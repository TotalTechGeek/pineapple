import fs from 'fs/promises'
import engine from './methods.js'
import { parse } from './parser/dsl.js'

/**
 * @param {*} file
 * @returns {{ set: async (key: string, value: any) => void, find: async (key: string) => any }}
 */
export function snapshot (file = './pineapple-snapshot') {
  const data = fs.readFile(file).catch(() => {}).then(async text => {
    if (!text) return {}
    try {
      return await deserialize(text)
    } catch (e) {
      return {}
    }
  })

  const find = async (key) => {
    return {
      exists: key in (await data),
      value: (await data)[key]
    }
  }

  const set = async function (key, value) {
    if (!this.data) this.data = await data
    this.data[key] = value
    await fs.writeFile(file, serialize(this.data))
  }

  return { find, set }
}

/**
 * Serializes a JavaScript value into a valid Pineapple expression.
 * This allows me to use the Pineapple Parser to deserialize values,
 * Which makes it easier to add support for custom types.
 *
 * @test 'Hello, World!'
 * @test 5 returns "5"
 * @test true returns "true"
 * @test Infinity returns "Infinity"
 * @test -Infinity returns "-Infinity"
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

  throw new Error('Unsupported Data Type.')
}

/**
 * Parses a Pineapple Expression.
 * @param {string} text
 */
export async function deserialize (text) {
  return engine.run(
    parse(text
      .toString()
      .replace(/\\n/g, '\n')
      .replace(/\\\n/g, '\n'), {
      startRule: 'Expression'
    })
  )
}
