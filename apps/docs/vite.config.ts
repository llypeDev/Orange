import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  base: process.env.DOCS_BASE ?? '/',
  server: { port: 5173 },
  preview: { port: 4173 },
  build: {
    chunkSizeWarningLimit: 1200,
  },
})
