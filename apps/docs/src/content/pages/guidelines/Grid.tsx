import { useMediaQuery } from '@orange/ui'
import { breakpoints, layout, space } from '@orange/tokens'
import { T, useLang, type Localized } from '../../../i18n'
import { Bullets, Code, CodeBlock, DocPage, DoDont, Prose, Section } from '../../../kit'
import { TableWrap } from '../_shared/Blocks'

const px = (rem: string) => (rem === '0' ? 0 : parseFloat(rem) * (rem.endsWith('rem') ? 16 : 1))

const spans: { label: string; cols: number[] }[] = [
  { label: '12', cols: [12] },
  { label: '6 + 6', cols: [6, 6] },
  { label: '4 + 4 + 4', cols: [4, 4, 4] },
  { label: '3 × 4', cols: [3, 3, 3, 3] },
  { label: '8 + 4', cols: [8, 4] },
  { label: '3 + 9', cols: [3, 9] },
]

const breakpointRows: { name: string; min: string; columns: number; gutter: string; usage: Localized<string> }[] = [
  { name: 'base', min: '0', columns: 4, gutter: '16px', usage: { pt: 'Celulares em retrato. Uma coluna de conteúdo, navegação em gaveta.', en: 'Phones in portrait. One content column, drawer navigation.' } },
  { name: 'sm', min: breakpoints.sm, columns: 4, gutter: '16px', usage: { pt: 'Celulares grandes e em paisagem.', en: 'Large phones and landscape.' } },
  { name: 'md', min: breakpoints.md, columns: 8, gutter: '24px', usage: { pt: 'Tablets. Cartões em duas colunas.', en: 'Tablets. Cards in two columns.' } },
  { name: 'lg', min: breakpoints.lg, columns: 12, gutter: '32px', usage: { pt: 'Notebooks. A sidebar fixa aparece (esta documentação).', en: 'Laptops. The fixed sidebar appears (these docs).' } },
  { name: 'xl', min: breakpoints.xl, columns: 12, gutter: '32px', usage: { pt: 'Desktops. Índice “Nesta página” ao lado do conteúdo.', en: 'Desktops. “On this page” index next to the content.' } },
  { name: '2xl', min: breakpoints['2xl'], columns: 12, gutter: '32px', usage: { pt: 'Telas largas. O conteúdo para em 1200px e centraliza.', en: 'Wide screens. Content stops at 1200px and centers.' } },
]

function CurrentBreakpoint() {
  const { t } = useLang()
  const sm = useMediaQuery(`(min-width: ${breakpoints.sm})`)
  const md = useMediaQuery(`(min-width: ${breakpoints.md})`)
  const lg = useMediaQuery(`(min-width: ${breakpoints.lg})`)
  const xl = useMediaQuery(`(min-width: ${breakpoints.xl})`)
  const xxl = useMediaQuery(`(min-width: ${breakpoints['2xl']})`)
  const current = xxl ? '2xl' : xl ? 'xl' : lg ? 'lg' : md ? 'md' : sm ? 'sm' : 'base'
  return (
    <p className="guide-live" role="status">
      {t({ pt: 'Breakpoint atual desta janela: ', en: 'Current breakpoint for this window: ' })}
      <strong>{current}</strong>
      {t({ pt: ' — redimensione para ver mudar.', en: ' — resize to see it change.' })}
    </p>
  )
}

export default function GridPage() {
  const { t } = useLang()
  const maxSpace = px(space[24])

  return (
    <DocPage
      eyebrow={{ pt: 'Design guidelines', en: 'Design guidelines' }}
      title={{ pt: 'Grid', en: 'Grid' }}
      lead={{
        pt: 'Doze colunas, um contêiner de 1200px, gutter de 32px e uma escala de espaço em múltiplos de 4. A grade do Orange é explícita: aparece nas bordas, nas linhas verticais do hero e no alinhamento de cada bloco.',
        en: 'Twelve columns, a 1200px container, a 32px gutter and a spacing scale in multiples of 4. Orange’s grid is explicit: it shows in the borders, in the hero’s vertical lines and in how every block aligns.',
      }}
    >
      <Section title={{ pt: 'Grade de 12 colunas', en: '12-column grid' }}>
        <Prose>
          <p>
            <T
              pt="Doze divide bem em 2, 3, 4 e 6, o que cobre quase todos os layouts de produto: metade e metade, três cartões, quatro métricas, conteúdo com barra lateral. As linhas abaixo mostram a grade e algumas combinações comuns."
              en="Twelve divides evenly into 2, 3, 4 and 6, which covers nearly every product layout: half and half, three cards, four metrics, content with a sidebar. The lines below show the grid and some common combinations."
            />
          </p>
        </Prose>
        <div className="guide-grid-demo" role="img" aria-label={t({ pt: 'Grade de 12 colunas com exemplos de divisão: 12, 6+6, 4+4+4, 3×4, 8+4 e 3+9', en: '12-column grid with split examples: 12, 6+6, 4+4+4, 3×4, 8+4 and 3+9' })}>
          <div className="guide-grid-demo__lines" aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
          {spans.map((row) => (
            <div key={row.label} className="guide-grid-demo__row">
              {row.cols.map((cols, i) => (
                <span key={i} className="guide-grid-demo__cell" style={{ gridColumn: `span ${cols}` }}>
                  {cols}
                </span>
              ))}
            </div>
          ))}
        </div>
        <CodeBlock
          language="css"
          title="layout.css"
          code={`.pagina {
  max-width: var(--or-layout-max-width);   /* 1200px */
  margin-inline: auto;
  padding-inline: var(--or-layout-gutter); /* 32px */
}

.grade {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--or-layout-gutter);
  row-gap: var(--or-space-8);
}

.grade__principal { grid-column: span 8; }
.grade__lateral   { grid-column: span 4; }`}
        />
      </Section>

      <Section title={{ pt: 'Contêiner e gutter', en: 'Container and gutter' }}>
        <div className="guide-container-demo" aria-hidden="true">
          <span className="guide-container-demo__margin">auto</span>
          <span className="guide-container-demo__box">
            <span className="guide-container-demo__gutter">{parseFloat(layout.gutter) * 16}px</span>
            <span className="guide-container-demo__content">max-width {layout['max-width']}</span>
            <span className="guide-container-demo__gutter">{parseFloat(layout.gutter) * 16}px</span>
          </span>
          <span className="guide-container-demo__margin">auto</span>
        </div>
        <TableWrap label={{ pt: 'Tokens de layout', en: 'Layout tokens' }}>
          <table className="doc-table">
            <thead>
              <tr>
                <th scope="col">Token</th>
                <th scope="col">{t({ pt: 'Valor', en: 'Value' })}</th>
                <th scope="col">{t({ pt: 'Uso', en: 'Usage' })}</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ['max-width', { pt: 'Largura máxima do conteúdo; acima disso, margens automáticas.', en: 'Maximum content width; beyond it, automatic margins.' }],
                  ['gutter', { pt: 'Espaço entre colunas e margem lateral do contêiner.', en: 'Space between columns and the container side margin.' }],
                  ['header-height', { pt: 'Altura do cabeçalho fixo; também usada no scroll-padding-top.', en: 'Sticky header height; also used for scroll-padding-top.' }],
                  ['sidebar-width', { pt: 'Largura da navegação lateral a partir de lg.', en: 'Side navigation width from lg up.' }],
                ] as [keyof typeof layout, Localized<string>][]
              ).map(([name, usage]) => (
                <tr key={name}>
                  <th scope="row">
                    <Code>--or-layout-{name}</Code>
                  </th>
                  <td>
                    <span className="guide-mono">
                      {layout[name]}
                      {layout[name].endsWith('rem') ? ` · ${px(layout[name])}px` : ''}
                    </span>
                  </td>
                  <td>{t(usage)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Section>

      <Section title={{ pt: 'Breakpoints', en: 'Breakpoints' }}>
        <Prose>
          <p>
            <T
              pt={<>Os breakpoints são <em>min-width</em> (mobile first). Custom properties não funcionam dentro de <Code>@media</Code>, então em CSS os valores são repetidos; em JavaScript, importe <Code>breakpoints</Code> de <Code>@orange/tokens</Code> e use <Code>useMediaQuery</Code>.</>}
              en={<>Breakpoints are <em>min-width</em> (mobile first). Custom properties don’t work inside <Code>@media</Code>, so CSS repeats the values; in JavaScript, import <Code>breakpoints</Code> from <Code>@orange/tokens</Code> and use <Code>useMediaQuery</Code>.</>}
            />
          </p>
        </Prose>
        <CurrentBreakpoint />
        <TableWrap label={{ pt: 'Breakpoints e colunas', en: 'Breakpoints and columns' }}>
          <table className="doc-table">
            <thead>
              <tr>
                <th scope="col">{t({ pt: 'Nome', en: 'Name' })}</th>
                <th scope="col">min-width</th>
                <th scope="col">{t({ pt: 'Colunas', en: 'Columns' })}</th>
                <th scope="col">Gutter</th>
                <th scope="col">{t({ pt: 'Uso típico', en: 'Typical use' })}</th>
              </tr>
            </thead>
            <tbody>
              {breakpointRows.map((row) => (
                <tr key={row.name}>
                  <th scope="row">
                    <Code>{row.name}</Code>
                  </th>
                  <td>
                    <span className="guide-mono">{row.min === '0' ? '0' : row.min}</span>
                  </td>
                  <td>
                    <span className="guide-cols">
                      {Array.from({ length: row.columns }, (_, i) => (
                        <span key={i} aria-hidden="true" />
                      ))}
                      <span className="guide-mono">{row.columns}</span>
                    </span>
                  </td>
                  <td>
                    <span className="guide-mono">{row.gutter}</span>
                  </td>
                  <td>{t(row.usage)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
        <CodeBlock
          language="tsx"
          title="responsivo.tsx"
          code={`import { breakpoints } from '@orange/tokens'
import { useMediaQuery } from '@orange/ui'

// CSS: @media (min-width: 1024px) { … }
const desktop = useMediaQuery(\`(min-width: \${breakpoints.lg})\`)

return desktop ? <TabelaCompleta /> : <ListaDeCartoes />`}
        />
      </Section>

      <Section title={{ pt: 'Escala de espaço', en: 'Spacing scale' }}>
        <Prose>
          <p>
            <T
              pt={<>Todo espaçamento — padding, margin, gap — vem de <Code>--or-space-*</Code>. A unidade base é 4px (<Code>--or-space-1</Code>); o número do token multiplicado por 4 dá o valor em pixels.</>}
              en={<>Every spacing value — padding, margin, gap — comes from <Code>--or-space-*</Code>. The base unit is 4px (<Code>--or-space-1</Code>); the token number times 4 gives the pixel value.</>}
            />
          </p>
        </Prose>
        <ul className="guide-space">
          {Object.entries(space)
            .filter(([k]) => k !== '0')
            .map(([name, value]) => (
              <li key={name}>
                <span className="guide-space__token">--or-space-{name}</span>
                <span className="guide-space__value">
                  {value} · {px(value)}px
                </span>
                <span className="guide-space__track" aria-hidden="true">
                  <span className="guide-space__bar" style={{ width: `${(px(value) / maxSpace) * 100}%` }} />
                </span>
              </li>
            ))}
        </ul>
        <Bullets
          items={[
            { pt: <><strong>1–3 (4–12px):</strong> dentro de componentes — ícone e rótulo, itens de uma lista compacta.</>, en: <><strong>1–3 (4–12px):</strong> inside components — icon and label, compact list items.</> },
            { pt: <><strong>4–6 (16–24px):</strong> entre elementos relacionados — campos de um formulário, padding de cartões.</>, en: <><strong>4–6 (16–24px):</strong> between related elements — form fields, card padding.</> },
            { pt: <><strong>8–12 (32–48px):</strong> entre grupos — blocos de uma página, colunas.</>, en: <><strong>8–12 (32–48px):</strong> between groups — page blocks, columns.</> },
            { pt: <><strong>14–24 (56–96px):</strong> entre seções e em páginas de marketing.</>, en: <><strong>14–24 (56–96px):</strong> between sections and on marketing pages.</> },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Layout de página', en: 'Page layout' }}>
        <Prose>
          <p>
            <T
              pt={<>O layout de aplicação do Orange — o mesmo desta documentação — tem cabeçalho fixo de 64px (<Code>--or-layout-header-height</Code>), navegação lateral de 280px (<Code>--or-layout-sidebar-width</Code>) e conteúdo com largura de leitura limitada. Abaixo de <Code>lg</Code>, a lateral vira uma gaveta.</>}
              en={<>Orange’s application layout — the same as these docs — has a 64px sticky header (<Code>--or-layout-header-height</Code>), a 280px side navigation (<Code>--or-layout-sidebar-width</Code>) and content with a limited reading width. Below <Code>lg</Code>, the side panel becomes a drawer.</>}
            />
          </p>
        </Prose>
        <div className="guide-shell-demo" role="img" aria-label={t({ pt: 'Esquema do layout: cabeçalho de 64px no topo, navegação lateral de 280px à esquerda, conteúdo e índice à direita', en: 'Layout diagram: 64px header on top, 280px side navigation on the left, content and index on the right' })}>
          <span className="guide-shell-demo__header">
            header · {px(layout['header-height'])}px
          </span>
          <span className="guide-shell-demo__sidebar">
            sidebar · {px(layout['sidebar-width'])}px
          </span>
          <span className="guide-shell-demo__main">
            <span className="guide-shell-demo__line guide-shell-demo__line--title" />
            <span className="guide-shell-demo__line" />
            <span className="guide-shell-demo__line" />
            <span className="guide-shell-demo__line guide-shell-demo__line--short" />
            <span className="guide-shell-demo__label">main · max 72ch</span>
          </span>
          <span className="guide-shell-demo__toc">toc · ≥ xl</span>
        </div>
        <CodeBlock
          language="css"
          title="app-shell.css"
          code={`.app {
  display: grid;
  grid-template-columns: var(--or-layout-sidebar-width) minmax(0, 1fr);
  grid-template-rows: var(--or-layout-header-height) 1fr;
  min-height: 100vh;
}

.app__header {
  grid-column: 1 / -1;
  position: sticky;
  top: 0;
  z-index: var(--or-z-header);
  border-bottom: 1px solid var(--or-color-border);
}

@media (max-width: 1023px) {
  .app { grid-template-columns: minmax(0, 1fr); }
  .app__sidebar { /* vira gaveta com useFocusTrap + Escape */ }
}`}
        />
      </Section>

      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <DoDont
          doItems={[
            { pt: 'Alinhe blocos às colunas e use o mesmo gutter em toda a página.', en: 'Align blocks to columns and use the same gutter across the page.' },
            { pt: 'Separe áreas com bordas de 1px e espaço, não com sombras.', en: 'Separate areas with 1px borders and space, not shadows.' },
            { pt: 'Use minmax(0, 1fr) nas colunas para que conteúdo longo não estoure a grade.', en: 'Use minmax(0, 1fr) for columns so long content doesn’t break the grid.' },
            { pt: 'Teste em 320px de largura: nada de rolagem horizontal (1.4.10).', en: 'Test at 320px width: no horizontal scrolling (1.4.10).' },
          ]}
          dontItems={[
            { pt: 'Valores mágicos como 13px ou 27px fora da escala.', en: 'Magic values like 13px or 27px outside the scale.' },
            { pt: 'Larguras fixas em pixels para colunas de conteúdo.', en: 'Fixed pixel widths for content columns.' },
            { pt: 'Texto corrido ocupando 1200px inteiros — limite a 72ch.', en: 'Running text spanning the full 1200px — cap it at 72ch.' },
            { pt: 'Esconder conteúdo no mobile em vez de reorganizá-lo.', en: 'Hiding content on mobile instead of reflowing it.' },
          ]}
        />
      </Section>
    </DocPage>
  )
}
