import esbuild from 'esbuild'
import fs from 'fs/promises'
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

/**
 * It takes a file path, transpiles it to JavaScript, and returns the file path to the transpiled file
 * @param input - The file to transpile
 * @returns A URL to the transpiled file.
 */
export async function transpile (input, file, rollup = false) {
  /* Transpiling the file to JavaScript. */
  if (rollup) await rollupGenerate(input, file)
  else await esbuildGenerate(input, file)
  return file
}

async function esbuildGenerate (input, file) {
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
      bundle: true,
      nodePaths: [''],
      format: file.endsWith('cjs') ? 'cjs' : 'esm',
      packages: 'external',
      logLevel: 'silent'
    })
  } catch (err) {
    await esbuild.build({
      entryPoints: [input],
      outfile: file,
      sourcemap: 'inline',
      bundle: true,
      nodePaths: [''],
      format: file.endsWith('cjs') ? 'cjs' : 'esm',
      packages: 'external'
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
