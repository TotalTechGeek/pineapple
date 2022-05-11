import fs from 'fs/promises'
import { serialize, deserialize } from 'jest-serializer'

/**
 * @param {*} file
 * @returns {{ set: async (key: string, value: any) => void, find: async (key: string) => any }}
 */
export function snapshot (file = './pineapple-snapshot') {
  const data = fs.readFile(file).catch(() => {}).then(text => {
    if (!text) return {}
    try {
      return deserialize(text)
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
