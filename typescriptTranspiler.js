
import url from 'url'
import { rollup } from 'rollup'
import path from 'path'
import { hash } from './hash.js'
import sucrase from '@rollup/plugin-sucrase'
import commonjs from '@rollup/plugin-commonjs'
import os from 'os'

const isWin = os.platform() === 'win32'

export async function transpile (input) {
  const file = `./pineapple-runner/${hash(input)}.mjs`

  const bundle = await rollup({
    cache: true,
    input: input.slice('file://'.length + isWin),
    output: {
      sourcemap: 'inline'
    },
    plugins: [
      commonjs(),
      sucrase({
        inlineSourceMap: true,
        incremental: true,
        tsBuildInfoFile: `./pineapple-runner/${hash(input)}.tsbuildinfo.json`,
        transforms: ['typescript'],
        exclude: ['node_modules/**']
      })
    ]
  })

  await bundle.write({
    sourcemap: 'inline',
    file
  })

  return url.pathToFileURL(path.resolve(file)).href
}
