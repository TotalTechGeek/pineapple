export default createNamespace;
/**
 * @param {string | [string]} name
 * @returns {Omit<{ [key: string]: (description: string, func: (...args: any[]) => void) => void }, 'Scenario'> & { Scenario: typeof Scenario }}
 */
declare function createNamespace <T> (name?: string | TemplateStringsArray): Omit<{
    [key: string]: (description: string, func: (this: T, ...args: any[]) => void) => void;
}, "Scenario"> & {
    Scenario: ([script]: TemplateStringsArray) => (...args: any[]) => Promise<{
        ___func___: any;
    }>;
};
