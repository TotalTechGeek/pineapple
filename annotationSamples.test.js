
/**
 * @test { name: 'Jesse', age: 25, email: 'jesse.daniel.mitchell@gmail.com' } returns
 * @test { name: 'Bob', age: 37, email: 'bob@bobwarehouse.com' } returns
 */
export function commentTap (input) {
  return {
    message: `Hello ${
        input // ? @.email
            .name
    }`, // ?
    success: true,
    ...input // ?
  } // ?
}
