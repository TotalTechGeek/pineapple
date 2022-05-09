---
tags: [introduction]
sidebar_position: 1
date: 2022-05-09
authors: 
    - name: Jesse Mitchell
      title: Developer of Pineapple
      url: https://github.com/TotalTechGeek
      image_url: https://github.com/TotalTechGeek.png
---

# Introducing Pineapple


    ![The Pineapple Logo](/img/pineapple.png)

## What in the world is Pineapple?

Pineapple is a test framework designed to remove the cruft from writing unit tests and creating snapshots.

```js
/**
 * Adds numbers together for the sake of demonstrating pineapple.
 * @test 1, 2 returns 3
 * @test '1', 2 throws "Not a number"
 * @param {number} a 
 * @param {number} b
 */
export function add(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') throw new Error('Not a number')
    return a + b
}
```

It allows you to embed a few example test-cases in your JSDocs, making it easier to focus on your code and less on defining `it` & `expect` chains. 

When you omit conditions from your test cases, it'll automatically capture the result of your test & snapshot it, making it easier to preserve expected behavior in your applications, and even easier for users to find examples on how to call your code.

![An example of the snapshot functionality where the code is modified and the snapshot fails due to a renamed attribute](/img/snapshot.gif)

## But... why?

While there are a lot of great test frameworks out there with solid communities and support, I've found it difficult to introduce testing to certain teams due to the cruft & ergonomics involved.

Pineapple is an attempt to make it easier to write your tests, to get more people into the habit of writing them. The idea is that if it's simple (or at least less of a pain) to write a few test cases & also flesh out your documentation, more people will take the opportunity to write them.


While frameworks like Mocha are pretty nice, writing some checks idiomatically tends to lead to verbose test-cases. 

```js
const { add } = require('../../modules/math')

describe('A description of your test suite', () => {
    it('Should be able to add two numbers together', () => {
        assert.equals(add(1, 2), 3)
    })

    it('Should throw if one of the parameters is a string', () => {
        expect(add(1, '2')).to.throw()
        expect(add('1', 2)).to.throw()
        expect(add('1', '2')).to.throw()
    })

    it('should be able to add negative numbers', () => {
        assert.equals(add(-3, 5), 2)
    })
})
```

vs writing
```js
/**
 * @test 1, 2 returns 3
 * @test 1, '2' throws
 * @test -3, 5 returns 2
 */
function add(a, b) { ... }
```

And sometimes the added verbosity is nice! But sometimes it'd be a little easier to be able to get to the point & provide examples of how to call your functions.

I also wanted to make it simple to perform snapshots, because in a handful of cases (particularly on functions with more complex types), I've seen people run the functions & copy-paste the output into an expect clause.

```js
// Snapshots by default if no conditions are specified :)
/**
 * @test { name: 'Jesse', term: '8mo' }
 */
export async function generateDocument({ name, term }) {
    return {
        name,
        term,
        lease: await acquireLease({ name, term })
    }
}
```

## Got slightly more complex examples?

In some cases, you may want to set up a more complex test, these are the times that `.test.js` files are warranted in Pineapple.

This allows you to compose a handful of test cases on the same code, while remaining true to vanilla javascript. Ideally the tests that would be created would be a function that you might find in a real-world implementation of your APIs.

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



Pineapple can also be used to test classes, though if you get to a point where you're needing to compose numerous scenarios across multiple entities, it might be ideal to start exploring a Scenario Testing framework like Cucumber. :)
```js
/**
 * A basic bank account class that allows for withdrawing & depositing money.
 * @test 100 ~> $.withdraw(10) ~> $.deposit(20) returns $.balance === 110
 * @test 0 ~> $.withdraw(100) throws 'Insufficient funds'
 * @test 100 ~> $.withdraw(-10) throws 
 */
 export class Account {
    constructor(balance) {
        this.balance = balance
    }

    withdraw (amount) {
        if (amount < 0) throw new Error('Amount must be greater than zero')
        if (this.balance < amount) throw new Error('Insufficient funds')
        this.balance -= amount
    }

    deposit (amount) {
        if (amount < 0) throw new Error('Amount must be greater than zero')
        this.balance += amount
    }
}
```

Pineapple isn't meant to replace all forms of testing; just your basic unit tests & similar.

As of May 9th 2022, the project still has not had a v1.0 release, thus should still be considered experimental. There are still some edges to round out before a stable release, but the technology is functional. :)