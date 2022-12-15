/**
 * Announces that a test is being skipped due to it not being exported.
 * @param {string} name
 * @param {string} file
 * @param {{ type: string, text: string, lineNo: number }[]} tags
 * @test 'ForcedSkip', './outputs.js', [
 *  { type: 'nonexistent', lineNo: 12, text: 'This is forced.' }
 * ] returns void
 * @test 'ForcedSkip2', './outputs.js', [
 *  { type: 'nonexistent', lineNo: 14, text: 'This is forced in an array.' },
 *  { type: 'nonexistent', lineNo: 15, text: 'This is forced in an array, too.' }
 * ] returns void
 */
export function skippingTest(name: string, file: string, tags: {
    type: string;
    text: string;
    lineNo: number;
}[]): void;
/**
 * Announces that a test was successful.
 * @param {string} name
 * @param {string} input
 * @param {string} file
 */
export function success(name: string, input: string, file: string): void;
/**
 * Announces that a test was not successful.
 * @param {{ name: string, input: string, message: string, file: string, data: string }}
 * @test { name: 'Forced Output', input: 'If this appears, this is successful', file: './outputs.js:46', data: [] } returns void
 */
export function failure({ name, input, message, file, data }: {
    name: string;
    input: string;
    message: string;
    file: string;
    data: string;
}): void;
/**
 * Announces that a test could not be run because of a parse failure.
 * @param {string} name
 * @param {string} input
 * @param {string} message
 * @param {string} file
 * @test 'Forced', 'Forced Parse Failure Output', 'Forced Parse Failure Output', './outputs.js' returns void
 */
export function parseFailure(name: string, input: string, message: string, file: string): void;
/**
 * Tries to log a test runtime error
 * @param {*} err
 * @test 'Anything' returns void
 */
export function testRuntimeFailure(err: any): void;
/**
 * Logs the number of tests run.
 * @param {number} failures
 * @param {number} total
 */
export function aggregate(failures: number, total: number): void;
/**
 * Print the files that are being tested.
 * @param {string[]} files
 * @test ['./outputs.js'] returns void
 */
export function filesTested(files: string[]): void;
