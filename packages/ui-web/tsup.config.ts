import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/variants/index.ts', 'src/theme/theme-script.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom'],
});
