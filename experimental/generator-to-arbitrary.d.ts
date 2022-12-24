/**
 * Takes an (infinite) generator function and turns it into an arbitrary, for testing.
 * @param {Generator} func
 */
export function generatorToArbitrary(func: Generator): fc.Arbitrary<any>;
import fc from "fast-check";
