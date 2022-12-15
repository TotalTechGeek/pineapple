
import Gherkin from './scenario.js'

const { Given, When, Then, Scenario } = Gherkin()

Given('I have {num} pineapples in my belly', function ({ num }) {
  this.pineapples = num
})

When('I vomit one', function () {
  this.pineapples--
})

Then('I should have one less pineapple in my belly', function ({ num }) {
  if (this.pineapples !== num - 1) throw new Error('There is not one less pineapple!')
})

Then('The number of pineapples should be positive.', function () {
  if (this.pineapples < 0) throw new Error('You cannot have a negative number of pineapples!')
})

/**
 * @test { num: 5 } resolves @.pineapples === 4
 * @test { num: #integer({ min: 1 }) } resolves
 */
export const Example = Scenario`
Given I have {num} pineapples in my belly
When I vomit one
Then I should have one less pineapple in my belly
And The number of pineapples should be positive.`

/**
 * @test { num: 5 } resolves @.pineapples === 2
 */
export const SecondExample = Scenario`
 Given I have {num} pineapples in my belly
 When I vomit one
 And I vomit one
 And I vomit one
 Then The number of pineapples should be positive.`

/**
 * @test @__fails__ void resolves
 */
export const Unimplemented = Scenario`
Given I have not implemented a scenario
Then I should receive a warning telling me what to implement`
