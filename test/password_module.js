// @ts-check

/**
 * A function to create a password policy.
 * @param {(((str: string) => string | undefined))[]} rules
 * @returns A string if there is an error, undefined otherwise.
 */
export function password (...rules) {
  return str => {
    const errors = []
    for (const rule of rules) {
      const error = rule(str)
      if (error) errors.push(error)
    }
    return errors.join('\n\n')
  }
}

/**
 * @test 3 ~> 'hi' returns truthy
 * @test 3 ~> 'hi hi hi' returns undefined
 *
 * Checks the password for a minimum length.
 * @param {number} num
 * @returns A string if there is an error, undefined otherwise.
 */
export function min (num) {
  return str => (str.length >= num ? undefined : `The password provided is too short. Needs ${num - str.length} more.`)
}

/**
 * @test 3 ~> 'hi' returns undefined
 * @test 3 ~> 'hi hi hi' returns truthy
 *
 * Checks the password for a maximum length.
 * @param {number} num
 * @returns A string if there is an error, undefined otherwise.
 */
export function max (num) {
  return str => (str.length <= num ? undefined : 'The password provided is too long.')
}

/**
 * @test ['ø'], 1 ~> 'Test' returns truthy
 * @test ['ø'], 1 ~> 'Testø' returns undefined
 *
 * Checks if certain characters are present in the password.
 * @param {string} charSet The characters to check for.
 * @param {number} [num] The minimum characters required.
 * @param {string} [name]
 * @returns A string if there is an error, undefined otherwise.
 */
export function has (charSet, num = 1, name = '') {
  return str => {
    let count = 0
    for (const char of str) {
      if (charSet.includes(char)) count++
    }
    return count >= num ? undefined : `The password provided does not contain enough "${name || charSet}" characters. Needs ${num - count} more.`
  }
}
/**
 * @test 1 ~> 'HELLO' returns truthy
 * @test 1 ~> 'Hello' returns undefined
 *
 * Checks if the password has lowercase letters.
 * @param {number} [num] The minimum characters required.
 * @returns A string if there is an error, undefined otherwise.
 */
export function hasLowerCase (num = 1) {
  return has('abcdefghijklmnopqrstuvwxyz', num, 'lowercase')
}

/**
 * @test 1 ~> 'hello' returns truthy
 * @test 1 ~> 'Hello' returns undefined
 *
 * Checks if the password has uppercase letters.
 * @param {number} [num] The minimum characters required.
 * @returns A string if there is an error, undefined otherwise.
 */
export function hasUpperCase (num = 1) {
  return has('ABCDEFGHIJKLMNOPQRSTUVWXYZ', num, 'uppercase')
}

/**
 * @test 1 ~> 'Hello' returns truthy
 * @test 1 ~> 'He!lo' returns undefined
 *
 * Checks if the password has special characters. i.e. !@#$%^&*()_+-=[]{}|;\':",./<>?
 * @param {number} [num] The minimum characters required.
 * @returns A string if there is an error, undefined otherwise.
 */
export function hasSpecial (num = 1) {
  return has('!@#$%^&*()_+-=[]{}|;\':",./<>?', num, 'special')
}

/**
 * @test 1 ~> 'Hello' returns truthy
 * @test 1 ~> 'Hell0' returns undefined
 *
 * Checks if the password has digits.
 * @param {number} [num] The minimum characters required.
 * @returns A string if there is an error, undefined otherwise.
 */
export function hasDigit (num = 1) {
  return has('0123456789', num, 'digit')
}

/**
 * @test 'Hello' ~> 'Hello World' returns undefined
 * @test 'Hello' ~> '' returns truthy
 *
 * Checks if the password includes the required text.
 * @param {string | string[]} requiredText
 * @returns A string if there is an error, undefined otherwise.
 */
export function includes (requiredText) {
  if (typeof requiredText === 'string') requiredText = [requiredText]
  return str => {
    for (const text of requiredText) {
      if (str.includes(text)) return undefined
    }
    // @ts-ignore
    return `The password provided does not contain the required text "${requiredText.join(', ')}".`
  }
}

/**
 * @test 'Kevin' ~> 'Kevin' returns truthy
 * @test 'Kevin' ~> 'Steve' returns undefined
 * @test 'Kevin', false ~> 'Kevin'
 * @test 'Kevin', true ~> 'Kevin'
 * @test 'Kevin', 'This is a message.' ~> 'Kevin'
 * @test ['password01', 'yeet'] ~> 'password01'
 * @test ['password01'] ~> 'yeet'
 *
 * Checks if the password includes forbidden text.
 * @param {string | string[]} requiredText
 * @param {boolean | string | ((text: string) => string)} substitute Allows you to conceal the text passed in that's forbidden, or replace the error with a specific string.
 * @returns A string if there is an error, undefined otherwise.
 */
export function notIncludes (requiredText, substitute = false) {
  if (typeof requiredText === 'string') requiredText = [requiredText]
  const regex = new RegExp(`(${requiredText
    // Escapes the characters in the string so they aren't part of the RegExp
    .map(i => i.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'))
    .join('|')})`)
  return str => {
    const result = regex.exec(str)
    if (!result) return undefined
    const text = result[0]
    return substitute
      ? substituteError(substitute, text)
      : `The password provided contains the prohibited text "${text}".`
  }
}

/**
 * Substitutes an error with a replacement.
 * @param {string|boolean|((text: string) => string)} substitute
 * @param {string} text
 */
function substituteError (substitute, text) {
  if (typeof substitute === 'string') return substitute
  if (typeof substitute === 'function') return substitute(text)
  return 'The password provided contains prohibited text.'
}

/**
 * Checks if some of the rules were followed, if a number is included at the end, it will check if at least
 * that many rules were followed.
 * @param {(((str: string) => string | undefined) | number)[]} rules
 * @returns A string if there is an error, undefined otherwise.
 */
export function some (...rules) {
  const count = (typeof rules[rules.length - 1] === 'number') ? +rules.pop() : 1
  return str => {
    const incomplete = rules.map(rule => typeof rule === 'function' && rule(str)).filter(i => i)
    if (rules.length - incomplete.length >= count) return ''
    return `Must complete ${count - (rules.length - incomplete.length)} of the following:\n- ${incomplete.join('\n- ')}`
  }
}

/**
 * Inverts the result of a rule, allowing you to specify text.
 * @param {(str: string) => string} rule
 * @param {string} error
 * @returns A string if there is an error, undefined otherwise.
 */
export function not (rule, error) {
  return str => (rule(str) ? '' : error)
}

/**
 * Parses the string template to make it simple to create templates.
 * "$" is the magic symbol that lets you reference the argument.
 * Only works with template functions with less than 10 arguments,
 * and doesn't let you traverse (input to the function should be strings).
 *
 * @test 'Hello, $0' ~> 'World' returns 'Hello, World'
 * @test '$0, $1' ~> 'Hello', 'World' returns 'Hello, World'
 * @test 'Hey $0' ~> 'Steve' returns 'Hey Steve'
 *
 * @param {string} stringTemplate
 * @returns {(...args: string[]) => string}
 */
export function template (stringTemplate) {
  // Simple optimization for the single argument case.
  if (!/\$[1-9]/.test(stringTemplate)) {
    /** @param {string} str */
    return str => stringTemplate.replace(/\$0/g, str)
  }

  /**
   * Replaces parts of the string with the arguments.
   * @param {string[]} args
   */
  return (...args) => {
    let template = stringTemplate
    for (let i = 0; i < args.length; i++) {
      template = template.replace(new RegExp(`\\$${i}`, 'g'), args[i])
    }
    return template
  }
}
