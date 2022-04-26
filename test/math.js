/**
 * @test 1, 2
 * @test '4', 3 throws
 * @test 1, '0' throws
 * @test -1, 1
 * @test -1, 1 to 0
 * @test -1, 1 to -1
 * @test -1, -1 to -2
 * @test -1, '-1' to -2
 * @param {number} a 
 * @param {number} b 
 */
export function add (a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') throw new Error('Not numbers')
    return a + b
}

/**
 * @test 3, 5
 * @test 10, -1
 * @param {number} a 
 * @param {number} b 
 * @returns 
 */
export function mul (a, b) {
    return a * b
}

/**
 * @test 1 ~> 2 returns 3
 * @test 3 ~> 5 returns 8
 * @param {number} a 
 */
export function curryAdd (a) {
    return (b) => a + b
}


/**
 * @test 'Jesse', 32
 * @test 'Jesse', '32' throws
 * @test 32, 'Kevin' throws
 * @param {string} owner 
 * @param {number} length 
 */
 export function boat(owner, length) {
    if (typeof owner !== 'string' || typeof length !== 'number') throw new Error('Types do not match.')
    return {
        name: 'Boats Rock',
        type: 'boat',
        owner,
        length
    }
}


/**
 * @test 1
 * @test 3
 * @test 10
 * @param {number} n 
 * @returns {number}
 */
export const fib = n => n <= 2 ? 1 : fib(n - 1) + fib(n - 2)


/**
 * @test 1, 3 resolves @ as number
 * @test 1, 5 resolves @ as string
 * @test 1, 5 resolves 7
 * @param {number} a 
 * @param {number} b 
 * @returns 
 */
export async function addAsync(a,b) {
    return a + b
}


