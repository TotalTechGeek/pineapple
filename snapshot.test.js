
import { snapshot, serialize, deserialize } from './snapshot.js'
import fc from 'fast-check'
import fs from 'fs'
import Steps from './experimental/scenario.js'

const { Given, When, Then, After, Scenario } = Steps()

const snapshotFile = 'snapshot.temp.test.psnap'

Given('a new snapshot', function () {
  this.snapshot = snapshot(snapshotFile)
})

When('I set {key} to {value}', async function ({ key, value }) {
  await this.snapshot.set(key, value)
  this.text = fs.readFileSync(snapshotFile).toString()
})

Then('{key} should be {value}', async function ({ key, value }) {
  if ((await this.snapshot.find(key)).value !== value) throw new Error('The record does not have the correct value')
})

When('I delete {key}', async function ({ key }) {
  await this.snapshot.remove(key)
  this.text = fs.readFileSync(snapshotFile).toString()
})

Then('{key} should not exist', async function () {
  if ((await this.snapshot.find('hello')).exists) throw new Error('The record exists though it should not')
})

After('I should clean up', function () {
  fs.unlinkSync(snapshotFile)
  delete this.snapshot
})

/**
 * @test { key: 'hello', value: 'world' }
 */
export const SimulateSnapshot = Scenario`
Given a new snapshot
When I set {key} to {value}
Then {key} should be {value}
After I should clean up
`

/**
 * @test { key: 'hello', value: 'world' }
 */
export const SimulateSnapshotWithDeletion = Scenario`
 Given a new snapshot
 When I set {key} to {value}
 Then {key} should be {value}
 When I delete {key}
 Then {key} should not exist
 After I should clean up
 `

/**
  * @pineapple_define Characters
  */
export const Characters = () => {
  return {
    Backslash: '\\'
  }
}

/**
 * @pineapple_define Snapshots
 */
export const Arbitraries = () => {
  return {
    Text: fc.string().filter(text => !text.endsWith('\\'))
  }
}

/**
  * @test void
  */
export const SnapshotUnicode = () => '\u1516\u1596\u4851'

/**
 * We need to test ' \\' because it fails, however everything else serializes properly.
 * @test #Snapshots.Text resolves args.0
 * @no-test #anything resolves args.0
 */
export function serializeAndDeserialize (value) {
  return deserialize(serialize(value))
}
