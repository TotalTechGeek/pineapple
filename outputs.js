import chalk from 'chalk'
import logSymbols from 'log-symbols'

const format = text => text.includes('\n') ? `\n${text}\n` : text

/**
 * Announces that a test is being skipped due to it not being exported.
 * @param {string} name
 * @param {string} file
 * @param {{ type: string, text: string, lineNo: number }} tags
 */
export function skippingTest (name, file, tags) {
  if (process.env.OUTPUT_FORMAT === 'CONSOLE') {
    const tagString =
      tags.length === 1
        ? ` the @${tags[0].type} statement on line ${tags[0].lineNo}: "${tags[0].text}"`
        : `:\n${tags.map(i => `- the @${i.type} statement on line ${i.lineNo}: "${i.text}"`).join('\n')}`
    return console.warn(logSymbols.warning, `Because the function or class "${name}" is not exported from ${file}, we will be skipping${tagString}`)
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
 * @param {{ name: string, input: string, message: string, file: string, data: string }}
 */
export function failure ({ name, input, message, file, data }) {
  if (process.env.OUTPUT_FORMAT === 'CONSOLE') {
    console.log(logSymbols.error, `Failed test (${name}):`, format(input))
    console.log('>>', file)
    if (message) {
      console.log(message)
      console.log()

      if (data && data.actualError) data = data.actualError
      if (data && data.stack) {
        console.log(chalk.red(data.stack))
        console.log()
      }
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
    return console.log(JSON.stringify({ type: 'Parse Failure', name, input, message, file }))
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
    return console.log(JSON.stringify({ type: 'Runtime Failure', message: err.message, name: err.name || (err.constructor || {}).name || 'Unidentified Error' }))
  }
}

/**
 * Logs the number of tests run.
 * @param {number} failures
 * @param {number} total
 */
export function aggregate (failures, total) {
  if (process.env.OUTPUT_FORMAT === 'CONSOLE') {
    const color = failures ? chalk.red : chalk.green
    console.log(chalk.bold(color(`Passed ${total - failures}/${total} tests.`)))
  }

  if (process.env.OUTPUT_FORMAT === 'JSON') {
    return console.log(JSON.stringify({ type: 'Aggregate', failures, total }))
  }
}

/**
 * Print the files that are being tested.
 * @param {string[]} files
 */
export function filesTested (files) {
  if (process.env.OUTPUT_FORMAT === 'CONSOLE') {
    console.log(`Testing: ${files.join(', ')}`)
  }

  if (process.env.OUTPUT_FORMAT === 'JSON') {
    /* nothing for now */
  }
}
