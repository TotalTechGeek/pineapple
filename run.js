import engine from "./methods.js";
import { parse } from "./parser/dsl.js";
import { snapshot } from './snapshot.js'
import logSymbols from 'log-symbols';
import { hash } from "./hash.js";
import chalk from 'chalk'
import { SpecialHoF } from "./symbols.js";
const snap = snapshot()

/**
 * Adds a method to the Pineapple JSON Logic Engine.
 * @param {string} name 
 * @param {(...args: any[]) => any} fn 
 */
export function addMethod(name, fn) {
    engine.addMethod(name, data => fn(...[].concat(data)))
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
        let lastSpecial = false
        for (let step of script) {
            // Override to break the special "hof" class thing.
            if (lastSpecial) {
                if(!Object.values(step)[0][0].special && typeof result[0].result === 'function')  result[0] = result[0].result
            }
            const [current] = result
            if (typeof result[0] !== 'function') return [result[0], false, 'Does not return a function.']
            result = await engine.run(step, { func: current, id: `${id}.${count}`, snap, hash: h, rule: input })
            const [data, success, message] = result
            if (!success) return [data, false, message]
            count++
            // Special Override for the Class-Based HoF thing.
            if (current[SpecialHoF]) {
                if (typeof result[0] !== 'function') result[0] = current
                lastSpecial = true
            } 
            else lastSpecial = false
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


/**
 * A way to turn a class into a higher-order function chain for testing purposes.
 * @param {*} classToUse 
 * @param {boolean} staticClass
 */
export function hof(classToUse, staticClass = false) {
    return (...args) => {
        let instance = staticClass ? classToUse : new classToUse(...args)
        const f = ([method, ...args]) => {
            if (!(method in instance && (instance.hasOwnProperty(method) || classToUse.prototype.hasOwnProperty(method)))) 
                throw new Error(`'${method}' is not a method of '${classToUse.name}'`)
            f.result = instance[method](...args)
            return f
        }
        f[SpecialHoF] = true
        f.instance = instance
        if (staticClass) return f(...args)
        return f 
    }
    
}