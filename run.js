/* eslint-disable no-prototype-builtins */
import engine, { createArbitrary } from './methods.js'
import { parse } from './parser/dsl.js'
import { serialize, snapshot } from './snapshot.js'
import { hash } from './hash.js'
import { SpecialHoF, ConstantFunc } from './symbols.js'
import { failure, parseFailure, success, testRuntimeFailure, snapshotsUnused } from './outputs.js'
import fc from 'fast-check'
import { argumentsToArbitraries } from './utils.js'
import { always } from 'ramda'
import url from 'url'
import { faker } from '@faker-js/faker'

// Global Log Injection //
if (!global.currentLog) global.currentLog = ''
global.log = (v, file, line, expr) => {
  // get cwd
  const cwd = process.cwd()
  let extract = i => i
  if (expr !== '@') {
    try {
      const func = engine.fallback.build(parse(expr.trim(), { startRule: 'Expression' }))
      extract = data => func({ data })
    } catch (e) {}
  }

  try {
    global.currentLog += `${file.replace(cwd, '.')}:${line}: ${serialize(extract(v))}\n`
  } catch (e) {
    global.currentLog += `${file.replace(cwd, '.')}:${line}: ${extract(v)}\n`
  }

  return v
}
export function flush () {
  if (global.currentLog) console.log(global.currentLog)
  global.currentLog = ''
}
// End Global Log Injection //

const ArbitraryFaker = { ...faker, seed: faker.seed }

const snap = snapshotManager()
function snapshotManager () {
  const snapshots = {}
  /**
   * @param {string} file
   */
  const result = (file) => {
    file = url.fileURLToPath(`${file.substring(0, file.lastIndexOf(':'))}.psnap`)
    if (!snapshots[file]) snapshots[file] = snapshot(file)
    return snapshots[file]
  }

  result.check = async (mode = false) => {
    const tests = []
    for (const file in snapshots) {
      const remaining = await snapshots[file].notAccessed
      if (mode === 'clean') for (const item of Array.from(remaining)) await snapshots[file].remove(item)
      else if (remaining.size) tests.push(...Array.from(remaining).map(item => [file, item]))
    }

    if (tests.length) {
      snapshotsUnused(tests, mode)
      // if strict, return 1, otherwise 0
      return +mode
    }

    return 0
  }

  return result
}

export const check = snap.check

/**
 * Adds a method to the Pineapple JSON Logic Engine.
 * @param {string} name
 * @param {(...args: any[]) => any} fn
 */
export function addMethod (name, fn) {
  engine.addMethod(name, data => fn(...[].concat(data)), {
    sync: fn.constructor.name !== 'AsyncFunction'
  })
}

/**
 * Adds a faker method to the Pineapple JSON Logic Engine.
 * @param {string} name
 * @param {(...args: any[]) => any} fn
 */
export function addFaker (name, fn) {
  return addDefinitions(() => ({
    [name]: (...args) => fc.nat().noShrink().map(() => fn(ArbitraryFaker, ...args))
  }))
}

/**
 * Executes the method passed in, and adds the arbitraries to the engine.
 * @param {(...args: any[]) => ({ [key: string]: any })} fn
 * @param {string} category
 */
export function addDefinitions (fn, category = '') {
  const definitions = fn()
  category = category.trim() ? `${category}.` : ''

  Object.keys(definitions).forEach(key => {
    if (typeof definitions[key] === 'function') {
      return engine.addMethod(`#${category}${key}`, createArbitrary(definitions[key]), { sync: true })
    }

    // todo: come up with a better way to detect that it's an arbitrary; there's probably a much better way
    if (definitions[key] instanceof fc.Arbitrary || (definitions[key].constructor && definitions[key].constructor.toString().includes('extends Arbitrary'))) {
      return engine.addMethod(`#${category}${key}`, always(definitions[key]), { sync: true })
    }

    const func = always(fc.constant(definitions[key]))
    func[ConstantFunc] = true
    return engine.addMethod(`#${category}${key}`, func, { sync: true })
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
  /**
     * @param {string} input
     * @param {string} id
     * @param {(...args: any[]) => any} func
     * @returns {Promise<[any, boolean] | [any, false, string]>}
     */
  async function internalRun (input, func) {
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

      const arbs = await argumentsToArbitraries({ data: current.result }, ...inputs)

      let numRuns = +process.env.FAST_CHECK_NUM_RUNS || 100

      // If the arguments are absolutely constant, run once
      if (arbs.constant) numRuns = 1
      // if there's only one argument and it has a fixed size, set the size to that.
      else if (arbs.length === 1 && arbs[0].size) numRuns = arbs[0].size
      // otherwise, reduce the number of runs for a snapshot
      // todo: make this configurable
      else if (key === 'snapshot') numRuns = +process.env.SNAPSHOT_FAST_CHECK_NUM_RUNS || 10

      let failed = null
      try {
        let count = 0
        const snapshot = snap(file)
        if (key === 'snapshot') ArbitraryFaker.seed(parseInt(h.substring(0, 16), 16))
        await fc.assert(fc.asyncProperty(...arbs, async (...args) => {
          count++
          // Hijack the seed for now, keep it simple
          const countStr = count > 1 ? `.${count}` : ''
          result = await engine.run({
            [key]: [{ preserve: args }, expectation]
          }, { func: current, id: (`${id}(${input})${countStr}`), snap: snapshot, hash: h, rule: input, file, args, context: current.instance, fuzzed: !arbs.constant })
          if (!result[1]) failed = result
          return result[1]
        }), {
          // If it's a snapshot, or there is more than one step in the test, make it consistent.
          seed: (key === 'snapshot' || script.length > 1) ? parseInt(h.substring(0, 16), 16) : undefined,
          numRuns,
          // If this is a snapshot test, but the snapshot does not exist, do not time out.
          ...(process.env.TEST_TIMEOUT && (key !== 'snapshot' || await snapshot.find(`${id}(${input})`).exists) && {
            markInterruptAsFailure: true,
            interruptAfterTimeLimit: +process.env.TEST_TIMEOUT
          }),
          reporter (out) {
            if (out.failed) {
              if (out.interrupted) throw new FuzzError(out.counterexample, out.seed, 'Test timed out.', out.numShrinks)
              throw new FuzzError(out.counterexample, out.seed, out.error, out.numShrinks)
            }
          }
        })
      } catch (e) {
        if (!failed) return [e, false, 'An unexpected issue was encountered.']
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
    const [data, success, message] = await internalRun(input, func)
    if (!success) {
      failure({ name: id, input, message, file, data })
      flush()
      return 1
    }
  } catch (err) {
    if (err.expected) {
      const { message } = err
      parseFailure(id, input, message, file)
    } else testRuntimeFailure(err)
    flush()

    return 1
  }

  success(id, input, file)
  flush()
  return 0
}

/**
 * Tries to invoke "new" to construct a class,
 * otherwise falls back to executing the function.
 * @param {(...args: any) => any} ClassToUse
 * @param  {any[]} args
 */
function forceConstruct (ClassToUse, ...args) {
  try {
    return new ClassToUse(...args)
  } catch (err) {
    return ClassToUse(...args)
  }
}

/**
 * A way to turn a class into a higher-order function chain for testing purposes.
 * @param {*} ClassToUse
 * @param {boolean} staticClass
 */
export function hof (ClassToUse, staticClass = false) {
  if (typeof ClassToUse !== 'function') ClassToUse = always(ClassToUse)
  return (...args) => {
    const instance = staticClass ? ClassToUse : forceConstruct(ClassToUse, ...args)
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
