import engine from "./methods.js";
import { parse } from "./parser/dsl.js";
import { snapshot } from './snapshot.js'
import logSymbols from 'log-symbols';
import { hash } from "./hash.js";

const snap = snapshot()

/**
 * @param {string} input 
 * @param {string} id
 * @param {(...args: any[]) => any} func
 * @returns {Promise<[any, boolean] | [any, false, string]>}
 */
export async function run (input, id, func) {
    async function internalRun(input, id, func) {
        const script = parse(input)
        const h = hash(input)
        let result = [func]
        let count = 0
        for (let step of script) {
            if (typeof result[0] !== 'function') return [data, false, 'Does not return a function.']
            result = await engine.run(step, { func: result[0], id: `${id}.${count}`, snap, hash: h, rule: input })
            const [data, success, message] = result
            if (!success) return [data, false, message]
            count++
        }
        return result
    }
    const [data, success, message] = await internalRun(input, id, func)

    if (!success) {
        console.log(logSymbols.error, `Failed test (${id.split('.')[0]}):`, input)
        if(message) {
            console.log(message)
            console.log()
        }
        return
    }

    console.log(logSymbols.success, `Passed test (${id.split('.')[0]}):`, input)
}