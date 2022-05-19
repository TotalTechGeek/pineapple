import chalk from 'chalk'
import logSymbols from 'log-symbols'

const format = text => text.includes('\n') ? `\n${text}\n` : text

/**
 * Announces that a test is being skipped due to it not being exported.
 * @param {string} name
 * @param {string} file
 */
export function skippingTest (name, file) {
  if (process.env.OUTPUT_FORMAT === 'CONSOLE') {
    return console.warn(logSymbols.warning, `Function / Class "${name}" is not exported from ${file}, skipping its tests.`)
  }

  if (process.env.OUTPUT_FORMAT === 'JSON') {
    return console.warn(JSON.stringify({ type: 'Test Skipped', name, file }))
  }
}

/**
 * Announces that a test was successful.
 * @param {string} name
 * @param {string} input
 * @param {string} file
 */
export function success (name, input, file) {
  if (process.env.OUTPUT_FORMAT === 'CONSOLE') {
    console.log(logSymbols.success, `Passed test (${name}):`, format(input))
  }

  if (process.env.OUTPUT_FORMAT === 'JSON') {
    return console.log(JSON.stringify({ type: 'Success', name, input, file }))
  }
}

/**
 * Announces that a test was not successful.
 * @param {string} name
 * @param {string} input
 * @param {string} message
 * @param {string} file
 */
export function failure (name, input, message, file) {
  if (process.env.OUTPUT_FORMAT === 'CONSOLE') {
    console.log(logSymbols.error, `Failed test (${name}):`, format(input))
    console.log('>>', file)
    if (message) {
      console.log(message)
      console.log()
    }
  }

  if (process.env.OUTPUT_FORMAT === 'JSON') {
    return console.log(JSON.stringify({ type: 'Failure', name, input, message, file }))
  }
}

/**
 * Announces that a test could not be run because of a parse failure.
 * @param {string} name
 * @param {string} input
 * @param {string} message
 * @param {string} file
 */
export function parseFailure (name, input, message, file) {
  if (process.env.OUTPUT_FORMAT === 'CONSOLE') {
    console.log(logSymbols.error, `Could not parse on (${name}): ${input}`)
    console.log(chalk.red(message))
    console.log()
  }

  if (process.env.OUTPUT_FORMAT === 'JSON') {
    return console.log(JSON.stringify({ type: 'ParseFailure', name, input, message, file }))
  }
}

/**
 * Tries to log a test runtime error
 * @param {*} err
 */
export function testRuntimeFailure (err) {
  if (process.env.OUTPUT_FORMAT === 'CONSOLE') {
    console.error(err)
  }

  if (process.env.OUTPUT_FORMAT === 'JSON') {
    return console.log(JSON.stringify({ type: 'RuntimeFailure', message: err.message, name: err.name || (err.constructor || {}).name || 'Unidentified Error' }))
  }
}
