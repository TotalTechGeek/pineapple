// Patches the parser code so that it doesn't get evaluated by c8.

import fs from 'fs'

fs.writeFileSync('./dsl.js',
`/* c8 ignore start */
${fs.readFileSync('./dsl.js').toString()}
/* c8 ignore end */`
)
