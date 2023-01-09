// @flow

/**
 * @test 5, 3
 */
export function add (a: number, b: number): number {
  return a + b
}


/**
 * @test 5
 * @test 3
 * @test void
 */
export function toString (value: ?number): string {
  if (!value) return 'default string'
  return value.toString()
} 
