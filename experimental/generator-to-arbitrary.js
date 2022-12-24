import fc from 'fast-check'

/**
 * Takes an (infinite) generator function and turns it into an arbitrary, for testing.
 * @param {Generator} func
 */
export function generatorToArbitrary (func) {
  return fc.integer().map(() => func.next().value)
}
