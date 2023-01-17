import assert from 'assert'

/**
 * @test 'Jesse', 12
 * @test 'Joe', '15'
 * @param {string} owner
 * @param {number} length
 */
export async function createRental (owner, length, type = 'boat') {
  assert(typeof owner === 'string', 'Owner must be a string.')
  assert(typeof length === 'number', 'Length must be a number.')
  return {
    type,
    owner,
    length
  }
}
