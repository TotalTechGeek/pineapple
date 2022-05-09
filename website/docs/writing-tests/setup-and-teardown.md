---
sidebar_position: 5
---

# Setup and Teardown

Continuing down the path of writing more complex tests with Pineapple, there may be certain situations where you need to perform some additional setup & teardown. While not strictly required, these are recommended to be embedded in a `.test.js` file.


## Before / After all of the tests

If you wish to run a function before / after all of the tests are run (like an initial setup for every single test you're going to run), you are able to simply add a JSDoc annotation to a function without any other descriptors.


```js
/**
 * A function that sets up some records in a mock database, or creates instances
 * of some objects you may need.
 * @beforeAll
 */
async function setup() {
    ...
}
```

The annotations for this are `beforeAll` and `afterAll`. You may define multiple functions to be invoked.

## Before / After tests within a function

If you need to run the setup with the function itself, you have multiple options; these annotation require you to specify what you'd like to have executed (usually methods imported using `pineapple_import`).

### Before / After

These annotations will run before / after all of the test cases associated with the function.

```js

/**
 * @pineapple_import
 */
export async function setupExample (name) {
    await db.initialize()
    await db.insert({
        name
    })
}

/**
 *  @pineapple_import
 */
export async function destroyExample (name) {
    await db.remove({ name })
}

/**
 * Silly example, but shows how to invoke.
 * @before setupExample('Jesse')
 * @after destroyExample('Jesse')
 * @test 'Jesse' returns 1
 * @test 'John' returns 0
 */
export async function example(name) {
    const people = await db.find({ name })
    return people.length
}
```

### BeforeEach / AfterEach

If you'd prefer for it to run before / after each test case,


```js
let person

/**
 * Sets a file-scoped variable to be a new person object.
 * @pineapple_import
 */
function createPerson (name, level) {
    person = {
        name,
        level: 1
    }
}

/**
 * Another silly example to demonstrate the use of beforeEach
 * @beforeEach createPerson('John', 5)
 * @test 3 returns @.age === 8
 * @test 1 returns @.age === 4
 */
function levelUp(amount) {
    person.level += amount
    return person
}
```

## Caveat Emptor

In general, I'd encourage you to avoid using these annotations. They have been added to the framework to introduce flexibility, but if your tests necessitate the use of setup & teardown, you likely have a use-case that unit tests aren't ideal for. Scenario Tests with a framework like Cucumber would likely be far more fitting.

There might be some use-cases where `@beforeAll` and `@afterAll` might make sense, but please be mindful that there may be better options.