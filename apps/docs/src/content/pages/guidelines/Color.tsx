import { Button, Icon, useTheme, type IconName } from '@orangesys/ui'
import { primitives, themeMeta, themes, vizThemes, type ThemeName } from '@orangesys/tokens'
import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { T, useLang, type Localized } from '../../../i18n'
import { Bullets, Callout, Code, CodeBlock, DocPage, DoDont, Prose, Section } from '../../../kit'
import { ColorChip, ContrastBadge, Segmented, TableWrap } from '../_shared/Blocks'
import { contrastRatio, flatten, inkOn, ratioOf } from '../_shared/color'

type Family = keyof typeof primitives

const families: { id: Family; name: Localized<string>; text: Localized<string> }[] = [
  {
    id: 'carbon',
    name: { pt: 'Carbon', en: 'Carbon' },
    text: {
      pt: 'Neutros do tema escuro: do quase-preto dos fundos ao creme do texto.',
      en: 'Dark theme neutrals: from near-black backgrounds to cream text.',
    },
  },
  {
    id: 'paper',
    name: { pt: 'Paper', en: 'Paper' },
    text: {
      pt: 'Neutros quentes do tema claro, com cara de papel.',
      en: 'Warm light theme neutrals, paper-like.',
    },
  },
  {
    id: 'orange',
    name: { pt: 'Orange', en: 'Orange' },
    text: {
      pt: 'O acento. 500 no tema escuro, 600 no claro (≥ 3:1 sobre o papel) e 850 no claro de alto contraste (≥ 7:1).',
      en: 'The accent. 500 on dark, 600 on light (≥ 3:1 on paper) and 850 on light high contrast (≥ 7:1).',
    },
  },
  {
    id: 'green',
    name: { pt: 'Green', en: 'Green' },
    text: { pt: 'Sucesso e confirmação.', en: 'Success and confirmation.' },
  },
  {
    id: 'blue',
    name: { pt: 'Blue', en: 'Blue' },
    text: { pt: 'Informação e tipos no código.', en: 'Information and code types.' },
  },
  {
    id: 'red',
    name: { pt: 'Red', en: 'Red' },
    text: { pt: 'Erro e ações destrutivas.', en: 'Errors and destructive actions.' },
  },
  {
    id: 'amber',
    name: { pt: 'Amber', en: 'Amber' },
    text: { pt: 'Atenção e avisos.', en: 'Attention and warnings.' },
  },
]

const groups: { title: Localized<string>; tokens: [string, Localized<string>][] }[] = [
  {
    title: { pt: 'Fundos e superfícies', en: 'Backgrounds and surfaces' },
    tokens: [
      ['bg', { pt: 'Fundo da página.', en: 'Page background.' }],
      [
        'bg-subtle',
        {
          pt: 'Faixas, cabeçalhos de tabela, campos desabilitados.',
          en: 'Bands, table headers, disabled fields.',
        },
      ],
      [
        'surface',
        {
          pt: 'Fundo de controles (inputs, selects).',
          en: 'Control background (inputs, selects).',
        },
      ],
      [
        'surface-raised',
        { pt: 'Cartões, menus, popovers e modais.', en: 'Cards, menus, popovers and modals.' },
      ],
      [
        'surface-hover',
        { pt: 'Hover de itens e botões ghost.', en: 'Hover for items and ghost buttons.' },
      ],
      ['surface-active', { pt: 'Item pressionado ou ativo.', en: 'Pressed or active item.' }],
      [
        'surface-inverse',
        { pt: 'Superfície invertida (tooltips).', en: 'Inverted surface (tooltips).' },
      ],
      ['overlay', { pt: 'Véu atrás de modais e drawers.', en: 'Scrim behind modals and drawers.' }],
    ],
  },
  {
    title: { pt: 'Texto', en: 'Text' },
    tokens: [
      ['text', { pt: 'Títulos e texto principal.', en: 'Headings and primary text.' }],
      ['text-muted', { pt: 'Parágrafos e descrições.', en: 'Paragraphs and descriptions.' }],
      [
        'text-subtle',
        { pt: 'Metadados, legendas, placeholders.', en: 'Metadata, captions, placeholders.' },
      ],
      [
        'text-disabled',
        {
          pt: 'Somente estados desabilitados (isentos de contraste).',
          en: 'Disabled states only (exempt from contrast).',
        },
      ],
      ['text-inverse', { pt: 'Texto sobre surface-inverse.', en: 'Text on surface-inverse.' }],
      [
        'text-on-accent',
        { pt: 'Texto sobre o laranja (botão primary).', en: 'Text on orange (primary button).' },
      ],
    ],
  },
  {
    title: { pt: 'Bordas', en: 'Borders' },
    tokens: [
      ['border', { pt: 'Divisórias e contornos de cartões.', en: 'Dividers and card outlines.' }],
      [
        'border-subtle',
        { pt: 'Divisórias internas, linhas de grade.', en: 'Inner dividers, grid lines.' },
      ],
      [
        'border-strong',
        { pt: 'Contornos que precisam de mais presença.', en: 'Outlines that need more presence.' },
      ],
      [
        'border-control',
        { pt: 'Borda de campos de formulário (≥ 3:1).', en: 'Form field border (≥ 3:1).' },
      ],
    ],
  },
  {
    title: { pt: 'Acento', en: 'Accent' },
    tokens: [
      [
        'accent',
        {
          pt: 'Ação primária, seleção, indicador ativo.',
          en: 'Primary action, selection, active indicator.',
        },
      ],
      ['accent-hover', { pt: 'Hover da ação primária.', en: 'Primary action hover.' }],
      ['accent-active', { pt: 'Ação primária pressionada.', en: 'Pressed primary action.' }],
      ['accent-subtle', { pt: 'Fundo de itens selecionados.', en: 'Selected item background.' }],
      [
        'accent-text',
        { pt: 'Links e texto em laranja (≥ 4.5:1).', en: 'Links and orange text (≥ 4.5:1).' },
      ],
      [
        'accent-border',
        { pt: 'Borda de elementos com acento suave.', en: 'Border for softly accented elements.' },
      ],
      ['focus', { pt: 'Contorno de foco de 2px.', en: '2px focus outline.' }],
      ['selection', { pt: 'Seleção de texto (::selection).', en: 'Text selection (::selection).' }],
    ],
  },
  {
    title: { pt: 'Neutro de alto contraste', en: 'High-contrast neutral' },
    tokens: [
      [
        'neutral',
        {
          pt: 'Botão secondary: ação forte sem competir com o laranja.',
          en: 'Secondary button: strong action that does not compete with orange.',
        },
      ],
      ['neutral-hover', { pt: 'Hover do neutral.', en: 'Neutral hover.' }],
      ['text-on-neutral', { pt: 'Texto sobre neutral.', en: 'Text on neutral.' }],
    ],
  },
  {
    title: { pt: 'Status', en: 'Status' },
    tokens: [
      ['success', { pt: 'Ícones e marcas de sucesso.', en: 'Success icons and marks.' }],
      [
        'success-subtle',
        { pt: 'Fundo de mensagens de sucesso.', en: 'Success message background.' },
      ],
      ['success-text', { pt: 'Texto de sucesso.', en: 'Success text.' }],
      ['warning', { pt: 'Ícones e marcas de atenção.', en: 'Warning icons and marks.' }],
      ['warning-subtle', { pt: 'Fundo de avisos.', en: 'Warning background.' }],
      ['warning-text', { pt: 'Texto de atenção.', en: 'Warning text.' }],
      ['danger', { pt: 'Erros e botão danger.', en: 'Errors and danger button.' }],
      ['danger-hover', { pt: 'Hover do botão danger.', en: 'Danger button hover.' }],
      ['danger-subtle', { pt: 'Fundo de mensagens de erro.', en: 'Error message background.' }],
      ['danger-text', { pt: 'Texto de erro.', en: 'Error text.' }],
      ['text-on-danger', { pt: 'Texto sobre danger.', en: 'Text on danger.' }],
      ['info', { pt: 'Ícones e marcas informativas.', en: 'Info icons and marks.' }],
      ['info-subtle', { pt: 'Fundo de mensagens informativas.', en: 'Info message background.' }],
      ['info-text', { pt: 'Texto informativo.', en: 'Info text.' }],
    ],
  },
  {
    title: { pt: 'Utilitários', en: 'Utilities' },
    tokens: [
      [
        'grid-line',
        { pt: 'Linhas da grade de fundo das prévias.', en: 'Background grid lines in previews.' },
      ],
      [
        'code-bg',
        {
          pt: 'Fundo de blocos de código (escuro nos dois temas).',
          en: 'Code block background (dark in both themes).',
        },
      ],
      ['code-text', { pt: 'Texto de código.', en: 'Code text.' }],
    ],
  },
]

const themeValue = (theme: ThemeName, token: string) =>
  (themes[theme] as unknown as Record<string, string>)[token]

function ThemeSwatch({ theme, token }: { theme: ThemeName; token: string }) {
  const value = themeValue(theme, token)
  return (
    <span className="guide-token-cell">
      <span
        className="guide-swatch-inline"
        style={{ background: `linear-gradient(${value}, ${value}), ${themes[theme].bg}` }}
        aria-hidden="true"
      />
      {value}
    </span>
  )
}

const themeLabels: Record<ThemeName, Localized<string>> = {
  dark: { pt: 'Escuro', en: 'Dark' },
  light: { pt: 'Claro', en: 'Light' },
  'dark-hc': { pt: 'Escuro (alto contraste)', en: 'Dark (high contrast)' },
  'light-hc': { pt: 'Claro (alto contraste)', en: 'Light (high contrast)' },
}

function SemanticTable() {
  const { t } = useLang()
  const [contrast, setContrast] = useState<'standard' | 'high'>('standard')
  const [darkTheme, lightTheme]: ThemeName[] = contrast === 'high' ? ['dark-hc', 'light-hc'] : ['dark', 'light']
  return (
    <>
      <div className="guide-toolbar">
        <span className="or-eyebrow">{t({ pt: 'Valores por tema', en: 'Values per theme' })}</span>
        <Segmented
          label={{ pt: 'Temas da tabela', en: 'Table themes' }}
          value={contrast}
          onChange={setContrast}
          options={[
            { value: 'standard', label: { pt: 'Padrão', en: 'Standard' } },
            { value: 'high', label: { pt: 'Alto contraste', en: 'High contrast' } },
          ]}
        />
      </div>
    <TableWrap label={{ pt: 'Tokens semânticos de cor', en: 'Semantic color tokens' }}>
      <table className="doc-table guide-table-group">
        <thead>
          <tr>
            <th scope="col">Token</th>
            <th scope="col">{t(themeLabels[darkTheme])}</th>
            <th scope="col">{t(themeLabels[lightTheme])}</th>
            <th scope="col">{t({ pt: 'Uso', en: 'Usage' })}</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <Fragment key={group.title.en}>
              <tr>
                <th scope="colgroup" colSpan={4}>
                  {t(group.title)}
                </th>
              </tr>
              {group.tokens.map(([token, usage]) => (
                <tr key={token}>
                  <th scope="row">
                    <Code>--or-color-{token}</Code>
                  </th>
                  <td>
                    <ThemeSwatch theme={darkTheme} token={token} />
                  </td>
                  <td>
                    <ThemeSwatch theme={lightTheme} token={token} />
                  </td>
                  <td>{t(usage)}</td>
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </TableWrap>
    </>
  )
}

const matrixText = [
  'text',
  'text-muted',
  'text-subtle',
  'accent-text',
  'success-text',
  'warning-text',
  'danger-text',
  'info-text',
  'text-disabled',
]
const matrixBg = ['bg', 'bg-subtle', 'surface-raised', 'surface-hover']

function ContrastMatrix() {
  const { t } = useLang()
  const { resolvedTheme } = useTheme()
  const [theme, setTheme] = useState<ThemeName>(resolvedTheme)
  return (
    <>
      <div className="guide-toolbar">
        <span className="or-eyebrow">{t({ pt: 'Texto × fundo', en: 'Text × background' })}</span>
        <Segmented
          label={{ pt: 'Tema da matriz', en: 'Matrix theme' }}
          value={theme}
          onChange={setTheme}
          options={(Object.keys(themeLabels) as ThemeName[]).map((value) => ({
            value,
            label: themeLabels[value],
          }))}
        />
      </div>
      <TableWrap label={{ pt: 'Matriz de contraste', en: 'Contrast matrix' }}>
        <table className="doc-table guide-matrix" data-theme={theme}>
          <caption className="or-visually-hidden">
            {t({
              pt: `Contraste de cada token de texto sobre cada fundo, tema ${themeLabels[theme].pt.toLowerCase()}`,
              en: `Contrast of each text token on each background, ${themeLabels[theme].en.toLowerCase()} theme`,
            })}
          </caption>
          <thead>
            <tr>
              <th scope="col">{t({ pt: 'Texto', en: 'Text' })}</th>
              {matrixBg.map((bg) => (
                <th scope="col" key={bg}>
                  {bg}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrixText.map((fg) => (
              <tr key={fg}>
                <th scope="row">
                  <Code>{fg}</Code>
                </th>
                {matrixBg.map((bg) => {
                  const ratio = ratioOf(theme, fg, bg)
                  return (
                    <td
                      key={bg}
                      className="guide-matrix__cell"
                      style={{ background: themeValue(theme, bg) }}
                    >
                      {/* Amostra decorativa desenhada por CSS (::before): a matriz mostra de
                          propósito pares que reprovam; a razão e o nível ficam no selo ao lado. */}
                      <span
                        className="guide-matrix__sample"
                        data-sample="Aa"
                        style={{ color: themeValue(theme, fg) }}
                        aria-hidden="true"
                      />
                      <ContrastBadge ratio={ratio} />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>
      <p className="guide-muted guide-note">
        {themeMeta[theme].highContrast ? (
          <T
            pt={
              <>
                No alto contraste, <Code>text-disabled</Code> sobe para ≥ 4.5:1 e todos os textos
                ativos passam de 7:1 (AAA) sobre os fundos de página e de superfície.
              </>
            }
            en={
              <>
                In high contrast, <Code>text-disabled</Code> rises to ≥ 4.5:1 and every active text
                passes 7:1 (AAA) on page and surface backgrounds.
              </>
            }
          />
        ) : (
          <T
            pt={
              <>
                <Code>text-disabled</Code> fica abaixo de 4.5:1 de propósito: a WCAG isenta
                componentes desabilitados (1.4.3). Nunca use esse token para texto ativo.
              </>
            }
            en={
              <>
                <Code>text-disabled</Code> is below 4.5:1 on purpose: WCAG exempts disabled
                components (1.4.3). Never use this token for active text.
              </>
            }
          />
        )}
      </p>
    </>
  )
}

/* --- Alto contraste: regras e o menor contraste de cada uma ------------------ */

const hcSurfaces = ['bg', 'bg-subtle', 'surface', 'surface-raised']
const pairsOf = (fgs: string[], bgs: string[]) =>
  fgs.flatMap((fg) => bgs.map((bg): [string, string] => [fg, bg]))

const hcRules: { label: Localized<string>; min: number; pairs: [string, string][] }[] = [
  {
    label: { pt: 'Texto, texto suave e sutil', en: 'Text, muted and subtle text' },
    min: 7,
    pairs: pairsOf(['text', 'text-muted', 'text-subtle'], hcSurfaces),
  },
  {
    label: { pt: 'Texto desabilitado', en: 'Disabled text' },
    min: 4.5,
    pairs: pairsOf(['text-disabled'], hcSurfaces),
  },
  {
    label: { pt: 'Bordas e foco', en: 'Borders and focus' },
    min: 4.5,
    pairs: pairsOf(
      ['border', 'border-subtle', 'border-strong', 'border-control', 'accent-border', 'focus'],
      hcSurfaces,
    ),
  },
  {
    label: { pt: 'Pares de acento', en: 'Accent pairs' },
    min: 7,
    pairs: [
      ['text-on-accent', 'accent'],
      ['text-on-accent', 'accent-hover'],
      ['text-on-accent', 'accent-active'],
      ...pairsOf(['accent-text'], [...hcSurfaces, 'accent-subtle']),
    ],
  },
  {
    label: { pt: 'Texto de status', en: 'Status text' },
    min: 7,
    pairs: ['success', 'warning', 'danger', 'info'].flatMap((status) =>
      pairsOf([`${status}-text`], [...hcSurfaces, `${status}-subtle`]),
    ),
  },
  {
    label: { pt: 'Gráficos: cores categóricas', en: 'Charts: categorical colors' },
    min: 4.5,
    pairs: pairsOf(
      ['viz-1', 'viz-2', 'viz-3', 'viz-4', 'viz-5', 'viz-other'],
      ['bg', 'bg-subtle', 'surface-raised'],
    ),
  },
]

/** O par com menor contraste de uma regra (transparências compostas sobre o fundo). */
function lowestPair(theme: ThemeName, pairs: [string, string][]) {
  const palette = { ...themes[theme], ...vizThemes[theme] } as Record<string, string>
  const solid = (token: string) => flatten(palette[token], palette.bg)
  return pairs
    .map(([fg, bg]) => ({ fg, bg, ratio: contrastRatio(solid(fg), solid(bg)) }))
    .reduce((low, pair) => (pair.ratio < low.ratio ? pair : low))
}

function HighContrastTable() {
  const { t } = useLang()
  const hcThemes: ThemeName[] = ['dark-hc', 'light-hc']
  return (
    <TableWrap label={{ pt: 'Regras do alto contraste', en: 'High contrast rules' }}>
      <table className="doc-table">
        <thead>
          <tr>
            <th scope="col">{t({ pt: 'Regra', en: 'Rule' })}</th>
            <th scope="col">{t({ pt: 'Mínimo', en: 'Minimum' })}</th>
            {hcThemes.map((theme) => (
              <th scope="col" key={theme}>
                {t({ pt: 'Menor par', en: 'Lowest pair' })} · <Code>{theme}</Code>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hcRules.map((rule) => (
            <tr key={rule.label.en}>
              <th scope="row">{t(rule.label)}</th>
              <td>{rule.min}:1</td>
              {hcThemes.map((theme) => {
                const low = lowestPair(theme, rule.pairs)
                return (
                  <td key={theme}>
                    <span className="guide-token-cell">
                      <ContrastBadge ratio={low.ratio} kind={rule.min < 7 ? 'ui' : 'text'} />
                      <Code>{low.fg}</Code> / <Code>{low.bg}</Code>
                    </span>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrap>
  )
}

const statuses: {
  tone: 'success' | 'warning' | 'danger' | 'info'
  icon: IconName
  title: Localized<string>
  text: Localized<string>
}[] = [
  {
    tone: 'success',
    icon: 'check-circle',
    title: { pt: 'Pagamento confirmado', en: 'Payment confirmed' },
    text: {
      pt: 'O pedido #4821 já foi enviado para separação.',
      en: 'Order #4821 has been sent for picking.',
    },
  },
  {
    tone: 'warning',
    icon: 'alert-triangle',
    title: { pt: 'Estoque baixo', en: 'Low stock' },
    text: {
      pt: 'Restam 3 unidades do tênis Corrida 42.',
      en: '3 units left of the Runner 42 sneaker.',
    },
  },
  {
    tone: 'danger',
    icon: 'alert-circle',
    title: { pt: 'Falha na sincronização', en: 'Sync failed' },
    text: {
      pt: 'Não foi possível conectar ao ERP. Tente novamente.',
      en: 'Could not reach the ERP. Try again.',
    },
  },
  {
    tone: 'info',
    icon: 'info',
    title: { pt: 'Nova versão disponível', en: 'New version available' },
    text: { pt: 'A versão 0.2 traz filtros salvos.', en: 'Version 0.2 adds saved filters.' },
  },
]

export default function ColorPage() {
  const { t, to } = useLang()
  return (
    <DocPage
      eyebrow={{ pt: 'Design guidelines', en: 'Design guidelines' }}
      title={{ pt: 'Cor', en: 'Color' }}
      lead={{
        pt: 'Carvão, creme e um único laranja. As cores do Orange existem em duas camadas: paletas primitivas e tokens semânticos — e só os semânticos entram nos componentes.',
        en: 'Charcoal, cream and a single orange. Orange colors live in two layers: primitive palettes and semantic tokens — and only the semantic ones go into components.',
      }}
    >
      <Section title={{ pt: 'Duas camadas', en: 'Two layers' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  <strong>Primitivas</strong> (<Code>--or-palette-orange-500</Code>) são valores
                  crus, sem significado. <strong>Semânticas</strong> (<Code>--or-color-accent</Code>
                  ) dizem para que a cor serve e mudam com o tema. Componentes e telas usam apenas
                  as semânticas; assim, o tema claro, o escuro e um tema da sua marca funcionam sem
                  tocar em nenhum componente.
                </>
              }
              en={
                <>
                  <strong>Primitives</strong> (<Code>--or-palette-orange-500</Code>) are raw values
                  with no meaning. <strong>Semantic</strong> tokens (<Code>--or-color-accent</Code>)
                  say what the color is for and change with the theme. Components and screens only
                  use semantic tokens, so the light theme, the dark theme and your brand theme all
                  work without touching a component.
                </>
              }
            />
          </p>
        </Prose>
        <CodeBlock
          language="css"
          title="tokens.css"
          code={`:root {
  --or-palette-orange-500: #f58549;   /* primitiva: só um valor */
}

[data-theme='dark'] {
  --or-color-accent: #f58549;         /* semântica: "o acento" no escuro */
}

[data-theme='light'] {
  --or-color-accent: #d4622a;         /* mais fechado para manter 3:1 no papel */
}`}
        />
      </Section>

      <Section title={{ pt: 'Paletas primitivas', en: 'Primitive palettes' }}>
        <Prose>
          <p>
            <T
              pt="Clique em uma amostra para copiar o hex. As paletas existem para alimentar os temas e casos especiais, como gráficos; não as use diretamente em componentes."
              en="Click a swatch to copy its hex. Palettes exist to feed the themes and special cases such as charts; don't use them directly in components."
            />
          </p>
        </Prose>
        {families.map((family) => (
          <div key={family.id} className="guide-palette">
            <div className="guide-palette__head">
              <h3 className="guide-palette__name">{t(family.name)}</h3>
              <span className="guide-muted guide-palette__text">{t(family.text)}</span>
            </div>
            <ul className="guide-palette__row">
              {Object.entries(primitives[family.id]).map(([step, hex]) => (
                <li key={step}>
                  <ColorChip
                    color={hex}
                    label={step}
                    value={hex}
                    ink={inkOn(hex)}
                    group={t(family.name)}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Section>

      <Section title={{ pt: 'Tokens semânticos', en: 'Semantic tokens' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Os {Object.keys(themes.dark).length} tokens abaixo existem nos quatro temas
                  (escuro, claro e os dois de alto contraste) com o mesmo nome. Valores com transparência (<Code>rgba</Code>) são compostos sobre o
                  fundo de cada tema.
                </>
              }
              en={
                <>
                  The {Object.keys(themes.dark).length} tokens below exist in all four themes (dark,
                  light and the two high contrast ones) under the same name. Values with transparency (<Code>rgba</Code>) are composited over each
                  theme's background.
                </>
              }
            />
          </p>
        </Prose>
        <SemanticTable />
      </Section>

      <Section title={{ pt: 'Um único acento', en: 'A single accent' }}>
        <Prose>
          <p>
            <T
              pt="O laranja é o único acento do sistema. Ele aponta para o que importa agora: a ação principal, o item selecionado, o foco do teclado. Quanto mais raro, mais ele funciona — uma tela com cinco elementos laranja não tem destaque nenhum."
              en="Orange is the system's only accent. It points to what matters now: the main action, the selected item, keyboard focus. The rarer it is, the better it works — a screen with five orange elements has no emphasis at all."
            />
          </p>
        </Prose>
        <Bullets
          items={[
            {
              pt: 'No máximo uma ação primária (fundo laranja) por contexto.',
              en: 'At most one primary action (orange fill) per context.',
            },
            {
              pt: (
                <>
                  Texto em laranja só com <Code>accent-text</Code>, que garante 4.5:1 nos dois
                  temas.
                </>
              ),
              en: (
                <>
                  Orange text only with <Code>accent-text</Code>, which guarantees 4.5:1 in both
                  themes.
                </>
              ),
            },
            {
              pt: 'Hierarquia vem de tamanho, peso e espaço — não de cor. Títulos ficam em text.',
              en: 'Hierarchy comes from size, weight and space — not color. Headings stay in text.',
            },
            {
              pt: (
                <>
                  Precisa de uma ação forte sem laranja? Use o <Code>neutral</Code> (botão
                  secondary).
                </>
              ),
              en: (
                <>
                  Need a strong action without orange? Use <Code>neutral</Code> (secondary button).
                </>
              ),
            },
          ]}
        />
        <DoDont
          doExample={
            <div className="guide-mini-card">
              <span className="or-eyebrow">{t({ pt: 'Plano Pro', en: 'Pro plan' })}</span>
              <span className="guide-mini-card__title">R$ 49/{t({ pt: 'mês', en: 'mo' })}</span>
              <span className="guide-mini-card__text">
                {t({ pt: 'Até 10 lojas conectadas.', en: 'Up to 10 connected stores.' })}
              </span>
              <div className="guide-row">
                <Button size="sm" variant="outline">
                  {t({ pt: 'Comparar', en: 'Compare' })}
                </Button>
                <Button size="sm">{t({ pt: 'Assinar', en: 'Subscribe' })}</Button>
              </div>
            </div>
          }
          dontExample={
            <div className="guide-mini-card guide-mini-card--noisy">
              <span className="or-eyebrow guide-mini-card__orange">
                {t({ pt: 'Plano Pro', en: 'Pro plan' })}
              </span>
              <span className="guide-mini-card__title guide-mini-card__orange">
                R$ 49/{t({ pt: 'mês', en: 'mo' })}
              </span>
              <span className="guide-mini-card__text guide-mini-card__orange">
                {t({ pt: 'Até 10 lojas conectadas.', en: 'Up to 10 connected stores.' })}
              </span>
              <div className="guide-row">
                <Button size="sm">{t({ pt: 'Comparar', en: 'Compare' })}</Button>
                <Button size="sm">{t({ pt: 'Assinar', en: 'Subscribe' })}</Button>
              </div>
            </div>
          }
          doItems={[
            {
              pt: 'Laranja só na ação que você quer que a pessoa tome.',
              en: 'Orange only on the action you want people to take.',
            },
          ]}
          dontItems={[
            {
              pt: 'Laranja em borda, título, texto e dois botões: nada se destaca.',
              en: 'Orange on border, title, text and two buttons: nothing stands out.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Cores de status', en: 'Status colors' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Verde, âmbar, vermelho e azul comunicam estado — sucesso, atenção, erro e
                  informação. Cada um tem três tokens: a cor plena (ícones e marcas,{' '}
                  <Code>success</Code>), o fundo suave (<Code>success-subtle</Code>) e o texto (
                  <Code>success-text</Code>, ≥ 4.5:1).
                </>
              }
              en={
                <>
                  Green, amber, red and blue communicate state — success, warning, error and
                  information. Each has three tokens: the full color (icons and marks,{' '}
                  <Code>success</Code>), the soft background (<Code>success-subtle</Code>) and the
                  text (<Code>success-text</Code>, ≥ 4.5:1).
                </>
              }
            />
          </p>
        </Prose>
        <div className="guide-status-grid">
          {statuses.map((status) => (
            <div key={status.tone} className={`guide-status guide-status--${status.tone}`}>
              <Icon name={status.icon} size="md" />
              <div>
                <p className="guide-status__title">{t(status.title)}</p>
                <p className="guide-status__text">{t(status.text)}</p>
              </div>
            </div>
          ))}
        </div>
        <Callout
          tone="warning"
          title={{ pt: 'Cor nunca é o único sinal', en: 'Color is never the only signal' }}
        >
          <p>
            <T
              pt="Todo status tem ícone e texto (WCAG 1.4.1). No tema claro, success e warning plenos ficam abaixo de 3:1 sobre o papel — por isso o ícone vem acompanhado de um título legível em *-text. No claro de alto contraste eles escurecem (green-600, amber-600) e passam de 3:1."
              en="Every status has an icon and text (WCAG 1.4.1). On the light theme, full success and warning sit below 3:1 on paper — which is why the icon always comes with a readable *-text title. On light high contrast they darken (green-600, amber-600) and pass 3:1."
            />
          </p>
        </Callout>
      </Section>

      <Section title={{ pt: 'Alto contraste', en: 'High contrast' }} id="alto-contraste">
        <Prose>
          <p>
            <T
              pt={
                <>
                  Dois temas a mais, <Code>dark-hc</Code> e <Code>light-hc</Code>, miram o nível AAA
                  da WCAG sem perder a identidade: o mesmo carvão, o mesmo creme, o mesmo laranja.
                  O que muda é a força de cada camada — fundos mais fundos (<Code>carbon-0</Code>,{' '}
                  <Code>paper-0</Code>), texto secundário mais forte, todas as bordas visíveis e,
                  no claro, um laranja mais fechado (<Code>orange-850</Code>) com texto claro por
                  cima. Os nomes dos tokens são os mesmos: nenhum componente muda.
                </>
              }
              en={
                <>
                  Two more themes, <Code>dark-hc</Code> and <Code>light-hc</Code>, target WCAG AAA
                  without losing the identity: the same charcoal, the same cream, the same orange.
                  What changes is the strength of each layer — deeper backgrounds (
                  <Code>carbon-0</Code>, <Code>paper-0</Code>), stronger secondary text, every border
                  visible and, on light, a deeper orange (<Code>orange-850</Code>) with light text on
                  top. Token names are the same: no component changes.
                </>
              }
            />
          </p>
          <p>
            <T
              pt={
                <>
                  Ative com <Code>data-theme="dark-hc"</Code> (ou <Code>light-hc</Code>). Em modo
                  automático, quem pede mais contraste ao sistema (<Code>prefers-contrast: more</Code>)
                  recebe o tema de alto contraste do mesmo esquema — veja{' '}
                  <Link to={to('/usage/theme')}>Tema</Link>. A tabela abaixo é calculada ao vivo e
                  as mesmas regras rodam em <Code>contrast.test.ts</Code>.
                </>
              }
              en={
                <>
                  Turn it on with <Code>data-theme="dark-hc"</Code> (or <Code>light-hc</Code>). In
                  automatic mode, people who ask their system for more contrast (
                  <Code>prefers-contrast: more</Code>) get the high contrast theme of the same scheme
                  — see <Link to={to('/usage/theme')}>Theme</Link>. The table below is computed live
                  and the same rules run in <Code>contrast.test.ts</Code>.
                </>
              }
            />
          </p>
        </Prose>
        <HighContrastTable />
        <Bullets
          items={[
            {
              pt: 'Hierarquia continua existindo: texto (≥ 17:1), suave e sutil (≥ 7:1), desabilitado (≥ 4.5:1).',
              en: 'Hierarchy still exists: text (≥ 17:1), muted and subtle (≥ 7:1), disabled (≥ 4.5:1).',
            },
            {
              pt: 'Status plenos (ícones, barras, bordas) ficam ≥ 3:1 e mantêm o texto do Badge legível; o texto de status (*-text) passa de 7:1.',
              en: 'Full status colors (icons, bars, borders) stay ≥ 3:1 and keep Badge text legible; status text (*-text) passes 7:1.',
            },
            {
              pt: 'Nos gráficos, as cores categóricas passam de 4.5:1 e vizinhas diferem em matiz ou luminosidade.',
              en: 'In charts, categorical colors pass 4.5:1 and neighbors differ in hue or lightness.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Matriz de contraste', en: 'Contrast matrix' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Calculada ao vivo com <Code>contrastRatio()</Code> e <Code>wcagLevel()</Code> de{' '}
                  <Code>@orangesys/tokens/contrast</Code>. AA exige 4.5:1 para texto normal e 3:1 para
                  texto grande (≥ 24px, ou ≥ 18.66px em negrito); AAA exige 7:1.
                </>
              }
              en={
                <>
                  Computed live with <Code>contrastRatio()</Code> and <Code>wcagLevel()</Code> from{' '}
                  <Code>@orangesys/tokens/contrast</Code>. AA requires 4.5:1 for normal text and 3:1
                  for large text (≥ 24px, or ≥ 18.66px bold); AAA requires 7:1.
                </>
              }
            />
          </p>
        </Prose>
        <ContrastMatrix />
      </Section>

      <Section title={{ pt: 'Faça e não faça', en: "Do's and don'ts" }}>
        <DoDont
          doItems={[
            {
              pt: (
                <>
                  Use tokens semânticos: <Code>var(--or-color-text-muted)</Code>.
                </>
              ),
              en: (
                <>
                  Use semantic tokens: <Code>var(--or-color-text-muted)</Code>.
                </>
              ),
            },
            {
              pt: 'Teste cada combinação nova nos dois temas.',
              en: 'Test every new combination in both themes.',
            },
            {
              pt: 'Combine cor com ícone, texto ou padrão.',
              en: 'Pair color with an icon, text or pattern.',
            },
            {
              pt: 'Use bordas de 1px para separar áreas antes de usar fundos coloridos.',
              en: 'Use 1px borders to separate areas before reaching for colored fills.',
            },
          ]}
          dontItems={[
            {
              pt: (
                <>
                  Escrever hex no CSS de componentes (<Code>#f58549</Code>).
                </>
              ),
              en: (
                <>
                  Write hex values in component CSS (<Code>#f58549</Code>).
                </>
              ),
            },
            {
              pt: (
                <>
                  Usar <Code>--or-palette-*</Code> para texto: o valor não muda com o tema.
                </>
              ),
              en: (
                <>
                  Use <Code>--or-palette-*</Code> for text: the value doesn't change with the theme.
                </>
              ),
            },
            {
              pt: 'Criar um segundo acento (roxo, rosa) para “dar vida” à tela.',
              en: 'Add a second accent (purple, pink) to “liven up” the screen.',
            },
            {
              pt: 'Usar vermelho ou verde para decorar — eles significam erro e sucesso.',
              en: 'Use red or green as decoration — they mean error and success.',
            },
          ]}
        />
        <Callout
          tone="info"
          title={{ pt: 'Quer outra cor de marca?', en: 'Want a different brand color?' }}
        >
          <p>
            <T
              pt={
                <>
                  Sobrescreva <Code>--or-color-accent</Code> e as variações e verifique o contraste
                  — o passo a passo está em <Link to={to('/usage/theme')}>Tema</Link>.
                </>
              }
              en={
                <>
                  Override <Code>--or-color-accent</Code> and its variants and check contrast — the
                  walkthrough is in <Link to={to('/usage/theme')}>Theme</Link>.
                </>
              }
            />
          </p>
        </Callout>
      </Section>
    </DocPage>
  )
}
