---
sidebar_position: 1
---
# Intro

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

<img alt="An example of the snapshot functionality where the code is modified and the snapshot fails due to a renamed attribute" src="../img/snapshot.gif" width="80%" />

## To Install

```
npm i pineapple --save-dev
```

or

```
yarn add pineapple --dev
```

Alternatively, you may install the runner globally (add a `-g` flag).

## To Run

```
Usage: pineapple [options]

Options:
  -V, --version                  output the version number
  -i, --include <files...>       Comma separated globs of files to include.
  -e, --exclude <files...>       Comma separated globs of files to exclude.
  -w, --watch-mode               Will run tests only when a file is modified.
  -a, --accept-all               Accept all snapshots.
  -u, --update-all               Update all snapshots.
  -t, --transpile                Enables transpilation.
  --typescript                   Enables transpilation for TypeScript. (legacy flag)
  --timeout <milliseconds>       The timeout for each test. (default: "5000")
  --strict                       Enables additional checks to enforce better testing, namely validating that all snapshots are used.
  --clean                        Cleans up unused snapshots.
  --only <lines...>              Allows you to specify which tests you would like to run.
  --fuzz-runs <amount>           The number of runs that fuzz tests perform. (default: "100")
  --snapshot-fuzz-runs <amount>  The number of runs that fuzz tests perform on a snapshot. (default: "10")
  -f, --format <format>          The output format (choices: "json", "console", default: "console")
  --bun                          Uses Bun as the test runner.
  -h, --help                     display help for command

```

#### Example

```bash
pineapple -w -i "src/**/*.js" # Starts Pineapple in "watch mode" so that it'll run on update.
```
