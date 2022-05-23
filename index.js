#!/usr/bin/env node
// @ts-check
import { Project } from 'ts-morph'
import { groupBy, pluck, map, indexBy } from 'ramda'
import tempy from 'tempy'

import { program, Option } from 'commander'
import { hash } from './hash.js'
import url from 'url'
import { transpile } from './typescriptTranspiler.js'
import { parse } from './parser/dsl.js'
import { skippingTest } from './outputs.js'
import chalk from 'chalk'

const formatOption = new Option('-f, --format <format>', 'The output format').choices(['json', 'console']).default('console')

program
  .name('pineapple')
  .version('0.9.0')
  .option('-i, --include <files...>', 'Comma separated globs of files.')
  .option('-a, --accept-all', 'Accept all snapshots.')
  .option('-u, --update-all', 'Update all snapshots.')
  .option('-t, --typescript', 'Enables typescript (slower).')
  .option('--only <lines...>', 'Allows you to specify which tests you would like to run.')
  .addOption(formatOption)

program.parse()

const options = program.opts()

if (!options.include || !options.include.length) throw new Error('Please select files to include.')

// hack for now until I make the code better
process.env.ACCEPT_ALL = options.acceptAll || ''
process.env.UPDATE_ALL = options.updateAll || ''

if (options.format === 'json') process.env.OUTPUT_FORMAT = 'JSON'
process.env.OUTPUT_FORMAT = process.env.OUTPUT_FORMAT || 'CONSOLE'
if (process.env.OUTPUT_FORMAT === 'JSON') {
  chalk.level = 0
  process.env.FORCE_COLOR = '0'
}

async function main () {
  const tmp = tempy.file({ extension: 'mjs' })
  const project = new Project({

  })

  const regex = /,\s?(?![^{}]*\})/

  const files = options.include.flatMap(i => i.split(regex)).flatMap(i => {
    return project.addSourceFilesAtPaths(i)
  })

  // get variable declarations that are arrow functions / functions

  const functions = files.flatMap(file => {
    const fileText = file.getFullText().split('\n')
    return getFunctions(file, fileText, url.pathToFileURL(file.getFilePath()).href)
  })

  const testFile = project.createSourceFile(tmp, undefined, {
    overwrite: true
  })

  const imports = Object.entries(map(i => {
    return { namedImports: pluck('name', i), original: indexBy(i => i.name, i) }
  }, groupBy(i => i.fileName, functions)))

  const specifier = import.meta.url.split(/\/|\\/)
  specifier.pop()
  specifier.push('run.js')

  testFile.addImportDeclaration({
    moduleSpecifier: specifier.join('/'),
    namedImports: ['run', 'addMethod', 'addDefinitions', 'execute', 'hof'],
    isTypeOnly: false
  })

  let counter = 0

  // add imports
  await Promise.all(imports.map(async ([moduleSpecifier, { namedImports, original }], index) => {
    if (options.typescript) moduleSpecifier = await transpile(moduleSpecifier)
    testFile.addStatements(`
            import * as $$${index} from '${moduleSpecifier}';
            const { ${namedImports.map(i => {
                original[i].alias = `$${counter++}`
                return `${i}: ${original[i].alias}`
            }).join(', ')} } = { ...$$${index}.default, ...$$${index} };
        `)
  }))

  // add test functions
  const testFunc = testFile.addFunction({
    name: 'test',
    parameters: [],
    isAsync: true
  })

  const executeTag = tag => `await execute(${JSON.stringify(tag.text)})`

  const { addedMethods, tests, beforeAll, afterAll } = functions.map(func => {
    const addedMethods = func.tags
      .filter(i => i.type === 'pineapple_import')
      .map(i => `addMethod(${JSON.stringify(i.text || func.originalName || func.name)}, ${func.alias})\n`)
      .join('') + '\n' +
      func.tags
        .filter(i => i.type === 'pineapple_define')
        .map(() => `addDefinitions(${func.alias})\n`)
        .join('')

    const beforeAll = func.tags
      .filter(i => i.type === 'beforeAll')
      .map(() => `${func.alias}()\n`)
      .join('')

    const afterAll = func.tags
      .filter(i => i.type === 'afterAll')
      .map(() => `${func.alias}()\n`)
      .join('')

    // before / beforeEach / after / afterEach will get integrated in directly with the tests.
    const before = func.tags
      .filter(i => i.type === 'before')
      .map(executeTag)
      .join('\n')

    const beforeEach = func.tags
      .filter(i => i.type === 'beforeEach')
      .map(executeTag)
      .join('\n')

    const after = func.tags
      .filter(i => i.type === 'after')
      .map(executeTag)
      .join('\n')

    const afterEach = func.tags
      .filter(i => i.type === 'afterEach')
      .map(executeTag)
      .join('\n')

    const wrapHof = (alias, tag) => func.isClass ? `hof(${alias}, ${tag.type === 'test_static'})` : alias

    const tests = `${before}\n${func.tags.filter(i => i.type === 'test' || i.type === 'test_static').map((tag, index) => `
            ${beforeEach}
            sum += await run(${JSON.stringify(tag.text)}, '${func.originalName || func.name}.${hash(func.relativePath + ':' + tag.text)}', ${wrapHof(func.alias, tag)}, "${func.fileName}:${tag.lineNo}")
            ${afterEach}
        `).join('')}\n${after}`

    return { addedMethods, tests, beforeAll, afterAll }
  }).reduce((acc, i) => {
    acc.addedMethods = [...acc.addedMethods, ...i.addedMethods]
    acc.beforeAll = [...acc.beforeAll, ...i.beforeAll]
    acc.afterAll = [...acc.afterAll, ...i.afterAll]
    acc.tests = [...acc.tests, ...i.tests]
    return acc
  }, { addedMethods: [], tests: [], beforeAll: [], afterAll: [] })

  testFunc.setBodyText(`let sum = 0;\n${addedMethods.join('')}\n${beforeAll.join('')}\n${tests.join('')}\n${afterAll.join('')};
    return sum`)

  // add text to end of file
  testFile.addStatements('test().then(i => { process.exit(i) });')

  testFile.saveSync()

  // run the file
  await import(url.pathToFileURL(tmp).href)
}

const cwd = url.pathToFileURL(process.cwd()).href

const TAG_TYPES = [
  'test',
  'test_static',
  'pineapple_import',
  'pineapple_define',
  'beforeAll',
  'afterAll',
  'before',
  'after',
  'beforeEach',
  'afterEach'
]

/**
 * An algorithm to try to parse out multi-line tests.
 * Terminates at either a new tag, or at the end of the comment chain.
 * It will continue crawling down until it terminates, and a test case is parsed correctly,
 * it use that instead of just the first line.
 *
 * This approach allows us to do multi-line without adding "\" to the end of the lines,
 * which would be rather ugly.
 * @param {string[]} fileText
 * @param {number} start
 * @param {string} type
 */
function multiLine (fileText, start, type) {
  let end = start + 1

  let text = (fileText[start].split(`@${type} `)[1] || '').trim()
  let lastSuccess = text

  // while there isn't a "* @" on the line or "*/"
  while (fileText[end] && !fileText[end].includes('* @') && !fileText[end].includes('*/')) {
    const addition = fileText[end]
      .substring(fileText[end].indexOf('*') + 1)
      .trim()

    text += '\n' + addition

    try {
      // attempt a parse, if it succeeds, flag it as successful & use that.
      parse(text)
      lastSuccess = text
    } catch (err) {}

    end++
  }

  return lastSuccess.trim()
}

/**
 * Gets each of the functions from the file & figures out if they have associated pineapple
 * annotations.
 */
function getFunctions (file, fileText, fileName) {
  let onlyLines = null
  if (options.only && options.only.length) {
    onlyLines = options.only.map(i => {
      const index = i.lastIndexOf(':')
      const fileRequested = i.substring(0, index)
      return fileName === fileRequested ? +i.substring(index + 1) : null
    }).filter(i => i)
    if (!onlyLines.length) return []
  }

  // Get classes & variable declarations for test cases.
  const dec = [...file.getClasses(), ...file.getVariableDeclarations()].map(i => {
    const text = i.getText()

    // BUG: This is a bit imprecise because "=>" and "function" could be present in the variable declaration,
    // If this situation comes up, where someone adds a JSDoc to a text string, we can resolve it.
    if (
      !text.includes('=>') &&
      !text.includes('function') &&
      i.getKindName() !== 'ClassDeclaration'
      // && !getTags(fileText, i.getStartLineNumber() - 2, ['pineapple_force']).length
    ) return null

    const isClass = i.getKindName() === 'ClassDeclaration'

    return {
      tags: getTags(fileText, i.getStartLineNumber() - 2, onlyLines),
      isClass,
      name: i.getName(),
      exported: i.isExported(),
      fileName,
      relativePath: fileName.startsWith(cwd) ? fileName.substring(cwd.length + 1) : ''
    }
  }).filter(i => i)

  const exports = getFileExports(file)

  const functions = [
    ...dec,
    // Attempt to get function declarations & get the tags.
    ...file
      .getFunctions()
      .map(i => [i.getName(), i.getJsDocs().flatMap(i => i.getTags()), i.getExportKeyword()])
      .map(item => {
        const tags = item[1].filter(i => TAG_TYPES.includes(i.getTagName())).map(tag => {
          const tagName = tag.getTagName()
          if (onlyLines && !onlyLines.includes(tag.getStartLineNumber())) return null
          return { type: tagName, text: multiLine(fileText, tag.getStartLineNumber() - 1, tagName), lineNo: tag.getStartLineNumber() }
        }).filter(i => i)

        return {
          name: item[0],
          tags,
          exported: Boolean(item[2]),
          fileName,
          relativePath: fileName.startsWith(cwd) ? fileName.substring(cwd.length + 1) : ''
        }
      })
  ].filter(exportedOnly(exports))

  return functions
}

main()

/**
 * Filters out any functions without tags or that are not exported.
 */
function exportedOnly (exports) {
  return i => {
    if (!i.tags.length) return false

    if (!i.exported) {
      if (exports[i.name]) {
        i.originalName = i.name
        i.name = exports[i.name]
        return true
      } else skippingTest(i.name, i.fileName)
    }
    return i.exported
  }
}

/**
 * Gets all of the exports of a file, currently only supports
 * non-defaults.
 * You may use "exports.X = ...",
 * "module.exports = { X: ... }"
 * "export X"
 * "export function X"
 */
function getFileExports (file) {
  return file.getStatements().filter(i => {
    // expression statement
    return (i.getKindName() === 'ExpressionStatement' && (i.getText().trim().includes('module.exports') || i.getText().trim().startsWith('exports.'))) || (i.getKindName() === 'ExportDeclaration')
  }).map(i => i.getText().trim()).reduce((exports, statement) => {
    const [ex, right] = statement.replace(';', '').split(/=|export /).map(i => i.trim())

    if (ex === 'module.exports') {
      if (right.includes('{')) {
        right.substring(1, right.length - 1).trim().split(',').forEach(i => {
          if (i.includes(':')) {
            const [key, value] = i.split(':').map(i => i.trim())
            if (/^[A-Za-z$_][A-Za-z$_0-9]+$/.test(key)) { exports[key] = value }
          } else exports[i.trim()] = i.trim()
        })
      } else {
        // support module.exports = func at some point
      }
    }

    if (!ex) {
      if (right.includes('{')) {
        right.substring(1, right.length - 1).trim().split(',').forEach(i => {
          if (i.includes(':')) {
            const [key, value] = i.split(':').map(i => i.trim())
            if (/^[A-Za-z$_][A-Za-z$_0-9]+$/.test(key)) { exports[key] = value }
          } else { exports[i] = i }
        })
      }
    }

    if (ex.startsWith('exports.')) {
      const key = ex.split('.')[1]
      if (/^[A-Za-z$_][A-Za-z$_0-9]+$/.test(key)) { exports[key] = right }
    }

    return exports
  }, {})
}

/**
 * Tries to parse tags from a multi-line jsdoc comment block.
 * You need to specify where the end of the comment block is so that it can crawl up.
 *
 * @param {string[]} fileText
 * @param {number} end
 */
function getTags (fileText, end, onlyLines = null, tagTypes = TAG_TYPES) {
  const tags = []
  // check if previous line has a comment ender
  if (fileText[end].includes('*/')) {
    // crawl up until you see comment begin
    while (end > 0 && !fileText[end].includes('/*')) {
      end--
      if (onlyLines && !onlyLines.includes(end + 1)) continue
      for (const type of tagTypes) {
        if (new RegExp(`@${type}($| )`).test(fileText[end])) {
          tags.unshift({
            type,
            text: multiLine(fileText, end, type),
            lineNo: end + 1
          })
        }
      }
    }
  }
  return tags
}
