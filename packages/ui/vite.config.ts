import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'OrangeUI',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'orange-ui.js' : 'orange-ui.cjs'),
      cssFileName: 'styles',
    },
    cssCodeSplit: false,
    sourcemap: true,
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', '@floating-ui/react-dom'],
      output: {
        globals: { react: 'React', 'react-dom': 'ReactDOM' },
      },
    },
  },
})
