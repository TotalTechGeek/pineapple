/**
 * @param {*} file
 * @returns {{ set: async (key: string, value: any) => void, find: async (key: string) => any }}
 */
export function snapshot(file?: any): {
    (key: string, value: any): void;
    (key: string): any;
    set: async;
    find: async;
};
/**
 * Serializes a JavaScript value into a valid Pineapple expression.
 * This allows me to use the Pineapple Parser to deserialize values,
 * Which makes it easier to add support for custom types.
 *
 * @test 'Hello, World!'
 * @test 5 returns "5"
 * @test true returns "true"
 * @test Infinity returns "Infinity"
 * @test -Infinity returns "-Infinity"
 *
 * @test null returns "null"
 * @test undefined returns "undefined"
 * @test void returns "undefined"
 * @test [1, 2, 3]
 * @test { name: 'Rick', age: 1000 }
 * @test 21n returns "21n"
 * @test date('2020-01-01')
 *
 * @param {*} item
 * @param {number} indent
 */
export function serialize(item: any, indent?: number): any;
/**
 * Parses a Pineapple Expression.
 * @param {string} text
 */
export function deserialize(text: string): Promise<any>;
