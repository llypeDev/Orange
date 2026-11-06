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
import InCard from './examples/InCard'
import InCardCode from './examples/InCard?raw'
import SalesByChannel from './examples/SalesByChannel'
import SalesByChannelCode from './examples/SalesByChannel?raw'
import TicketsByStatus from './examples/TicketsByStatus'
import TicketsByStatusCode from './examples/TicketsByStatus?raw'
import { meta } from './meta'

export default function DonutChartPage() {
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
                  A rosca mostra partes de <strong>um</strong> todo num momento. Para comparar
                  quantidades entre categorias use <strong>BarChart</strong> ou{' '}
                  <strong>BarList</strong>; para partes de um todo ao longo do tempo,{' '}
                  <strong>BarChart</strong> empilhado. As regras vêm da diretriz{' '}
                  <Link to={guideline}>Visualização de dados</Link>.
                </>
              ),
              en: (
                <>
                  A donut shows the parts of <strong>one</strong> whole at one moment. To compare
                  quantities across categories use <strong>BarChart</strong> or{' '}
                  <strong>BarList</strong>; for parts of a whole over time, a stacked{' '}
                  <strong>BarChart</strong>. The rules come from the{' '}
                  <Link to={guideline}>Data visualization</Link> guideline.
                </>
              ),
            },
            {
              pt: (
                <>
                  Até cinco fatias, com as cores <Code>--or-color-viz-1…5</Code> na ordem. O resto
                  vira “Outros”, no fim, com <Code>--or-color-viz-other</Code>.
                </>
              ),
              en: (
                <>
                  Up to five slices, colored <Code>--or-color-viz-1…5</Code> in order. The rest
                  becomes “Other”, last, with <Code>--or-color-viz-other</Code>.
                </>
              ),
            },
            {
              pt: 'Ordene as fatias da maior para a menor (com “Outros” por último): o desenho começa no topo e segue no sentido horário, na mesma ordem da legenda.',
              en: 'Order slices from largest to smallest (with “Other” last): the drawing starts at the top and goes clockwise, in the same order as the legend.',
            },
            {
              pt: (
                <>
                  Os percentuais são inteiros arredondados pelo maior resto: a legenda sempre soma
                  100%. O valor exato fica na legenda e na tabela “Ver dados”. Use{' '}
                  <Code>centerLabel</Code> para dizer o que o total conta (“tickets”, “pedidos”).
                </>
              ),
              en: (
                <>
                  Percentages are integers rounded by largest remainder: the legend always adds up
                  to 100%. The exact value is in the legend and in the “Show data” table. Use{' '}
                  <Code>centerLabel</Code> to say what the total counts (“tickets”, “orders”).
                </>
              ),
            },
          ]}
        />
        <DoDont
          doItems={[
            {
              pt: 'Escrever a conclusão em summary (“Seis em cada dez tickets já foram resolvidos”).',
              en: 'Write the takeaway in summary (“Six in ten tickets are already resolved”).',
            },
            {
              pt: 'Agrupar fatias pequenas em “Outros” com o neutro.',
              en: 'Group small slices into “Other” with the neutral color.',
            },
            {
              pt: 'Formatar com valueFormat (moeda, sem casas decimais em valores grandes).',
              en: 'Format with valueFormat (currency, no decimals on large values).',
            },
          ]}
          dontItems={[
            {
              pt: 'Mais de cinco fatias coloridas, ou fatias que não somam um todo (ex.: respostas de múltipla escolha).',
              en: 'More than five colored slices, or slices that don’t add up to a whole (e.g. multiple-choice answers).',
            },
            {
              pt: 'Comparar duas roscas lado a lado para ver variação: use barras.',
              en: 'Compare two donuts side by side to show change: use bars.',
            },
            {
              pt: 'Valores negativos: a rosca só mostra partes positivas (negativos contam como zero).',
              en: 'Negative values: a donut only shows positive parts (negatives count as zero).',
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
                pt: 'O <figcaption> da figura, como em BarChart e LineChart. hideCaption os esconde só visualmente.',
                en: 'The figure’s <figcaption>, as in BarChart and LineChart. hideCaption hides them visually only.',
              },
            },
            {
              term: { pt: 'Anel', en: 'Ring' },
              description: {
                pt: 'Fatias retas separadas por 2px de fundo (--or-chart-surface), a partir do topo, no sentido horário. O diâmetro é height (padrão 200px) e encolhe para caber.',
                en: 'Square-cut slices separated by 2px of background (--or-chart-surface), from the top, clockwise. The diameter is height (200px by default) and shrinks to fit.',
              },
            },
            {
              term: { pt: 'Centro', en: 'Center' },
              description: {
                pt: 'O total formatado (display bold) e centerLabel (padrão “Total”). Com uma fatia em destaque, mostra o percentual e o nome dela.',
                en: 'The formatted total (display bold) and centerLabel (“Total” by default). With a highlighted slice, it shows that slice’s percentage and name.',
              },
            },
            {
              term: { pt: 'Legenda', en: 'Legend' },
              description: {
                pt: 'Ao lado do anel (abaixo, em telas estreitas): marca de cor, nome, valor e percentual, em colunas alinhadas.',
                en: 'Beside the ring (below it on narrow screens): color mark, name, value and percentage, in aligned columns.',
              },
            },
            {
              term: { pt: 'Ver dados', en: 'Show data' },
              description: {
                pt: 'A tabela com valor, participação e a linha Total. Sempre presente para leitores de tela; o botão a mostra na tela.',
                en: 'The table with value, share and a Total row. Always present for screen readers; the button shows it on screen.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Participação por canal', en: 'Share by channel' }}
          description={{
            pt: 'Passe o mouse numa fatia ou na legenda, ou foque o gráfico e use as setas.',
            en: 'Hover a slice or the legend, or focus the chart and use the arrow keys.',
          }}
          code={SalesByChannelCode}
        >
          <SalesByChannel />
        </Example>
        <Example
          title={{ pt: 'Contagens e resumo', en: 'Counts and summary' }}
          description={{
            pt: 'Sem valueFormat, os números seguem o idioma. centerLabel diz o que o total conta e summary dá a conclusão ao leitor de tela.',
            en: 'Without valueFormat, numbers follow the locale. centerLabel says what the total counts and summary gives screen readers the takeaway.',
          }}
          code={TicketsByStatusCode}
        >
          <TicketsByStatus />
        </Example>
        <Example
          title={{ pt: 'Em um cartão', en: 'Inside a card' }}
          description={{
            pt: 'variant="plain" e hideCaption quando o cartão já tem o título; --or-chart-surface com o fundo do cartão mantém o espaço entre as fatias.',
            en: 'variant="plain" and hideCaption when the card already has the title; --or-chart-surface set to the card background keeps the gap between slices.',
          }}
          code={InCardCode}
        >
          <InCard />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Entrada', en: 'Entrance' },
              description: {
                pt: 'Uma vez, quando o gráfico entra na tela (useInView): uma máscara varre o anel a partir do topo, no sentido horário (stroke-dashoffset, --or-duration-reveal × 1,5, --or-ease-in-out); o centro aparece em seguida (opacidade, --or-duration-medium).',
                en: 'Once, when the chart enters the viewport (useInView): a mask sweeps the ring from the top, clockwise (stroke-dashoffset, --or-duration-reveal × 1.5, --or-ease-in-out); the center fades in right after (opacity, --or-duration-medium).',
              },
            },
            {
              term: { pt: 'Destaque', en: 'Highlight' },
              description: {
                pt: 'A fatia ativa se afasta 4px do centro e as outras recuam (opacidade); no centro, o total dá lugar ao percentual da fatia — tudo em --or-duration-fast.',
                en: 'The active slice moves 4px away from the center and the others recede (opacity); in the center, the total gives way to the slice’s percentage — all in --or-duration-fast.',
              },
            },
            {
              term: { pt: 'Movimento reduzido', en: 'Reduced motion' },
              description: {
                pt: 'O anel aparece desenhado, sem varredura. O destaque continua indicando a fatia.',
                en: 'The ring appears fully drawn, without the sweep. The highlight still indicates the slice.',
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
              type: '{ label: string; value: number; color?: string }[]',
              required: true,
              description: {
                pt: 'Fatias na ordem do desenho e da legenda. value ≥ 0; color sobrescreve o token viz da posição.',
                en: 'Slices in drawing and legend order. value ≥ 0; color overrides the viz token for that position.',
              },
            },
            {
              name: 'centerLabel',
              type: 'string',
              default: "'Total'",
              description: {
                pt: 'Legenda pequena sob o total, no centro (ex.: “tickets”). Entra também no resumo.',
                en: 'Small caption under the total, in the center (e.g. “tickets”). Also used in the summary.',
              },
            },
            {
              name: 'valueFormat',
              type: '((n: number) => string) | Intl.NumberFormatOptions',
              description: {
                pt: (
                  <>
                    Formato dos valores (centro, legenda, tabela) no idioma do{' '}
                    <Code>OrangeProvider</Code>. Ex.:{' '}
                    <Code>{"{ style: 'currency', currency: 'BRL' }"}</Code>.
                  </>
                ),
                en: (
                  <>
                    Value format (center, legend, table) in the <Code>OrangeProvider</Code> locale.
                    E.g. <Code>{"{ style: 'currency', currency: 'BRL' }"}</Code>.
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
                pt: 'Conclusão para leitores de tela. Padrão: o total e cada fatia com valor e percentual.',
                en: 'Takeaway for screen readers. Default: the total and each slice with value and percentage.',
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
              default: '200',
              description: {
                pt: 'Diâmetro da rosca em px. Encolhe para caber na largura disponível.',
                en: 'Donut diameter in px. Shrinks to fit the available width.',
              },
            },
            {
              name: 'categoryLabel',
              type: 'string',
              default: "'Categoria'",
              description: {
                pt: 'Cabeçalho da primeira coluna da tabela (ex.: “Canal”).',
                en: 'Header of the table’s first column (e.g. “Channel”).',
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
                pt: 'Com moldura de 1px ou sem moldura (dentro de cartões), como nos outros gráficos.',
                en: 'With a 1px frame or frameless (inside cards), as in the other charts.',
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
                Em cartões, defina <Code>--or-chart-surface</Code> com o fundo do cartão para o
                espaço de 2px entre as fatias acompanhar.
              </>
            }
            en={
              <>
                Inside cards, set <Code>--or-chart-surface</Code> to the card background so the 2px
                gap between slices matches it.
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
                Renderiza um <Code>&lt;figure&gt;</Code> nomeado pelo título, como BarChart e
                LineChart. O SVG tem <Code>role="img"</Code> e um <Code>aria-label</Code> com o
                título e o resumo (“Total: R$ 128.400. Site: R$ 48.200 (38%), …”). A legenda é uma
                lista com nome, valor e percentual de cada fatia, e a tabela de dados fica sempre na
                árvore de acessibilidade — o botão “Ver dados” só a mostra na tela. O gráfico é{' '}
                <strong>uma</strong> parada de Tab (as fatias não são): as setas movem o destaque e
                uma região <Code>role="status"</Code> anuncia “Site: R$ 48.200 (38%)”. O destaque
                pelo ponteiro (fatia ou legenda) é só visual.
              </>
            }
            en={
              <>
                Renders a <Code>&lt;figure&gt;</Code> named by its title, like BarChart and
                LineChart. The SVG has <Code>role="img"</Code> and an <Code>aria-label</Code> with
                the title and the summary (“Total: R$128,400. Site: R$48,200 (38%), …”). The legend
                is a list with each slice’s name, value and percentage, and the data table always
                stays in the accessibility tree — the “Show data” button only shows it on screen.
                The chart is <strong>one</strong> Tab stop (slices aren’t): the arrow keys move the
                highlight and a <Code>role="status"</Code> region announces “Site: R$48,200 (38%)”.
                The pointer highlight (slice or legend) is visual only.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['Tab'],
              description: {
                pt: 'Foca o gráfico (e depois o botão Ver dados).',
                en: 'Focuses the chart (then the Show data button).',
              },
            },
            {
              keys: ['→', '↓'],
              description: {
                pt: 'Próxima fatia (sentido horário / próxima linha da legenda).',
                en: 'Next slice (clockwise / next legend row).',
              },
            },
            {
              keys: ['←', '↑'],
              description: { pt: 'Fatia anterior.', en: 'Previous slice.' },
            },
            {
              keys: ['Home', 'End'],
              description: { pt: 'Primeira/última fatia.', en: 'First/last slice.' },
            },
            {
              keys: ['Esc'],
              description: {
                pt: 'Limpa o destaque (também o do mouse).',
                en: 'Clears the highlight (the hover one too).',
              },
            },
          ]}
        />
        <WcagList
          items={[
            {
              criterion: '1.1.1',
              description: {
                pt: 'Texto alternativo: título + resumo no SVG, legenda em texto e a tabela com os dados completos.',
                en: 'Text alternative: title + summary on the SVG, a text legend and the table with the full data.',
              },
            },
            {
              criterion: '1.3.1',
              description: {
                pt: 'Legenda como lista; tabela com <caption> e cabeçalhos de linha e coluna.',
                en: 'Legend as a list; table with <caption> and row and column headers.',
              },
            },
            {
              criterion: '1.4.1',
              description: {
                pt: 'Cor nunca sozinha: cada cor tem nome, valor e percentual na legenda, na mesma ordem do desenho.',
                en: 'Never color alone: each color has a name, value and percentage in the legend, in drawing order.',
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
                pt: 'O destaque do ponteiro não cobre nada e fecha com Esc.',
                en: 'The pointer highlight covers nothing and closes with Esc.',
              },
            },
            {
              criterion: '2.1.1',
              description: {
                pt: 'Todas as fatias são alcançáveis pelo teclado.',
                en: 'Every slice is reachable by keyboard.',
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
                pt: 'Fatia em destaque anunciada por role="status".',
                en: 'Highlighted slice announced through role="status".',
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
