import { generatorToArbitrary } from './generator-to-arbitrary'

function * sequence (...arr) {
  for (let i = 0; i < Infinity; i++) {
    yield arr[i % arr.length]
  }
}

export function sequenceArbitrary (...arr) {
  const result = generatorToArbitrary(sequence(...arr))
  result.size = arr.length
  return result
}
