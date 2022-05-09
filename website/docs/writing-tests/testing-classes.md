---
sidebar_position: 4
---

# Testing Classes

## Normal Classes

Starting in version `v0.6.1`, you are now able to test classes using the Higher-Order Function syntax. 

This allows you to test more complex processes & functionality, and avoid too much cruft.

```js
/**
 * A basic bank account class; allows for withdrawing & depositing money.
 * @test 100 ~> $.withdraw(10) ~> $.deposit(20) returns $.balance === 110
 * @test 0 ~> $.withdraw(100) throws 'Insufficient funds'
 * @test 0 ~> $.deposit(30) ~> $.deposit(10) returns $.balance === 40 ~> $.withdraw(20) ~> $.withdraw(30) throws 'Insufficient funds'
 * @test 100 ~> $.withdraw(-10) throws ~> $.deposit(-10) throws
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


The first part in the chain will be the arguments that are passed into the constructor, and from then on you'll be able to invoke functions on the class by using `$.funcName(...arguments)`. 

At each step in the chain, you will be able to test conditions (for example, to check the current balance of the class instance, or the result of the function call).

Let's examine a slightly better `Account` implementation,


```js
/**
 * A basic bank account class; allows for withdrawing & depositing money.
 * @test 50 ~> $.deposit(30) returns 80 ~> $.withdraw(20) returns 60
 * @test 0 ~> $.deposit(10) ~> $.deposit(30) returns 40 ~> $.withdraw(5) returns @ === 35 and $.transactions === 3
 */
 export class Account2 {
    constructor(balance) {
        this.balance = balance
        this.transactions = 0
    }

    withdraw (amount) {
        if (amount < 0) throw new Error('Amount must be greater than zero')
        if (this.balance < amount) throw new Error('Insufficient funds')
        this.balance -= amount
        this.transactions++
        return this.balance
    }

    deposit (amount) {
        if (amount < 0) throw new Error('Amount must be greater than zero')
        this.balance += amount
        this.transactions++
        return this.balance
    }
}
```

As you can see, each step in the chain can be tested separately. If writing a complex condition, you may use `@` to reference the result of the function call, and `$` to reference the current instance of the class.

Functions on a class may only be invoked from the left-hand side of the expression, and its properties may only be accessed on the right side.


## Static Methods in Classes

Static methods in classes may be tested using `@test_static`. 

You do not need to provide arguments for a constructor like you typically would for a class test.

```js
/**
 * @test_static $.add(5, 3) returns 8
 * @test_static $.getPrevious() returns 8
 */
export class Math {
    static previousResult = null
    static add(a, b) {
        return this.previousResult = a + b
    }

    static getPrevious() {
        return this.previousResult
    }
}
```

## Classes that return Functions

If you have a case where a class returns a function, you may invoke the result by just passing arguments in the next step,
```js
/**
 * @test 10 ~> $.getAdd() ~> 5 returns 15
 */
export class Adder {
    constructor(value) {
        this.value = value
    }

    getAdd () {
        return num => num + this.value 
    }
}
```