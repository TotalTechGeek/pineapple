
import url from 'url'
import { rollup } from 'rollup'
import path from 'path'
import { hash } from './hash.js'
import sucrase from '@rollup/plugin-sucrase'
import commonjs from '@rollup/plugin-commonjs'
import os from 'os'

const isWin = os.platform() === 'win32'

/**
 * It takes a file path, transpiles it to JavaScript, and returns the file path to the transpiled file
 * @param input - The file to transpile
 * @returns A URL to the transpiled file.
 */
export async function transpile (input) {
  const file = `./pineapple-runner/${hash(input)}.mjs`

  const bundle = await rollup({
    cache: true,
    input: input.slice('file://'.length + isWin),
    /* Telling Rollup to include the sourcemap in the output file. */
    output: {
      sourcemap: 'inline'
    },
    plugins: [
      /* A plugin that converts CommonJS modules to ES6, so they can be included in a Rollup bundle. */
      commonjs(),
      /* A plugin that transpiles TypeScript to JavaScript. */
      sucrase({
        inlineSourceMap: true,
        incremental: true,
        tsBuildInfoFile: `./pineapple-runner/${hash(input)}.tsbuildinfo.json`,
        transforms: ['typescript'],
        exclude: ['node_modules/**']
      })
    ]
  })

  /* Writing the transpiled file to the file system. */
  await bundle.write({
    sourcemap: 'inline',
    file
  })

  return url.pathToFileURL(path.resolve(file)).href
}
