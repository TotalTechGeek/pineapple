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

export function serialize (item, indent = 0) {
  const indentStr = str => ' '.repeat(indent) + str
  if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') return indentStr(JSON.stringify(item))
  if (typeof item === 'bigint') return indentStr(`${item.toString()}n`)
  if (item === undefined) return indentStr('undefined')
  if (item === null) return indentStr('null')
  if (item === Infinity) return 'Infinity'
  if (item === -Infinity) return '-Infinity'
  if (Array.isArray(item)) return indentStr('[') + item.map(i => `\n${serialize(i, indent + 2)}`).join(',') + '\n' + indentStr(']')
  if (item instanceof Date) return indentStr(`date("${item.toISOString()}")`)

  if (typeof item === 'object') {
    return (indentStr('{') +
        Object.keys(item).map(i => `\n${' '.repeat(indent + 2)}${JSON.stringify(i)}: ${serialize(item[i], indent + 2)}`).join(',') +
        '\n' + indentStr('}')).replace(/:[ ]+/g, ': ')
  }

  throw new Error('Unsupported Data Type.')
}

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
