


<p align="center">
<img width=300 alt="A picture of a pineapple with a galaxy behind it with the word 'pineapple' under it." src="./resources/pineapple.png" /><br/> <p align="center" style="font-size: 18px;">A software testing framework for humans :) </p>

</p>

---
## What is this?

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

Pineapple allows you to embed a few example test-cases in your JSDocs, making it easier to focus on your code and less on defining `it` & `expect` chains. 

When you omit conditions from your test cases, Pineapple will automatically capture the result of your test & snapshot it, making it easier to preserve expected behavior in your applications, and even easier for users to find examples on how to call your code.

<img alt="An example of the snapshot functionality where the code is modified and the snapshot fails due to a renamed attribute" src="./resources/snapshot.gif" width=60% />

## To Install

```
npm i pineapple --save-dev
```
or 
```
yarn add pineapple --dev
```



Alternatively, you may install the runner globally (add a `-g` flag).

### To Run

```
Usage: pineapple [options]

Options:
  -V, --version             output the version number
  -i, --include <files...>  Comma separated globs of files.
  -a, --accept-all          Accept all snapshots.
  -u, --update-all          Update all snapshots.
  -t, --typescript          Enables typescript
  -h, --help                display help for command
```



#### Example
```
pineapple -i src/**/*.js
```

#### Continuous Integration

If `process.env.CI` / the environment variable `CI` is set, it will automatically fail if a snapshot is not set or if the snapshot does not match.


### Q&A


#### Should I put pineapple on my pizza?

The author of this project holds no opinion on this subject, but you might want to consider [Cucumber for your scenario tests](https://www.npmjs.com/package/@cucumber/cucumber).