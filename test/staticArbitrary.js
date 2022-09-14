/**
 * @pineapple_define Static
 */
export function define () {
  return {
    age: 7
  }
}

/**
 * @test { age: #Static.age }
 * @test [#Static.age, #Static.age]
 */
export function staticTest (data) {
  return data
}
