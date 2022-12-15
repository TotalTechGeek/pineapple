import fc from 'fast-check'

/**
 * @param {Generator} func
 */
export function generatorToArbitrary (func) {
  return fc.integer().map(() => func.next().value)
}
