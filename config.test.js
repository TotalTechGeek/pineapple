import fs from 'fs/promises'
import flowRemoveTypes from 'flow-remove-types'

/**
 * Transpiles Flow files to JavaScript, the weakness of this implementation is that it doesn't support
 * bundling, so it doesn't work with other flow files.
 * Pineapple expects all transpilation functions to export a bundle.
 * @pineapple_transpile ['*.flow.js']
 * @param {string} file
 * @param {string} recommended
 */
export async function transpileFlow (file, recommended) {
  const output = flowRemoveTypes(await fs.readFile(file, { encoding: 'utf-8' }))
  const map = output.generateMap()
  map.sources = [file]
  await fs.writeFile(
    recommended,
    `${output.toString()}\n//# sourceMappingURL=data:application/json;base64,${Buffer.from(JSON.stringify(map)).toString('base64')}`
  )
  return recommended
}
