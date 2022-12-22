
import url from 'url'
import path from 'path'
import { hash } from './hash.js'
import os from 'os'
import esbuild from 'esbuild'

const isWin = os.platform() === 'win32'

/**
 * It takes a file path, transpiles it to JavaScript, and returns the file path to the transpiled file
 * @param input - The file to transpile
 * @returns A URL to the transpiled file.
 */
export async function transpile (input) {
  const file = `./pineapple-runner/${hash(input)}.mjs`

  /* Transpiling the file to JavaScript. */
  await esbuild.build({
    entryPoints: [input.slice('file://'.length + isWin)],
    outfile: file,
    sourcemap: 'inline',
    bundle: true,
    nodePaths: [''],
    format: 'esm',
    packages: 'external'
  })

  return url.pathToFileURL(path.resolve(file)).href
}
