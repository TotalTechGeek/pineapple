"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[516],{4477:function(e){e.exports=JSON.parse('{"blogPosts":[{"id":"/introducing-pineapple","metadata":{"permalink":"/pineapple/blog/introducing-pineapple","editUrl":"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/blog/introducing-pineapple.md","source":"@site/blog/introducing-pineapple.md","title":"Introducing Pineapple","description":"The Pineapple Logo","date":"2022-05-09T00:00:00.000Z","formattedDate":"May 9, 2022","tags":[{"label":"introduction","permalink":"/pineapple/blog/tags/introduction"}],"readingTime":3.98,"truncated":false,"authors":[{"name":"Jesse Mitchell","title":"Developer of Pineapple","url":"https://github.com/TotalTechGeek","image_url":"https://github.com/TotalTechGeek.png","imageURL":"https://github.com/TotalTechGeek.png"}],"frontMatter":{"tags":["introduction"],"sidebar_position":1,"date":"2022-05-09T00:00:00.000Z","authors":[{"name":"Jesse Mitchell","title":"Developer of Pineapple","url":"https://github.com/TotalTechGeek","image_url":"https://github.com/TotalTechGeek.png","imageURL":"https://github.com/TotalTechGeek.png"}]}},"content":"![The Pineapple Logo](/img/pineapple.png)\\n\\n## What in the world is Pineapple?\\n\\nPineapple is a test framework designed to remove the cruft from writing unit tests and creating snapshots.\\n\\n```js\\n/**\\n * Adds numbers together for the sake of demonstrating pineapple.\\n * @test 1, 2 returns 3\\n * @test \'1\', 2 throws \\"Not a number\\"\\n * @param {number} a \\n * @param {number} b\\n */\\nexport function add(a, b) {\\n    if (typeof a !== \'number\' || typeof b !== \'number\') throw new Error(\'Not a number\')\\n    return a + b\\n}\\n```\\n\\nIt allows you to embed a few example test-cases in your JSDocs, making it easier to focus on your code and less on defining `it` & `expect` chains. \\n\\nWhen you omit conditions from your test cases, it\'ll automatically capture the result of your test & snapshot it, making it easier to preserve expected behavior in your applications, and even easier for users to find examples on how to call your code.\\n\\n![An example of the snapshot functionality where the code is modified and the snapshot fails due to a renamed attribute](/img/snapshot.gif)\\n\\n## But... why?\\n\\nWhile there are a lot of great test frameworks out there with solid communities and support, I\'ve found it difficult to introduce testing to certain teams due to the cruft & ergonomics involved.\\n\\nPineapple is an attempt to make it easier to write your tests, to get more people into the habit of writing them. The idea is that if it\'s simple (or at least less of a pain) to write a few test cases & also flesh out your documentation, more people will take the opportunity to write them.\\n\\n\\nWhile frameworks like Mocha are pretty nice, writing some checks idiomatically tends to lead to verbose test-cases. \\n\\n```js\\nconst { add } = require(\'../../modules/math\')\\n\\ndescribe(\'A description of your test suite\', () => {\\n    it(\'Should be able to add two numbers together\', () => {\\n        assert.equals(add(1, 2), 3)\\n    })\\n\\n    it(\'Should throw if one of the parameters is a string\', () => {\\n        expect(add(1, \'2\')).to.throw()\\n        expect(add(\'1\', 2)).to.throw()\\n        expect(add(\'1\', \'2\')).to.throw()\\n    })\\n\\n    it(\'should be able to add negative numbers\', () => {\\n        assert.equals(add(-3, 5), 2)\\n    })\\n})\\n```\\n\\nvs writing\\n```js\\n/**\\n * @test 1, 2 returns 3\\n * @test 1, \'2\' throws\\n * @test -3, 5 returns 2\\n */\\nfunction add(a, b) { ... }\\n```\\n\\nAnd sometimes the added verbosity is nice! But sometimes it\'d be a little easier to be able to get to the point & provide examples of how to call your functions.\\n\\nI also wanted to make it simple to perform snapshots, because in a handful of cases (particularly on functions with more complex types), I\'ve seen people run the functions & copy-paste the output into an expect clause.\\n\\n```js\\n// Snapshots by default if no conditions are specified :)\\n/**\\n * @test { name: \'Jesse\', term: \'8mo\' }\\n */\\nexport async function generateDocument({ name, term }) {\\n    return {\\n        name,\\n        term,\\n        lease: await acquireLease({ name, term })\\n    }\\n}\\n```\\n\\n## Got slightly more complex examples?\\n\\nIn some cases, you may want to set up a more complex test, these are the times that `.test.js` files are warranted in Pineapple.\\n\\nThis allows you to compose a handful of test cases on the same code, while remaining true to vanilla javascript. Ideally the tests that would be created would be a function that you might find in a real-world implementation of your APIs.\\n\\n```js\\n/**\\n * @test \\"HelloWorld\\"\\n * @test \\"Hello1\\" returns truthy\\n * @test \\"Hello\\" returns truthy\\n * @test \\"th1ng$Here\\" returns falsy\\n */\\nexport function commonRule (pw) {\\n    return password(\\n        min(8),\\n        max(16),\\n        hasDigits(1),\\n        hasSpecial(1),\\n        hasLowerCase(1),\\n        hasUpperCase(1)\\n    )(pw)\\n}\\n```\\n\\n\\n\\nPineapple can also be used to test classes, though if you get to a point where you\'re needing to compose numerous scenarios across multiple entities, it might be ideal to start exploring a Scenario Testing framework like Cucumber. :)\\n```js\\n/**\\n * A basic bank account class that allows for withdrawing & depositing money.\\n * @test 100 ~> $.withdraw(10) ~> $.deposit(20) returns $.balance === 110\\n * @test 0 ~> $.withdraw(100) throws \'Insufficient funds\'\\n * @test 100 ~> $.withdraw(-10) throws \\n */\\n export class Account {\\n    constructor(balance) {\\n        this.balance = balance\\n    }\\n\\n    withdraw (amount) {\\n        if (amount < 0) throw new Error(\'Amount must be greater than zero\')\\n        if (this.balance < amount) throw new Error(\'Insufficient funds\')\\n        this.balance -= amount\\n    }\\n\\n    deposit (amount) {\\n        if (amount < 0) throw new Error(\'Amount must be greater than zero\')\\n        this.balance += amount\\n    }\\n}\\n```\\n\\nPineapple isn\'t meant to replace all forms of testing; just your basic unit tests & similar.\\n\\nAs of May 9th 2022, the project still has not had a v1.0 release, thus should still be considered experimental. There are still some edges to round out before a stable release, but the technology is functional. :)"}]}')}}]);