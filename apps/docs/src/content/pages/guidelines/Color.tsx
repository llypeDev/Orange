import { Button, Icon, type IconName } from '@orange/ui'
import { primitives, themes, type ThemeName } from '@orange/tokens'
import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { T, useLang, type Localized } from '../../../i18n'
import { Bullets, Callout, Code, CodeBlock, DocPage, DoDont, Prose, Section } from '../../../kit'
import { ColorChip, ContrastBadge, Segmented, TableWrap } from '../_shared/Blocks'
import { inkOn, ratioOf } from '../_shared/color'

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
      pt: 'O acento. 500 no tema escuro, 600 no claro (≥ 3:1 sobre o papel).',
      en: 'The accent. 500 on dark, 600 on light (≥ 3:1 on paper).',
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

function SemanticTable() {
  const { t } = useLang()
  return (
    <TableWrap label={{ pt: 'Tokens semânticos de cor', en: 'Semantic color tokens' }}>
      <table className="doc-table guide-table-group">
        <thead>
          <tr>
            <th scope="col">Token</th>
            <th scope="col">{t({ pt: 'Escuro', en: 'Dark' })}</th>
            <th scope="col">{t({ pt: 'Claro', en: 'Light' })}</th>
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
                    <ThemeSwatch theme="dark" token={token} />
                  </td>
                  <td>
                    <ThemeSwatch theme="light" token={token} />
                  </td>
                  <td>{t(usage)}</td>
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </TableWrap>
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
  const [theme, setTheme] = useState<ThemeName>('dark')
  return (
    <>
      <div className="guide-toolbar">
        <span className="or-eyebrow">{t({ pt: 'Texto × fundo', en: 'Text × background' })}</span>
        <Segmented
          label={{ pt: 'Tema da matriz', en: 'Matrix theme' }}
          value={theme}
          onChange={setTheme}
          options={[
            { value: 'dark', label: { pt: 'Escuro', en: 'Dark' } },
            { value: 'light', label: { pt: 'Claro', en: 'Light' } },
          ]}
        />
      </div>
      <TableWrap label={{ pt: 'Matriz de contraste', en: 'Contrast matrix' }}>
        <table className="doc-table guide-matrix" data-theme={theme}>
          <caption className="or-visually-hidden">
            {t({
              pt: `Contraste de cada token de texto sobre cada fundo, tema ${theme === 'dark' ? 'escuro' : 'claro'}`,
              en: `Contrast of each text token on each background, ${theme} theme`,
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
                      <span
                        className="guide-matrix__sample"
                        style={{ color: themeValue(theme, fg) }}
                        aria-hidden="true"
                      >
                        Aa
                      </span>
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
        <T
          pt={
            <>
              <Code>text-disabled</Code> fica abaixo de 4.5:1 de propósito: a WCAG isenta
              componentes desabilitados (1.4.3). Nunca use esse token para texto ativo.
            </>
          }
          en={
            <>
              <Code>text-disabled</Code> is below 4.5:1 on purpose: WCAG exempts disabled components
              (1.4.3). Never use this token for active text.
            </>
          }
        />
      </p>
    </>
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
                  Os {Object.keys(themes.dark).length} tokens abaixo existem nos dois temas com o
                  mesmo nome. Valores com transparência (<Code>rgba</Code>) são compostos sobre o
                  fundo de cada tema.
                </>
              }
              en={
                <>
                  The {Object.keys(themes.dark).length} tokens below exist in both themes under the
                  same name. Values with transparency (<Code>rgba</Code>) are composited over each
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
              pt="Todo status tem ícone e texto (WCAG 1.4.1). No tema claro, success e warning plenos ficam abaixo de 3:1 sobre o papel — por isso o ícone vem acompanhado de um título legível em *-text."
              en="Every status has an icon and text (WCAG 1.4.1). On the light theme, full success and warning sit below 3:1 on paper — which is why the icon always comes with a readable *-text title."
            />
          </p>
        </Callout>
      </Section>

      <Section title={{ pt: 'Matriz de contraste', en: 'Contrast matrix' }}>
        <Prose>
          <p>
            <T
              pt={
                <>
                  Calculada ao vivo com <Code>contrastRatio()</Code> e <Code>wcagLevel()</Code> de{' '}
                  <Code>@orange/tokens/contrast</Code>. AA exige 4.5:1 para texto normal e 3:1 para
                  texto grande (≥ 24px, ou ≥ 18.66px em negrito); AAA exige 7:1.
                </>
              }
              en={
                <>
                  Computed live with <Code>contrastRatio()</Code> and <Code>wcagLevel()</Code> from{' '}
                  <Code>@orange/tokens/contrast</Code>. AA requires 4.5:1 for normal text and 3:1
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
