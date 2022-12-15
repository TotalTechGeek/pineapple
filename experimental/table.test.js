import { ArrayTable, HeaderTable } from './table.js'

/**
 * @pineapple_define Tables
 */
export function Tables () {
  return {
    cucumberWithTitles: `
      | title                                | author      |
      | -- | -- |
      | The Devil in the White City          | Erik Larson |
      | The Lion, the Witch and the Wardrobe | C.S. Lewis  |
      | In the Garden of Beasts              | Erik Larson |`,
    cucumberWithoutTitles: `
      | The Devil in the White City          | Erik Larson |
      | The Lion, the Witch and the Wardrobe | C.S. Lewis  |
      | In the Garden of Beasts              | Erik Larson |`,
    markDown: `
      title | author 
      -- | -- 
      The Devil in the White City          | Erik Larson 
      The Lion, the Witch and the Wardrobe | C.S. Lewis  
      In the Garden of Beasts              | Erik Larson
      `,
    sample: `
      name | title
      -- | --
      Jesse Mitchell | Lead Software Engineer
      Hooman Famili | VP of Engineering
      `
  }
}

/**
 * @pineapple_define Tables
 */
export const People = HeaderTable('People', `
    first | last 
    -- | -- 
    Jesse | Mitchell
    John | Doe
    Jane | Doe
    Austin | Donovan
    Luke | Hardin
`)

/**
 * @pineapple_define Tables
 */
export const PeopleArray = ArrayTable('PeopleArray', `
    Jesse | Mitchell
    John | Doe
    Jane | Doe
    Austin | Donovan
    Luke | Hardin
`)

/**
 * @test #Tables.People
 * @test #Tables.PeopleArray
 */
export const HeaderTableTest = () => {}
