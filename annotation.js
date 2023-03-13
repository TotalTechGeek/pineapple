/* eslint-disable prefer-regex-literals */
/**
 * @test 'join(dir, type)'
 * @test 'path.join(dir, type)'
 * @test 'const x = path.join(dir, type)'
 * @test 'const x = path.join(dir, type);'
 * @test 'path.join(dir,\ntype),'
 * @param {string} str
 */
export function inject (str, func = 'tap(@data)') {
  // crawl through backwards,
  let endPosition = str.length - 1

  const punctuation = new Set([' ', '\t', '\n', '\r', ';', ','])
  while (endPosition >= 0 && punctuation.has(str[endPosition])) endPosition--

  let startPosition = endPosition

  let parenCount = 0
  let bracketCount = 0
  let curlyCount = 0

  while (startPosition > 0) {
    if (str[startPosition] === ')') parenCount++
    else if (str[startPosition] === '(') parenCount--
    else if (str[startPosition] === ']') bracketCount++
    else if (str[startPosition] === '[') bracketCount--
    else if (str[startPosition] === '}') curlyCount++
    else if (str[startPosition] === '{') curlyCount--
    else if (parenCount === 0 && bracketCount === 0 && curlyCount === 0 && str[startPosition] === '=') {
      startPosition++
      if (str[startPosition] === '>') startPosition++
      break
    } else if (parenCount === 0 && bracketCount === 0 && curlyCount === 0 && (str[startPosition] === '\n' || str[startPosition] === ';' || str[startPosition] === ':' || str[startPosition] === '?')) {
      startPosition++
      break
    }

    if (str.substring(startPosition, endPosition).startsWith('return')) {
      startPosition += 7
      break
    }

    if (bracketCount === 0 && curlyCount === 0 && str.substring(startPosition, endPosition).startsWith('...')) {
      startPosition += 3
      break
    }

    startPosition--
  }

  return `${str.substring(0, startPosition)}${func.replace('@data', str.substring(startPosition, endPosition + 1)).replace('@line', str.split('\n').length)}${str.substring(endPosition + 1)}`
}

/**
 * Find every instance of a token in a file and call inject on the string before it
 * @param {string} file
 * @param {RegExp} token
 * @test #Annotations.Multiple
 */
export function injectStr (file, func = 'tap(@data)', token = new RegExp('\\/\\/\\s*\\?[^\\n]*', 'g')) {
  let match = token.exec(file)
  while (match !== null) {
    file = inject(file.substring(0, match.index), func).replace('@expr', JSON.stringify(match[0].split('?')[1] || '@')) + file.slice(match.index + match[0].length)
    match = token.exec(file)
  }
  return file
}
