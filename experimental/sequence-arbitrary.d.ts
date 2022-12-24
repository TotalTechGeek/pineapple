/**
 * Takes a sequence and creates a fixed size arbitrary from it.
 * This is useful for forcing Pineapple to iterate through each item sequentially.
 * @param  {...any} arr
 * @returns
 */
export function sequenceArbitrary(...arr: any[]): import("fast-check").Arbitrary<any>;
