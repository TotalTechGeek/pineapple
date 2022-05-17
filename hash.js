import crypto from 'crypto'

/**
 * @test 'Hello World'
 * @test 'Kevin'
 * @param {string} str
 */
export function hash (str) {
  return crypto.createHash('sha256').update(str).digest('hex')
}
