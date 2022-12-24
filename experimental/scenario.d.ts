export default createNamespace;
/**
 * This function creates a dynamic step namespace for the scenarios.
 * While you can avoid specifying a namespace and it'll default, I recommend defining a namespace to avoid
 * step collisions / encouraging people to re-use steps across different sections of the codebase.
 * 
 * @example
 * ```
 * const { Given, When, Then, Scenario } = Steps()
 *
 * Given('There are 20 Pickles', function () { ... })
 * ...
 *
 * const Example = Scenario`
 * Given There are 20 Pickles
 * ...
 * `
 * ```
 * 
 * @param {string | [string]} name The namespace for the steps to avoid collisions
 * @returns {Omit<{ [key: string]: (description: string, func: (...args: any[]) => void) => void }, 'Scenario'> & { Scenario: typeof Scenario }}
 */
declare function createNamespace <T> (name?: string | TemplateStringsArray): Omit<{
    [key: string]: (description: string, func: (this: T, ...args: any[]) => void) => void;
}, "Scenario"> & {
    Scenario: ([script]: TemplateStringsArray) => (...args: any[]) => Promise<{
        ___func___: any;
    }>;
};
