import esbuild from 'esbuild'
import fs from 'fs/promises'
import { existsSync, readFileSync } from 'fs'
import path from 'path'
import { injectStr } from './annotation.js'

import { rollup } from 'rollup'
import virtual from '@rollup/plugin-virtual'
import sucrase from '@rollup/plugin-sucrase'
import commonjs from '@rollup/plugin-commonjs'

const loaderDict = {
  cjs: 'js'
}
function replaceLoader (loader) {
  return loaderDict[loader] || loader
}

const externalShim = {
  name: 'ExternalShim',
  setup (build) {
    let packageFile = null

    // eslint-disable-next-line node/no-deprecated-api
    const nativeModules = new Set(Object.keys(process.binding('natives')))

    // try traversing up the directory tree to find a package.json
    let dir = process.cwd()
    do {
      try {
        packageFile = JSON.parse(readFileSync(path.join(dir, 'package.json'), 'utf-8'))
      } catch (err) {}
    } while (dir !== (dir = path.dirname(dir)) && !packageFile)

    build.onResolve({ filter: /.+/ }, args => {
      if (nativeModules.has(args.path)) return { external: true }
      if (args.path.startsWith('node:')) return { external: true }
      if (args.path.startsWith('.')) return

      // check if the dependency is a node_module
      // split the path based on the slash
      const splitPath = args.path.split('/')
      if (packageFile) {
        // check if the first part of the path is a node_module
        if (packageFile.dependencies[splitPath[0]] || packageFile.devDependencies[splitPath[0]]) return { external: true }
        if (packageFile.dependencies[args.path] || packageFile.devDependencies[args.path]) return { external: true }
      } else {
        // if the first part of the path is a node_module, by actually checking node_modules
        if (existsSync(path.join(process.cwd(), 'node_modules', splitPath[0]))) return { external: true }
        if (existsSync(path.join(process.cwd(), 'node_modules', args.path))) return { external: true }
      }

      if (args.importer.includes('node_modules')) return { external: true }
    })
    return build
  }
}

/**
 * It takes a file path, transpiles it to JavaScript, and returns the file path to the transpiled file
 * @param input - The file to transpile
 * @returns A URL to the transpiled file.
 */
export async function transpile (input, file, { rollup = false, shim = false } = {}) {
  /* Transpiling the file to JavaScript. */
  if (rollup) await rollupGenerate(input, file)
  else await esbuildGenerate(input, file, shim)
  return file
}

async function esbuildGenerate (input, file, shim) {
  try {
    await esbuild.build({
      stdin: {
        contents: injectStr(await fs.readFile(input, 'utf-8'), `global.log(@data, "${input}", @line, @expr)`),
        sourcefile: input,
        resolveDir: path.dirname(input),
        loader: replaceLoader(path.extname(input).slice(1))
      },
      outfile: file,
      sourcemap: 'inline',
      ...(shim ? { plugins: [externalShim] } : { packages: 'external' }),
      bundle: true,
      nodePaths: [''],
      format: file.endsWith('cjs') ? 'cjs' : 'esm',
      logLevel: 'silent',
      // Right now, Pineapple is not meant for this type of front-end testing,
      // so we are treating png and css files as empty.
      loader: { '.css': 'empty', '.png': 'empty' }
    })
  } catch (err) {
    await esbuild.build({
      entryPoints: [input],
      outfile: file,
      sourcemap: 'inline',
      bundle: true,
      nodePaths: [''],
      ...(shim ? { plugins: [externalShim] } : { packages: 'external' }),
      format: file.endsWith('cjs') ? 'cjs' : 'esm',
      loader: { '.css': 'empty', '.png': 'empty' }
    })
  }
}

async function rollupGenerate (input, file) {
  let bundle

  try {
    bundle = await rollup({
      cache: true,
      input,
      /* Telling Rollup to include the sourcemap in the output file. */
      output: {
        sourcemap: 'inline',
        format: file.endsWith('cjs') ? 'cjs' : 'esm'
      },
      plugins: [
        virtual({
          [input]: injectStr(await fs.readFile(input, 'utf-8'), `global.log(@data, "${input}", @line, @expr)`)
        }),
        /* A plugin that converts CommonJS modules to ES6, so they can be included in a Rollup bundle. */
        commonjs(),
        /* A plugin that transpiles TypeScript to JavaScript. */
        sucrase({
          inlineSourceMap: true,
          incremental: true,
          transforms: ['typescript'],
          exclude: ['node_modules/**']
        })
      ]
    })
  } catch (err) {
    bundle = await rollup({
      cache: true,
      input,
      /* Telling Rollup to include the sourcemap in the output file. */
      output: {
        sourcemap: 'inline',
        format: file.endsWith('cjs') ? 'cjs' : 'esm'
      },
      plugins: [
        /* A plugin that converts CommonJS modules to ES6, so they can be included in a Rollup bundle. */
        commonjs(),
        /* A plugin that transpiles TypeScript to JavaScript. */
        sucrase({
          inlineSourceMap: true,
          incremental: true,
          transforms: ['typescript'],
          exclude: ['node_modules/**']
        })
      ]
    })
  }

  /* Writing the transpiled file to the file system. */
  await bundle.write({
    sourcemap: 'inline',
    file,
    format: file.endsWith('cjs') ? 'cjs' : 'esm'
  })
}
