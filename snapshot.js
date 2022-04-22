import fs from 'fs/promises'

/**
 * 
 * @param {*} file 
 * @returns {{ set: async (key: string, value: any) => void, find: async (key: string) => any }}
 */
export function snapshot(file = './pineapple-snapshot.json') {
    const data = fs.readFile(file).catch(() => '{}').then(text => {
        try {
            return JSON.parse(text)
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

    const set = async function(key, value) {
        if (!this.data) this.data = await data
        this.data[key] = value
        await fs.writeFile(file, JSON.stringify(this.data, undefined, 4))
    }

    return { find, set }
}