// {"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"age":{"type":"array","items":{"type":"number"}},"friends":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"}},"required":["name"]}}},"required":["name","age","friends"]}} 
// const schema = [
//     {
//        "name": "string",
//        "age": [
//           "number"
//        ],
//        "friends": [
//           {
//              "name": "string"
//           }
//        ]
//     }
//  ]

/**
 * @param {*} schema 
 * @returns A JSON Schema
 */
export function toJsonSchema (schema) {
    if (Array.isArray(schema)) {
        return {
            type: 'array',
            items: toJsonSchema(schema[0])
        }
    }

    if (schema === 'string') {
        return {
            type: 'string'
        }
    }

    if (schema === 'number') {
        return {
            type: 'number'
        }
    }

    if (schema === 'boolean') {
        return {
            type: 'boolean'
        }
    }

    if (typeof schema === 'object') {
        const result = {
            type: 'object',
            properties: {},
            required: []
        }

        for (let key in schema) {
            result.properties[key] = toJsonSchema(schema[key])
            result.required.push(key)
        }

        return result
    }
    
    throw new Error('Unrecognized Schema')
}
