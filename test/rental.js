
/**
 * @test 'Morty', 32
 * @param {string} buyer 
 * @param {number} length 
 */
 export async function createRental(buyer, length, type = 'boat') {
    if (typeof buyer !== 'string' || typeof length !== 'number') throw new Error('Types do not match.')
    return { type, buyer, length }
}
