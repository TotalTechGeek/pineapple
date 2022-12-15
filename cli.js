#!/usr/bin/env node
// @ts-check
import { groupBy, pluck, map, indexBy, pickBy, identity } from 'ramda'
import tempy from 'tempy'
import debounce from 'debounce'
import { program, Option } from 'commander'
import { hash } from './hash.js'
import url from 'url'
import { transpile } from './typescriptTranspiler.js'
import { filesTested, skippingTest } from './outputs.js'
import chalk from 'chalk'
import dependencyTree from 'dependency-tree'
import chokidar from 'chokidar'
import path from 'path'
import { spawn } from 'node:child_process'
import readline from 'node:readline'
import os from 'os'
import { parseCode } from './basic-parser.js'
import { readFileSync, writeFileSync } from 'fs'
import glob from 'glob'

const formatOption = new Option('-f, --format <format>', 'The output format').choices(['json', 'console']).default('console')

program
  .name('pineapple')
  .version('0.13.6')
  .option('-i, --include <files...>', 'Comma separated globs of files to include.')
  .option('-e, --exclude <files...>', 'Comma separated globs of files to exclude.')
  .option('-w, --watch-mode', 'Will run tests only when a file is modified.')
  .option('-a, --accept-all', 'Accept all snapshots.')
  .option('-u, --update-all', 'Update all snapshots.')
  .option('-t, --typescript', 'Enables typescript (slower).')
  .option('--only <lines...>', 'Allows you to specify which tests you would like to run.')
  .addOption(formatOption)

if (os.platform() !== 'win32') program.option('--bun', 'Uses Bun as the test runner.')

program.parse()

const options = program.opts()

if (!options.include || !options.include.length) throw new Error('Please select files to include.')

// Used for the "watch" mode.
let child

// Add additional code to make it easier to interface with the program when in watch mode.
if (options.watchMode) {
  const cleanExit = () => {
    console.clear()
    if (child) child.kill()
    process.exit()
  }
  readline.emitKeypressEvents(process.stdin)
  process.stdin.setRawMode(true)

  const forward = new Set(['down', 'up', 'return', 'backspace'])
  const forwardEntered = new Set(['y', 'n'])
  process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') cleanExit()
    if ((!child || child.exitCode !== null) && key.name === 'q') cleanExit()

    // Forward certain keystrokes to the child program
    if (child && child.exitCode === null && forward.has(key.name)) child.stdin.write(key.sequence)
    if (child && child.exitCode === null && forwardEntered.has(key.name)) child.stdin.write(key.sequence + '\n')
  })
}

// hack for now until I make the code better
process.env.ACCEPT_ALL = options.acceptAll || ''
process.env.UPDATE_ALL = options.updateAll || ''

if (options.format === 'json') process.env.OUTPUT_FORMAT = 'JSON'
process.env.OUTPUT_FORMAT = process.env.OUTPUT_FORMAT || 'CONSOLE'
if (options.bun) delete options.typescript
if (options.bun && process.env.OUTPUT_FORMAT === 'CONSOLE') process.env.FORCE_COLOR = '1'
if (process.env.OUTPUT_FORMAT === 'JSON') {
  chalk.level = 0
  process.env.FORCE_COLOR = '0'
}

async function main () {
  const regex = /,\s?(?![^{}]*\})/
  options.exclude = options.exclude ? options.exclude.flatMap(i => i.split(regex)) : []
  const files = options.include.flatMap(i => i.split(regex)).flatMap(i => glob.sync(i, {
    ignore: options.exclude
  }))

  // get variable declarations that are arrow functions / functions
  let functions = files.flatMap(getFileFunctions)

  const fileChanged = debounce(async (fileChanged) => {
    const correctPath = path.resolve(fileChanged)

    if (fileChanged.endsWith('.psnap')) return

    console.clear()
    functions = functions.filter(i => i.fileName !== url.pathToFileURL(correctPath).href).concat(
      getFileFunctions(fileChanged)
    )

    const execFunctions = functions.filter(i => {
      // we also always need to include files with @pineapple_define and global tags.
      const global = i.tags.some(i => i.type === 'pineapple_define' || i.type.includes('Global') || i.type === 'pineapple_import')
      return i.dependencies.has(correctPath) || global
    })

    if (execFunctions.length) {
      const set = new Set()
      execFunctions.forEach(i => set.add(i.relativePath))
      await execute(execFunctions, true)
      filesTested(Array.from(set))
    }
  }, 50, false)

  if (options.watchMode) {
    chokidar.watch(options.include).on('change', fileChanged)
  } else await execute(functions, false)
}

const getFileFunctions = file => {
  const functions = getFunctions(readFileSync(file).toString(), url.pathToFileURL(file).href)

  if (functions.length) {
    // grab the dependencies for a given file
    const dependencies = new Set(dependencyTree.toList({
      filename: file,
      directory: '.',
      filter: str => !str.includes('/node_modules/')
    }))
    // attach the dependencies to the files.
    return functions.map(i => ({ ...i, dependencies }))
  }

  return []
}

const cwd = url.pathToFileURL(process.cwd()).href

/**
 * @param {*} functions
 * @param {boolean} forkProcess
 */
async function execute (functions, forkProcess = false) {
  const tmp = tempy.file({ extension: 'mjs' })

  const imports = Object.entries(map(i => {
    return { namedImports: pluck('name', i), original: indexBy(i => i.name, i) }
  }, groupBy(i => i.fileName, functions)))

  const specifier = import.meta.url.split(/\/|\\/)
  specifier.pop()
  const runFile = [...specifier, 'run.js'].join('/')
  const outputFile = [...specifier, 'outputs.js'].join('/')

  const pathScheme = options.bun ? url.fileURLToPath : i => i

  let testFileString = ''

  testFileString += `import { run, addMethod, addDefinitions, execute, hof } from '${pathScheme(runFile)}';\n`
  testFileString += `import { aggregate } from '${pathScheme(outputFile)}';\n`

  let counter = 0

  // add imports
  await Promise.all(imports.map(async ([moduleSpecifier, { namedImports, original }], index) => {
    if (options.typescript) { moduleSpecifier = await transpile(moduleSpecifier) }

    const str = `
        import * as $$${index} from '${pathScheme(moduleSpecifier)}';
        const { ${namedImports.map(i => {
          original[i].alias = `$${counter++}`
          return `${i}: ${original[i].alias}`
        }).join(', ')} } = { ...$$${index}.default, ...$$${index} };
    `
    testFileString += str
  }))

  // add test functions
  testFileString += '\nasync function test() {\n'

  const executeTag = tag => `await execute(${JSON.stringify(tag.text)})`

  let testCount = 0
  const { addedMethods, tests, beforeAll, afterAll, beforeEachGlobal, beforeGlobal, afterGlobal, afterEachGlobal } = functions.map(func => {
    const addedMethods = func.tags
      .filter(i => i.type === 'pineapple_import')
      .map(i => `addMethod(${JSON.stringify(i.text || func.originalName || func.name)}, ${func.alias})\n`)
      .join('') + '\n' +
      func.tags
        .filter(i => i.type === 'pineapple_define')
        .map((i) => `addDefinitions(${func.alias}, ${JSON.stringify(i.text.trim() || '')})\n`)
        .join('')

    const globalLifecycle = name => func.tags
      .filter(i => i.type === name)
      .map(() => `${func.alias}()\n`)
      .join('')

    const beforeAll = globalLifecycle('beforeAll')
    const afterAll = globalLifecycle('afterAll')
    const beforeEachGlobal = globalLifecycle('beforeEachGlobal')
    const beforeGlobal = globalLifecycle('beforeGlobal')
    const afterGlobal = globalLifecycle('afterGlobal')
    const afterEachGlobal = globalLifecycle('afterEachGlobal')

    // before / beforeEach / after / afterEach will get integrated in directly with the tests.
    const testLifecycle = name => func.tags
      .filter(i => i.type === name)
      .map(executeTag)
      .join('\n')

    const before = testLifecycle('before')
    const beforeEach = testLifecycle('beforeEach')
    const after = testLifecycle('after')
    const afterEach = testLifecycle('afterEach')

    const wrapHof = (alias, tag) => func.isClass ? `hof(${alias}, ${tag.type === 'test_static'})` : alias

    // this is sloppy, I should make this part of the reducer
    testCount += func.tags.filter(i => i.type === 'test' || i.type === 'test_static').length
    const tests = `%beforeGlobal%\n${before}\n${func.tags.filter(i => i.type === 'test' || i.type === 'test_static').map((tag, index) => `
            %beforeEachGlobal% 
            ${beforeEach}
            sum += await run(${JSON.stringify(tag.text)}, '${func.originalName || func.name}.${hash(func.relativePath + ':' + tag.text)}', ${wrapHof(func.alias, tag)}, "${func.fileName}:${tag.lineNo}")
            %afterEachGlobal%
            ${afterEach}
        `).join('')}\n${after}\n%afterGlobal%`

    return { addedMethods, tests, beforeAll, afterAll, beforeEachGlobal, afterEachGlobal, afterGlobal, beforeGlobal }
  }).reduce((acc, i) => {
    // eslint-disable-next-line no-return-assign
    Object.keys(i).forEach(k => acc[k] = [...(acc[k] || []), ...i[k]])
    return acc
  }, {})

  const testString = tests.join('')
    .replace(/%beforeEachGlobal%/g, beforeEachGlobal.join(''))
    .replace(/%beforeGlobal%/g, beforeGlobal.join(''))
    .replace(/%afterEachGlobal%/g, afterEachGlobal.join(''))
    .replace(/%afterGlobal%/g, afterGlobal.join(''))

  testFileString += `const count = ${testCount};\nlet sum = 0;\n${addedMethods.join('')}\n${beforeAll.join('')}\n${testString}\n${afterAll.join('')};
    return { sum, count }`

  testFileString += '\n}\n'

  // add text to end of file
  testFileString += 'test().then(({ sum, count }) => { aggregate(sum, count); process.exit(sum) });'

  writeFileSync(tmp, testFileString)

  if (child) child.kill()

  // run the file
  if (forkProcess) {
    const program = options.bun ? 'bun' : 'node'

    child = spawn(program, [tmp], {
      stdio: ['pipe', 'inherit', 'inherit'],
      env: pickBy(identity, process.env)
    })
  } else if (options.bun) {
    child = spawn('bun', [tmp], {
      stdio: ['pipe', 'inherit', 'inherit'],
      env: pickBy(identity, process.env)
    })

    child.on('exit', (code) => {
      process.exit(code || undefined)
    })
  } else await import(url.pathToFileURL(tmp).href)
}

/**
 * Gets each of the functions from the file & figures out if they have associated pineapple
 * annotations.
 */
function getFunctions (fileText, fileName) {
  let onlyLines = null
  if (options.only && options.only.length) {
    onlyLines = new Set(options.only.map(i => {
      const index = i.lastIndexOf(':')
      const fileRequested = i.substring(0, index)
      return fileName === fileRequested ? +i.substring(index + 1) : null
    }).filter(i => i))

    if (!onlyLines.size) return []
  }

  const functions = parseCode(fileText).map(i => ({
    ...i,
    fileName,
    isClass: i.type === 'class',
    relativePath: fileName.startsWith(cwd) ? fileName.substring(cwd.length + 1) : ''
  })).filter(i => {
    if (onlyLines) {
      i.tags = i.tags.filter(tag => {
        if (tag.type !== 'test' && tag.type !== 'test_static') return true
        return onlyLines.has(tag.lineNo)
      })
    }
    if (!i.tags.length) return false
    if (!i.exported) skippingTest(i.name, i.fileName, i.tags)
    return i.exported
  })

  return functions
}

main()
