
/**
 * @pineapple_define Annotations
 */
export function AnnotationTests () {
  return {
    Multiple: `
        const z = {
            x: 1 
        } // ? @.x

        const y = 7; // ?
        const x = 5 // ?

        Math.max(1, 2, 3) // ?
          `
  }
}

// For now, the transpiler will fail if a "// ?" is contained in a string
const trap = '// ?'
AnnotationTests(trap)
