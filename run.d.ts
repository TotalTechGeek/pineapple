/**
 * Adds a method to the Pineapple JSON Logic Engine.
 * @param {string} name
 * @param {(...args: any[]) => any} fn
 */
export function addMethod(name: string, fn: (...args: any[]) => any): void;
/**
 * Executes the method passed in, and adds the arbitraries to the engine.
 * @param {(...args: any[]) => ({ [key: string]: any })} fn
 * @param {string} category
 */
export function addDefinitions(fn: (...args: any[]) => {
    [key: string]: any;
}, category?: string): void;
/**
 * Just executes the expression, used for "before" / "beforeEach" / "after" / "afterEach".
 * @param {string} input
 */
export function execute(input: string): Promise<void>;
/**
 * Runs the tests in the Pineapple JSON Logic Engine.
 * @param {string} input
 * @param {string} id
 * @param {(...args: any[]) => any} func
 * @param {string} file
 */
export function run(input: string, id: string, func: (...args: any[]) => any, file: string): Promise<1 | 0>;
/**
 * A way to turn a class into a higher-order function chain for testing purposes.
 * @param {*} ClassToUse
 * @param {boolean} staticClass
 */
export function hof(ClassToUse: any, staticClass?: boolean): (...args: any[]) => {
    (method: any, ...args: any[]): any;
    instance: any;
};
