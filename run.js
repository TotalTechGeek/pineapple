/* eslint-disable no-prototype-builtins */
import engine from './methods.js'
import { parse } from './parser/dsl.js'
import { snapshot } from './snapshot.js'
import logSymbols from 'log-symbols'
import { hash } from './hash.js'
import chalk from 'chalk'
import { SpecialHoF } from './symbols.js'
import { failure, parseFailure, success, testRuntimeFailure } from './outputs.js'
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
 * Just executes the expression, used for "before" / "beforeEach" / "after" / "afterEach".
 * @param {string} input
 */
export async function execute (input) {
  const ast = parse(input, { startRule: 'Expression' })
  await engine.run(ast)
}

/**
 * Runs the tests in the Pineapple JSON Logic Engine.
 * @param {string} input
 * @param {string} id
 * @param {(...args: any[]) => any} func
 * @param {string} fileName
 */
export async function run (input, id, func, fileName) {
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
      result = await engine.run(step, { func: current, id: (`${idName}(${input}) [${idHash}]`), snap, hash: h, rule: input })
      const [data, success, message] = result
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
      failure(idName, input, message, fileName)
      return 1
    }
  } catch (err) {
    if (err.expected) {
      const { message } = err
      parseFailure(idName, input, message, fileName)
    } else testRuntimeFailure(err)

    return 1
  }

  success(idName, input, fileName)
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
    const f = ([method, ...args]) => {
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
