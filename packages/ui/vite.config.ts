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
    // Sem sourcemaps e sem encurtar nomes: o dist sai legível (nomes originais), quem depura lê o
    // código direto, e o pacote no npm encolhe (os mapas eram 4,1 dos 6,4 MB). O projeto de quem
    // usa minifica no próprio build — o custo final no navegador não muda (`pnpm size`).
    sourcemap: false,
    minify: false,
    // O CSS continua minificado: o styles.css é importado direto e não passa por esta etapa de novo.
    cssMinify: true,
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
