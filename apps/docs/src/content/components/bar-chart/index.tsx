import { Link } from 'react-router-dom'
import { T, useLang } from '../../../i18n'
import {
  Bullets,
  Code,
  ComponentPage,
  DefinitionTable,
  DoDont,
  Example,
  KeyboardTable,
  PropsTable,
  Section,
  WcagList,
} from '../../../kit'
import Highlight from './examples/Highlight'
import HighlightCode from './examples/Highlight?raw'
import NegativeValues from './examples/NegativeValues'
import NegativeValuesCode from './examples/NegativeValues?raw'
import OrdersByCategory from './examples/OrdersByCategory'
import OrdersByCategoryCode from './examples/OrdersByCategory?raw'
import RevenueByRegion from './examples/RevenueByRegion'
import RevenueByRegionCode from './examples/RevenueByRegion?raw'
import SalesByChannel from './examples/SalesByChannel'
import SalesByChannelCode from './examples/SalesByChannel?raw'
import { meta } from './meta'

export default function BarChartPage() {
  const { to } = useLang()
  const guideline = to('/design-guidelines/data-visualization')
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: (
                <>
                  Barras comparam quantidades entre categorias. Para evolução contínua no tempo use{' '}
                  <strong>LineChart</strong>; para um único número, <strong>Stat</strong>. As regras
                  vêm da diretriz <Link to={guideline}>Visualização de dados</Link>.
                </>
              ),
              en: (
                <>
                  Bars compare quantities across categories. For continuous change over time use{' '}
                  <strong>LineChart</strong>; for a single number, <strong>Stat</strong>. The rules
                  come from the <Link to={guideline}>Data visualization</Link> guideline.
                </>
              ),
            },
            {
              pt: 'O eixo começa sempre em zero (o componente garante). Use a orientação horizontal quando os rótulos forem longos.',
              en: 'The axis always starts at zero (the component enforces it). Use the horizontal orientation when labels are long.',
            },
            {
              pt: (
                <>
                  Até cinco séries, com as cores <Code>--or-color-viz-1…5</Code> na ordem. A sexta
                  não ganha cor nova: agrupe em “Outros” com <Code>--or-color-viz-other</Code>.
                </>
              ),
              en: (
                <>
                  Up to five series, colored <Code>--or-color-viz-1…5</Code> in order. A sixth
                  doesn’t get a new color: group it into “Other” with{' '}
                  <Code>--or-color-viz-other</Code>.
                </>
              ),
            },
            {
              pt: (
                <>
                  <Code>title</Code> diz o quê, <Code>description</Code> diz quando e em que
                  unidade, <Code>source</Code> diz de onde. Escreva a conclusão em{' '}
                  <Code>summary</Code>: é o que o leitor de tela ouve primeiro.
                </>
              ),
              en: (
                <>
                  <Code>title</Code> says what, <Code>description</Code> says when and in which
                  unit, <Code>source</Code> says where from. Write the takeaway in{' '}
                  <Code>summary</Code>: it’s what screen readers hear first.
                </>
              ),
            },
          ]}
        />
        <DoDont
          doItems={[
            {
              pt: 'Destacar uma barra com highlight (acento) e deixar o resto no neutro.',
              en: 'Highlight one bar with highlight (accent) and leave the rest neutral.',
            },
            {
              pt: 'Mostrar valores (showValues) quando são poucos e importam; o resto fica na dica e na tabela.',
              en: 'Show values (showValues) when there are few and they matter; the rest lives in the tooltip and the table.',
            },
            {
              pt: 'Formatar com valueFormat (moeda, sem casas decimais em valores grandes).',
              en: 'Format with valueFormat (currency, no decimals on large values).',
            },
          ]}
          dontItems={[
            {
              pt: 'Pintar cada barra de uma cor quando há uma só série.',
              en: 'Paint each bar a different color when there is a single series.',
            },
            {
              pt: 'Dois eixos Y no mesmo gráfico: faça dois gráficos.',
              en: 'Two Y axes in one chart: make two charts.',
            },
            {
              pt: 'Empilhar mais de cinco partes ou partes que não somam um todo.',
              en: 'Stack more than five parts, or parts that don’t add up to a whole.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Título e subtítulo', en: 'Title and subtitle' },
              description: {
                pt: 'O <figcaption> da figura: title em display bold, description em text-subtle. hideCaption os esconde só visualmente.',
                en: 'The figure’s <figcaption>: title in display bold, description in text-subtle. hideCaption hides them visually only.',
              },
            },
            {
              term: { pt: 'Legenda', en: 'Legend' },
              description: {
                pt: 'Acima do gráfico, na ordem das séries, com a marca e o nome em cor de texto. Só com 2 ou mais séries.',
                en: 'Above the chart, in series order, with the mark and the name in text color. Only with 2 or more series.',
              },
            },
            {
              term: { pt: 'Eixos e grade', en: 'Axes and grid' },
              description: {
                pt: 'Números “redondos” em --or-font-mono / --or-text-xs; grade de 1px em border; base (zero) em border-strong. Valores a partir de 10 mil ficam compactos (R$ 10 mil).',
                en: '“Nice” numbers in --or-font-mono / --or-text-xs; 1px grid in border; baseline (zero) in border-strong. Values from 10,000 up are compacted (R$10K).',
              },
            },
            {
              term: { pt: 'Barras', en: 'Bars' },
              description: {
                pt: 'Retas, até 56px de largura (24px na horizontal), separadas por 2px de fundo — também entre segmentos empilhados.',
                en: 'Square, up to 56px wide (24px when horizontal), separated by 2px of background — stacked segments too.',
              },
            },
            {
              term: { pt: 'Dica', en: 'Tooltip' },
              description: {
                pt: 'Todas as séries da categoria: valor primeiro, nome depois, e o total na pilha.',
                en: 'Every series in the category: value first, name second, plus the stack total.',
              },
            },
            {
              term: { pt: 'Ver dados', en: 'Show data' },
              description: {
                pt: 'A tabela com os mesmos números. Sempre presente para leitores de tela; o botão a mostra na tela.',
                en: 'The table with the same numbers. Always present for screen readers; the button shows it on screen.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Agrupado', en: 'Grouped' }}
          description={{
            pt: 'Vendas por canal por mês. Passe o mouse ou foque o gráfico e use as setas.',
            en: 'Sales by channel per month. Hover or focus the chart and use the arrow keys.',
          }}
          code={SalesByChannelCode}
        >
          <SalesByChannel />
        </Example>
        <Example
          title={{ pt: 'Horizontal', en: 'Horizontal' }}
          description={{
            pt: 'Para rótulos longos. Com showValues, o valor fica na ponta da barra.',
            en: 'For long labels. With showValues the value sits at the tip of the bar.',
          }}
          code={OrdersByCategoryCode}
        >
          <OrdersByCategory />
        </Example>
        <Example
          title={{ pt: 'Empilhado', en: 'Stacked' }}
          description={{
            pt: 'Partes de um todo ao longo do tempo. showValues escreve o total; a tabela ganha a coluna Total.',
            en: 'Parts of a whole over time. showValues writes the total; the table gets a Total column.',
          }}
          code={RevenueByRegionCode}
        >
          <RevenueByRegion />
        </Example>
        <Example
          title={{ pt: 'Destaque', en: 'Highlight' }}
          description={{
            pt: 'Uma série, uma barra no acento e o resto no neutro — o acento continua único.',
            en: 'One series, one bar in the accent and the rest neutral — the accent stays single.',
          }}
          code={HighlightCode}
        >
          <Highlight />
        </Example>
        <Example
          title={{ pt: 'Valores negativos', en: 'Negative values' }}
          description={{
            pt: 'No modo agrupado, barras negativas descem a partir do zero.',
            en: 'In grouped mode, negative bars go down from zero.',
          }}
          code={NegativeValuesCode}
        >
          <NegativeValues />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Entrada', en: 'Entrance' },
              description: {
                pt: 'Uma vez, quando o gráfico entra na tela (useInView): cada categoria cresce a partir da base (scaleY, ou scaleX na horizontal, com transform-origin na linha do zero). --or-duration-reveal, --or-ease-out, escalonado com --or-stagger.',
                en: 'Once, when the chart enters the viewport (useInView): each category grows from the baseline (scaleY, or scaleX when horizontal, with transform-origin on the zero line). --or-duration-reveal, --or-ease-out, staggered by --or-stagger.',
              },
            },
            {
              term: { pt: 'Rótulos de valor', en: 'Value labels' },
              description: {
                pt: 'Aparecem logo depois das barras (opacidade, --or-duration-medium).',
                en: 'Fade in right after the bars (opacity, --or-duration-medium).',
              },
            },
            {
              term: { pt: 'Destaque e dica', en: 'Highlight and tooltip' },
              description: {
                pt: 'A faixa da categoria e a dica deslizam para a nova posição e as outras barras recuam (opacidade), em --or-duration-fast.',
                en: 'The category band and the tooltip slide to the new position and the other bars recede (opacity), in --or-duration-fast.',
              },
            },
            {
              term: { pt: 'Ver dados', en: 'Show data' },
              description: {
                pt: 'A tabela expande (or-collapse, --or-duration-slow) e o chevron gira 180°.',
                en: 'The table expands (or-collapse, --or-duration-slow) and the chevron turns 180°.',
              },
            },
            {
              term: { pt: 'Movimento reduzido', en: 'Reduced motion' },
              description: {
                pt: 'Tudo aparece desenhado, sem crescer nem deslizar. O destaque e a dica continuam indicando o valor.',
                en: 'Everything appears fully drawn, without growing or sliding. The highlight and the tooltip still indicate the value.',
              },
            },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            {
              name: 'title',
              type: 'string',
              required: true,
              description: {
                pt: 'O que o gráfico mostra. Vira o <figcaption> e o nome do gráfico.',
                en: 'What the chart shows. Becomes the <figcaption> and the chart’s name.',
              },
            },
            {
              name: 'data',
              type: '{ label: string; values: Record<string, number | null> }[]',
              required: true,
              description: {
                pt: 'Uma entrada por categoria, com o valor de cada série pela key.',
                en: 'One entry per category, with each series’ value by key.',
              },
            },
            {
              name: 'series',
              type: '{ key: string; label: string; color?: string }[]',
              required: true,
              description: {
                pt: 'Séries na ordem da legenda. color sobrescreve o token viz da posição.',
                en: 'Series in legend order. color overrides the viz token for that position.',
              },
            },
            {
              name: 'orientation',
              type: "'vertical' | 'horizontal'",
              default: "'vertical'",
              description: {
                pt: 'Colunas ou barras deitadas (rótulos longos).',
                en: 'Columns or lying bars (long labels).',
              },
            },
            {
              name: 'layout',
              type: "'grouped' | 'stacked'",
              default: "'grouped'",
              description: {
                pt: 'Lado a lado ou empilhadas (com total).',
                en: 'Side by side or stacked (with total).',
              },
            },
            {
              name: 'showValues',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Valor na ponta de cada barra (ou total da pilha), quando couber.',
                en: 'Value at the tip of each bar (or stack total), when it fits.',
              },
            },
            {
              name: 'highlight',
              type: 'string',
              description: {
                pt: 'label da categoria em destaque (acento); as demais no neutro. Uma série.',
                en: 'label of the highlighted category (accent); the rest neutral. Single series.',
              },
            },
            {
              name: 'valueFormat',
              type: '((n: number) => string) | Intl.NumberFormatOptions',
              description: {
                pt: (
                  <>
                    Formato dos números no idioma do <Code>OrangeProvider</Code>. Ex.:{' '}
                    <Code>{"{ style: 'currency', currency: 'BRL' }"}</Code>.
                  </>
                ),
                en: (
                  <>
                    Number format in the <Code>OrangeProvider</Code> locale. E.g.{' '}
                    <Code>{"{ style: 'currency', currency: 'BRL' }"}</Code>.
                  </>
                ),
              },
            },
            {
              name: 'description',
              type: 'ReactNode',
              description: {
                pt: 'Subtítulo: período e unidade.',
                en: 'Subtitle: period and unit.',
              },
            },
            {
              name: 'summary',
              type: 'string',
              description: {
                pt: 'Conclusão para leitores de tela. Padrão: séries, maior e menor valor.',
                en: 'Takeaway for screen readers. Default: series, highest and lowest value.',
              },
            },
            {
              name: 'source',
              type: 'ReactNode',
              description: {
                pt: 'Fonte dos dados, abaixo do gráfico.',
                en: 'Data source, below the chart.',
              },
            },
            {
              name: 'height',
              type: 'number',
              default: '280',
              description: {
                pt: 'Altura em px, incluindo os rótulos do eixo. Na horizontal, padrão automático pelo número de categorias.',
                en: 'Height in px, axis labels included. Horizontal defaults to an automatic height from the category count.',
              },
            },
            {
              name: 'categoryLabel',
              type: 'string',
              default: "'Categoria'",
              description: {
                pt: 'Cabeçalho da primeira coluna da tabela (ex.: “Mês”).',
                en: 'Header of the table’s first column (e.g. “Month”).',
              },
            },
            {
              name: 'hideCaption',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Esconde título e subtítulo só visualmente.',
                en: 'Hides title and subtitle visually only.',
              },
            },
            {
              name: 'variant',
              type: "'outline' | 'plain'",
              default: "'outline'",
              description: {
                pt: 'Com moldura de 1px ou sem moldura (dentro de cartões).',
                en: 'With a 1px frame or frameless (inside cards).',
              },
            },
            {
              name: 'defaultShowData',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Começa com a tabela visível.',
                en: 'Starts with the table visible.',
              },
            },
            {
              name: '...rest',
              type: 'HTMLAttributes<HTMLElement>',
              description: {
                pt: 'Repassado ao <figure> (ref também).',
                en: 'Passed to the <figure> (ref too).',
              },
            },
          ]}
        />
        <p>
          <T
            pt={
              <>
                Em cartões, defina <Code>--or-chart-surface</Code> com o fundo do cartão para o anel
                de 2px das marcas acompanhar.
              </>
            }
            en={
              <>
                Inside cards, set <Code>--or-chart-surface</Code> to the card background so the
                marks’ 2px ring matches it.
              </>
            }
          />
        </p>
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Renderiza um <Code>&lt;figure&gt;</Code> nomeado pelo título. O SVG tem{' '}
                <Code>role="img"</Code> e um <Code>aria-label</Code> com o título e o resumo (como
                na diretriz). A tabela de dados fica sempre na árvore de acessibilidade — o botão
                “Ver dados” só a mostra na tela. Ao explorar pelo teclado, uma região{' '}
                <Code>role="status"</Code> anuncia “mar · Site: R$ 52.700”. A dica é visual (
                <Code>aria-hidden</Code>) e nunca é o único caminho para um valor.
              </>
            }
            en={
              <>
                Renders a <Code>&lt;figure&gt;</Code> named by its title. The SVG has{' '}
                <Code>role="img"</Code> and an <Code>aria-label</Code> with the title and the
                summary (as in the guideline). The data table always stays in the accessibility tree
                — the “Show data” button only shows it on screen. While exploring with the keyboard,
                a <Code>role="status"</Code> region announces “mar · Site: R$52,700”. The tooltip is
                visual (<Code>aria-hidden</Code>) and never the only way to a value.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['Tab'],
              description: {
                pt: 'Foca a área do gráfico (e depois o botão Ver dados).',
                en: 'Focuses the chart area (then the Show data button).',
              },
            },
            {
              keys: ['←', '→'],
              description: {
                pt: 'Categoria anterior/próxima (na horizontal: ↑ ↓).',
                en: 'Previous/next category (horizontal: ↑ ↓).',
              },
            },
            {
              keys: ['↑', '↓'],
              description: {
                pt: 'Troca a série dentro da categoria (na horizontal: ← →).',
                en: 'Switches the series within the category (horizontal: ← →).',
              },
            },
            {
              keys: ['Home', 'End'],
              description: { pt: 'Primeira/última categoria.', en: 'First/last category.' },
            },
            {
              keys: ['Esc'],
              description: {
                pt: 'Limpa o destaque e fecha a dica (também a do mouse).',
                en: 'Clears the highlight and closes the tooltip (the hover one too).',
              },
            },
          ]}
        />
        <WcagList
          items={[
            {
              criterion: '1.1.1',
              description: {
                pt: 'Texto alternativo: título + resumo no SVG e a tabela com os dados completos.',
                en: 'Text alternative: title + summary on the SVG and the table with the full data.',
              },
            },
            {
              criterion: '1.3.1',
              description: {
                pt: 'Tabela com <caption> e cabeçalhos de linha e coluna.',
                en: 'Table with <caption> and row and column headers.',
              },
            },
            {
              criterion: '1.4.1',
              description: {
                pt: 'Cor nunca sozinha: legenda com nome, posição fixa das séries, dica e tabela.',
                en: 'Never color alone: legend with names, fixed series position, tooltip and table.',
              },
            },
            {
              criterion: '1.4.11',
              description: {
                pt: 'Cores categóricas com ≥ 3:1 contra o fundo nos dois temas (testado nos tokens).',
                en: 'Categorical colors at ≥ 3:1 against the background in both themes (tested in tokens).',
              },
            },
            {
              criterion: '1.4.13',
              description: {
                pt: 'A dica não bloqueia o ponteiro e fecha com Esc.',
                en: 'The tooltip doesn’t block the pointer and closes with Esc.',
              },
            },
            {
              criterion: '2.1.1',
              description: {
                pt: 'Todos os valores são alcançáveis pelo teclado.',
                en: 'Every value is reachable by keyboard.',
              },
            },
            {
              criterion: '2.3.3',
              description: {
                pt: 'Sem animação com prefers-reduced-motion.',
                en: 'No animation with prefers-reduced-motion.',
              },
            },
            {
              criterion: '4.1.3',
              description: {
                pt: 'Valor em destaque anunciado por role="status".',
                en: 'Highlighted value announced through role="status".',
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
