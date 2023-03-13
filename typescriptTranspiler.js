import esbuild from 'esbuild'
import fs from 'fs/promises'
import path from 'path'
import { injectStr } from './annotation.js'

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
export async function transpile (input, file) {
  /* Transpiling the file to JavaScript. */

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

  return file
}
