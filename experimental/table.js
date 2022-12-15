import fc from 'fast-check'

/**
 * @test #Tables.cucumberWithTitles, true
 * @test #Tables.markDown, true
 * @test #Tables.cucumberWithoutTitles, false
 * @test #Tables.sample, true
 * @param {string} str
 * @param {boolean} header
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
    const items = line.split('|').map(i => i.trim())
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
 * @param {string} name
 * @param {string} param
 */
export function HeaderTable (name, str) {
  if (Array.isArray(str)) str = str[0]
  return () => ({ [name]: fc.constantFrom(...parseTable(str, true)) })
}

/**
 * @param {string} name
 * @param {string} param
 */
export function ArrayTable (name, str) {
  if (Array.isArray(str)) str = str[0]
  return () => ({ [name]: fc.constantFrom(...parseTable(str, false)) })
}
