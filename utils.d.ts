/**
 * It takes the output of the diff function and if it contains the string "Comparing two different
 * types", it replaces the output with a more detailed message
 * @param expected - The expected value.
 * @param received - The value that was actually returned from the test.
 * @returns The function diffTouchup is being returned.
 */
export function diff(expected: any, received: any): string;
/**
 * Substitute any arbitraries with a "var" expression so that we can perform a map operation
 * after building the relevant logic. :)
 * @param {*} obj
 * @param {*} sub
 */
export function traverseSubstitute(obj: any, sub?: any): any;
/**
 * Convert the arguments for a test case into arbitraries.
 * @param  {...any} args
 */
export function argumentsToArbitraries(data: any, ...args: any[]): Promise<any[]>;
