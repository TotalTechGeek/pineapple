/**
 * @pineapple_define
 */
export function define () {
  return {
    staticAge: 7
  }
}

/**
 * @test { age: #staticAge }
 * @test [#staticAge, #staticAge]
 */
export function staticTest (data) {
  return data
}
