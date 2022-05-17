
import { password, template, hasDigit, hasLowerCase, hasSpecial, hasUpperCase, some, notIncludes, not, has } from './password_module.js'
import { asLogicSync } from 'json-logic-engine'

/**
 * @test 'Hello'
 * @test 'Hello World'
 * @test 'HelloW0rld!'
 * @param {string} pass
 */
export function commonRule (pass) {
  return password(
    some(
      hasDigit(1),
      hasLowerCase(1),
      hasSpecial(1),
      hasUpperCase(1),
      3
    ),
    not(has(' ', 1), 'You may not have spaces.'),
    notIncludes(['12', '23', '34', '45', '56', '67', '78', '89', '01'], 'You may not have sequential numbers in your password.')
  )(pass)
}

/**
 * @test 'hello' returns truthy
 * @test 'hell0' returns falsy
 * @param {string} pass
 */
export function someWithoutNumber (pass) {
  return password(
    // must have one of the next 3.
    some(
      hasDigit(1),
      hasSpecial(1),
      hasUpperCase(1)
    )
  )(pass)
}

/**
 *
 * @test ['password01'], 'You failed! You used $0.' ~> 'Jessepassword01'
 * @test ['password01'], 'You failed! You used $0.' ~> 'Jesse' returns undefined
 * @param {string | string[]} items
 * @param {string} stringTemplate
 */
export function notIncludesFunction (items, stringTemplate) {
  return notIncludes(items, template(stringTemplate))
}

const policy = {
  password: [{
    notIncludes: [
      ['abcd1234', 'password1'],
      { template: 'The text: "$0" is not allowed.' }
    ]
  }, {
    notIncludes: [
      { var: 'username' },
      'Your password may not include your username.'
    ]
  }]
}

const policyParser = asLogicSync({
  password,
  template,
  notIncludes
}, ['var'])

const check = policyParser(policy)

/**
 * @test 'Jesse', 'Jesseabcd1234'
 * @test 'Jesse', 'Jesse2'
 * @test 'TotalTechGeek', 'password'
 * @param {string} password
 */
export function jsonLogicTest (username, password) {
  return check({
    username
  })(password)
}
