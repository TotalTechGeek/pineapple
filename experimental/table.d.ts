/**
 * @pineapple_define Tables
 */
export function Tables(): {
    cucumberWithTitles: string;
    cucumberWithoutTitles: string;
    markDown: string;
    sample: string;
};
/**
 * @test #Tables.cucumberWithTitles, true
 * @test #Tables.markDown, true
 * @test #Tables.cucumberWithoutTitles, false
 * @test #Tables.sample, true
 * @param {string} str
 * @param {boolean} header
 */
export function parseTable(str: string, header: boolean): any[];
/**
 * @param {string} name
 * @param {string} param
 */
export function HeaderTable(name: string, str: any): () => {
    [x: string]: fc.Arbitrary<any>;
};
/**
 * @param {string} name
 * @param {string} param
 */
export function ArrayTable(name: string, str: any): () => {
    [x: string]: fc.Arbitrary<any>;
};
import fc from "fast-check";
