
import Gherkin from './scenario.js'

const { Given, When, Then, Scenario } = Gherkin<{ pineapples: number }>()

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

Given(/^I have eaten (\d+) pineapples$/, function (num) {
  if (!this.pineapples) this.pineapples = 0
  this.pineapples += +num  
})

Then(/^I should have eaten (?<count>\d+) pineapples$/, function ({ count }) {
  if (this.pineapples !== +count) throw new Error('The total number of pineapples is incorrect.')
})

Then(/^I should have eaten (?<count>\d+) pineapples, which is more than {num}$/, function ({ count }) {
  return ({ num }) => {
    if (this.pineapples !== +count) throw new Error('The total number of pineapples is incorrect.')
    if (this.pineapples < num) throw new Error('The number is less than {num}')
  }
})

/**
 * @test { num: 5 } resolves @.pineapples === 4
 * @test { num: #integer({ min: 1 }) } resolves
 */
export const Eating = Scenario`
Given I have {num} pineapples in my belly
When I vomit one
Then I should have one less pineapple in my belly
And The number of pineapples should be positive.`

/**
 * @test { num: 5 } resolves @.pineapples === 2
 */
export const MultiVomit = Scenario`
 Given I have {num} pineapples in my belly
 When I vomit one
 And I vomit one
 And I vomit one
 Then The number of pineapples should be positive.`

/**
 * @test @__fails__ void resolves
 */
export const UnimplementedScenario = Scenario`
Given I have not implemented a scenario
Then I should receive a warning telling me what to implement`


/**
 * @test void resolves
 */
export const RegexScenario = Scenario`
Given I have eaten 50 pineapples
And I have eaten 30 pineapples
Then I should have eaten 80 pineapples`

/**
 * @test { num: 75 } resolves
 */
 export const RegexIntense = Scenario`
 Given I have eaten 50 pineapples
 And I have eaten 30 pineapples
 Then I should have eaten 80 pineapples, which is more than {num}
 `

 /**
  * @test void throws
  */
 export const FailsDeclaration = () => {
  Given('I have {num} pineapples in my belly', function ({ num }) {
  })
 }