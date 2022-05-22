/* eslint-disable no-prototype-builtins */
import engine from './methods.js'
import { parse } from './parser/dsl.js'
import { serialize, snapshot } from './snapshot.js'
import { hash } from './hash.js'
import { SpecialHoF, ConstantFunc } from './symbols.js'
import { failure, parseFailure, success, testRuntimeFailure } from './outputs.js'
import fc from 'fast-check'
import { argumentsToArbitraries } from './utils.js'
import { always } from 'ramda'
const snap = snapshot()

/**
 * Adds a method to the Pineapple JSON Logic Engine.
 * @param {string} name
 * @param {(...args: any[]) => any} fn
 */
export function addMethod (name, fn) {
  engine.addMethod(name, data => fn(...[].concat(data)))
}

/**
 * Executes the method passed in, and adds the arbitraries to the engine.
 * @param {(...args: any[]) => ({ [key: string]: any })} fn
 */
export function addDefinitions (fn) {
  const definitions = fn()
  Object.keys(definitions).forEach(key => {
    if (typeof definitions[key] === 'function') {
      const method = definitions[key]
      engine.addMethod('#' + key, (data) => {
        if (data === undefined) return method()
        return method(...[].concat(data))
      }, { sync: true })
    } else {
      const arbitrary = definitions[key]
      if (arbitrary instanceof fc.Arbitrary) {
        engine.addMethod('#' + key, always(arbitrary), { sync: true })
      } else {
        const func = always(fc.constant(arbitrary))
        func[ConstantFunc] = true
        engine.addMethod('#' + key, func, { sync: true })
      }
    }
  })
}

/**
 * Just executes the expression, used for "before" / "beforeEach" / "after" / "afterEach".
 * @param {string} input
 */
export async function execute (input) {
  const ast = parse(input, { startRule: 'Expression' })
  await engine.run(ast)
}

class FuzzError extends Error {
  constructor (counterExample, seed, message, shrunk) {
    super()
    this.counterExample = counterExample
    this.seed = seed
    this.shrunk = shrunk
    this.message = message
  }
}

/**
 * Runs the tests in the Pineapple JSON Logic Engine.
 * @param {string} input
 * @param {string} id
 * @param {(...args: any[]) => any} func
 * @param {string} file
 */
export async function run (input, id, func, file) {
  const [idName, idHash] = id.split('.')

  /**
     * @param {string} input
     * @param {string} id
     * @param {(...args: any[]) => any} func
     * @returns {Promise<[any, boolean] | [any, false, string]>}
     */
  async function internalRun (input, id, func) {
    const script = parse(input)
    const h = hash(input)
    let result = [func]
    let lastSpecial = false

    for (const step of script) {
      // Override to break the special "hof" class thing.
      if (lastSpecial) {
        if (!Object.values(step)[0][0].special && typeof result[0].result === 'function') result[0] = result[0].result
      }
      const [current] = result
      if (typeof result[0] !== 'function') return [result[0], false, 'Does not return a function.']

      const key = Object.keys(step)[0]
      const [inputs, expectation] = step[key]
      const arbs = await argumentsToArbitraries(...inputs)
      let failed = null
      try {
        let count = 0
        await fc.assert(fc.asyncProperty(...arbs, async (...args) => {
          count++
          const countStr = count > 1 ? `.${count}` : ''
          result = await engine.run({
            [key]: [{ preserve: args }, expectation]
          }, { func: current, id: (`${idName}(${input}) [${idHash}${countStr}]`), snap, hash: h, rule: input, file, args, context: current.instance, fuzzed: !arbs.constant })
          if (!result[1]) failed = result
          return result[1]
        }), {
          seed: key === 'snapshot' ? parseInt(h.substring(0, 16), 16) : undefined,
          numRuns: arbs.constant ? 1 : key === 'snapshot' ? 10 : undefined,
          reporter (out) {
            if (out.failed) {
              throw new FuzzError(out.counterexample, out.seed, out.error, out.numShrinks)
            }
          }
        })
      } catch (e) {
        if (e instanceof FuzzError && !arbs.constant) {
          failed[2] = (failed[2] || '') + `\nFailing Example: ${serialize(e.counterExample)}\nShrunk ${e.shrunk} times.\nSeed: ${e.seed}`
        }
      }

      const [data, success, message] = result
      if (failed) return failed
      if (!success) return [data, false, message]

      // Special Override for the Class-Based HoF thing.
      if (current[SpecialHoF]) {
        if (typeof result[0] !== 'function') result[0] = current
        lastSpecial = true
      } else lastSpecial = false
    }
    return result
  }

  try {
    const [, success, message] = await internalRun(input, id, func)

    if (!success) {
      failure(idName, input, message, file)
      return 1
    }
  } catch (err) {
    if (err.expected) {
      const { message } = err
      parseFailure(idName, input, message, file)
    } else testRuntimeFailure(err)

    return 1
  }

  success(idName, input, file)
  return 0
}

/**
 * A way to turn a class into a higher-order function chain for testing purposes.
 * @param {*} ClassToUse
 * @param {boolean} staticClass
 */
export function hof (ClassToUse, staticClass = false) {
  return (...args) => {
    const instance = staticClass ? ClassToUse : new ClassToUse(...args)
    const f = (method, ...args) => {
      if (!(method in instance && (instance.hasOwnProperty(method) || ClassToUse.prototype.hasOwnProperty(method)))) { throw new Error(`'${method}' is not a method of '${ClassToUse.name}'`) }
      f.result = instance[method](...args)
      return f
    }
    f[SpecialHoF] = true
    f.instance = instance
    if (staticClass) return f(...args)
    return f
  }
}
