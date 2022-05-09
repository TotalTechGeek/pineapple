#!/usr/bin/env node
import { Project } from 'ts-morph'
import logSymbols from 'log-symbols';
import { groupBy, pluck, map, indexBy } from 'ramda'
import tempy from 'tempy'

import { program } from 'commander'
import { hash } from './hash.js';
import url from 'url'
import { transpile } from './typescriptTranspiler.js';


program
    .name('pineapple')
    .version('0.6.0')
    .option('-i, --include <files...>', 'Comma separated globs of files.')
    .option('-a, --accept-all', 'Accept all snapshots.')
    .option('-u, --update-all', 'Update all snapshots.')
    .option('-t, --typescript', 'Enables typescript (slower).')

program.parse()

const options = program.opts();

if(!options.include || !options.include.length) throw new Error('Please select files to include.')

// hack for now until I make the code better
process.env.ACCEPT_ALL = options.acceptAll || '';
process.env.UPDATE_ALL = options.updateAll || '';

async function main () {
    const tmp = tempy.file({ extension: 'mjs' })
    const project = new Project({
        
    })
    
    const regex = /\,\s?(?![^\{}]*\})/
      
    const files = options.include.flatMap(i => i.split(regex)).flatMap(i => {
        return project.addSourceFilesAtPaths(i)
    })

    // get variable declarations that are arrow functions / functions

   const functions = files.flatMap(file => {
        const fileText = file.getFullText().split('\n')
        return getFunctions(file, fileText, url.pathToFileURL(file.getFilePath()).href)
   });

    const testFile = project.createSourceFile(tmp, undefined, { 
        overwrite: true,
    })

    const imports = Object.entries(map(i => {
        return { namedImports: pluck('name', i), original: indexBy(i => i.name, i) }
    }, groupBy(i => i.fileName, functions)))
    

    const specifier = import.meta.url.split(/\/|\\/)
    specifier.pop()
    specifier.push('run.js')

    testFile.addImportDeclaration({
        moduleSpecifier: specifier.join('/'),
        namedImports: ['run', 'addMethod', 'execute'],
        isTypeOnly: false
    })

    let counter = 0

    // add imports
    await Promise.all(imports.map(async ([moduleSpecifier, { namedImports, original }], index) => {
        if (options.typescript) moduleSpecifier = await transpile(moduleSpecifier)
        testFile.addStatements(`
            import * as $$${index} from '${moduleSpecifier}';
            const { ${namedImports.map(i => {
                original[i].alias = `$${counter++}`
                return `${i}: ${original[i].alias}`
            }).join(', ')} } = { ...$$${index}.default, ...$$${index} };
        `)
    }))

 
    // add test functions
    const testFunc = testFile.addFunction({
        name: 'test',
        parameters: [],
        isAsync: true
    })

    const { addedMethods, tests, beforeAll, afterAll } = functions.map(func => {
        const addedMethods = func.tags.filter(i => i.type === 'pineapple_import').map(i => {
            return `addMethod(${JSON.stringify(i.text || func.originalName || func.name)}, ${func.alias})\n`
        }).join('')

        const beforeAll = func.tags.filter(i => i.type === 'beforeAll').map(i => {
            return `${func.alias}()\n`
        }).join('')

        const afterAll = func.tags.filter(i => i.type === 'afterAll').map(i => {
            return `${func.alias}()\n`
        }).join('')

        // before / beforeEach / after / afterEach will get integrated in directly with the tests.
        const before = func.tags.filter(i => i.type === 'before').map(tag => {
            return `await execute(${JSON.stringify(tag.text)})`
        }).join('\n')

        const beforeEach = func.tags.filter(i => i.type === 'beforeEach').map(tag => {
            return `await execute(${JSON.stringify(tag.text)})`
        }).join('\n')

        const after = func.tags.filter(i => i.type === 'after').map(tag => {
            return `await execute(${JSON.stringify(tag.text)})`
        }).join('\n')

        const afterEach = func.tags.filter(i => i.type === 'afterEach').map(tag => {
            return `await execute(${JSON.stringify(tag.text)})`
        }).join('\n')

        const tests = `${before}\n${func.tags.filter(i => i.type === 'test').map((tag, index) => `
            ${beforeEach}
            sum += await run(${JSON.stringify(tag.text)}, '${func.originalName || func.name}.${hash(func.relativePath + ':' + tag.text)}', ${func.alias})
            ${afterEach}
        `).join('')}\n${after}`


        return { addedMethods, tests, beforeAll, afterAll }
    }).reduce((acc, i) => {
        acc.addedMethods = [...acc.addedMethods, ...i.addedMethods]
        acc.beforeAll = [...acc.beforeAll, ...i.beforeAll]
        acc.afterAll = [...acc.afterAll, ...i.afterAll]
        acc.tests = [...acc.tests, ...i.tests]
        return acc
    }, { addedMethods: [], tests: [], beforeAll: [], afterAll: [] })

    testFunc.setBodyText(`let sum = 0;\n${addedMethods.join('')}\n${beforeAll.join('')}\n${tests.join('')}\n${afterAll.join('')};
    return sum`)

    // add text to end of file
    testFile.addStatements(`test().then(i => { process.exit(i) });`)

    testFile.saveSync()

    // run the file 
    const { stdout, stderr } = await import(url.pathToFileURL(tmp))
}

const cwd = url.pathToFileURL(process.cwd()).href


const tagTypes = [
    'test',
    'pineapple_import',
    'beforeAll',
    'afterAll',
    'before',
    'after',
    'beforeEach',
    'afterEach'
]

function getFunctions(file, fileText, fileName) {
    const dec = file.getVariableDeclarations().map(i => {
        const text = i.getText();

        const tags = [];

        if (!text.includes('=>') && !text.includes('function')) return null;

        let current = i.getStartLineNumber() - 2;

        // check if previous line has a comment ender
        if (fileText[current].includes('*/')) {
            // crawl up until you see comment begin
            while (current > 0 && !fileText[current].includes('/*')) {
                current--;
                for (const type of tagTypes) {
                    if (fileText[current].includes(`@${type}`))
                        tags.push(
                            { 
                                type, 
                                text: fileText[current].split(`@${type}`)[1].trim() 
                            }
                        );
                }
            }
        }

        tags.reverse();
        return {
            tags,
            name: i.getName(),
            exported: i.isExported(),
            fileName,
            relativePath: fileName.startsWith(cwd) ? fileName.substring(cwd.length + 1) : ''
        };
    }).filter(i => i);

    

   const exports = file.getStatements().filter(i => {
        // expression statement
        return (i.getKindName() === 'ExpressionStatement' && (i.getText().trim().includes('module.exports') || i.getText().trim().startsWith('exports.'))) || (i.getKindName() === 'ExportDeclaration')
   }).map(i => i.getText().trim()).reduce((exports, statement) => {
    const [ex, right] = statement.replace(';', '').split(/=|export /).map(i=>i.trim())
    
    if (ex === 'module.exports') {
        if (right.includes('{')) {
            right.substring(1, right.length - 1).trim().split(',').forEach(i => {
                if(i.includes(':')) {
                    const [key, value] = i.split(':').map(i => i.trim())
                    if (/^[A-Za-z$_][A-Za-z$_0-9]+$/.test(key)) exports[key] = value
                }
                else exports[i.trim()] = i.trim()
            })
        }
        else {
            // support module.exports = func at some point
        }
    }

    if (!ex) {
        if (right.includes('{')) {
            right.substring(1, right.length - 1).trim().split(',').forEach(i => {
                if(i.includes(':')) {
                    const [key, value] = i.split(':').map(i => i.trim())
                    if (/^[A-Za-z$_][A-Za-z$_0-9]+$/.test(key)) exports[key] = value
                }
                else exports[i] = i
            })
        }
    }

    if (ex.startsWith('exports.')) {
        const key = ex.split('.')[1]
        if (/^[A-Za-z$_][A-Za-z$_0-9]+$/.test(key)) exports[key] = right
    }

    return exports
   }, {})


    const functions = [...dec, ...file.getFunctions().map(i => [i.getName(), i.getJsDocs().flatMap(i => i.getTags()), i.getExportKeyword()]
    ).map(item => {
        const tags = item[1].filter(i => tagTypes.includes(i.getTagName()))
            .map(tag => {
                const tagName = tag.getTagName()
                return { type: tagName, text: fileText[tag.getStartLineNumber() - 1].split(`@${tagName}`)[1].trim() }
            });

        return {
            name: item[0],
            tags,
            exported: Boolean(item[2]),
            fileName,
            relativePath: fileName.startsWith(cwd) ? fileName.substring(cwd.length + 1) : ''
        };
    })].filter(i => {
        if (!i.tags.length)
            return false;
        
            if (!i.exported) {
                if(exports[i.name]) {
                    i.originalName = i.name
                    i.name = exports[i.name]
                    return true
                }
                else console.log(logSymbols.warning, `Function "${i.name}" is not exported from ${i.fileName}, skipping its tests.`);
            }
        return i.exported;
    });

    return functions;
}

main()
