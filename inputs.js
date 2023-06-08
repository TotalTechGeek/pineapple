import chalk from 'chalk'
import { serialize } from './snapshot.js'
import { diff } from './utils.js'
import { flush } from './run.js'
import { getDiff } from 'json-difference'

async function getConfirmation (message, choices = ['Yes', 'No ']) {
  if (typeof prompt !== 'undefined') {
    const result = prompt(`${message} (Y/N)`).toLowerCase()
    console.log()
    return result === 'y' || result === 'yes' ? 'Yes' : 'No '
  }
  return new Promise(resolve => {
    const currentMode = process.stdin.isRaw
    if (process.stdin.setRawMode) process.stdin.setRawMode(true)

    process.stdout.write(message + ' ')
    let choice = choices[0]
    process.stdout.write(choices[0])

    let position = 0

    const func = data => {
      if (data[0] === 13) {
        if (process.stdin.setRawMode) process.stdin.setRawMode(currentMode)
        process.stdin.removeListener('data', func)
        console.log()
        return resolve(choice)
      }

      data = data.toString()

      if (data === '\x1B[B') {
        process.stdout.write('\r')
        process.stdout.write(message + ' ')
        position++
        if (position >= choices.length) position = 0
        process.stdout.write(choices[position])
        choice = choices[position]
      }

      if (data === '\x1B[A') {
        process.stdout.write('\r')
        process.stdout.write(message + ' ')
        position--
        if (position < 0) position = choices.length - 1
        process.stdout.write(choices[position])
        choice = choices[position]
      }
    }

    process.stdin.on('data', func)
  })
}

/**
 * It asks the user if they want to accept the snapshot
 * @param {{ item: any, rule: string, id: string, file: string }} data
 * @returns A function that returns a boolean.
 */
export async function askSnapshot ({ item, rule, id, file }) {
  if (process.env.CI) return false
  if (process.env.ACCEPT_ALL) return true
  if (process.env.OUTPUT_FORMAT === 'JSON') {
    console.log(JSON.stringify({
      type: 'Request Snapshot',
      item: serialize(item),
      input: rule,
      id,
      file
    }))
    return false
  }
  console.log(`On test (${id.split('(')[0]}):`, rule)
  flush()

  console.log(chalk.green(serialize(item)))
  const result = await getConfirmation(`${chalk.magenta('?')} Accept this snapshot?`).catch(err => console.log(err))
  return result
}

/**
 * It asks the user if they want to update the snapshot
 * @param {{ item: any, rule: string, id: string, value: any, file: string }} data
 * @returns A function that returns a boolean.
 */
export async function askSnapshotUpdate ({ item, value, rule, id, file }) {
  if (process.env.CI) return false
  if (process.env.UPDATE_ALL) return true
  if (process.env.OUTPUT_FORMAT === 'JSON') {
    console.log(JSON.stringify({
      type: 'Request Snapshot Update',
      new: serialize(item),
      old: serialize(value),
      input: rule,
      id,
      file
    }))
    return false
  }
  console.log(`On test (${id.split('(')[0]}):`, rule)
  flush()

  console.log(diff(value, item))

  if (typeof value === typeof item && value && item && typeof value === 'object') {
    const differences = getDiff(value, item, true)
    if (differences.added.length === 0 && differences.removed.length === 0) {
      // This means that fields were modified, which means we can offer to omit the fields
      console.log(chalk.yellow('\nSome of the fields have been modified, you can choose to omit them.'))

      const result = await getConfirmation(`${chalk.magenta('?')} Do you wish to update to this snapshot?`, ['Yes ', 'No  ', 'Omit'])
      if (result === 'Omit') return { omitDeep: [{ var: '' }, differences.edited.map(i => i[0])] }
      return result === 'Yes '
    }
  }

  const result = await getConfirmation(`${chalk.magenta('?')} Do you wish to update to this snapshot?`)
  return result === 'Yes'
}
