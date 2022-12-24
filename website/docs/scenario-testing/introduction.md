---
sidebar_position: 1
---

# Introduction

Introduced officially in `v0.14.0`, Pineapple now includes a simple Scenario testing framework to enable developers to write more advanced tests without pulling in another framework / taking a cumbersome approach.

While we'd still encourage developers to consider pulling in Cucumber or a similar framework, Pineapple now has a lightweight setup to allow for comparable testing strategies.

## Writing a Scenario Test

To write a Scenario Test in Pineapple, you may use the `Steps` utility.

By using this utility, you may specify the scope of the test (the `this` keyword to transfer data in between steps), as well as a namespace to prevent steps from being inherited by other Scenario Tests.

```typescript
// Inside of an account.test.ts file (though of course you can write it inside of a .js file)
import { Steps } from 'pineapple'
const { Given, When, Then, Scenario } = Steps<{ account: BankAccount }>()

Given("a bank account with a balance of {balance}", function ({ balance }) {
    this.account = new BankAccount(balance)
})

When("I deposit {amount}", function ({ amount }) {
    this.account.deposit(amount)
})

Then("I should have a positive balance", function () {
    // Preferably, use an assert framework here!
    if (this.account.balance < 0) throw new Error('This should never occur!')
})

/**
 * Define a simple scenario with the bank account, and provide some test cases:
 * @test { balance: 100, amount: 50 }
 * @test { balance: 30, amount: 190 }
 */
export const Example = Scenario`
Given a bank account with a balance of {balance}
When I deposit {amount}
Then I should have a positive balance`
```

## Using the Fuzz & Snapshot Technology

What is interesting about using Pineapple as your scenario test runner is that you can leverage some of the strengths of both testing approaches.

For example, you could write:

```javascript
/**
 * Define a simple scenario with the bank account, and provide some test cases:
 * @test { balance: #integer, amount: #integer }
 */
export const Example = Scenario`
Given a bank account with a balance of {balance}
When I deposit {amount}
Then I should have a positive balance`
```

Then one of the test cases it generates might correctly fail with:

```
{
  "error": "Amount must not be negative.",
  "async": true,
  "input": [
    {
      "balance": 5,
      "amount": -3
    }
  ]
}
Accept this snapshot? Yes
```

You are able to apply the Scenario Test steps to validate your passing cases (for the scenario), and the snapshot testing to capture (correctly) failing cases.
