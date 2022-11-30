
/**
 * @test 1 rejects 'Annoying error'
 * @test @__fails__ 1 throws 'Annoying error'
 *
 * @test 2 resolves undefined
 * @test @__fails__ 2 returns undefined
 *
 * @test @__fails__ 2 throws
 * @test @__fails__ 2 rejects
 */
export async function throwsAsync (num) {
  if (num === 1) throw new Error('Annoying error')
}

/**
 * @test @__fails__ 1 ~> 'Hello' returns truthy
 * @test @__fails__ 1 rejects 'Annoying error'
 * @test @__fails__ 1 resolves @.message === 'Annoying Error'
 * @test @__fails__ 1 returns @.message === 'Annoying Error'
 * @test 1 throws 'Annoying error'
 * @test @__fails__ 2 resolves undefined
 * @test 2 returns undefined
 * @test @__fails__ 2 throws
 * @test @__fails__ 2 rejects
 */
export function throwsSync (num) {
  if (num === 1) throw new Error('Annoying error')
}
