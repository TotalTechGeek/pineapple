
<p align="center">
<img width=300 alt="A picture of a pineapple with a galaxy behind it with the word 'pineapple' under it." src="https://raw.githubusercontent.com/TotalTechGeek/pineapple/master/resources/pineapple.png" /><br/> <p align="center" style="font-size: 18px;">A software testing framework for humans :) </p>

</p>

---

## What is this?

[![npm version](https://badge.fury.io/js/pineapple.svg)](https://badge.fury.io/js/pineapple) [![Node.js CI](https://github.com/TotalTechGeek/pineapple/actions/workflows/node.js.yml/badge.svg)](https://github.com/TotalTechGeek/pineapple/actions/workflows/node.js.yml) [![Coverage Status](https://coveralls.io/repos/github/TotalTechGeek/pineapple/badge.svg)](https://coveralls.io/github/TotalTechGeek/pineapple)

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

<img alt="An example of the snapshot functionality where the code is modified and the snapshot fails due to a renamed attribute" src="https://jessemitchell.me/pineapple/img/snapshot.gif" width=60% />

## Documentation

Visit our [documentation here](https://jessemitchell.me/pineapple/).

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
  -t, --typescript          Enables typescript (slower).
  --only <lines...>         Allows you to specify which tests you would like to
                            run.
  -f, --format <format>     The output format (choices: "json", "console",
                            default: "console")
  -h, --help                display help for command
```

#### Example

```
pineapple -i src/**/*.js
```

#### Continuous Integration

If `process.env.CI` / the environment variable `CI` is set, it will automatically fail if a snapshot is not set or if the snapshot does not match.

### Q&A

#### Does Pineapple support TypeScript?

Yes. The functionality is experimental at this point in time, but you should be enable to enable it with `-t` or  `--typescript`.

#### Does Pineapple support Babel?

Not yet, but it is on the roadmap. With the recent addition of TypeScript support, it hopefully won't require too much effort.

#### Should I put pineapple on my pizza?

The author of this project holds no opinion on this subject, but you might want to consider [Cucumber for your scenario tests](https://www.npmjs.com/package/@cucumber/cucumber).

Pineapple doesn't necessarily go well with every use case, so for certain types of tests we actively encourage you to choose a framework better suited for that style of test.

Pineapple is oriented towards simplifying unit tests & making it easy to run multiple test cases against functions, but if you're trying to test a series of complex processes against something stateful (transactions against a rewards points system, combat, etc), scenario tests are likely your better bet.
