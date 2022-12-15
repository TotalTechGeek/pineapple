import chalk from 'chalk'
import { diff as jestDiff } from 'jest-diff'
import engine from './methods.js'
import { serialize } from './snapshot.js'
import fc from 'fast-check'
import { ConstantFunc } from './symbols.js'

// The following is used as a "simple way" to keep track of whether a complex structure generated from arbitraries is actually constant.
// This allows us to avoid a bunch of duplicate test effort when someone writes something like:
// { name: 'Jesse', image: #commonPicture }, where #commonPicture is defined as a constant.
const constantStructures = new Set()

/**
 * Checks if a function in the Logic Engine is logged as constant.
 * @param {string} name
 * @returns {boolean}
 */
function checkConstantFunction (name) {
  return engine.methods[name] && engine.methods[name].method && engine.methods[name].method[ConstantFunc]
}

/**
 * It takes the output of the diff function and if it contains the string "Comparing two different
 * types", it replaces the output with a more detailed message
 * @param expected - The expected value.
 * @param received - The value that was actually returned from the test.
 * @returns The function diffTouchup is being returned.
 */
export function diff (expected, received) {
  const result = jestDiff(expected, received)
  if (result.includes('Comparing two different types')) {
    return `${result}\n  ${chalk.green(`- Expected: ${serialize(expected).replace(/\n/g, '\n  ')}`)}\n${chalk.red(`  - Received: ${serialize(received).replace(/\n/g, '\n  ')}`)}`
  }
  return result
}

const tupleConstApplication = item => {
  if (item && typeof item === 'object') {
    const key = Object.keys(item)[0]
    if (key.startsWith('#')) {
      return item
    }
  }
  return { '#constant': item }
}

/**
 * Used to touch up the logic so that statements that aren't completely valid with arbitraries are made valid,
 * like #record({ id: #integer }) and { id: #integer } become the same.
 * @param {*} item
 * @returns
 */
function touchUpArbitrary (item) {
  if (!item) return item
  if (typeof item === 'number') return item
  if (typeof item === 'string') return item
  if (typeof item === 'boolean') return item
  if (typeof item === 'bigint') return item

  const key = Object.keys(item)[0]

  if (key.startsWith('#')) {
    if (item[key] && item[key].obj) {
      return {
        [key]: {
          obj: item[key].obj.map(touchUpArbitrary)
        }
      }
    }

    if (item[key] && item[key].list) {
      return {
        [key]: {
          list: item[key].list.map(touchUpArbitrary)
        }
      }
    }
  }

  if (key === 'obj') {
    if (item[key].some(i => (Object.keys(i || {})[0] || '').startsWith('#'))) {
      const result = {
        '#record': {
          obj: item[key]
            .map(touchUpArbitrary)
            // apply a fix to the values of the obj so that they're all wrapped in #constant,
            // this makes the sugar simpler.
            .map((i, x) => (x & 1) ? tupleConstApplication(i) : i)
        }
      }

      // detect & track if the result is purely constant.
      if (result['#record'].obj.every((i, x) => !(x & 1) || constantStructures.has(i) || typeof i['#constant'] !== 'undefined' || checkConstantFunction(Object.keys(i)[0]))) {
        constantStructures.add(result)
      }

      return result
    }
  }

  if (key === 'list') {
    if (item[key].some(i => (Object.keys(i || {})[0] || '').startsWith('#'))) {
      const result = {
        '#tuple': {
          list: item[key]
            .map(touchUpArbitrary)
            // makes the sugar simpler by applying #constant to the constant values of an inferred tuple.
            .map(tupleConstApplication)
        }
      }

      // detect & track if the result is purely constant.
      if (result['#tuple'].list.every((i) => typeof i['#constant'] !== 'undefined' || checkConstantFunction(Object.keys(i)[0]))) {
        constantStructures.add(result)
      }

      return result
    }
  }

  const count = arbitraryBranchCount(item)

  if (count === 0) {
    return item
  } else if (count === 1) {
    const [map, arbitraries] = traverseSubstitute(item)
    return {
      ...arbitraries[0],
      map
    }
  } else throw new Error('You may not use more than one arbitrary in an argument, did you intend to use #record or #tuple?')
}

/**
 * Count the number of references to arbitraries in the logic tree.
 * (Nested Arbitraries still count as one, because it terminates the traversal
 * when it reaches one; this is by design!).
 * @param {*} obj
 */
function arbitraryBranchCount (obj) {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    const key = Object.keys(obj)[0]
    if (key.startsWith('#')) return 1

    if (!Array.isArray(obj[key])) return 0

    return obj[key].reduce((acc, i) => {
      acc += arbitraryBranchCount(i)
      return acc
    }, 0)
  }
  return 0
}

const basicSub = { var: '' }

/**
 * Substitute any arbitraries with a "var" expression so that we can perform a map operation
 * after building the relevant logic. :)
 * @param {*} obj
 * @param {*} sub
 */
export function traverseSubstitute (obj, sub = []) {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    const key = Object.keys(obj)[0]
    if (key.startsWith('#')) {
      sub.push(obj)
      return [basicSub, sub]
    }

    return [{
      [key]: Array.isArray(obj[key]) ? obj[key].map(i => traverseSubstitute(i, sub)[0]) : traverseSubstitute(obj[key], sub)[0]
    }, sub]
  }
  return [obj, sub]
}

/**
 * Convert the arguments for a test case into arbitraries.
 * @param  {...any} args
 */
export async function argumentsToArbitraries (data, ...args) {
  args = args.map(touchUpArbitrary)
  let constant = true
  const list = []
  for (const i of args) {
    if (i && typeof i === 'object') {
      const keys = Object.keys(i)

      if (keys[0].startsWith('#')) {
        if (!constantStructures.has(i) && keys[0] !== '#constant' && !checkConstantFunction(keys[0])) constant = false
        const result = await (await engine.build(i))(data)
        if (keys[1] === 'map' && i.map !== basicSub) {
          list.push(result.map(engine.fallback.build(i.map)))
          continue
        }
        list.push(result)
        continue
      }
    }

    list.push(fc.constant(await (await engine.build(i))(data)))
  }

  list.constant = constant
  return list
}
