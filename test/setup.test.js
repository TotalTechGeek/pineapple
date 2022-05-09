


/**
 * @pineapple_import
 * @param {number} n 
 */
export function isPrime(n) {
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
            return false
        }
    }
    return n > 1
}


/**
 * @test undefined returns isPrime(@)
 */
export function generatePrime() {
    return 17
}