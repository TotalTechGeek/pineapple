---
sidebar_position: 5
---

# Adding Methods to Pineapple

Because there may be situations where you wish to use additional functions inside of your test cases, Pineapple gives you the ability to expose new methods to the test clauses.


```js
/**
 * Checks whether a number is prime or not. 
 * @pineapple_import
 */
export function isPrime(n) {
    ...
}


/**
 * Generates a prime larger than the given number.
 * @test 100 returns isPrime(@) and @ > 100
 */
export function generatePrime(n) {
    ...
}
```

This should give you plenty of flexibility to implement descriptive and simple test cases.

If you wish to change the name of the function import from within the logic engine, you may specify the name as `@pineapple_import nameToUseInTestClause`, otherwise it will infer it to be the same as the function name.