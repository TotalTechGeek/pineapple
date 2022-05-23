/**
 * @test #integer, #integer returns @ as number
 * @test #integer, #string throws
 * @test #string, #integer throws
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
 * @test 1
 * @test 3
 * @test 10
 * @param {number} n
 * @returns {number}
 */
export const fib = n => n <= 2 ? 1 : fib(n - 1) + fib(n - 2)

/**
 * @test 1, 3 resolves @ as number
 * @test 5n, 3n
 * @param {number} a
 * @param {number} b
 * @returns
 */
export async function addAsync (a, b) {
  return a + b
}
