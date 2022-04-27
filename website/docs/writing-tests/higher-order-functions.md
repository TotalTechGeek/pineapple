---
sidebar_position: 2
---

# Higher Order Functions

If you have a particular case where a you wish to test a function that returns a function (perhaps through currying or just as a natural API Design choice), Pineapple can handle that inline as well!

Using `~>` after a test declaration will allow you to chain it to another test declaration,

```js
/**
 * @test 3 ~> 'Hello' returns falsy
 * @test 10 ~> 'Hello' returns truthy
 */
function min (num = 1) {
    return str => str.length < min ? 'The string is too short' : ''
}

/**
 *  @test 1 ~> 5 ~> 3 returns 9
 */
const threeAdd = a => b => c => a + b + c
```


If, however, you wish to test a function that accepts a function as a parameter, you may wish to proceed to the next step in the tutorial. 