import { Button, Eyebrow, Heading, Icon, Text } from '@orange/ui'
import { T, useLang } from '../../i18n'
import { Bullets, Callout, Code, CodeBlock, DefinitionTable, DocPage, Example, PropsTable, Prose, Section } from '../../kit'
import { REPO_URL, STORYBOOK_URL } from '../registry'
import { Cards, Checklist, CodeTabs, Steps, TableWrap } from './_shared/Blocks'

const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap'

const fontsHtml = `<!-- index.html, dentro de <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="${FONTS_URL}" />`

const mainTsx = `// src/main.tsx
import '@orange/ui/styles.css'
import { OrangeProvider } from '@orange/ui'
import { createRoot } from 'react-dom/client'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <OrangeProvider defaultTheme="dark" locale="pt-BR">
    <App />
  </OrangeProvider>,
)`

const firstComponent = `import { Button, Eyebrow, Heading, Icon, Text } from '@orange/ui'

export function BoasVindas() {
  return (
    <section>
      <Eyebrow marker>Conta criada</Eyebrow>
      <Heading level={3} size="2xl">Bem-vinda ao painel, Marina</Heading>
      <Text tone="muted">Conecte sua loja para importar pedidos e estoque.</Text>
      <Button endIcon={<Icon name="arrow-right" />}>Conectar loja</Button>
    </section>
  )
}`

const nextProviders = `// app/providers.tsx
'use client'

import { OrangeProvider } from '@orange/ui'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <OrangeProvider defaultTheme="system" locale="pt-BR">
      {children}
    </OrangeProvider>
  )
}`

const nextLayout = `// app/layout.tsx
import '@orange/ui/styles.css'
import { Providers } from './providers'

// Aplica o tema salvo antes da hidratação — evita o "flash" de tema errado.
const themeScript = \`try {
  var t = localStorage.getItem('tema');
  if (t !== 'light' && t !== 'dark') {
    t = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  document.documentElement.setAttribute('data-theme', t);
} catch (e) {}\`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}`

const tokensOnlyCss = `/* Qualquer stack: Vue, Svelte, Astro, HTML puro… */
@import '@orange/tokens/tokens.css';

.cartao {
  padding: var(--or-space-6);
  border: 1px solid var(--or-color-border);
  background: var(--or-color-surface-raised);
  color: var(--or-color-text);
  font-family: var(--or-font-body);
}

.cartao__titulo {
  font-family: var(--or-font-display);
  font-size: var(--or-text-xl);
  letter-spacing: var(--or-tracking-heading);
}`

const tokensOnlyTs = `import { breakpoints, motion, themes } from '@orange/tokens'
import { contrastRatio } from '@orange/tokens/contrast'

themes.dark.accent            // '#f58549'
breakpoints.lg                // '1024px'
motion.duration.fast          // '160ms'
contrastRatio(themes.light['text-on-accent'], themes.light.accent) // 5.08`

const tree = `orange/
├── packages/
│   ├── tokens/        @orange/tokens — fonte única dos tokens
│   │   ├── src/index.ts       primitives, themes, typography, space…
│   │   ├── src/contrast.ts    contrastRatio(), wcagLevel()
│   │   └── css/tokens.css     gerado — não edite à mão
│   └── ui/            @orange/ui — componentes, hooks, ícones, providers
│       └── src/
│           ├── components/<Nome>/   .tsx · .css · .test.tsx · .stories.tsx
│           ├── hooks/               useDisclosure, useFocusTrap…
│           ├── icons/               <Icon /> + paths.tsx
│           ├── providers/           OrangeProvider, mensagens pt-BR/en-US
│           └── styles/              index.css, base.css
├── apps/
│   ├── docs/          este site (Vite + React Router, PT/EN)
│   └── storybook/     Storybook 9 + addon de acessibilidade
└── scripts/           gen-index.mjs, merge-storybook.mjs`

export default function GettingStarted() {
  const { t } = useLang()
  return (
    <DocPage
      eyebrow={{ pt: 'Primeiros passos', en: 'First steps' }}
      title={{ pt: 'Começando', en: 'Getting started' }}
      lead={{
        pt: 'Instale o Orange, importe os estilos, envolva a aplicação no OrangeProvider e renderize o primeiro componente. Leva cerca de cinco minutos.',
        en: 'Install Orange, import the styles, wrap your app in OrangeProvider and render your first component. It takes about five minutes.',
      }}
    >
      <Section title={{ pt: 'Requisitos', en: 'Requirements' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'React', en: 'React' },
              description: {
                pt: <>18.2 ou superior (desenvolvido e testado com React 19). <Code>react</Code> e <Code>react-dom</Code> são peer dependencies.</>,
                en: <>18.2 or later (developed and tested with React 19). <Code>react</Code> and <Code>react-dom</Code> are peer dependencies.</>,
              },
            },
            {
              term: { pt: 'TypeScript', en: 'TypeScript' },
              description: {
                pt: 'Opcional. Os tipos acompanham o pacote; recomendamos o modo strict e moduleResolution "Bundler".',
                en: 'Optional. Types ship with the package; we recommend strict mode and moduleResolution "Bundler".',
              },
            },
            {
              term: { pt: 'Empacotador', en: 'Bundler' },
              description: {
                pt: 'Qualquer um que importe CSS a partir de JavaScript: Vite, Next.js, Remix, webpack, Parcel, Rsbuild.',
                en: 'Anything that imports CSS from JavaScript: Vite, Next.js, Remix, webpack, Parcel, Rsbuild.',
              },
            },
            {
              term: { pt: 'Navegadores', en: 'Browsers' },
              description: {
                pt: 'As duas últimas versões de Chrome, Edge, Firefox e Safari (usamos :focus-visible, :where() e color-mix()).',
                en: 'The last two versions of Chrome, Edge, Firefox and Safari (we rely on :focus-visible, :where() and color-mix()).',
              },
            },
            {
              term: { pt: 'Node.js', en: 'Node.js' },
              description: {
                pt: <>20 ou superior — necessário apenas para desenvolver o próprio monorepo (<Code>pnpm@10</Code>).</>,
                en: <>20 or later — only needed to work on the monorepo itself (<Code>pnpm@10</Code>).</>,
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Instalação', en: 'Installation' }}>
        <Prose>
          <p>
            <T
              pt={<>O pacote <Code>@orange/ui</Code> traz os componentes, hooks, ícones e providers. Ele já depende de <Code>@orange/tokens</Code>, então não é preciso instalar os dois.</>}
              en={<>The <Code>@orange/ui</Code> package ships components, hooks, icons and providers. It already depends on <Code>@orange/tokens</Code>, so you don't need to install both.</>}
            />
          </p>
        </Prose>
        <CodeTabs
          label={{ pt: 'Gerenciador de pacotes', en: 'Package manager' }}
          tabs={[
            { id: 'pnpm', label: 'pnpm', code: 'pnpm add @orange/ui' },
            { id: 'npm', label: 'npm', code: 'npm install @orange/ui' },
            { id: 'yarn', label: 'yarn', code: 'yarn add @orange/ui' },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Configuração em quatro passos', en: 'Setup in four steps' }}>
        <Steps
          items={[
            {
              title: { pt: 'Importe os estilos uma única vez', en: 'Import the styles once' },
              content: (
                <>
                  <p>
                    <T
                      pt={<>No ponto de entrada da aplicação. O arquivo inclui os tokens (<Code>tokens.css</Code>) e a base (<Code>base.css</Code>): reset leve, foco visível, utilitários e animações. O CSS de cada componente entra junto com o componente.</>}
                      en={<>In your app entry point. The file includes the tokens (<Code>tokens.css</Code>) and the base (<Code>base.css</Code>): a light reset, visible focus, utilities and keyframes. Each component's CSS comes with the component.</>}
                    />
                  </p>
                  <CodeBlock code={`import '@orange/ui/styles.css'`} language="ts" title="main.tsx" />
                </>
              ),
            },
            {
              title: { pt: 'Carregue as fontes', en: 'Load the fonts' },
              content: (
                <>
                  <p>
                    <T
                      pt="Space Grotesk (títulos e rótulos), Inter (texto) e JetBrains Mono (código). Sem elas, os tokens caem em fontes do sistema — funciona, mas perde a voz do Orange."
                      en="Space Grotesk (headings and labels), Inter (body) and JetBrains Mono (code). Without them the tokens fall back to system fonts — it works, but loses Orange's voice."
                    />
                  </p>
                  <CodeBlock code={fontsHtml} language="html" title="index.html" />
                </>
              ),
            },
            {
              title: { pt: 'Envolva a aplicação no OrangeProvider', en: 'Wrap your app in OrangeProvider' },
              content: (
                <>
                  <p>
                    <T
                      pt={<>Ele aplica <Code>data-theme</Code> no <Code>&lt;html&gt;</Code> e fornece as mensagens internas (rótulos como “Fechar” e “Próxima página”) no idioma escolhido.</>}
                      en={<>It sets <Code>data-theme</Code> on <Code>&lt;html&gt;</Code> and provides the internal messages (labels such as “Close” and “Next page”) in the chosen language.</>}
                    />
                  </p>
                  <CodeBlock code={mainTsx} language="tsx" title="main.tsx" />
                </>
              ),
            },
            {
              title: { pt: 'Use os componentes', en: 'Use the components' },
              content: (
                <p>
                  <T
                    pt={<>Importe pelo nome a partir de <Code>@orange/ui</Code>. Todos os exports são nomeados e o pacote é tree-shakeable.</>}
                    en={<>Import by name from <Code>@orange/ui</Code>. Every export is named and the package is tree-shakeable.</>}
                  />
                </p>
              ),
            },
          ]}
        />
        <PropsTable
          caption={{ pt: 'Props do OrangeProvider', en: 'OrangeProvider props' }}
          rows={[
            { name: 'defaultTheme', type: "'dark' | 'light' | 'system'", default: "'dark'", description: { pt: 'Tema inicial (não controlado).', en: 'Initial theme (uncontrolled).' } },
            { name: 'theme', type: "'dark' | 'light' | 'system'", description: { pt: 'Tema controlado. Use com onThemeChange.', en: 'Controlled theme. Use with onThemeChange.' } },
            { name: 'onThemeChange', type: '(theme) => void', description: { pt: 'Chamado quando setTheme() é usado.', en: 'Called when setTheme() is used.' } },
            { name: 'themeTarget', type: "'document' | 'scoped'", default: "'document'", description: { pt: <>Onde aplicar <Code>data-theme</Code>: no <Code>&lt;html&gt;</Code> ou em um <Code>&lt;div&gt;</Code> que envolve os filhos.</>, en: <>Where to set <Code>data-theme</Code>: on <Code>&lt;html&gt;</Code> or on a <Code>&lt;div&gt;</Code> wrapping the children.</> } },
            { name: 'locale', type: "'pt-BR' | 'en-US' | string", default: "'pt-BR'", description: { pt: 'Idioma das mensagens internas.', en: 'Language of the internal messages.' } },
            { name: 'messages', type: 'Partial<Messages>', description: { pt: 'Sobrescreve mensagens específicas.', en: 'Overrides specific messages.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Seu primeiro componente', en: 'Your first component' }}>
        <Example
          description={{
            pt: 'Tipografia e botão da base, já com os tokens do tema. Alterne entre Escuro e Claro na barra da prévia.',
            en: 'Base typography and button, already themed by the tokens. Switch between Dark and Light in the preview bar.',
          }}
          code={firstComponent}
          align="stretch"
        >
          <section className="guide-stack" style={{ maxWidth: '34rem' }}>
            <Eyebrow marker>{t({ pt: 'Conta criada', en: 'Account created' })}</Eyebrow>
            <Heading level={3} size="2xl">
              {t({ pt: 'Bem-vinda ao painel, Marina', en: 'Welcome to your dashboard, Marina' })}
            </Heading>
            <Text tone="muted">
              {t({ pt: 'Conecte sua loja para importar pedidos e estoque.', en: 'Connect your store to import orders and inventory.' })}
            </Text>
            <div>
              <Button endIcon={<Icon name="arrow-right" />}>{t({ pt: 'Conectar loja', en: 'Connect store' })}</Button>
            </div>
          </section>
        </Example>
      </Section>

      <Section title={{ pt: 'Next.js e SSR', en: 'Next.js and SSR' }}>
        <Prose>
          <p>
            <T
              pt={<>Os componentes não acessam <Code>window</Code> nem <Code>document</Code> durante a renderização, e portais só montam no cliente (<Code>useMounted</Code>). No App Router, o <Code>OrangeProvider</Code> usa estado e contexto, então fica em um componente cliente:</>}
              en={<>Components don't touch <Code>window</Code> or <Code>document</Code> while rendering, and portals only mount on the client (<Code>useMounted</Code>). In the App Router, <Code>OrangeProvider</Code> uses state and context, so it lives in a client component:</>}
            />
          </p>
        </Prose>
        <CodeBlock code={nextProviders} language="tsx" title="app/providers.tsx" />
        <CodeBlock code={nextLayout} language="tsx" title="app/layout.tsx" />
        <Callout tone="info" title={{ pt: 'Por que o script inline?', en: 'Why the inline script?' }}>
          <p>
            <T
              pt={<>No servidor não existe <Code>prefers-color-scheme</Code> nem <Code>localStorage</Code>. O script define <Code>data-theme</Code> antes da primeira pintura; <Code>suppressHydrationWarning</Code> evita o aviso de atributo diferente entre servidor e cliente.</>}
              en={<>The server knows neither <Code>prefers-color-scheme</Code> nor <Code>localStorage</Code>. The script sets <Code>data-theme</Code> before the first paint; <Code>suppressHydrationWarning</Code> silences the server/client attribute mismatch.</>}
            />
          </p>
        </Callout>
      </Section>

      <Section title={{ pt: 'Usando apenas os tokens', en: 'Using only the tokens' }}>
        <Prose>
          <p>
            <T
              pt={<>Não usa React? <Code>@orange/tokens</Code> funciona sozinho. O CSS expõe tudo como custom properties <Code>--or-*</Code>, com os temas em <Code>[data-theme='dark']</Code> e <Code>[data-theme='light']</Code>; o TypeScript expõe os mesmos valores como objetos.</>}
              en={<>Not using React? <Code>@orange/tokens</Code> works on its own. The CSS exposes everything as <Code>--or-*</Code> custom properties, with themes under <Code>[data-theme='dark']</Code> and <Code>[data-theme='light']</Code>; TypeScript exposes the same values as objects.</>}
            />
          </p>
        </Prose>
        <CodeTabs
          label={{ pt: 'Formas de consumir os tokens', en: 'Ways to consume the tokens' }}
          tabs={[
            { id: 'css', label: 'CSS', code: tokensOnlyCss, language: 'css', title: 'styles.css' },
            { id: 'ts', label: 'TypeScript', code: tokensOnlyTs, language: 'ts', title: 'tokens.ts' },
            { id: 'install', label: t({ pt: 'Instalar', en: 'Install' }), code: 'pnpm add @orange/tokens', language: 'bash' },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Estrutura do monorepo', en: 'Monorepo structure' }}>
        <Prose>
          <p>
            <T
              pt={<>Para contribuir ou estudar o código. O repositório usa workspaces do pnpm; os pacotes apontam para <Code>src/</Code> durante o desenvolvimento, então mudanças em tokens e componentes aparecem na documentação com hot reload.</>}
              en={<>To contribute or study the code. The repository uses pnpm workspaces; packages point at <Code>src/</Code> during development, so changes to tokens and components show up in the docs with hot reload.</>}
            />
          </p>
        </Prose>
        <CodeBlock code={tree} language="bash" title={t({ pt: 'estrutura', en: 'structure' })} />
      </Section>

      <Section title={{ pt: 'Scripts de desenvolvimento', en: 'Development scripts' }}>
        <TableWrap label={{ pt: 'Scripts do monorepo', en: 'Monorepo scripts' }}>
          <table className="doc-table">
            <thead>
              <tr>
                <th scope="col">{t({ pt: 'Comando', en: 'Command' })}</th>
                <th scope="col">{t({ pt: 'O que faz', en: 'What it does' })}</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['pnpm install', { pt: 'Instala as dependências de todos os workspaces.', en: 'Installs dependencies for every workspace.' }],
                ['pnpm dev', { pt: 'Sobe esta documentação em http://localhost:5173.', en: 'Starts these docs at http://localhost:5173.' }],
                ['pnpm storybook', { pt: 'Sobe o Storybook em http://localhost:6006.', en: 'Starts Storybook at http://localhost:6006.' }],
                ['pnpm gen', { pt: 'Regenera o índice de componentes de @orange/ui (rode após criar uma pasta).', en: 'Regenerates the @orange/ui component index (run after adding a folder).' }],
                ['pnpm test', { pt: 'Vitest + Testing Library + axe-core em tokens e componentes.', en: 'Vitest + Testing Library + axe-core for tokens and components.' }],
                ['pnpm typecheck', { pt: 'TypeScript em modo strict em todos os pacotes.', en: 'Strict TypeScript across every package.' }],
                ['pnpm lint', { pt: 'ESLint com jsx-a11y e react-hooks.', en: 'ESLint with jsx-a11y and react-hooks.' }],
                ['pnpm build:tokens', { pt: 'Gera css/tokens.css a partir de src/index.ts.', en: 'Generates css/tokens.css from src/index.ts.' }],
                ['pnpm build', { pt: 'tokens → biblioteca → Storybook → docs (Storybook servido em /storybook).', en: 'tokens → library → Storybook → docs (Storybook served at /storybook).' }],
              ].map(([cmd, desc]) => (
                <tr key={cmd as string}>
                  <th scope="row">
                    <Code>{cmd as string}</Code>
                  </th>
                  <td>{t(desc as { pt: string; en: string })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Section>

      <Section title={{ pt: 'Pronto para produção', en: 'Production checklist' }}>
        <Prose>
          <p>
            <T
              pt="Antes de publicar, confira os itens abaixo. A lista é interativa e não é salva — use-a como roteiro de revisão."
              en="Before shipping, go through the items below. The list is interactive and not saved — use it as a review script."
            />
          </p>
        </Prose>
        <Checklist
          label={{ pt: 'Checklist de lançamento', en: 'Launch checklist' }}
          items={[
            { pt: <><code>@orange/ui/styles.css</code> importado uma única vez, antes do CSS da aplicação.</>, en: <><code>@orange/ui/styles.css</code> imported once, before your app CSS.</> },
            { pt: 'Fontes carregadas com preconnect e display=swap.', en: 'Fonts loaded with preconnect and display=swap.' },
            { pt: <>Atributo <code>lang</code> do <code>&lt;html&gt;</code> igual ao <code>locale</code> do provider.</>, en: <>The <code>&lt;html&gt;</code> <code>lang</code> attribute matches the provider <code>locale</code>.</> },
            { pt: 'Tema aplicado antes da primeira pintura (sem flash) e escolha do usuário persistida.', en: 'Theme applied before first paint (no flash) and the user choice persisted.' },
            { pt: 'Cores customizadas verificadas: texto ≥ 4.5:1 e bordas/ícones ≥ 3:1 nos dois temas.', en: 'Custom colors verified: text ≥ 4.5:1 and borders/icons ≥ 3:1 in both themes.' },
            { pt: 'Navegação completa por teclado testada, com foco sempre visível.', en: 'Full keyboard navigation tested, with focus always visible.' },
            { pt: 'Botões só com ícone têm aria-label; imagens informativas têm texto alternativo.', en: 'Icon-only buttons have an aria-label; informative images have alt text.' },
            { pt: 'Interface verificada com prefers-reduced-motion ativo e zoom de 200%.', en: 'UI checked with prefers-reduced-motion on and 200% zoom.' },
            { pt: 'Build de produção usando o dist/ publicado (ESM + CJS + styles.css).', en: 'Production build uses the published dist/ (ESM + CJS + styles.css).' },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Próximos passos', en: 'Next steps' }}>
        <Cards
          columns={2}
          items={[
            { icon: 'droplet', title: { pt: 'Cor', en: 'Color' }, text: { pt: 'Paletas, tokens semânticos e a regra do acento único.', en: 'Palettes, semantic tokens and the single-accent rule.' }, to: '/design-guidelines/color' },
            { icon: 'sun', title: { pt: 'Tema', en: 'Theme' }, text: { pt: 'Claro, escuro, por seção ou com a cor da sua marca.', en: 'Light, dark, per section or with your brand color.' }, to: '/usage/theme' },
            { icon: 'accessibility', title: { pt: 'Acessibilidade', en: 'Accessibility' }, text: { pt: 'O que os componentes garantem e o que fica com você.', en: 'What components guarantee and what is up to you.' }, to: '/design-guidelines/accessibility' },
            { icon: 'grid', title: { pt: 'Componentes', en: 'Components' }, text: { pt: 'Todos os componentes com exemplos ao vivo e API.', en: 'Every component with live examples and API.' }, to: '/components/overview' },
          ]}
        />
        <Bullets
          items={[
            {
              pt: <>Explore os estados de cada componente no <a href={STORYBOOK_URL} target="_blank" rel="noreferrer">Storybook</a>.</>,
              en: <>Explore every component state in <a href={STORYBOOK_URL} target="_blank" rel="noreferrer">Storybook</a>.</>,
            },
            {
              pt: <>Encontrou um problema? Abra uma issue no <a href={`${REPO_URL}/issues`} target="_blank" rel="noreferrer">GitHub</a>.</>,
              en: <>Found a problem? Open an issue on <a href={`${REPO_URL}/issues`} target="_blank" rel="noreferrer">GitHub</a>.</>,
            },
          ]}
        />
      </Section>
    </DocPage>
  )
}
