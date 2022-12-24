import chalk from 'chalk'

const namespaces = {}

// Todo: Make this file work with the alternative output formats & etc.
// Todo: Add support for reading from feature files.

/**
 * This function creates a dynamic step namespace for the scenarios.
 * While you can avoid specifying a namespace and it'll default, I recommend defining a namespace to avoid
 * step collisions / encouraging people to re-use steps across different sections of the codebase.
 *
 * @example
 * ```
 * const { Given, When, Then, Scenario } = Steps()
 *
 * Given('There are 20 Pickles', function () { ... })
 * ...
 *
 * const Example = Scenario`
 * Given There are 20 Pickles
 * ...
 * `
 * ```
 *
 * @param {string | TemplateStringsArray} name The namespace for the steps to avoid collisions
 * @returns {Omit<{ [key: string]: (description: string, func: (...args: any[]) => void) => void }, 'Scenario'> & { Scenario: typeof Scenario }}
 */
function createNamespace (name = 'default') {
  if (Array.isArray(name)) name = name[0]
  if (namespaces[name]) return namespaces[name]
  const createHandler = (type) => (str, func) => {
    if (!target.registered[type]) target.registered[type] = {}
    const registeredType = target.registered[type]
    if (registeredType[str]) throw new Error(`${type} ${str} is already implemented.`)
    registeredType[str] = func
  }

  const handler = {
    get (target, prop) {
      if (prop === 'Scenario') return Scenario
      if (!target.methods[prop]) target.methods[prop] = createHandler(prop)
      return target.methods[prop]
    }
  }

  const target = {
    methods: {},
    registered: {}
  }

  /**
   * @param {TemplateStringsArray} param
   */
  function Scenario ([script]) {
    return async (...args) => {
      const steps = script.split('\n').filter(i => i.trim())
      if (!steps.length) return

      // validate that all the steps exist.
      let lastStep = null
      let missing = ''

      for (const step of steps) {
        const sentence = step.split(' ').map(i => i.trim()).filter(i => i)
        let verb = sentence.shift()
        const rest = sentence.join(' ')
        if (verb === 'And' || verb === 'and') verb = lastStep
        if (!target.registered[verb] || !target.registered[verb][rest]) {
          if (missing) missing += '\n\n'
          else missing += '\n// Step Implementations:\n'
          missing += `${verb}(${JSON.stringify(rest)}, function () {\n\n})`
        }
        lastStep = verb
      }

      if (missing) {
        console.log(`${chalk.red.bold('The following steps are not implemented / imported:')}\n${chalk.yellow(missing)}\n`)
        throw new Error('Not all of the necessary steps are implemented.')
      }

      // validate that the steps are in order.
      // todo: implement this block.

      // start to parse the steps
      const obj = {}
      lastStep = null
      for (const step of steps) {
        const sentence = step.split(' ').map(i => i.trim()).filter(i => i)
        let verb = sentence.shift()
        const rest = sentence.join(' ')
        if (verb === 'And' || verb === 'and') verb = lastStep
        obj.___func___ = target.registered[verb][rest]
        await obj.___func___(...args)
        lastStep = verb
      }

      delete obj.___func___
      return obj
    }
  }

  const ScenarioFramework = new Proxy(target, handler)
  namespaces[name] = ScenarioFramework
  return ScenarioFramework
}

export default createNamespace
