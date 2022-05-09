
import { AsyncLogicEngine, Constants } from 'json-logic-engine'
import { splitEvery, equals, omit } from 'ramda'
import { diff } from 'jest-diff'
import Ajv from 'ajv'
import inquirer from 'inquirer'
import chalk from 'chalk'
import { SpecialHoF } from './symbols.js'


const engine = new AsyncLogicEngine()
const ajv = new Ajv()

function diffTouchup(expected, received) {
    const result = diff(expected, received)
    if (result.includes('Comparing two different types')) {
        return `${result}\n  ${chalk.green(`- Expected: ${stringify(expected).replace(/\n/g, '\n  ')}`)}\n${chalk.red(`  - Received: ${stringify(received).replace(/\n/g, '\n  ')}`)}`
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

engine.addMethod('combine', (data) => Object.assign({}, ...data), {
    sync: true,
    deterministic: true
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


function generateErrorText (error) {
    if (error && error.constructor.name === 'Error' && error.message) return chalk.red(`"${error.message}"`)
    if (error.errors) return chalk.red(error.errors.map(e => e.message).join('\n'))
    if(error instanceof Error) {
        return chalk.red(`${error.constructor.name}: "${error.message}"`)
    }
    return chalk.red(JSON.stringify(error))
}

function stringify(obj) {
    return JSON.stringify(obj, (k, v) => {
        if (typeof v === "undefined") return '~~~undefined~~~'
        return v
    }, 2).replace(/"~~~undefined~~~"/g, 'undefined')
}

/**
 * @param {*} item 
 * @param {string} rule 
 * @param {string} id
 */
async function askSnapshot({ item, rule, id }) {
    if (process.env.CI) return false
    if (process.env.ACCEPT_ALL) return true
    console.log(`On test (${id.split('.')[0]}):`, rule)
    console.log(chalk.green(stringify(omit(['hash'], item))))
    const {result} = await inquirer.prompt([{ name: 'result', message: 'Accept this snapshot?', type: 'list', choices: ['Yes', 'No'] }])
    return result === 'Yes' 
}

/**
 * @param {*} item 
 * @param {string} rule 
 * @param {string} id
 */
 async function askSnapshotUpdate({ item, value, rule, id }) {
    if (process.env.CI) return false
    if (process.env.UPDATE_ALL) return true
    console.log(`On test (${id.split('.')[0]}):`, rule)
    console.log(diff(omit(['hash'], value), omit(['hash'], item)))
    const {result} = await inquirer.prompt([{ name: 'result', message: 'Do you wish to update to this snapshot?', type: 'list', choices: ['Yes', 'No'] }])
    return result === 'Yes' 
}

engine.addMethod('snapshot', async ([inputs], context) => {
    let result = null
    let promise = false
    try {
        let call = getDataSpecialSnapshot(context.func.apply(null, inputs))
        if (call && call.then) {
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

    if ((!exists || !equals(value.hash, result.hash)) && await askSnapshot({ item: result, rule: context.rule, id: context.id})) {
        await context.snap.set(context.id, result)
        return [omit(['hash'], result), true]
    }

    if (equals(value, result)) {
        return [omit(['hash'], result), true]
    }
    
    if (exists) {
        // We have a snapshot, but it's different, so we need to ask the user if they want to update the snapshot
        if(await askSnapshotUpdate({ item: result, value, rule: context.rule, id: context.id })) {
            await context.snap.set(context.id, result)
            return [omit(['hash'], result), true]
        }
    }
    
    return [omit(['hash'], result), false, diff(omit(['hash'], value), omit(['hash'], result))]
}, {
    useContext: true
})

engine.addMethod('to', async ([inputs, output], context) => {
    try {
        const result = getDataSpecial(context.func.apply(null, inputs))   
        if (!equals(result, output)) {
            if (result && result.then) {
                return [await result, false, `Expected ${JSON.stringify(output)} but got Promise<${JSON.stringify(await result)}>`]
            }
            return [result, false, diffTouchup(output, result)]
        }
        return [result, true]
    }
    catch (err) {
        return [err, false, `Expected ${JSON.stringify(output)} but function threw ${generateErrorText(err)}`]
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
            const result = getDataSpecial(context.func.apply(null, await engine.run(inputs, context)))
            if (result && result.then) return [result.catch(err => err), false, 'Function call returns a promise.'] 
            return [result, Boolean(await engine.run(output, { data: result, context: context.func.instance }))]
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
        if (!result || !result.then) return [result, false, 'Was not a promise.']
        return [await result, equals(await result, output)]
    } catch(err) {
        return [err, false, `Expected ${JSON.stringify(output)} but function rejected with ${generateErrorText(err)}`]
    }
}, {
    useContext: true
})

engine.addMethod('resolvesParse', {
    asyncMethod: async ([inputs, output], context, above, engine) => {
        try {
            const result = getDataSpecial(context.func.apply(null, await engine.run(inputs, context)))    
            if (!result || !result.then) return [result, false, 'Was not a promise.']
            return [await result, Boolean(await engine.run(output, { data: await result, context: context.func.instance }))]
        } catch(err) {
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
        } catch(err) {
            return [err, false, `Could not execute as function threw ${generateErrorText(err)}`]
        }
    },
    traverse: false
}, {
    useContext: true
})

engine.addMethod('throws', async ([inputs, output], context) => {
  try {
    const result = getDataSpecial(context.func.apply(null, await engine.run(inputs, context)))

    if (result && result.then) {
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
      try { result = getDataSpecial(context.func.apply(null, await engine.run(inputs, context))) } catch(err2) {
        return [err2, false, 'Async call threw synchronously.']
      }
      if (!result || !result.then) return [result, false, 'Was not a promise.']
      return [await result, false, 'Did not throw.']
    } catch (err) {
      const errorName = err.constructor.name 
      const errorMessage = err.message 
      if (output && !equals(errorName, output) && !equals(errorMessage, output)) 
          return [err, false, `Error name or message did not match. Expected '${output}' but got class '${errorName}' or message '${errorMessage}'`]
      
      return [err, true]
    }
  })
  

export default engine