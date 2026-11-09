// Publica o skill orange-ui no site, para qualquer IA (roda no fim do build da documentação):
//
// - /llms.txt          índice no formato llmstxt.org: o que é o Orange e links para cada .md;
// - /llms-full.txt     tudo num arquivo só (skill + referências), para colar ou anexar;
// - /llms/orange-ui/   o skill como arquivos .md (SKILL.md + references/), com os links relativos;
// - /llms/orange-ui.zip  o mesmo skill compactado, para ferramentas que recebem skills por upload.
//
// A fonte é skills/orange-ui (SKILL.md escrito à mão; references/ gerado por `pnpm gen:ai`).
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { crc32, deflateRawSync } from 'node:zlib'

const docsRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = join(docsRoot, '../..')
const skillDir = join(repoRoot, 'skills/orange-ui')
const dist = join(docsRoot, 'dist')
const site = (process.env.DOCS_SITE_URL || 'https://orange.llypedev.com.br').replace(/\/+$/, '')
const base = process.env.DOCS_BASE ?? '/'
const url = (path) => `${site}${base}${path.replace(/^\//, '')}`

if (!existsSync(join(skillDir, 'SKILL.md'))) {
  console.error('skills/orange-ui/SKILL.md não encontrado.')
  process.exit(1)
}

/** Arquivos do skill (caminho relativo → conteúdo), em ordem estável. */
function walk(dir, prefix = '') {
  return readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) =>
      entry.isDirectory()
        ? walk(join(dir, entry.name), `${prefix}${entry.name}/`)
        : [[`${prefix}${entry.name}`, readFileSync(join(dir, entry.name))]],
    )
}
const files = walk(skillDir).filter(([path]) => path.endsWith('.md'))
const text = (path) => files.find(([p]) => p === path)?.[1].toString('utf8') ?? ''
const titleOf = (path) => (text(path).match(/^# (.+)$/m)?.[1] ?? path).trim()
const skillUrl = (path) => url(`llms/orange-ui/${path}`)

// 1) O skill em arquivos soltos.
for (const [path, content] of files) {
  const target = join(dist, 'llms/orange-ui', path)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, content)
}

// 2) O skill compactado (zip com a pasta orange-ui/ na raiz). Datas fixas: o zip sai igual a
//    cada build.
function zip(entries) {
  const locals = []
  const centrals = []
  let offset = 0
  for (const [name, data] of entries) {
    const nameBuf = Buffer.from(name, 'utf8')
    const compressed = deflateRawSync(data, { level: 9 })
    const crc = crc32(data)
    const local = Buffer.alloc(30)
    local.writeUInt32LE(0x04034b50, 0)
    local.writeUInt16LE(20, 4) // versão necessária
    local.writeUInt16LE(0x0800, 6) // nomes em UTF-8
    local.writeUInt16LE(8, 8) // deflate
    local.writeUInt16LE(0, 10) // hora
    local.writeUInt16LE(0x21, 12) // data: 1980-01-01
    local.writeUInt32LE(crc, 14)
    local.writeUInt32LE(compressed.length, 18)
    local.writeUInt32LE(data.length, 22)
    local.writeUInt16LE(nameBuf.length, 26)
    locals.push(local, nameBuf, compressed)
    const central = Buffer.alloc(46)
    central.writeUInt32LE(0x02014b50, 0)
    central.writeUInt16LE(20, 4)
    central.writeUInt16LE(20, 6)
    central.writeUInt16LE(0x0800, 8)
    central.writeUInt16LE(8, 10)
    central.writeUInt16LE(0, 12)
    central.writeUInt16LE(0x21, 14)
    central.writeUInt32LE(crc, 16)
    central.writeUInt32LE(compressed.length, 20)
    central.writeUInt32LE(data.length, 24)
    central.writeUInt16LE(nameBuf.length, 28)
    central.writeUInt32LE(offset, 42)
    centrals.push(central, nameBuf)
    offset += local.length + nameBuf.length + compressed.length
  }
  const directory = Buffer.concat(centrals)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0)
  end.writeUInt16LE(entries.length, 8)
  end.writeUInt16LE(entries.length, 10)
  end.writeUInt32LE(directory.length, 12)
  end.writeUInt32LE(offset, 16)
  return Buffer.concat([...locals, directory, end])
}
writeFileSync(
  join(dist, 'llms/orange-ui.zip'),
  zip(files.map(([path, data]) => [`orange-ui/${path}`, data])),
)

// 3) llms.txt — índice (https://llmstxt.org).
const components = [
  ...text('references/components.md').matchAll(
    /^- \*\*(\w+)\*\*(?: _\([^)]+\)_)? — (.+) → `(components\/[a-z0-9-]+\.md)`$/gm,
  ),
].map((m) => ({ name: m[1], description: m[2], path: `references/${m[3]}` }))

const guide = (slug) => `references/guides/${slug}.md`
const usageGuides = ['theme', 'styles', 'i18n', 'versioning']
const designGuides = [
  'accessibility',
  'color',
  'typography',
  'grid',
  'iconography',
  'motion',
  'data-visualization',
]
const templates = files.map(([p]) => p).filter((p) => p.startsWith('references/templates/'))
const link = (path, description) =>
  `- [${titleOf(path).replace(/^Modelo: /, '')}](${skillUrl(path)})${description ? `: ${description}` : ''}`

const llms = [
  '# Orange Design System',
  '',
  `> Design system React 19 + TypeScript, open source (@orangesys/ui e @orangesys/tokens): ${components.length} componentes acessíveis (WCAG 2.2 AA), quatro temas (escuro, claro e alto contraste) por tokens CSS e mensagens internas em PT-BR e EN. Estes arquivos são a referência para IAs: props geradas do código, boas práticas, acessibilidade e exemplos que funcionam.`,
  '',
  `Comece pelo [skill orange-ui](${skillUrl('SKILL.md')}): configuração, como escolher componentes, convenções da API, estilo com tokens e regras de acessibilidade. Antes de usar um componente, leia o arquivo dele abaixo — não invente props. Instale com \`npm install @orangesys/ui\`. Tudo num arquivo: [llms-full.txt](${url('llms-full.txt')}). O skill para instalar numa ferramenta de IA: [orange-ui.zip](${url('llms/orange-ui.zip')}). Referência em português; a documentação também existe em inglês em ${url('en/')}.`,
  '',
  '## Comece aqui',
  '',
  `- [Skill orange-ui](${skillUrl('SKILL.md')}): como trabalhar, configuração, "Preciso de… → use", convenções, estilo, acessibilidade e checklist`,
  link(guide('getting-started'), 'instalação, estilos, fontes, OrangeProvider, Next.js e SSR'),
  link(
    'references/foundations.md',
    'OrangeProvider, Field, Heading/Text/Eyebrow, Icon, Portal e utilitários',
  ),
  link(
    'references/tokens.md',
    'variáveis CSS --or-* (cores semânticas nos quatro temas e escalas)',
  ),
  link('references/hooks.md', 'os hooks exportados, com assinatura, parâmetros e exemplos'),
  link('references/icons.md', 'nomes dos ícones e como usar o Icon'),
  '',
  `## Componentes (${components.length})`,
  '',
  ...components.map((c) => `- [${c.name}](${skillUrl(c.path)}): ${c.description}`),
  '',
  '## Modelos de página',
  '',
  ...templates.map((p) =>
    link(p, 'código completo, componentes usados e decisões de acessibilidade'),
  ),
  '',
  '## Usando',
  '',
  ...usageGuides.map((slug) => link(guide(slug))),
  '',
  '## Optional',
  '',
  ...designGuides.map((slug) => link(guide(slug), 'diretrizes de design')),
  `- [Documentação (site)](${url('pt/')}): páginas com exemplos ao vivo, em PT e EN`,
  `- [Storybook](${url('storybook/')}): estados de cada componente`,
  '- [Código no GitHub](https://github.com/llypeDev/Orange): monorepo; para trabalhar nele, leia o AGENTS.md',
  '',
].join('\n')
writeFileSync(join(dist, 'llms.txt'), llms)

// 4) llms-full.txt — o skill e as referências em sequência, na ordem de leitura.
const order = [
  'SKILL.md',
  guide('getting-started'),
  'references/foundations.md',
  'references/tokens.md',
  'references/icons.md',
  'references/hooks.md',
  'references/components.md',
  ...components.map((c) => c.path),
  ...templates,
  ...usageGuides.map(guide),
  ...designGuides.map(guide),
]
const seen = new Set()
const parts = []
for (const path of [...order, ...files.map(([p]) => p)]) {
  if (seen.has(path) || !files.some(([p]) => p === path)) continue
  seen.add(path)
  const content = text(path).replace(/^---\n[\s\S]*?\n---\n+/, '') // sem o frontmatter do skill
  parts.push(`<!-- ${path} — ${skillUrl(path)} -->\n\n${content.trim()}\n`)
}
writeFileSync(
  join(dist, 'llms-full.txt'),
  `# Orange Design System — referência completa para IAs\n\nGerado de ${skillUrl('SKILL.md')} (índice: ${url('llms.txt')}).\n\n${parts.join('\n---\n\n')}`,
)

console.log(
  `llms.txt (${components.length} componentes), llms-full.txt e o skill orange-ui (${files.length} arquivos + zip) publicados.`,
)
