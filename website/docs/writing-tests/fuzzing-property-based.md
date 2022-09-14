---
sidebar_position: 3
---

# Fuzz Testing

## General Use

Leveraging the technology from the amazing [fast-check](https://github.com/dubzzz/fast-check) npm package, Pineapple enables you to write rather comprehensive tests in a small, single statements.

```js
/**
 * Adds two numbers together
 * @test #integer, #integer returns @ as number
 * @test #integer, #string throws
 * @test #string, #integer throws
 * @param {number} a
 * @param {number} b
 */
export function add (a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') throw new Error('Not numbers')
  return a + b
}
```

By using a `#arbitrary` tag, you're able to describe what information should be tested, Pineapple + Fast-Check will try a handful of test cases against your function and try to find any counter-examples where your condition fails.

This technology also works with snapshots.

You may also invoke the `#arbitrary` tags with arguments, as if it were a function call, and construct objects / tuples from them. You may also use `args` to refer to the arguments that were used to call the function, which is particularly useful for fuzzed-test cases.

```js
/*
 * @test { name: #string, age: #integer(1, 20) } throws
 * @test { name: #string, age: #integer(21, 80) } returns cat(args.0.name, ' is drinking age.')
 */
export function drinkingAge ({ name, age }) {
  if (age >= 21) return `${name} is drinking age.`
  throw new Error(`${name} is not drinking age.`)
}
```

If a counter-example is found, `fast-check` will use a shrinking algorithm to find the smallest possible test-case to trigger the error, for example, if you wrote a sum function like so:

```js
/**
 * A simple template function.
 * @test 'Hello $0' ~> #string returns cat('Hello ', args.0)
 * @param {string} templateString
 */
export function template (templateString) {
  /** @param {string} replace */
  return replace => templateString.replace(/\$0/g, replace)
}
```

It would generate the following:

```
✖ Failed test (template): 'Hello $0' ~> #string returns cat('Hello ', args.0)
>> file:///Users/jesse/Documents/Projects/pineapple/test/fuzz.js:35
- Expected
+ Received

- Hello $$
+ Hello $
Failing Example: [
  "$$"
]
Shrunk 4 times.
Seed: -2121637705
```

Which should help isolate the nature of the issue (in this case, "$" is special in the replace function, therefore it needs to be escaped with another dollar sign). In this case, the shrinking helps deduce the nature of the issue & reproduce it easily.

You may see a list of [all built-in arbitraries here](https://github.com/dubzzz/fast-check/blob/main/documentation/Arbitraries.md).

## Applying Operations to an Arbitrary

In some cases, you may wish to apply operations to the fuzzed value, Pineapple will parse & handle this use case.

```js
/**
 * @test #integer(1, 10000) ** 2 returns true
 */
export function isSquare (num) {
  return Math.sqrt(num) % 1 === 0
}
```

## Adding new Arbitraries

If you wish to generate complex data structures, or need to introduce a new type of data-set to fuzz against, you are able to do so by implementing a new arbitrary type, and returning it from a function tagged with `pineapple_define`.

You may read up on how to implement them [under fast-check's documentation](https://github.com/dubzzz/fast-check/blob/main/documentation/AdvancedArbitraries.md).

```js
import fc from 'fast-check' 

/**
 * @pineapple_define
 */
function arbitraries () {
    return {
        // you can pass in an arbitrary, a function that returns an arbitrary, or a value that'll be constant.
        // it will be named the value that you define here in the Pineapple engine.
        person: fc.record({ id: fc.integer(), name: fc.string(), age: fc.integer(12, 80) }) 
    }
}

/**
 * @test #person returns args.0.age > 21
 */
function ofAge (person) {
    return person.age > 21
}
```

It is also possible to provide namespaces for your arbitraries:

```js
/**
 * @pineapple_define tavern
 */
function arbitraries () {
    return {
        // you can pass in an arbitrary, a function that returns an arbitrary, or a value that'll be constant.
        // it will be named the value that you define here in the Pineapple engine.
        person: fc.record({ id: fc.integer(), name: fc.string(), age: fc.integer(12, 80) }) 
    }
}

/**
 * @test #tavern.person returns args.0.age > 21
 */
function ofAge (person) {
    return person.age > 21
}
```

This should make it simpler to organize some of your static / generated data sets that you would like to use for your tests.
