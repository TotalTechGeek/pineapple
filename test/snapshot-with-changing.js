
/**
 * @test #person.fullName
 */
export function changing () {
  return {
    date: new Date().getTime()
  }
}

/**
 * @test #boolean
 */
export function TruthyTest (a) {
  if (a) return Math.random() + 1
  return null
}

/**
 * @test void
 */
export function arrayReturned () {
  return {
    arr: [new Date()]
  }
}
