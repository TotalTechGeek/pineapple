/**
 * @test #array(#integer) returns @ as number
 * @test #array(#string, { minLength: 1 }) throws
 * @test [1, 2, 3] returns 6
 * @test [#integer, 2, 3] returns args.0.0 + 5
 * @test [] returns 0
 */
export function sum (values) {
  if (values.some(i => typeof i !== 'number')) throw new Error('An item in the array is not a number.')
  return values.reduce((a, b) => a + b, 0)
}

/**
 * @test { name: #string, age: #integer(1, 20) } throws
 * @test { name: 'Jesse', age: #integer(21, 80) } returns cat(args.0.name, ' is drinking age.')
 */
export function drinkingAge ({ name, age }) {
  if (age >= 21) return `${name} is drinking age.`
  throw new Error(`${name} is not drinking age.`)
}

/**
 * @test #integer(1, 10000) ** 2 returns true
 * @test #constantFrom(3, 5, 8, 13, 21, 1997) returns false
 */
export function isSquare (num) {
  return Math.sqrt(num) % 1 === 0
}

/**
 * A simple template function.
 * @test 'Hello $0' ~> 'World' returns 'Hello World'
 * @test '$0 $0' ~> 'Hi' returns 'Hi Hi'
 * @test 'Hello $0' ~> #string returns cat('Hello ', args.0)
 * @param {string} templateString
 */
export function template (templateString) {
  /** @param {string} replace */
  return replace => templateString.replace(/\$0/g, replace.replace(/\$/g, '$$$$'))
}
