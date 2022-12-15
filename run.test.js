
import { hof } from './run.js'

class Counter {
  constructor (amount) {
    this.amount = amount
  }

  increment () {
    return ++this.amount
  }
}

/**
 * @test 100 ~> $.increment() returns 101
 * @test 100 ~> $.increment() ~> $.increment() returns 102
 */
export const CreateCounter = hof(Counter)

/**
 * @test void ~>
 *  $.create('Jesse') ~>
 *  $.greet() returns 'Hello Jesse'
 */
export const Module = hof({
  create (name) {
    this.person = { name }
  },
  greet () {
    return `Hello ${this.person.name}`
  }
})
