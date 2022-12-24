import { generatorToArbitrary } from './generator-to-arbitrary.js'

function * sequence (...arr) {
  for (let i = 0; i < Infinity; i++) {
    yield arr[i % arr.length]
  }
}

/**
 * Takes a sequence and creates a fixed size arbitrary from it.
 * This is useful for forcing Pineapple to iterate through each item sequentially.
 * @param  {...any} arr
 * @returns
 */
export function sequenceArbitrary (...arr) {
  const result = generatorToArbitrary(sequence(...arr))
  result.size = arr.length
  return result
}
