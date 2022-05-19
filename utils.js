import chalk from 'chalk'
import { diff as jestDiff } from 'jest-diff'
import { serialize } from './snapshot.js'

/**
 * It takes the output of the diff function and if it contains the string "Comparing two different
 * types", it replaces the output with a more detailed message
 * @param expected - The expected value.
 * @param received - The value that was actually returned from the test.
 * @returns The function diffTouchup is being returned.
 */
export function diff (expected, received) {
  const result = jestDiff(expected, received)
  if (result.includes('Comparing two different types')) {
    return `${result}\n  ${chalk.green(`- Expected: ${serialize(expected).replace(/\n/g, '\n  ')}`)}\n${chalk.red(`  - Received: ${serialize(received).replace(/\n/g, '\n  ')}`)}`
  }
  return result
}
