// Gera um HTML por rota da documentação (dist/<lang>/<rota>.html e dist/<lang>/<rota>/index.html).
//
// Sem isso, o GitHub Pages só conhece o index.html da raiz: qualquer link direto (/pt/,
// /pt/components/select…) caía no 404.html — a página abria (o app roda no 404.html), mas com
// status HTTP 404, o que tira as páginas da busca, quebra prévias de link e acusa erro em
// monitores. Cada arquivo é o index.html do build com título, descrição, idioma, canonical,
// Open Graph e alternativas hreflang próprios da rota; o app carrega igual.
//
// Com DOCS_SITE_URL (URL absoluta do site, ex.: https://orange.llypedev.com.br), também gera
// sitemap.xml e robots.txt. O 404.html continua servindo rotas desconhecidas — agora com 404 de
// verdade.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const siteUrl = (process.env.DOCS_SITE_URL ?? '').replace(/\/+$/, '')
const SITE = 'Orange Design System'
const langs = { pt: 'pt-BR', en: 'en' }
const siteDescription = {
  pt: 'Orange — design system open source, acessível (WCAG 2.2 AA) e customizável, feito com React e TypeScript.',
  en: 'Orange — open source, accessible (WCAG 2.2 AA) and customizable design system, built with React and TypeScript.',
}

// nav.ts e o registro usam import.meta.glob e imports do app: o Vite os carrega como no build.
const vite = await createServer({
  root,
  logLevel: 'error',
  server: { middlewareMode: true },
  appType: 'custom',
})
let staticPages, componentMetas
try {
  ;({ allStaticPages: staticPages } = await vite.ssrLoadModule('/src/nav.ts'))
  ;({ componentMetas } = await vite.ssrLoadModule('/src/content/registry.ts'))
} finally {
  await vite.close()
}

/** Rotas sem o prefixo de idioma, com título e descrição por idioma. */
const routes = [
  { path: '', title: { pt: SITE, en: SITE }, description: siteDescription },
  ...staticPages.map((page) => ({
    path: page.path,
    title: { pt: `${page.label.pt} · ${SITE}`, en: `${page.label.en} · ${SITE}` },
    description: siteDescription,
  })),
  ...componentMetas.map((meta) => ({
    path: `/components/${meta.slug}`,
    title: { pt: `${meta.name} · ${SITE}`, en: `${meta.name} · ${SITE}` },
    description: meta.description,
  })),
]
// /components redireciona (no app) para a visão geral: mesmo conteúdo, canonical da visão geral.
const overview = routes.find((r) => r.path === '/components/overview')
if (overview) routes.push({ ...overview, path: '/components', canonical: '/components/overview' })

const escape = (text) =>
  String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const template = readFileSync(join(dist, 'index.html'), 'utf8')
const base = process.env.DOCS_BASE ?? '/'
const urlFor = (lang, path) => `${siteUrl}${base}${lang}${path || '/'}`

function render(route, lang) {
  const title = escape(route.title[lang])
  const description = escape(route.description[lang])
  const canonicalPath = route.canonical ?? route.path
  const absolute = siteUrl
    ? [
        `<link rel="canonical" href="${urlFor(lang, canonicalPath)}" />`,
        ...Object.keys(langs).map(
          (l) =>
            `<link rel="alternate" hreflang="${langs[l]}" href="${urlFor(l, canonicalPath)}" />`,
        ),
        `<meta property="og:url" content="${urlFor(lang, canonicalPath)}" />`,
      ]
    : []
  const head = [
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SITE}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:locale" content="${langs[lang].replace('-', '_')}" />`,
    ...absolute,
  ].join('\n    ')
  return template
    .replace(/<html lang="[^"]*"/, `<html lang="${langs[lang]}"`)
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${description}" />\n    ${head}`,
    )
}

let files = 0
const write = (file, html) => {
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
  files++
}
for (const lang of Object.keys(langs)) {
  for (const route of routes) {
    const html = render(route, lang)
    if (route.path === '') {
      write(join(dist, lang, 'index.html'), html)
    } else {
      // /pt/usage/hooks → pt/usage/hooks.html (sem barra) e pt/usage/hooks/index.html (com barra).
      write(join(dist, lang, `${route.path}.html`), html)
      write(join(dist, lang, route.path, 'index.html'), html)
    }
  }
}

if (siteUrl) {
  const urls = Object.keys(langs).flatMap((lang) =>
    routes
      .filter((r) => !r.canonical)
      .map((r) => `  <url><loc>${urlFor(lang, r.path)}</loc></url>`),
  )
  writeFileSync(
    join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
  )
  writeFileSync(
    join(dist, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}${base}sitemap.xml\n`,
  )
}

console.log(
  `${files} páginas de rota geradas (${routes.length} rotas × ${Object.keys(langs).length} idiomas)` +
    (siteUrl ? ' + sitemap.xml e robots.txt.' : '. Sem DOCS_SITE_URL: sem canonical/sitemap.'),
)
