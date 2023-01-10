---
sidebar_position: 2
---
# Changes from Cucumber

## Explanation

In Cucumber.js, there is a special syntax for specifying how items are parsed:

```js
// Cucumber.js style
Given("a bank account with a balance of {int}", function (balance) {
    this.account = new BankAccount(balance)
})
```

Then in your scenarios, you'd write:

```
Given a bank account with a balance of 200
...
```

The Cucumber library performs some parsing & regex matching against your steps to find matches.

By default, Pineapple does not opt for this approach. Instead, you are encouraged to think in templates from the beginning, and provide test cases to fill in the blanks:

```js
Given("a bank account with a balance of {balance}", function ({ balance }) {
    this.account = new BankAccount(balance)
})

/**
 * @test { balance: 200 }
 * @test { balance: 150 }
 */
 const Basic = Scenario`
 Given a bank account with a balance of {balance}`
```

This allows the test framework to more easily recommend stubs to copy-paste in, as the template steps just directly match against the strings, no parsing magic necessary.

## Regex Match

However, if you'd like to be able to re-use a step multiple times in the same scenario with different sets of data, Cucumber's approach can be more convenient.

Thus in Pineapple, you can provide a regex expression to the step definition similar to how you can in Cucumber (use groups to designate variables).

```js
When(/^I deposit (\d+)$/, function (amount) {
    this.account.deposit(amount)
})

/**
 * @test { balance: 200 }
 * @test { balance: 150 }
 */
 const Basic = Scenario`
 Given a bank account with a balance of {balance}
 When I deposit 50
 And I deposit 30`
```

### Named Groups

You are also able to use named groups in your regular expressions:

```js
When(/^I deposit (?<amount>\d+)$/, function ({ amount }) {
    this.account.deposit(amount)
})

/**
 * @test { balance: 200 }
 * @test { balance: 150 }
 */
 const Basic = Scenario`
 Given a bank account with a balance of {balance}
 When I deposit 50
 And I deposit 30`
 ```

### Using Both Step & Scenario Context

If you need access to both the step's context (parsed from the regular expression), and the context pulled from the scenario invocation, you may return a function from your regex step definition.

```js
When(/^I deposit (?<amount>\d+) more than my original balance$/, function ({ amount }) {
    return ({ balance }) => {
        this.account.deposit(balance + amount)
    }
})

/**
 * @test { balance: 200 }
 * @test { balance: 150 }
 */
 const Basic = Scenario`
 Given a bank account with a balance of {balance}
 When I deposit 50 more than my original balance`
```

I expect this to be rare, though.
