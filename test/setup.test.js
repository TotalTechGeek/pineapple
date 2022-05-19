/**
 * @pineapple_import
 * @param {number} n
 */
export function isPrime (n) {
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      return false
    }
  }
  return n > 1
}

/**
 * @test void returns isPrime(@)
 */
export function generatePrime () {
  return 17
}

let person

/**
 * Sets a file-scoped variable to be a new person object.
 * @pineapple_import
 */
export function createPerson (name, level) {
  person = {
    name,
    level
  }
}

/**
 * Another silly example to demonstrate the use of beforeEach
 * @beforeEach createPerson('John', 5)
 * @test 3 returns @.level === 8
 * @test 1 returns @.level === 6
 */
export function levelUp (amount) {
  person.level += amount
  return person
}

let cities = new Set()

/**
 * @beforeAll
 */
export async function initializeCityDatabase () {
  cities = new Set([
    'New York',
    'Los Angeles',
    'San Juan',
    'Vienna'
  ])
}

/**
 * @test 'Vienna' resolves truthy
 * @test 'San Juan' resolves truthy
 * @test 'United Kingdom' resolves falsy
 */
export async function isCity (city) {
  return cities.has(city)
}
