import fc from 'fast-check'
import { sequenceArbitrary } from './sequence-arbitrary.js'

/**
 * @test date() returns false
 * @test '5' returns true
 * @param {string} str
 */
export function isNumeric (str) {
  if (typeof str !== 'string') return false
  return !isNaN(str) && !isNaN(parseFloat(str))
}

/**
 * @test #Tables.cucumberWithTitles, true
 * @test #Tables.markDown, true
 * @test #Tables.cucumberWithoutTitles, false
 * @test #Tables.sample, true
 * @test #Tables.accounts, true
 */
/**
 * Allows you to parse a text table, either in Cucumber's typical format or Markdown-esque format.
 *
 * For example:
 * ```text
 * Name | Age
 * -- | --
 * Jesse | 25
 * Bob | 23
 *```

 Would be parsed as:
 ```
 [
    { "name": "Jesse", "age": 25 },
    { "name": "Bob", "age": 23 }
 ]
 ```
 * @param {string} str The table to parse
 * @param {boolean} header Whether the table has a header specified of not.
 */
export function parseTable (str, header) {
  const lines = str.split('\n').filter(i => i.trim())
  let top
  const result = []

  if (header) {
    top = lines.shift().split('|').map(i => i.trim())
    if (!top[0]) top.shift()
    if (!top[top.length - 1]) top.pop()
  }

  for (const line of lines) {
    const items = line.split('|').map(i => i.trim()).map(i => {
      return isNumeric(i) ? +i : i
    })
    if (!items[0]) items.shift()
    if (!items[items.length - 1]) items.pop()
    if (!items.some(i => /[A-Za-z0-9]/.test(i))) continue
    if (top) {
      result.push(Object.fromEntries(
        items.map((i, x) => [top[x], i])
      ))
    } else result.push(items)
  }
  return result
}

/**
 *
 * Allows you to parse a text table, either in Cucumber's typical format or Markdown-esque format.
 *
 * For example:
 * ```text
 * Name | Age
 * -- | --
 * Jesse | 25
 * Bob | 23
 *```

 Would be parsed as:
 ```
 [
    { "name": "Jesse", "age": 25 },
    { "name": "Bob", "age": 23 }
 ]
 ```
 *
 * @param {string} name
 * @param {string} param
 * @param {boolean} randomize Decides whether to use this arbitrary sequentially or not.
 *
 * * @example
 * ```
 * // "@pineapple_define" this
 * const People = HeaderTable('People', `
 *  Name | Age
 *  -- | --
 *  Jesse | 25
 *  Bob | 23
 * `)
 * ```
 */
export function HeaderTable (name, str, randomize = false) {
  const arbitrary = randomize ? fc.constantFrom : sequenceArbitrary
  if (Array.isArray(str)) str = str[0]
  return () => ({ [name]: arbitrary(...parseTable(str, true)) })
}

/**
 * @param {string} name
 * @param {string} param
 * @param {boolean} randomize Decides whether to use this arbitrary sequentially or not
 *
 * @example
 * ```
 * // "@pineapple_define" this
 * const People = ArrayTable('People', `
 *  Jesse | 25
 *  Bob | 23
 * `)
 * ```
 */
export function ArrayTable (name, str, randomize = false) {
  const arbitrary = randomize ? fc.constantFrom : sequenceArbitrary
  if (Array.isArray(str)) str = str[0]
  return () => ({ [name]: arbitrary(...parseTable(str, false)) })
}
