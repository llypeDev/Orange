import { Button, buttonClassName, Icon } from '@orangesys/ui'
import { motion, primitives, radius, space, themes, tokens, typography } from '@orangesys/tokens'
import tokensCss from '@orangesys/tokens/tokens.css?raw'
import { useMemo, useState } from 'react'
import { T, useLang, type Localized } from '../../i18n'
import { Callout, Code, CodeBlock, DocPage, Prose, Section } from '../../kit'
import { libVersion } from '../../version'
import { REPO_URL, STORYBOOK_URL } from '../registry'
import { Cards, Segmented } from './_shared/Blocks'

type Format = 'json' | 'dtcg' | 'css'

const mapValues = <T, R>(obj: Record<string, T>, fn: (value: T) => R): Record<string, R> =>
  Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, fn(value)]))

/** Converte os tokens para o formato W3C Design Tokens (DTCG). */
function toDtcg() {
  const color = (value: string) => ({ $type: 'color', $value: value })
  const dimension = (value: string) => ({
    $type: 'dimension',
    $value: value === '0' ? '0px' : value,
  })
  return {
    $description: 'Orange Design System — tokens no formato W3C Design Tokens (DTCG).',
    palette: mapValues(primitives as unknown as Record<string, Record<string, string>>, (family) =>
      mapValues(family, color),
    ),
    color: {
      dark: mapValues(themes.dark as unknown as Record<string, string>, color),
      light: mapValues(themes.light as unknown as Record<string, string>, color),
    },
    font: {
      family: mapValues(typography.fontFamily, (value) => ({
        $type: 'fontFamily',
        $value: value.split(',').map((part) => part.trim().replace(/"/g, '')),
      })),
      size: mapValues(typography.fontSize, dimension),
      weight: mapValues(typography.fontWeight, (value) => ({
        $type: 'fontWeight',
        $value: Number(value),
      })),
      lineHeight: mapValues(typography.lineHeight, (value) => ({
        $type: 'number',
        $value: Number(value),
      })),
    },
    space: mapValues(space, dimension),
    radius: mapValues(radius, dimension),
    duration: mapValues(motion.duration, (value) => ({ $type: 'duration', $value: value })),
    easing: mapValues(motion.easing, (value) => ({
      $type: 'cubicBezier',
      $value: value
        .replace(/cubic-bezier\(|\)/g, '')
        .split(',')
        .map((n) => Number(n.trim())),
    })),
  }
}

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const formatInfo: Record<
  Format,
  {
    file: string
    mime: string
    title: Localized<string>
    text: Localized<string>
    language: 'json' | 'css'
  }
> = {
  json: {
    file: 'orange-tokens.json',
    mime: 'application/json',
    language: 'json',
    title: { pt: 'JSON (objeto tokens)', en: 'JSON (tokens object)' },
    text: {
      pt: 'O mesmo objeto exportado por @orangesys/tokens: primitives, themes, typography, space, motion, zIndex, breakpoints…',
      en: 'The same object exported by @orangesys/tokens: primitives, themes, typography, space, motion, zIndex, breakpoints…',
    },
  },
  dtcg: {
    file: 'orange-tokens.dtcg.json',
    mime: 'application/json',
    language: 'json',
    title: { pt: 'W3C Design Tokens', en: 'W3C Design Tokens' },
    text: {
      pt: 'Formato DTCG ($type/$value), pronto para Style Dictionary, Tokens Studio e outras ferramentas.',
      en: 'DTCG format ($type/$value), ready for Style Dictionary, Tokens Studio and other tools.',
    },
  },
  css: {
    file: 'orange-tokens.css',
    mime: 'text/css',
    language: 'css',
    title: { pt: 'CSS (custom properties)', en: 'CSS (custom properties)' },
    text: {
      pt: 'O tokens.css gerado: variáveis --or-*, temas em [data-theme] e durações zeradas em movimento reduzido.',
      en: 'The generated tokens.css: --or-* variables, themes under [data-theme] and zeroed durations for reduced motion.',
    },
  },
}

function TokenDownloads() {
  const { t } = useLang()
  const [preview, setPreview] = useState<Format>('dtcg')
  const [announce, setAnnounce] = useState('')
  const files = useMemo<Record<Format, string>>(
    () => ({
      json: JSON.stringify(tokens, null, 2),
      dtcg: JSON.stringify(toDtcg(), null, 2),
      css: tokensCss,
    }),
    [],
  )
  const kb = (text: string) => `${(new Blob([text]).size / 1024).toFixed(1)} KB`

  return (
    <>
      <ul className="guide-cards guide-cards--3">
        {(Object.keys(formatInfo) as Format[]).map((format) => {
          const info = formatInfo[format]
          return (
            <li key={format}>
              <div className="guide-card">
                <span className="guide-card__top">
                  <span className="guide-card__icon">
                    <Icon name="file" size="md" />
                  </span>
                  <span className="or-eyebrow">{info.file.split('.').slice(1).join('.')}</span>
                </span>
                <span className="guide-card__title">{t(info.title)}</span>
                <span className="guide-card__text">{t(info.text)}</span>
                <span className="guide-card__meta guide-download">
                  <span>
                    {info.file} · {kb(files[format])}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    startIcon={<Icon name="download" size="sm" />}
                    onClick={() => {
                      download(info.file, files[format], info.mime)
                      setAnnounce(t({ pt: `${info.file} baixado`, en: `${info.file} downloaded` }))
                    }}
                    aria-label={t({ pt: `Baixar ${info.file}`, en: `Download ${info.file}` })}
                  >
                    {t({ pt: 'Baixar', en: 'Download' })}
                  </Button>
                </span>
              </div>
            </li>
          )
        })}
      </ul>
      <p className="or-visually-hidden" role="status">
        {announce}
      </p>
      <div className="guide-toolbar">
        <span className="or-eyebrow">{t({ pt: 'Prévia do arquivo', en: 'File preview' })}</span>
        <Segmented
          label={{ pt: 'Formato da prévia', en: 'Preview format' }}
          value={preview}
          onChange={setPreview}
          options={[
            { value: 'json', label: 'JSON' },
            { value: 'dtcg', label: 'DTCG' },
            { value: 'css', label: 'CSS' },
          ]}
        />
      </div>
      <CodeBlock
        code={files[preview]}
        language={formatInfo[preview].language}
        title={formatInfo[preview].file}
        maxHeight={360}
      />
    </>
  )
}

export default function Resources() {
  const { t } = useLang()
  return (
    <DocPage
      hero={{
        actions: (
          <>
            <a href={STORYBOOK_URL} target="_blank" rel="noreferrer" className={buttonClassName({ variant: 'secondary', size: 'lg' })}>
              <span className="or-button__label">{t({ pt: 'Abrir o Storybook', en: 'Open Storybook' })}</span>
              <span className="or-button__icon or-button__icon--end" aria-hidden="true">
                <Icon name="arrow-up-right" />
              </span>
              <span className="or-visually-hidden">{t({ pt: '(abre em nova aba)', en: '(opens in a new tab)' })}</span>
            </a>
            <a href={REPO_URL} target="_blank" rel="noreferrer" className={buttonClassName({ variant: 'outline', size: 'lg' })}>
              <span className="or-button__label">GitHub</span>
              <span className="or-button__icon or-button__icon--end" aria-hidden="true">
                <Icon name="arrow-up-right" />
              </span>
              <span className="or-visually-hidden">{t({ pt: '(abre em nova aba)', en: '(opens in a new tab)' })}</span>
            </a>
          </>
        ),
      }}
      eyebrow={{ pt: 'Orange', en: 'Orange' }}
      title={{ pt: 'Recursos', en: 'Resources' }}
      lead={{
        pt: 'Tudo o que fica fora destas páginas: o laboratório de componentes, o código-fonte, os pacotes, os tokens para baixar e as referências que usamos para decidir.',
        en: 'Everything beyond these pages: the component lab, the source code, the packages, downloadable tokens and the references we use to make decisions.',
      }}
    >
      <Section title={{ pt: 'Ferramentas do projeto', en: 'Project tools' }}>
        <Cards
          columns={2}
          items={[
            {
              icon: 'layers',
              eyebrow: { pt: 'Laboratório', en: 'Lab' },
              title: { pt: 'Storybook', en: 'Storybook' },
              text: {
                pt: 'Cada componente em todos os estados, com Controls para alterar props, alternância de tema e idioma e o painel Accessibility (axe-core) em cada story.',
                en: 'Every component in every state, with Controls to change props, theme and language switching and the Accessibility panel (axe-core) on every story.',
              },
              href: STORYBOOK_URL,
            },
            {
              icon: 'code',
              eyebrow: { pt: 'Código-fonte', en: 'Source code' },
              title: { pt: 'Repositório no GitHub', en: 'GitHub repository' },
              text: {
                pt: 'Monorepo com tokens, componentes, documentação e Storybook. Licença MIT.',
                en: 'Monorepo with tokens, components, docs and Storybook. MIT license.',
              },
              href: REPO_URL,
              meta: 'github.com/llypeDev/Orange',
            },
            {
              icon: 'alert-circle',
              eyebrow: { pt: 'Suporte', en: 'Support' },
              title: { pt: 'Issues', en: 'Issues' },
              text: {
                pt: 'Relate bugs, barreiras de acessibilidade ou proponha componentes. Inclua navegador e passos para reproduzir.',
                en: 'Report bugs or accessibility barriers, or propose components. Include browser and reproduction steps.',
              },
              href: `${REPO_URL}/issues`,
            },
            {
              icon: 'book',
              eyebrow: { pt: 'Guia', en: 'Guide' },
              title: { pt: 'CONTRIBUTING.md', en: 'CONTRIBUTING.md' },
              text: {
                pt: 'Como um componente é construído: API, CSS, acessibilidade, testes, stories e página de documentação.',
                en: 'How a component is built: API, CSS, accessibility, tests, stories and docs page.',
              },
              href: `${REPO_URL}/blob/main/CONTRIBUTING.md`,
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Pacotes', en: 'Packages' }}>
        <Cards
          columns={2}
          items={[
            {
              eyebrow: { pt: `v${libVersion} · MIT`, en: `v${libVersion} · MIT` },
              title: { pt: '@orangesys/tokens', en: '@orangesys/tokens' },
              text: {
                pt: (
                  <>
                    Fonte única dos tokens em TypeScript e o <code>tokens.css</code> gerado. Inclui{' '}
                    <code>contrastRatio()</code> e <code>wcagLevel()</code> em{' '}
                    <code>@orangesys/tokens/contrast</code>. Funciona sem React.
                  </>
                ),
                en: (
                  <>
                    Single source of tokens in TypeScript plus the generated <code>tokens.css</code>
                    . Includes <code>contrastRatio()</code> and <code>wcagLevel()</code> in{' '}
                    <code>@orangesys/tokens/contrast</code>. Works without React.
                  </>
                ),
              },
              meta: 'pnpm add @orangesys/tokens',
            },
            {
              eyebrow: { pt: `v${libVersion} · MIT`, en: `v${libVersion} · MIT` },
              title: { pt: '@orangesys/ui', en: '@orangesys/ui' },
              text: {
                pt: (
                  <>
                    Componentes React acessíveis, hooks, ícones e o <code>OrangeProvider</code>.
                    Saída ESM + CJS, tipos e <code>styles.css</code>. Peer: React 18.2+.
                  </>
                ),
                en: (
                  <>
                    Accessible React components, hooks, icons and <code>OrangeProvider</code>. ESM +
                    CJS output, types and <code>styles.css</code>. Peer: React 18.2+.
                  </>
                ),
              },
              meta: 'pnpm add @orangesys/ui',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Baixar os tokens', en: 'Download the tokens' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Os arquivos são gerados aqui no navegador, a partir da mesma versão dos tokens que
                  esta documentação usa. Para manter tudo sincronizado em um projeto, prefira
                  instalar <Code>@orangesys/tokens</Code>.
                </>
              }
              en={
                <>
                  Files are generated right here in the browser, from the same token version these
                  docs use. To keep a project in sync, prefer installing <Code>@orangesys/tokens</Code>
                  .
                </>
              }
            />
          </p>
        </Prose>
        <TokenDownloads />
      </Section>

      <Section title={{ pt: 'Referências de acessibilidade', en: 'Accessibility references' }}>
        <Cards
          columns={3}
          items={[
            {
              eyebrow: { pt: 'Norma', en: 'Standard' },
              title: { pt: 'WCAG 2.2', en: 'WCAG 2.2' },
              text: {
                pt: 'As diretrizes do W3C. Nosso alvo é o nível AA em todos os componentes.',
                en: 'The W3C guidelines. Our target is level AA in every component.',
              },
              href: 'https://www.w3.org/TR/WCAG22/',
            },
            {
              eyebrow: { pt: 'Norma', en: 'Standard' },
              title: { pt: 'Understanding WCAG 2.2', en: 'Understanding WCAG 2.2' },
              text: {
                pt: 'A intenção, os exemplos e as falhas comuns de cada critério de sucesso.',
                en: 'Intent, examples and common failures for every success criterion.',
              },
              href: 'https://www.w3.org/WAI/WCAG22/Understanding/',
            },
            {
              eyebrow: { pt: 'Padrões', en: 'Patterns' },
              title: { pt: 'WAI-ARIA APG', en: 'WAI-ARIA APG' },
              text: {
                pt: 'Authoring Practices: papéis, estados e mapa de teclado de cada padrão de widget.',
                en: 'Authoring Practices: roles, states and keyboard map for each widget pattern.',
              },
              href: 'https://www.w3.org/WAI/ARIA/apg/patterns/',
            },
            {
              eyebrow: { pt: 'Referência', en: 'Reference' },
              title: { pt: 'MDN — Acessibilidade', en: 'MDN — Accessibility' },
              text: {
                pt: 'Guias de HTML semântico, ARIA e testes com tecnologias assistivas.',
                en: 'Guides on semantic HTML, ARIA and testing with assistive technologies.',
              },
              href: 'https://developer.mozilla.org/docs/Web/Accessibility',
            },
            {
              eyebrow: { pt: 'Livro', en: 'Book' },
              title: { pt: 'Inclusive Components', en: 'Inclusive Components' },
              text: {
                pt: 'Heydon Pickering desconstrói componentes comuns e mostra versões inclusivas.',
                en: 'Heydon Pickering deconstructs common components into inclusive versions.',
              },
              href: 'https://inclusive-components.design/',
            },
            {
              eyebrow: { pt: 'Ferramenta', en: 'Tool' },
              title: { pt: 'Regras do axe-core', en: 'axe-core rules' },
              text: {
                pt: 'Explicação de cada regra que o axe verifica nos nossos testes e no Storybook.',
                en: 'Explanation of every rule axe checks in our tests and in Storybook.',
              },
              href: 'https://dequeuniversity.com/rules/axe/',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Fontes e bibliotecas', en: 'Fonts and libraries' }}>
        <Cards
          columns={3}
          items={[
            {
              eyebrow: { pt: 'Títulos e rótulos', en: 'Headings and labels' },
              title: { pt: 'Space Grotesk', en: 'Space Grotesk' },
              text: {
                pt: 'Geométrica com personalidade; pesos 400 a 700.',
                en: 'Geometric with character; weights 400 to 700.',
              },
              href: 'https://fonts.google.com/specimen/Space+Grotesk',
            },
            {
              eyebrow: { pt: 'Texto', en: 'Body' },
              title: { pt: 'Inter', en: 'Inter' },
              text: {
                pt: 'Feita para telas, ótima em tamanhos pequenos e com números tabulares.',
                en: 'Made for screens, great at small sizes and with tabular figures.',
              },
              href: 'https://fonts.google.com/specimen/Inter',
            },
            {
              eyebrow: { pt: 'Código', en: 'Code' },
              title: { pt: 'JetBrains Mono', en: 'JetBrains Mono' },
              text: {
                pt: 'Monoespaçada com caracteres bem distintos (0/O, 1/l/I).',
                en: 'Monospaced with clearly distinct characters (0/O, 1/l/I).',
              },
              href: 'https://fonts.google.com/specimen/JetBrains+Mono',
            },
            {
              eyebrow: { pt: 'Posicionamento', en: 'Positioning' },
              title: { pt: 'Floating UI', en: 'Floating UI' },
              text: {
                pt: 'A única dependência de runtime: posiciona popovers, menus e tooltips.',
                en: 'The only runtime dependency: positions popovers, menus and tooltips.',
              },
              href: 'https://floating-ui.com/',
            },
            {
              eyebrow: { pt: 'Testes', en: 'Testing' },
              title: { pt: 'Testing Library', en: 'Testing Library' },
              text: {
                pt: 'Consultas por papel e nome acessível; o jeito como testamos interações.',
                en: 'Queries by role and accessible name; how we test interactions.',
              },
              href: 'https://testing-library.com/docs/queries/byrole',
            },
            {
              eyebrow: { pt: 'Laboratório', en: 'Lab' },
              title: { pt: 'Storybook', en: 'Storybook' },
              text: {
                pt: 'Documentação oficial do Storybook 9 e do addon de acessibilidade.',
                en: 'Official docs for Storybook 9 and its accessibility addon.',
              },
              href: 'https://storybook.js.org/docs/writing-tests/accessibility-testing',
            },
          ]}
        />
        <Callout tone="info" title={{ pt: 'Falta alguma coisa?', en: 'Something missing?' }}>
          <p>
            <T
              pt={
                <>
                  Sugira um recurso abrindo uma issue no{' '}
                  <a href={`${REPO_URL}/issues`} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                  .
                </>
              }
              en={
                <>
                  Suggest a resource by opening an issue on{' '}
                  <a href={`${REPO_URL}/issues`} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                  .
                </>
              }
            />
          </p>
        </Callout>
      </Section>
    </DocPage>
  )
}
