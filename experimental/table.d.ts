/**
 * @test #Tables.cucumberWithTitles, true
 * @test #Tables.markDown, true
 * @test #Tables.cucumberWithoutTitles, false
 * @test #Tables.sample, true
 * @test #Tables.accounts, true
 */
/**
 * Allows you to parse a text table, either in Cucumber's typical format or Markdown-esque format.
 *
 * For example:
 * ```text
 * Name | Age
 * -- | --
 * Jesse | 25
 * Bob | 23
 *```

 Would be parsed as:
 ```
 [
    { "name": "Jesse", "age": 25 },
    { "name": "Bob", "age": 23 }
 ]
 ```
 * @param {string} str The table to parse
 * @param {boolean} header Whether the table has a header specified of not.
 */
export function parseTable(str: string, header: boolean): any[];
/**
 *
 * Allows you to parse a text table, either in Cucumber's typical format or Markdown-esque format.
 *
 * For example:
 * ```text
 * Name | Age
 * -- | --
 * Jesse | 25
 * Bob | 23
 *```

 Would be parsed as:
 ```
 [
    { "name": "Jesse", "age": 25 },
    { "name": "Bob", "age": 23 }
 ]
 ```
 *
 * @param {string} name
 * @param {string} param
 * @param {boolean} randomize Decides whether to use this arbitrary sequentially or not.
 *
 * * @example
 * ```
 * // "@pineapple_define" this
 * const People = HeaderTable('People', `
 *  Name | Age
 *  -- | --
 *  Jesse | 25
 *  Bob | 23
 * `)
 * ```
 */
export function HeaderTable(name: string, str: any, randomize?: boolean): () => {
    [x: string]: fc.Arbitrary<any>;
};
/**
 * @param {string} name
 * @param {string} param
 * @param {boolean} randomize Decides whether to use this arbitrary sequentially or not
 *
 * @example
 * ```
 * // "@pineapple_define" this
 * const People = ArrayTable('People', `
 *  Jesse | 25
 *  Bob | 23
 * `)
 * ```
 */
export function ArrayTable(name: string, str: any, randomize?: boolean): () => {
    [x: string]: fc.Arbitrary<any>;
};
import fc from "fast-check";
