import esbuild from 'esbuild'

/**
 * It takes a file path, transpiles it to JavaScript, and returns the file path to the transpiled file
 * @param input - The file to transpile
 * @returns A URL to the transpiled file.
 */
export async function transpile (input, file) {
  /* Transpiling the file to JavaScript. */
  await esbuild.build({
    entryPoints: [input],
    outfile: file,
    sourcemap: 'inline',
    bundle: true,
    nodePaths: [''],
    format: 'esm',
    packages: 'external'
  })

  return file
}
