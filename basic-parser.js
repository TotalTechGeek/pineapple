import { parse } from './parser/dsl.js'
import { readFileSync } from 'fs'

/**
 * @pineapple_define Parser
 */
export function InternalTests () {
  return {
    voidTest: `
          /** 
           * @test void
           */
          `,
    addTest: `
          /**
           * @test 1, 
           * 2 returns 3
           */
          export function add (a, b) {
              return a + b
          }
      `,
    moduleExports: `
          module.exports = { 
              "hello": age, name 
          }
      `,
    typicalExport: `
          export { X, Y as Z }
          export { Two }
    `,
    exports: `
      exports.X = XYZ;
      exports.Y = Y;
    `,
    quoteIssue: `
          function a (x = /helloWorld\\//) {

          }

          function b () {
            return "hello{" + 'wrld{\\''
          }

          function c () {

          }
    `,
    this: readFileSync('./basic-parser.js').toString(),
    mathCjs: readFileSync('./test/math.cjs').toString(),
    passwordModule: readFileSync('./test/password_module.js').toString(),
    setupTest: readFileSync('./test/setup.test.js').toString()
  }
}

/**
 * This function removes all of the strings, Regexes and contents in between braces.
 * This is done to make it simpler to run a regex to fetch out classes,
 * functions and variable declarations.
 * @test "function a () { function b () {} return b }"
 * @test 'function a () { function b () {} return b } function b () { }'
 * @test 'z + { { a } + } { b } + c'
 * @test #Parser.this
 * @test #Parser.quoteIssue
 * @test #Parser.passwordModule
 * @test #Parser.setupTest
 * @param {string} code
 */
export function strip (code) {
  code = code.replace(/\r\n/g, '\n')

  const codeStripped = code
    .replace(/as\s+const/g, '')
  // .replace(/=>?\s+\//g, '= //')
  let count = 0
  let res = ''
  let quoteMode = null
  let commentMode = null
  for (let i = 0; i < codeStripped.length; i++) {
    if (!quoteMode && commentMode === 2 && codeStripped[i] === '\n') commentMode = false

    if (!quoteMode && commentMode === 1 && codeStripped[i] === '*' && codeStripped[i + 1] === '/') {
      commentMode = false
      i++
      continue
    }

    if (commentMode) continue

    if (!quoteMode && codeStripped[i] === '/' && codeStripped[i + 1] === '*') {
      commentMode = 1
      continue
    }
    if (!quoteMode && codeStripped[i] === '/' && codeStripped[i + 1] === '/') {
      commentMode = 2
      continue
    }

    if (codeStripped[i] === '"') {
      if (quoteMode === '"') {
        quoteMode = null
        continue
      } else if (!quoteMode) quoteMode = '"'
    }

    if (quoteMode === '/' && codeStripped[i] === '\n') {
      if (codeStripped[i - 1] !== '\\' || (codeStripped[i - 1] === '\\' && codeStripped[i - 2] === '\\')) {
        quoteMode = null
        continue
      }
    }

    if (codeStripped[i] === '/') {
      if (quoteMode === '/') {
        if (codeStripped[i - 1] !== '\\' || (codeStripped[i - 1] === '\\' && codeStripped[i - 2] === '\\')) {
          quoteMode = null
          continue
        }
      } else if (!quoteMode) quoteMode = '/'
    }

    if (codeStripped[i] === "'") {
      if (quoteMode === "'") {
        if (codeStripped[i - 1] !== '\\' || (codeStripped[i - 1] === '\\' && codeStripped[i - 2] === '\\')) {
          quoteMode = null
          continue
        }
      } else if (!quoteMode) quoteMode = "'"
    }

    if (codeStripped[i] === '`') {
      if (quoteMode === '`') {
        if (codeStripped[i - 1] !== '\\' || (codeStripped[i - 1] === '\\' && codeStripped[i - 2] === '\\')) {
          quoteMode = null
          continue
        }
      } else if (!quoteMode) quoteMode = '`'
    }

    if (quoteMode) continue

    if (codeStripped[i] === '{') count++
    else if (codeStripped[i] === '}') {
      if (count > 0) count--
    } else if (!count) {
      res += codeStripped[i]
    }
  }

  return res
}

function matchExpr (stripped, types = 'function') {
  const regex = new RegExp(`(export\\s+)?(async\\s+)?(${types.join('|')})\\s+([A-Za-z0-9_]+)[\\s(={]`, 'mg')
  return [...(stripped.matchAll(regex))].map(i => ({
    /** @type {string}  */ name: i[4],
    /** @type {boolean} */ exported: Boolean(i[1]),
    /** @type {string}  */ type: i[3],
    /** @type {string}  */ raw: i[0]
  }))
}

/**
 * @test 'export const a = () => b + c; const b = 3'
 * @test 'class A {}'
 * @test 'export class A {} class B {}'
 * @test 'module.exports = {}'
 * @param {string} code
 */
export function getOuterDeclarations (code) {
  const stripped = strip(code)
  return matchExpr(stripped, ['class', 'function', 'let', 'const', 'var'])
}

/**
 * @test "export function y () { function b () {} return b } const b = 1 + 2"
 * @test cat(#Parser.voidTest, 'function a() {}')
 * @test #Parser.addTest
 * @test #Parser.mathCjs
 * @test #Parser.passwordModule
 * @test #Parser.setupTest
 * @test #Parser.this
 * @param {string} code
 */
export function parseCode (code) {
  code = code.replace(/\r\n/g, '\n')
  const virtualDependencies = grabVirtualDependencies(code)
  const fileLines = code.split('\n')

  // first, get the outer declarations (things that can be tested by Pineapple)
  const declarations = getOuterDeclarations(code).map(i => {
    // next append line numbers & indexes
    const result = {
      ...i,
      index: code.indexOf(i.raw),
      lineNo: 0
    }

    // this is stupidly inefficient. I'm writing it in a stupid way so
    // it can be replaced by something intelligent later
    result.lineNo = code.substring(0, result.index).split('\n').length

    return result
  })

  // next, get all of the external exports (module.exports =) and (export { })
  const exports = getExports(code)

  // figure out which ones have tests
  const result = declarations.map(i => {
    const step1 = {
      ...i,
      tags: getTags(fileLines, i.lineNo - 2),
      virtualDependencies
    }

    // if (!step1.tags.length) return null

    if (!i.exported) {
      if (exports[i.name]) {
        return {
          ...step1,
          originalName: i.name,
          name: exports[i.name],
          exported: true
        }
      }
    }

    return step1
  }).filter(i => i)

  return result
}

/**
 * Tries to parse tags from a multi-line jsdoc comment block.
 * You need to specify where the end of the comment block is so that it can crawl up.
 *
 * @param {string[]} fileText
 * @param {number} end
 * @param {number[] | null} onlyLines
 */
function getTags (fileText, end, onlyLines = null, tagTypes = TAG_TYPES) {
  const tags = []

  if (end < 0) return []
  // check if previous line has a comment ender
  if (fileText[end].includes('*/') && !fileText[end].includes('/*')) {
    // crawl up until you see comment begin
    while (end > 0) {
      end--
      if (onlyLines && !onlyLines.includes(end + 1)) continue
      if (fileText[end].includes('/*') && !fileText[end].includes('*/') && !(fileText[end - 1] || '').includes('*/')) break
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

const TAG_TYPES = [
  'test',
  'test_static',
  'pineapple_import',
  'pineapple_define',
  'pineapple_transpile',
  'faker',
  'beforeAll',
  'afterAll',
  'before',
  'after',
  'beforeEach',
  'afterEach',
  'beforeGlobal',
  'beforeEachGlobal',
  'afterGlobal',
  'afterEachGlobal'
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

  while (fileText[end] && !fileText[end].includes('* @') && !fileText[end].includes('*/')) {
    const addition = fileText[end]
      .substring(fileText[end].indexOf('*') + 1)
      .trim()

    text += '\n' + addition

    try {
      // attempt a parse, if it succeeds, flag it as successful & use that.
      parse(text, {})
      lastSuccess = text
    } catch (err) {}

    end++
  }

  return lastSuccess.trim()
}

/**
 * Parses out exports that are not declared on the function,
 * typical for "exports.X", "module.exports = { X }", "export { X }"
 *
 * Right now, this only supports module.exports and export { X }, and exports.X = X
 *
 * Todo: Default Functions and module.exports = X.
 *
 * @test #Parser.moduleExports
 * @test #Parser.typicalExport
 * @test #Parser.exports
 *
 * @param {string} code
 */
export function getExports (code) {
  code = code.replace(/\r\n/g, '\n')

  const exported = {}

  const module = /module.exports\s*=\s*{\s*([A-Za-z0-9._$]+,?\s*|'?"?[A-Za-z0-9._$]+'?"?\s*:\s*[A-Za-z0-9._$]+,?\s*)+\s*}/
  const item = code.match(module)

  if (item) {
    const match = item[0]
    match.substring(match.indexOf('{') + 1, match.length - 1).trim().split(',').map(i => {
      const arr = i.split(':').map(i => i.trim().replace(/"|'/g, ''))
      if (arr.length === 1) return [arr[0], arr[0]]
      return arr
    }).forEach(item => {
      exported[item[1]] = item[0]
    })
  }

  const module2 = /export\s*{\s*([A-Za-z0-9._$]+,?\s*|[A-Za-z0-9._$]+\s*as\s*[A-Za-z0-9._$]+,?\s*)+\s*}/
  const item2 = code.match(module2)

  if (item2) {
    for (const match of item2) {
      match.substring(match.indexOf('{') + 1, match.length - 1).trim().split(',').map(i => {
        const arr = i.split('as').map(i => i.trim().replace(/"|'/g, ''))
        if (arr.length === 1) return [arr[0], arr[0]]
        return arr
      }).forEach(item => {
        exported[item[1]] = item[0]
      })
    }
  }

  const module3 = /exports\.([A-Za-z0-9._$]+)\s*=\s*([A-Za-z0-9._$]+)/g
  const item3 = code.match(module3)

  if (item3) {
    for (const match of item3) {
      match.trim().split(',').forEach(i => {
        const arr = i.split('=').map(i => i.trim().replace(/"|'/g, ''))
        exported[arr[1]] = arr[0].substring(8)
      })
    }
  }

  return exported
}

function * pathFromRegex (regex, file, position) {
  let match
  while ((match = regex.exec(file)) !== null) yield match[position]
}

/**
 * @test '// import("./organizations.js")'
 * @returns {string[]}
 */
export function grabVirtualDependencies (str) {
  /* eslint-disable prefer-regex-literals */
  const importFunctionRegex = new RegExp('\\/\\/\\s*(require|import)\\s*\\(["\']([a-zA-z_0-9/.]+)[\'"]\\)', 'g')

  const modules = [
    ...pathFromRegex(importFunctionRegex, str, 2)
  ]

  return modules
}
