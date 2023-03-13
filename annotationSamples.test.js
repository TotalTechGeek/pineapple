
const circular = { }
circular.circle = circular

/**
 * @test { name: 'Jesse', age: 25, email: 'jesse.daniel.mitchell@gmail.com' } returns
 * @test { name: 'Bob', age: 37, email: 'bob@bobwarehouse.com' } returns
 */
export function commentTap (input) {
  // eslint-disable-next-line no-unused-vars
  const circle = circular // ?
  return {
    message: `Hello ${
        input // ? @.email
            .name
    }`, // ?
    success: true,
    ...input // ?
  } // ?
}
