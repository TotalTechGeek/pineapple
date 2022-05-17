
/**
 * @test 1 rejects 'Annoying error'
 * @test 1 throws 'Annoying error'
 *
 * @test 2 resolves undefined
 * @test 2 returns undefined
 *
 * @test 2 throws
 * @test 2 rejects
 */
export async function throwsAsync (num) {
  if (num === 1) throw new Error('Annoying error')
}

/**
 * @test 1 ~> 'Hello' returns truthy
 * @test 1 rejects 'Annoying error'
 * @test 1 resolves @.message === 'Annoying Error'
 * @test 1 returns @.message === 'Annoying Error'
 * @test 1 throws 'Annoying error'
 * @test 2 resolves undefined
 * @test 2 returns undefined
 * @test 2 throws
 * @test 2 rejects
 */
export function throwsSync (num) {
  if (num === 1) throw new Error('Annoying error')
}
