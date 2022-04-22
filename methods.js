
import { AsyncLogicEngine, Constants } from 'json-logic-engine'
import { splitEvery, equals, omit } from 'ramda'
import { diff } from 'jest-diff'
import Ajv from 'ajv'

const engine = new AsyncLogicEngine()
const ajv = new Ajv()

function diffTouchup(expected, received) {
    const result = diff(expected, received)
    if (result.includes('Comparing two different types')) {
        return `${result}\n  - Expected: ${JSON.stringify(expected)}\n  - Received: ${JSON.stringify(received)}`
    }
    return result
}

engine.addMethod('===', ([a, b]) => equals(a, b), {
    sync: true,
    deterministic: true
})

engine.addMethod('as', {
    asyncMethod: async ([item, schema], context, above, engine) => {
        if (schema === 'function') return typeof item === 'function'
        return ajv.validate(schema, item)
    },
    traverse: true
})

engine.addMethod('list', {
    method: i => i ? [].concat(i) : [],
    deterministic: true,
    traverse: true,
    sync: true
  })

engine.addMethod('obj', {
    method: (items) => {
      return items ? splitEvery(2, items).reduce((accumulator, [variable, value]) => ({ ...accumulator, [variable]: value }), {}) : {}
    },
    traverse: true,
    // deterministic: true,
    compile: (data, buildState) => {
      if (!data) return '({})'
      data = [].concat(data)
      if (!data.length % 2) { return false }
      const items = splitEvery(2, data).map(([variable, item]) => {
        return `[${buildString(variable, buildState)}]: ${buildString(item, buildState)}`
      })
      return `({ ${items.join(', ')} })`
    }
  })

engine.addMethod('snapshot', async ([inputs], context) => {
    let result = null
    let promise = false
    try {
        let call = context.func.apply(null, inputs)    
        if (call.then) {
            promise = true
        }
        result = { value: await call }
    }
    catch (err) {
        const errorInfo = err instanceof Error ? 
            (err.constructor.name === 'Error' ? err.message : err.constructor.name)
            : err
        result = {
            error: errorInfo
        }
    }

    result.async = promise
    result.hash = context.hash

    const { exists, value } = await context.snap.find(context.id)

    if (!exists || !equals(value.hash, result.hash)) {
        await context.snap.set(context.id, result)
        return [omit(['hash'], result), true]
    }

    if (equals(value, result)) {
        return [omit(['hash'], result), true]
    }
    
    return [omit(['hash'], result), false, diff(omit(['hash'], value), omit(['hash'], result))]
}, {
    useContext: true
})

engine.addMethod('to', async ([inputs, output], context) => {
    const result = context.func.apply(null, inputs)    

    if (!equals(result, output)) {
        if (result.then) {
            return [await result, false, `Expected ${JSON.stringify(output)} but got Promise<${JSON.stringify(await result)}>`]
        }
        return [result, false, diffTouchup(output, result)]
    }

    return [result, true]
}, {
    useContext: true
})

engine.addMethod('resolves', async ([inputs, output], context) => {
    const result = context.func.apply(null, inputs)    
    if (!result.then) return [result, false, 'Was not a promise.']
    return [await result, equals(await result, output)]
}, {
    useContext: true
})


engine.addMethod('toParse', {
    asyncMethod: async ([inputs, output], context, above, engine) => {
        const result = context.func.apply(null, await engine.run(inputs, context))    
        return [result, Boolean(await engine.run(output, result))]
    },
    traverse: false
}, {
    useContext: true
})

engine.addMethod('execute', {
    asyncMethod: async ([inputs], context, above, engine) => {
        const result = await context.func.apply(null, await engine.run(inputs, context))    
        return [result, true]
    },
    traverse: false
}, {
    useContext: true
})

engine.addMethod('resolvesParse', {
    asyncMethod: async ([inputs, output], context, above, engine) => {
        const result = context.func.apply(null, await engine.run(inputs, context))    
        if (!result.then) return [result, false, 'Was not a promise.']
        return [await result, Boolean(await engine.run(output, await result))]
    },
    traverse: false
}, {
    useContext: true
})

engine.addMethod('throws', async ([inputs, output], context) => {
  try {
    const result = context.func.apply(null, await engine.run(inputs, context)) 
    if (result.then) {
        try {
            return [await result, false, `Expected to throw but got Promise<${JSON.stringify(await result)}>`]
        } catch (err2) {
            return [err2, false, `Expected to throw but got rejected Promise instead. (${err2 && (err2.message || err2.constructor.name || err2)})`]
        }
        
    }
    return [result, false, 'Did not throw.']
  } catch (err) {
    const errorName = err.constructor.name 
    const errorMessage = err.message 

    if (output && !equals(errorName, output) && !equals(errorMessage, output)) 
        return [err, false, `Error name or message did not match. Expected '${output}' but got class '${errorName}' or message '${errorMessage}'`]
    
    return [err, true]
  }
})

engine.addMethod('rejects', async ([inputs, output], context) => {
    try {
      let result
      try { result = context.func.apply(null, await engine.run(inputs, context)) } catch(err2) {
        return [err2, false, 'Async call threw synchronously.']
      }
      if (!result.then) return [result, false, 'Was not a promise.']
      return [await result, false, 'Did not throw.']
    } catch (err) {
      const errorName = err.constructor.name //?
      const errorMessage = err.message //?
  
      if (output && !equals(errorName, output) && !equals(errorMessage, output)) 
          return [err, false, `Error name or message did not match. Expected '${output}' but got class '${errorName}' or message '${errorMessage}'`]
      
      return [err, true]
    }
  })
  

export default engine