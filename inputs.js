import chalk from 'chalk'
import inquirer from 'inquirer'
import { serialize } from './snapshot.js'
import { diff } from './utils.js'

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
  console.log(chalk.green(serialize(item)))
  const { result } = await inquirer.prompt([{ name: 'result', message: 'Accept this snapshot?', type: 'list', choices: ['Yes', 'No'] }])
  return result === 'Yes'
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
  console.log(diff(value, item))
  const { result } = await inquirer.prompt([{ name: 'result', message: 'Do you wish to update to this snapshot?', type: 'list', choices: ['Yes', 'No'] }])
  return result === 'Yes'
}
