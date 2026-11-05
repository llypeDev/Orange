#!/usr/bin/env node
// Servidor estático mínimo (sem dependências) para o Storybook já construído.
// Usado pelo `webServer` do Playwright: `node serve.mjs <porta> <pasta>`.
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { dirname, extname, join, normalize, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = process.argv[3]
  ? resolve(process.argv[3])
  : join(dirname(fileURLToPath(import.meta.url)), '../../apps/storybook/storybook-static')
const port = Number(process.argv[2] ?? 6007)

if (!existsSync(join(root, 'index.json'))) {
  console.error(
    `Storybook estático não encontrado em ${root}. Rode \`pnpm build:storybook\` antes.`,
  )
  process.exit(1)
}

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
}

createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname)
  let file = normalize(join(root, pathname))
  if (file !== root && !file.startsWith(root + sep)) {
    res.writeHead(403).end()
    return
  }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html')
  if (!existsSync(file)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found')
    return
  }
  res.writeHead(200, {
    'Content-Type': types[extname(file).toLowerCase()] ?? 'application/octet-stream',
    'Cache-Control': 'no-store',
  })
  createReadStream(file).pipe(res)
}).listen(port, '127.0.0.1', () => {
  console.log(`Storybook estático em http://127.0.0.1:${port}`)
})
