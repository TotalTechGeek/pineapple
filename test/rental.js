
/**
 * @test 'Morty', 32
 * @param {string} buyer
 * @param {number} length
 */
export async function createRental (buyer, length, type = 'boat') {
  if (typeof buyer !== 'string' || typeof length !== 'number') throw new Error('Types do not match.')
  return { type, buyer, length }
}

/**
 * @test {
 *      tenant: 'Rick',
 *      length: 10,
 *      type: 'boat'
 * } resolves
 *
 * @test {
 *      tenant: 10,
 *      length: 'Rick',
 *      type: 'boat'
 * } rejects
 */
export async function createLease ({ tenant, length, type = 'boat' }) {
  if (typeof tenant !== 'string' || typeof length !== 'number') { throw new Error('Types do not match.') }
  return { type, tenant, length }
}
