import fs from 'fs/promises'
import engine from './methods.js'
import { parse } from './parser/dsl.js'

/**
 * @param {*} file
 * @returns {{ set: async (key: string, value: any) => void, find: async (key: string) => any, remove: async (key: string) => void }}
 */
export function snapshot (file = './pineapple-snapshot') {
  const data = fs.readFile(file).catch(() => {}).then(async text => {
    if (!text) return {}
    try {
      return cleanOldSnapshots(await deserialize(text))
    } catch (e) {
      return {}
    }
  })

  const notAccessed = data.then(data => new Set(Object.keys(data)))

  const find = async (key) => {
    (await notAccessed).delete(key)
    return {
      exists: key in (await data),
      value: (await data)[key],
      meta: (await data)[`${key}.meta`]
    }
  }

  // todo: make this not hammer disk.
  const set = async function (key, value, meta) {
    if (!this.data) this.data = await data
    this.data[key] = value
    if (meta) this.data[`${key}.meta`] = meta
    else if (this.data[`${key}.meta`]) delete this.data[`${key}.meta`]
    await fs.writeFile(file, serialize(this.data))
  }

  const remove = async function (key) {
    if (!this.data) this.data = await data
    delete this.data[key]
    await fs.writeFile(file, serialize(this.data))
  }

  return { find, set, remove, notAccessed }
}

/**
 * Handles pre-2023 snapshots so that they are still valid upon being read,
 * but it'll convert it to remove the hashes attached.
 * @test { "add(1, 2) [abcd]": {}, "add(1, 2) [abcd.2]": {} }
 * @test { "add(1, 2)": {} }
 */
export function cleanOldSnapshots (result) {
  for (const key in result) {
    if (key.endsWith(']')) {
      const data = result[key]
      delete result[key]
      const arbitraryPoint = key.indexOf('.', key.lastIndexOf('['))
      let correctedKey = key.substring(0, key.lastIndexOf('[') - 1)
      if (arbitraryPoint !== -1) { correctedKey += key.substring(arbitraryPoint, key.length - 1) }
      result[correctedKey] = data
    }
  }
  return result
}

/**
 * Serializes a JavaScript value into a valid Pineapple expression.
 * This allows me to use the Pineapple Parser to deserialize values,
 * Which makes it easier to add support for custom types.
 *
 * @test #Characters.Backslash
 * @test 'Hello, World!'
 * @test 5 returns "5"
 * @test true returns "true"
 * @test Infinity returns "Infinity"
 * @test -Infinity returns "-Infinity"
 *
 * @test null returns "null"
 * @test undefined returns "undefined"
 * @test void returns "undefined"
 * @test [1, 2, 3]
 * @test { name: 'Rick', age: 1000 }
 * @test 21n returns "21n"
 * @test date('2020-01-01')
 *
 * @param {*} item
 * @param {number} indent
 */
export function serialize (item, indent = 0) {
  const indentStr = str => ' '.repeat(indent) + str

  if (item === Infinity) return 'Infinity'
  if (item === -Infinity) return '-Infinity'
  if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') return indentStr(JSON.stringify(item))
  if (typeof item === 'bigint') return indentStr(`${item.toString()}n`)
  if (item === undefined) return indentStr('undefined')
  if (item === null) return indentStr('null')
  if (Array.isArray(item)) return indentStr('[') + item.map(i => `\n${serialize(i, indent + 2)}`).join(',') + '\n' + indentStr(']')
  if (item instanceof Date) return indentStr(`date("${item.toISOString()}")`)
  if (typeof item === 'object') {
    return (indentStr('{') +
        Object.keys(item).map(i => `\n${' '.repeat(indent + 2)}${JSON.stringify(i)}: ${serialize(item[i], indent + 2)}`).join(',') +
        '\n' + indentStr('}')).replace(/:[ ]+/g, ': ')
  }

  throw new Error('Unsupported Data Type: ' + item)
}

/**
 * Parses a Pineapple Expression.
 * @param {string} text
 */
export async function deserialize (text) {
  return engine.run(
    parse(text
      .toString(), {
      startRule: 'Expression'
    })
  )
}
