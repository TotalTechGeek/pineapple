// @ts-check
import { AsyncLogicEngine, Compiler } from 'json-logic-engine'
import { splitEvery, equals, omit, pick, dissocPath } from 'ramda'
import Ajv from 'ajv'
import chalk from 'chalk'
import { SpecialHoF } from './symbols.js'
import { askSnapshotUpdate, askSnapshot } from './inputs.js'
import { diff } from './utils.js'
import { serialize } from './snapshot.js'
import fc from 'fast-check'

const engine = new AsyncLogicEngine()
const ajv = new Ajv()

engine.addMethod('pick', ([a, b]) => pick(a, b), { sync: true, deterministic: true })
engine.addMethod('omit', ([a, b]) => omit(a, b), { sync: true, deterministic: true })
engine.addMethod('omitDeep', ([a, b]) => {
  let res = a
  for (const path of b) res = dissocPath(path.split('.'), res)
  return res
}, { sync: true, deterministic: true })
engine.addMethod('**', ([a, b]) => a ** b, { sync: true, deterministic: true })
engine.addMethod('===', ([a, b]) => equals(a, b), {
  sync: true,
  deterministic: true
})
engine.addMethod('bigint', i => BigInt(i))
engine.addMethod('date', i => i ? new Date(i) : new Date())
engine.addMethod('as', {
  asyncMethod: async ([item, schema], context, above, engine) => {
    if (schema === 'function') return typeof item === 'function'
    return ajv.validate(schema, item)
  },
  traverse: true
})

engine.addMethod('combine', (data) => Object.assign({}, ...data), {
  sync: true,
  deterministic: true
})

engine.addMethod('list', {
  method: i => i ? [].concat(i) : [],
  deterministic: true,
  traverse: true
}, { sync: true })

engine.addMethod('obj', {
  method: (items) => {
    return items ? splitEvery(2, items).reduce((accumulator, [variable, value]) => ({ ...accumulator, [variable]: value }), {}) : {}
  },
  traverse: true,
  // @ts-ignore
  compile: (data, buildState) => {
    if (!data) return '({})'
    data = [].concat(data)
    if (!(data.length % 2)) { return false }
    const items = splitEvery(2, data).map(([variable, item]) => {
      return `[${Compiler.buildString(variable, buildState)}]: ${Compiler.buildString(item, buildState)}`
    })
    return `({ ${items.join(', ')} })`
  }
})

function generateErrorText (error) {
  if (error && error.constructor.name === 'Error' && error.message) return chalk.red(`"${error.message}"`)
  if (error.errors) return chalk.red(error.errors.map(e => e.message).join('\n'))
  if (error instanceof Error) {
    return chalk.red(`${error.constructor.name}: "${error.message}"`)
  }
  return chalk.red(JSON.stringify(error))
}

engine.addMethod('snapshot', {
  asyncMethod: async ([inputs, extract], context) => {
    inputs = await engine.run(inputs, context)

    let result = null
    let promise = false
    // workaround to get the actualError to the output.
    let actualError = null
    try {
      const call = getDataSpecialSnapshot(context.func.apply(null, inputs))
      if (call && call.then) {
        promise = true
      }
      result = { value: await call }
    } catch (err) {
      const errorInfo = err instanceof Error
        ? (err.constructor.name === 'Error' ? err.message : err.constructor.name)
        : err
      actualError = err
      result = {
        error: errorInfo,
        ...(err.message !== errorInfo && err.message && { message: err.message })
      }
    }

    if (result.value && extract) {
      result.value = await engine.run(extract, { ...context, data: result.value })
    }

    // @ts-ignore
    result.async = promise

    // @ts-ignore
    if (!process.env.OMIT_SNAPSHOT_INPUTS && context.fuzzed) result.input = inputs

    const { exists, value, transform } = await context.snap.find(context.id)

    // @ts-ignore
    if (!exists && await askSnapshot({ item: result, rule: context.rule, id: context.id, file: context.file })) {
      await context.snap.set(context.id, result)
      return [result, true]
    }

    const compareResult = transform ? await engine.run(transform, result) : result
    const compareValue = transform ? await engine.run(transform, value) : value

    if (equals(compareValue, compareResult)) return [result, true]

    if (exists) {
      const answer = await askSnapshotUpdate({ item: result, value, rule: context.rule, id: context.id, file: context.file })
      // We have a snapshot, but it's different, so we need to ask the user if they want to update the snapshot
      if (answer) {
        await context.snap.set(context.id, result, typeof answer === 'object' ? answer : undefined)
        return [result, true]
      }
      return [{ ...result, actualError }, false, diff(value, result)]
    }

    return [{ ...result, actualError }, false, 'There is no snapshot for this test.']
  },
  traverse: false
}, {
  useContext: true
}
)

engine.addMethod('to', async ([inputs, output], context) => {
  try {
    const result = getDataSpecial(context.func.apply(null, inputs))
    if (!equals(result, output)) {
      if (result && result.then) {
        return [await result, false, `Expected ${chalk.green(`${serialize(output)} `)}\n\nReceived ${chalk.red(`Promise<${serialize(await result)}>`)}`]
      }
      return [result, false, diff(output, result)]
    }
    return [result, true]
  } catch (err) {
    return [err, false, `Expected ${chalk.green(serialize(output))} but function threw ${chalk.red(generateErrorText(err))}`]
  }
}, {
  useContext: true
})

function getDataSpecial (data) {
  if (data && data[SpecialHoF]) return data.result
  return data
}

function getDataSpecialSnapshot (data) {
  if (data && data[SpecialHoF]) return { result: data.result, instance: data.instance }
  return data
}

engine.addMethod('toParse', {
  asyncMethod: async ([inputs, output], context, above, engine) => {
    try {
      inputs = await engine.run(inputs, context)
      const result = getDataSpecial(context.func.apply(null, inputs))
      if (result && result.then) return [result.catch(err => err), false, 'Function call returns a promise.']
      return [result, Boolean(await engine.run(output, { data: result, context: context.func.instance, args: inputs }))]
    } catch (err) {
      return [err, false, `Could not execute condition as function threw ${generateErrorText(err)}`]
    }
  },
  traverse: false
}, {
  useContext: true
})

engine.addMethod('resolves', async ([inputs, output], context) => {
  try {
    const result = getDataSpecial(context.func.apply(null, inputs))

    if (!result || !result.then) {
      return [await result, false, `Expected ${chalk.green(`Promise<${serialize(output)}>`)}\n\nReceived ${chalk.red(`${serialize(await result)}`)}`]
    }

    if (!equals(await result, output)) {
      return [result, false, diff(output, await result)]
    }

    return [await result, true]
  } catch (err) {
    return [err, false, `Expected ${serialize(output)} but function rejected with ${generateErrorText(err)}`]
  }
}, {
  useContext: true
})

engine.addMethod('resolvesParse', {
  asyncMethod: async ([inputs, output], context, above, engine) => {
    try {
      inputs = await engine.run(inputs, context)
      const result = getDataSpecial(context.func.apply(null, inputs))
      if (!result || !result.then) return [result, false, `Expected ${chalk.green('Promise<T>')}\nReceived ${chalk.red(serialize(result))}`]
      return [await result, Boolean(await engine.run(output, { data: await result, context: context.func.instance, args: inputs }))]
    } catch (err) {
      return [err, false, `Could not execute condition as function rejected with ${generateErrorText(err)}`]
    }
  },
  traverse: false
}, {
  useContext: true
})

engine.addMethod('execute', {
  asyncMethod: async ([inputs], context, above, engine) => {
    try {
      const result = await context.func.apply(null, await engine.run(inputs, context))
      return [result, true]
    } catch (err) {
      return [err, false, `Could not execute as function threw ${generateErrorText(err)}`]
    }
  },
  traverse: false
}, {
  useContext: true
})

engine.addMethod('throws', async ([inputs, output], context) => {
  try {
    const result = getDataSpecial(context.func.apply(null, inputs))

    if (result && result.then) {
      try {
        return [await result, false, `Expected to throw but got ${chalk.red(`Promise<${serialize(await result)}>`)}`]
      } catch (err2) {
        return [err2, false, `Expected to throw but got rejected Promise instead. (${chalk.red(err2 && (err2.message || err2.constructor.name || err2))})`]
      }
    }
    return [result, false, 'Did not throw.']
  } catch (err) {
    const errorName = err.constructor.name
    const errorMessage = err.message
    if (output && !equals(errorName, output) && !equals(errorMessage, output)) { return [err, false, `Error name or message did not match. Expected '${output}' but got class '${errorName}' or message '${errorMessage}'`] }
    return [err, true]
  }
})

engine.addMethod('rejects', async ([inputs, output], context) => {
  try {
    let result
    try { result = getDataSpecial(context.func.apply(null, inputs)) } catch (err2) {
      return [err2, false, 'Async call threw synchronously.']
    }
    if (!result || !result.then) return [result, false, `Expected ${chalk.green('a rejected Promise')}\nReceived ${chalk.red(serialize(result))}`]
    return [await result, false, 'Did not throw.']
  } catch (err) {
    const errorName = err.constructor.name
    const errorMessage = err.message
    if (output && !equals(errorName, output) && !equals(errorMessage, output)) { return [err, false, `Error name or message did not match. Expected '${output}' but got class '${errorName}' or message '${errorMessage}'`] }

    return [err, true]
  }
})

engine.addMethod('__fails__', async ([func, inputs, output], context, above, engine) => {
  const data = await engine.run({ [func.join('')]: [inputs, output] }, context)
  return [data, !data[1]]
})

export const createArbitrary = method => data => {
  if (data === undefined) return method()
  return method(...[].concat(data))
}

Object.keys(fc).filter(i => typeof fc[i] === 'function' && i[0] === i[0].toLowerCase()).forEach(addition => {
  engine.addMethod('#' + addition, createArbitrary(fc[addition]), { sync: true })
})

engine.addMethod('#number', createArbitrary(fc.nat), { sync: true })

export default engine
