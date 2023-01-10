---
sidebar_position: 6
---

# Customizing Transpilation

Starting in v0.16.0, Pineapple has implemented the ability to pull source a custom transpiler function for running your code. While this is not necessary for most projects (Pineapple should be able to run TypeScript and React out of the box), it might be necessary if your project uses numerous plugins, or belongs to Svelte / similar.

By tagging a function with `@pineapple_transpile`, you can define a transpiler for a given glob of files.

A simple example is the following:

```js
/**
 * Transpiles Flow files to JavaScript, the weakness of this implementation is that it doesn't support
 * bundling, so it doesn't work with other flow files. It would be better to use the esbuild flow plugin. 
 * Pineapple expects all transpilation functions to export a bundle.
 * @pineapple_transpile ['*.flow.js']
 * @param {string} file
 * @param {string} recommended
 */
export async function transpileFlow (file, recommended) {
  const output = flowRemoveTypes(await fs.readFile(file, { encoding: 'utf-8' }))
  const map = output.generateMap()
  map.sources = [file]
  await fs.writeFile(
    recommended,
    `${output.toString()}\n//# sourceMappingURL=data:application/json;base64,${Buffer.from(JSON.stringify(map)).toString('base64')}`
  )
  return recommended
}
```

You can now chain Pineapple to Babel, ESBuild, Rollup, or any other build system to allow you to build and transpile your files for testing.

The function receives two arguments, the first being the file that needs transpiled, and the second being a recommended file to output to. You can ignore the second argument and return any path that you'd like.

It is expected that your transpiler function handles any necessary bundling.
