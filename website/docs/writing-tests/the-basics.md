---
sidebar_position: 1
---

# The Basics

## "Returns" / "Resolves" Statements

In Pineapple, test cases are introduced as JSDoc annotations above a function. The most simple conditional test case is a "returns" statement.

```js
/**
 * @test 1 returns 1
 * @test 2 returns 2
 * @test 5 returns 8
 */
function fibonacci (n) {
  return n < 2 ? 1 : fibonacci(n - 1) + fibonacci(n - 2)
}

/**
 * @test 1 resolves to 1
 * @test 2 resolves to 2
 * @test 5 resolves to 8
 */
function async_fibonacci (n) {
  return n < 2 ? 1 : await async_fibonacci(n - 1) + await async_fibonacci(n - 2)
}
```

This will run the fibonacci function with each specified set of arguments, in this case 1, then 2, then 5, and compare the result to the right side.

To make it easier to express this common type of test case clearly, you are able to express this type of test in several ways.

**For synchronous functions: `is`, `to` and `returns` each do the same thing.** **For asynchronous functions: `resolves`, `resolves to` each do the same thing.**

You may also compare against objects, as it will automatically perform a deep equals operation for comparison purposes.

```js
/**
 * @test 'name', 'Morty' is { name: 'Morty' }
 * @test 'name', 'Rick' is { name: 'Rick' }
 * @test 'count', 20 is { count: 20 }
 */
function wrap (attr, value) {
  return { [attr]: value }
}
```

### Complex Conditions

If you need to be able to write a more complex test, rather than specifying a value, you may instead write out an expression. Expressions use an `@` symbol to represent the value of the computed result.

If an expression is provided, the test will pass if the result is truthy.

```js
/**
 * @test 'Joe' resolves @.friends.length === 0 and @ as { friends: string[] }
 * @test 'Luke' resolves @.friends.length === 3 and @ as { friends: string[] }
 */
async function getFriends(name) {
  // no one but luke has friends in this test.
  if (name !== 'Luke') return { friends: [] } 
  return {
    friends: [
      'Han',
      'Leia',
      'Chewbacca'
    ]
  }
}
```

You may use `and`, `or`, `&&` and `||` and most of the common operators.

Additionally, as seen above, you may do some schema validation by using `as <schema>`. The schema may either be a valid JSON Schema, a simple typescript definition (unions currently unsupported).

You may also use some shorthand expressions such as `truthy` & `falsey` / `falsy`

```js
/**
 * @test 'password1' is truthy and @ as string
 * @test 'p@ssingPa$$word1' is falsy and @ as string
 * @returns {string} An empty string if valid, or a list of issues if invalid.
 */
function checkPassword(pw) { 
//  ... 
}
```

## Snapshots

Snapshots are probably one of the better conveniences provided by pineapple. To use them, just specify a test case without any conditions whatsoever.

```js
/**
 * @test -1, 1
 * @test 5, 8
 * @test '6', 39
 */
function add(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') throws new Error('Not a number.')
  return a + b
}
```

Pineapple will see these test cases, and will prompt you for whether the computed result is correct.

If so, it will preserve this result & compare it on all future runs.

If the result changes, it will prompt you again to see if you'd like to update the snapshot, unless the test is being run from a continuous integration pipeline (in which is will immediately fail the test).

Snapshots are not just for capturing values, they may also capture whether a specific function is supposed to throw an exception (and with what exception it threw with).

## Throws / Rejects

In some tests, you may wish to confirm whether a function throws or not,

```js
class InfinityError extends Error { 
  // ... 
}

/**
 * @test '6', 39 throws
 * @test 5, Infinity throws InfinityError
 * @test 5, '31' throws "Not a number."
 */
function add(a, b) {
  if (a === Infinity || b === Infinity) throw new InfinityError()
  if (typeof a !== 'number' || typeof b !== 'number') throws new Error('Not a number.')
  return a + b
}
```

`throws` / `rejects` by itself will merely check if the function threw, but if you specify either a string or an identifier afterwards, it will try to check the constructor name of the error & the message to see if the expected error occurred.
