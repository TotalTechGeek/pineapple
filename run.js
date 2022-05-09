import engine from "./methods.js";
import { parse } from "./parser/dsl.js";
import { snapshot } from './snapshot.js'
import logSymbols from 'log-symbols';
import { hash } from "./hash.js";
import chalk from 'chalk'
const snap = snapshot()

/**
 * Adds a method to the Pineapple JSON Logic Engine.
 * @param {string} name 
 * @param {(...args: any[]) => any} fn 
 */
export function addMethod(name, fn) {
    engine.addMethod(name, fn)
}

/**
 * Just executes the expression, used for "before" / "beforeEach" / "after" / "afterEach".
 * @param {string} input 
 */
export async function execute(input) {
    const ast = parse(input, { startRule: 'Expression' })
    await engine.run(ast)
}


/**
 * Runs the tests in the Pineapple JSON Logic Engine.
 * @param {string} input 
 * @param {string} id
 * @param {(...args: any[]) => any} func
 */
export async function run (input, id, func) {
    /**
     * @param {string} input 
     * @param {string} id 
     * @param {(...args: any[]) => any} func 
     * @returns {Promise<[any, boolean] | [any, false, string]>}
     */
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
    
    try {
        const [data, success, message] = await internalRun(input, id, func)

        if (!success) {
            console.log(logSymbols.error, `Failed test (${id.split('.')[0]}):`, input)
            if(message) {
                console.log(message)
                console.log()
            }
            return 1
        }
    } catch(err) {
        if (err.expected) {
            const { expected, message } = err
            console.log(logSymbols.error, `Could not parse on (${id.split('.')[0]}): ${input}`)
            console.log(chalk.red(message))
            console.log()
        }
        else console.log(err)

        return 1
    }
    

    console.log(logSymbols.success, `Passed test (${id.split('.')[0]}):`, input)
    return 0
}