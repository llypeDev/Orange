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
import AverageTicket from './examples/AverageTicket'
import AverageTicketCode from './examples/AverageTicket?raw'
import MonthlyRevenue from './examples/MonthlyRevenue'
import MonthlyRevenueCode from './examples/MonthlyRevenue?raw'
import WithGaps from './examples/WithGaps'
import WithGapsCode from './examples/WithGaps?raw'
import { meta } from './meta'

export default function LineChartPage() {
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
                  Linhas mostram evolução contínua no tempo. Para poucos períodos discretos ou para
                  comparar categorias use <strong>BarChart</strong>. As regras vêm da diretriz{' '}
                  <Link to={guideline}>Visualização de dados</Link>.
                </>
              ),
              en: (
                <>
                  Lines show continuous change over time. For a few discrete periods or to compare
                  categories use <strong>BarChart</strong>. The rules come from the{' '}
                  <Link to={guideline}>Data visualization</Link> guideline.
                </>
              ),
            },
            {
              pt: 'Cada série ganha cor, traço e marcador próprios, na ordem: a forma reforça a cor. Até cinco séries; acima disso, agrupe ou divida em gráficos menores.',
              en: 'Each series gets its own color, dash and marker, in order: shape reinforces color. Up to five series; beyond that, group them or split into smaller charts.',
            },
            {
              pt: (
                <>
                  Dado ausente é <Code>null</Code>: a linha se interrompe em vez de inventar um valor
                  — e a tabela mostra “sem dados”.
                </>
              ),
              en: (
                <>
                  A missing value is <Code>null</Code>: the line breaks instead of inventing a value
                  — and the table says “no data”.
                </>
              ),
            },
            {
              pt: (
                <>
                  O eixo de valores segue os dados; use <Code>includeZero</Code> quando a distância
                  até o zero importa. <Code>area</Code> (uma série) sempre parte do zero.
                </>
              ),
              en: (
                <>
                  The value axis follows the data; use <Code>includeZero</Code> when the distance to
                  zero matters. <Code>area</Code> (single series) always starts at zero.
                </>
              ),
            },
          ]}
        />
        <DoDont
          doItems={[
            {
              pt: 'Rótulo direto no fim de cada linha (endLabels), além da legenda.',
              en: 'A direct label at the end of each line (endLabels), plus the legend.',
            },
            {
              pt: 'Um resumo (summary) com a conclusão: “o app encosta no site em junho”.',
              en: 'A summary with the takeaway: “the app catches up with the website in June”.',
            },
          ]}
          dontItems={[
            {
              pt: 'Dois eixos Y para medidas de escalas diferentes: faça dois gráficos.',
              en: 'Two Y axes for measures on different scales: make two charts.',
            },
            {
              pt: 'Área em várias séries sobrepostas — uma esconde a outra.',
              en: 'Area on several overlapping series — one hides the other.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Título, subtítulo e legenda', en: 'Title, subtitle and legend' },
              description: {
                pt: 'Iguais aos do BarChart. Na legenda, cada série mostra o traço e o marcador que usa no gráfico.',
                en: 'Same as BarChart. In the legend, each series shows the dash and the marker it uses in the chart.',
              },
            },
            {
              term: { pt: 'Linhas e marcadores', en: 'Lines and markers' },
              description: {
                pt: 'Linhas de 2px; marcadores de 9px (círculo, quadrado, triângulo, losango, triângulo invertido) com anel de 2px no fundo. Com muitos pontos, só o último e os isolados.',
                en: '2px lines; 9px markers (circle, square, triangle, diamond, inverted triangle) with a 2px background ring. With many points, only the last and the isolated ones.',
              },
            },
            {
              term: { pt: 'Cruz e dica', en: 'Crosshair and tooltip' },
              description: {
                pt: 'A cruz vertical encontra o mês mais próximo do ponteiro; a dica lista todas as séries ali.',
                en: 'The vertical crosshair finds the month nearest to the pointer; the tooltip lists every series there.',
              },
            },
            {
              term: { pt: 'Rótulo no fim', en: 'End label' },
              description: {
                pt: 'O último valor de cada linha, em cor de texto. Se dois rótulos colidirem, o segundo sai (fica na legenda e na dica).',
                en: 'The last value of each line, in text color. If two labels collide, the second is dropped (legend and tooltip keep it).',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Duas séries', en: 'Two series' }}
          description={{
            pt: 'Ticket médio por canal. Foque o gráfico: ← → percorrem os meses, ↑ ↓ trocam a série.',
            en: 'Average order value by channel. Focus the chart: ← → walk the months, ↑ ↓ switch the series.',
          }}
          code={AverageTicketCode}
        >
          <AverageTicket />
        </Example>
        <Example
          title={{ pt: 'Área', en: 'Area' }}
          description={{
            pt: 'Uma série com área: um véu de 14% da cor, partindo do zero.',
            en: 'A single series with area: a 14% wash of the color, starting at zero.',
          }}
          code={MonthlyRevenueCode}
        >
          <MonthlyRevenue />
        </Example>
        <Example
          title={{ pt: 'Lacunas', en: 'Gaps' }}
          description={{
            pt: 'null interrompe a linha do marketplace na quarta.',
            en: 'null breaks the marketplace line on Wednesday.',
          }}
          code={WithGapsCode}
        >
          <WithGaps />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Entrada', en: 'Entrance' },
              description: {
                pt: 'Uma vez, quando o gráfico entra na tela (useInView): cada linha se desenha da esquerda para a direita (stroke-dashoffset 1 → 0 com pathLength=1, numa máscara, para funcionar também nas tracejadas). 1,5 × --or-duration-reveal, --or-ease-in-out; séries escalonadas com --or-stagger.',
                en: 'Once, when the chart enters the viewport (useInView): each line draws from left to right (stroke-dashoffset 1 → 0 with pathLength=1, in a mask, so dashed lines work too). 1.5 × --or-duration-reveal, --or-ease-in-out; series staggered by --or-stagger.',
              },
            },
            {
              term: { pt: 'Marcadores, área e rótulos', en: 'Markers, area and labels' },
              description: {
                pt: 'Os marcadores surgem quando a linha passa por eles (--or-ease-bounce); a área e o rótulo do fim aparecem por opacidade.',
                en: 'Markers pop in as the line reaches them (--or-ease-bounce); the area and the end label fade in.',
              },
            },
            {
              term: { pt: 'Cruz e dica', en: 'Crosshair and tooltip' },
              description: {
                pt: 'Deslizam até o novo mês em --or-duration-fast; as outras séries recuam (opacidade).',
                en: 'Slide to the new month in --or-duration-fast; the other series recede (opacity).',
              },
            },
            {
              term: { pt: 'Movimento reduzido', en: 'Reduced motion' },
              description: {
                pt: 'Sem máscara nem animação: as linhas já aparecem desenhadas.',
                en: 'No mask and no animation: lines appear fully drawn.',
              },
            },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'title', type: 'string', required: true, description: { pt: 'O que o gráfico mostra. Vira o <figcaption> e o nome do gráfico.', en: 'What the chart shows. Becomes the <figcaption> and the chart’s name.' } },
            { name: 'data', type: '{ label: string; values: Record<string, number | null> }[]', required: true, description: { pt: 'Um ponto do eixo X por entrada (mês, data em texto). null interrompe a linha.', en: 'One X-axis point per entry (month, date as text). null breaks the line.' } },
            { name: 'series', type: '{ key: string; label: string; color?: string }[]', required: true, description: { pt: 'Séries na ordem da legenda; cada uma ganha traço e marcador.', en: 'Series in legend order; each gets a dash and a marker.' } },
            { name: 'area', type: 'boolean', default: 'false', description: { pt: 'Preenche a área sob a linha (só com uma série).', en: 'Fills the area under the line (single series only).' } },
            { name: 'endLabels', type: 'boolean', default: 'true', description: { pt: 'Último valor no fim de cada linha.', en: 'Last value at the end of each line.' } },
            { name: 'includeZero', type: 'boolean', default: 'area', description: { pt: 'Começa o eixo de valores em zero.', en: 'Starts the value axis at zero.' } },
            { name: 'valueFormat', type: '((n: number) => string) | Intl.NumberFormatOptions', description: { pt: 'Formato dos números no idioma do OrangeProvider.', en: 'Number format in the OrangeProvider locale.' } },
            { name: 'description / summary / source', type: 'ReactNode / string / ReactNode', description: { pt: 'Subtítulo, conclusão para leitores de tela e fonte (como no BarChart).', en: 'Subtitle, takeaway for screen readers and source (as in BarChart).' } },
            { name: 'height', type: 'number', default: '280', description: { pt: 'Altura em px, incluindo os rótulos do eixo.', en: 'Height in px, axis labels included.' } },
            { name: 'categoryLabel', type: 'string', default: "'Categoria'", description: { pt: 'Cabeçalho da primeira coluna da tabela.', en: 'Header of the table’s first column.' } },
            { name: 'hideCaption / variant / defaultShowData', type: "boolean / 'outline' | 'plain' / boolean", description: { pt: 'Como no BarChart.', en: 'As in BarChart.' } },
            { name: '...rest', type: 'HTMLAttributes<HTMLElement>', description: { pt: 'Repassado ao <figure> (ref também).', en: 'Passed to the <figure> (ref too).' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Mesma estrutura do BarChart: <Code>&lt;figure&gt;</Code> nomeado pelo título, SVG com{' '}
                <Code>role="img"</Code> e resumo (período, séries, maior e menor valor ou o seu{' '}
                <Code>summary</Code>), tabela sempre presente para leitores de tela e anúncio em{' '}
                <Code>role="status"</Code> ao explorar pelo teclado: “mar · App: R$ 141,00”.
              </>
            }
            en={
              <>
                Same structure as BarChart: a <Code>&lt;figure&gt;</Code> named by its title, an SVG
                with <Code>role="img"</Code> and a summary (period, series, highest and lowest value,
                or your <Code>summary</Code>), a table always present for screen readers and a{' '}
                <Code>role="status"</Code> announcement while exploring by keyboard: “mar · App:
                R$141.00”.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Foca a área do gráfico.', en: 'Focuses the chart area.' } },
            { keys: ['←', '→'], description: { pt: 'Ponto anterior/próximo no eixo X.', en: 'Previous/next point on the X axis.' } },
            { keys: ['↑', '↓'], description: { pt: 'Série anterior/próxima no mesmo ponto.', en: 'Previous/next series at the same point.' } },
            { keys: ['Home', 'End'], description: { pt: 'Primeiro/último ponto.', en: 'First/last point.' } },
            { keys: ['Esc'], description: { pt: 'Limpa o destaque e fecha a dica.', en: 'Clears the highlight and closes the tooltip.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.1.1', description: { pt: 'Resumo no SVG e tabela com os dados completos.', en: 'Summary on the SVG and a table with the full data.' } },
            { criterion: '1.4.1', description: { pt: 'Séries distinguidas por cor, traço e forma do marcador.', en: 'Series told apart by color, dash and marker shape.' } },
            { criterion: '1.4.11', description: { pt: 'Linhas com ≥ 3:1 contra o fundo nos dois temas.', en: 'Lines at ≥ 3:1 against the background in both themes.' } },
            { criterion: '1.4.13', description: { pt: 'A dica não bloqueia o ponteiro e fecha com Esc.', en: 'The tooltip doesn’t block the pointer and closes with Esc.' } },
            { criterion: '2.1.1', description: { pt: 'Todos os pontos alcançáveis pelo teclado.', en: 'Every point reachable by keyboard.' } },
            { criterion: '4.1.3', description: { pt: 'Ponto em destaque anunciado por role="status".', en: 'Highlighted point announced through role="status".' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
