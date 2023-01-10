---
sidebar_position: 3
---

# More Complex Tests

While in many cases, you should be able to write your test cases inline writing Pineapple test declarations, you may come across cases where your unit test may require a bit more setup than just invoking a function.

Rather than going in the direction of `it` and `describe` like test specifications, Pineapple encourages users to write test code as vanilla functions that can be invoked.

So imagine you had a declarative API for a password rules module that makes heavy use of higher order functions, and features a `password` function that takes in a list of functions that each return a string if the password fails a particular check.

Since this password module requires a slightly more complex setup, it might be easier to create a `password_module.test.js` file, and write a few vanilla functions that make use of the module.

```js
/**
 * @test "HelloWorld"
 * @test "Hello1" returns truthy
 * @test "Hello" returns truthy
 * @test "th1ng$Here" returns falsy
 */
export function commonRule (pw) {
    return password(
        min(8),
        max(16),
        hasDigits(1),
        hasSpecial(1),
        hasLowerCase(1),
        hasUpperCase(1)
    )(pw)
}
```

While this approach still encourages the creation of a `.test.js` file, this `.test.js` file still follows the rules & patterns of everything else in your codebase, and it makes it simpler to run a handful of test cases against your setup.

```js
/**
 * @test 'Poison' returns @ < 25
 * @test 'Water' returns 25
 * @test 'Rock' throws
 * @test 'Ambrosia' returns @ > 25
 */
function personConsumes (substance) {
    const rick = new Person('Rick', 25)
    rick.consume(substance)
    return rick.health
}
```

However, much like in real life Pineapples are not always the best pairing for certain use cases.

If you are going to be testing more complex scenarios against something stateful, it might be ideal to consider an option like [Cucumber](https://www.npmjs.com/package/@cucumber/cucumber) or Pineapple's built in [Scenario Testing](/docs/scenario-testing/introduction).

Pineapple's goal is not to replace all forms of testing, but instead make unit and scenario testing a more digestable experience.
