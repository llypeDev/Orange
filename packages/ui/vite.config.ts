import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      // Um arquivo por módulo (preserveModules): com `sideEffects: ["*.css"]`, o bundler de quem
      // usa descarta os módulos que não são importados. Num arquivo único, chamadas de topo como
      // forwardRef(...) seguravam a biblioteca inteira — importar só o Button trazia ~147 KB gzip.
      fileName: (format, entryName) =>
        format === 'es' ? `esm/${entryName}.js` : `cjs/${entryName}.cjs`,
      cssFileName: 'styles',
    },
    cssCodeSplit: false,
    sourcemap: true,
    rollupOptions: {
      // Dependências declaradas ficam de fora (o @orangesys/tokens sai na mesma versão do ui).
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@floating-ui/react-dom',
        /^@orangesys\/tokens(\/.*)?$/,
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        exports: 'named',
      },
    },
  },
})
