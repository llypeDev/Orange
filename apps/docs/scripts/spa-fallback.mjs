// Copia dist/index.html para dist/404.html: hosts estáticos (GitHub Pages,
// Netlify, etc.) servem o app para qualquer rota do client-side router.
import { copyFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
if (existsSync(join(dist, 'index.html'))) {
  copyFileSync(join(dist, 'index.html'), join(dist, '404.html'))
  console.log('404.html criado para fallback de SPA.')
}
