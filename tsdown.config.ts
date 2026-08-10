import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: ['index.ts'],
    format: 'cjs',
    outDir: 'dist/cjs',
    dts: true,
    sourcemap: true,
    target: 'es2020',
    minify: false,
    treeshake: true,
    clean: true,
    deps: {
      neverBundle: true,
    },
  },

  {
    entry: ['index.ts'],
    format: 'esm',
    outDir: 'dist/esm',
    dts: true,
    sourcemap: true,
    target: 'es2020',
    minify: false,
    treeshake: true,
    clean: false,
    deps: {
      neverBundle: true,
    },
  },
])
