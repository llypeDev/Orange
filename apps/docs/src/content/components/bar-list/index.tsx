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
import ResponseTime from './examples/ResponseTime'
import ResponseTimeCode from './examples/ResponseTime?raw'
import TopPages from './examples/TopPages'
import TopPagesCode from './examples/TopPages?raw'
import TopProducts from './examples/TopProducts'
import TopProductsCode from './examples/TopProducts?raw'
import { meta } from './meta'

export default function BarListPage() {
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
                  Use para rankings de uma medida só — páginas, produtos, regiões — com rótulos
                  longos e valores lidos um a um. Para comparar várias séries, use{' '}
                  <strong>BarChart</strong>; para partes de um todo, <strong>DonutChart</strong>. As
                  regras vêm da diretriz <Link to={guideline}>Visualização de dados</Link>.
                </>
              ),
              en: (
                <>
                  Use it for single-measure rankings — pages, products, regions — with long labels
                  and values read one by one. To compare several series use{' '}
                  <strong>BarChart</strong>; for parts of a whole, <strong>DonutChart</strong>. The
                  rules come from the <Link to={guideline}>Data visualization</Link> guideline.
                </>
              ),
            },
            {
              pt: 'A barra mede a distância até o maior valor da lista (que ocupa a linha toda); o número exato fica sempre escrito ao lado.',
              en: 'The bar measures the distance to the largest value in the list (which fills the row); the exact number is always written next to it.',
            },
            {
              pt: (
                <>
                  Uma cor para todas as barras: <Code>--or-color-viz-1</Code> por padrão, como a
                  primeira série dos gráficos. Troque com <Code>color</Code> (ex.:{' '}
                  <Code>--or-color-accent</Code> num painel só de destaques).
                </>
              ),
              en: (
                <>
                  One color for every bar: <Code>--or-color-viz-1</Code> by default, like the
                  charts’ first series. Change it with <Code>color</Code> (e.g.{' '}
                  <Code>--or-color-accent</Code> on a highlights-only panel).
                </>
              ),
            },
            {
              pt: (
                <>
                  Dê um nome à lista: <Code>aria-labelledby</Code> com o título do cartão ou{' '}
                  <Code>aria-label</Code> (os dois vão para o <Code>&lt;ul&gt;</Code>).
                </>
              ),
              en: (
                <>
                  Name the list: <Code>aria-labelledby</Code> pointing to the card title or{' '}
                  <Code>aria-label</Code> (both go to the <Code>&lt;ul&gt;</Code>).
                </>
              ),
            },
          ]}
        />
        <DoDont
          doItems={[
            {
              pt: 'Mostrar os 5 primeiros com limit e deixar o resto em “Mostrar todos”.',
              en: 'Show the top 5 with limit and leave the rest behind “Show all”.',
            },
            {
              pt: 'Usar href quando cada linha leva ao detalhe (a linha inteira vira o link).',
              en: 'Use href when each row leads to its detail (the whole row becomes the link).',
            },
            {
              pt: 'Formatar com valueFormat (moeda, “min”, “visitas”).',
              en: 'Format with valueFormat (currency, “min”, “visits”).',
            },
          ]}
          dontItems={[
            {
              pt: 'Valores negativos ou variações (+/−): use barras divergentes no BarChart.',
              en: 'Negative values or changes (+/−): use diverging bars in BarChart.',
            },
            {
              pt: 'Uma cor por linha: a posição e o rótulo já identificam cada item.',
              en: 'One color per row: position and label already identify each item.',
            },
            {
              pt: 'Botões ou links dentro do rótulo de uma linha com href (links aninhados).',
              en: 'Buttons or links inside the label of a row with href (nested links).',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Linha', en: 'Row' },
              description: {
                pt: 'Um <li>: rótulo à esquerda, valor em --or-font-mono à direita (sempre em cor de texto) e a barra embaixo. Com href, a linha inteira é um <a>.',
                en: 'An <li>: label on the left, value in --or-font-mono on the right (always in text color) and the bar below. With href, the whole row is an <a>.',
              },
            },
            {
              term: { pt: 'Barra', en: 'Bar' },
              description: {
                pt: 'Reta, 4/6/8px (sm/md/lg), comprimento proporcional ao maior valor. Decorativa (aria-hidden): o valor está no texto.',
                en: 'Square, 4/6/8px (sm/md/lg), length proportional to the largest value. Decorative (aria-hidden): the value is in the text.',
              },
            },
            {
              term: { pt: 'Mostrar todos', en: 'Show all' },
              description: {
                pt: 'Com limit, um botão com aria-expanded alterna entre os primeiros itens e a lista inteira (“Mostrar todos (N)” / “Mostrar menos”).',
                en: 'With limit, a button with aria-expanded toggles between the top items and the full list (“Show all (N)” / “Show less”).',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Com links e limite', en: 'With links and a limit' }}
          description={{
            pt: 'Cada linha leva ao detalhe da página. limit mostra as cinco primeiras; o botão revela o resto.',
            en: 'Each row leads to the page detail. limit shows the top five; the button reveals the rest.',
          }}
          code={TopPagesCode}
        >
          <TopPages />
        </Example>
        <Example
          title={{ pt: 'Em um cartão', en: 'Inside a card' }}
          description={{
            pt: 'Ordenado do maior para o menor automaticamente, em moeda, no tamanho sm.',
            en: 'Sorted largest first automatically, as currency, in the sm size.',
          }}
          code={TopProductsCode}
        >
          <TopProducts />
        </Example>
        <Example
          title={{ pt: 'Menor é melhor', en: 'Lower is better' }}
          description={{
            pt: 'sort="asc" põe os menores valores no topo; valueFormat como função escreve a unidade.',
            en: 'sort="asc" puts the lowest values on top; valueFormat as a function writes the unit.',
          }}
          code={ResponseTimeCode}
        >
          <ResponseTime />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Entrada', en: 'Entrance' },
              description: {
                pt: 'Uma vez, quando a lista entra na tela (useInView): cada barra cresce a partir do início (scaleX), em --or-duration-reveal com --or-ease-out, escalonada com --or-stagger.',
                en: 'Once, when the list enters the viewport (useInView): each bar grows from the start (scaleX), in --or-duration-reveal with --or-ease-out, staggered by --or-stagger.',
              },
            },
            {
              term: { pt: 'Mostrar todos', en: 'Show all' },
              description: {
                pt: 'Os itens revelados descem 4px e aparecem (--or-duration-medium) com as barras crescendo; ao recolher, somem em --or-duration-fast. O chevron gira 180°.',
                en: 'Revealed items slide down 4px and fade in (--or-duration-medium) with their bars growing; collapsing fades them out in --or-duration-fast. The chevron turns 180°.',
              },
            },
            {
              term: { pt: 'Dados novos', en: 'New data' },
              description: {
                pt: 'Barras mudam de comprimento com transição (transform, --or-duration-slow).',
                en: 'Bars change length with a transition (transform, --or-duration-slow).',
              },
            },
            {
              term: { pt: 'Movimento reduzido', en: 'Reduced motion' },
              description: {
                pt: 'Tudo aparece desenhado, sem crescer nem deslizar.',
                en: 'Everything appears fully drawn, without growing or sliding.',
              },
            },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            {
              name: 'data',
              type: '{ label: ReactNode; value: number; href?: string }[]',
              required: true,
              description: {
                pt: 'Itens do ranking. value ≥ 0; href transforma a linha inteira num link.',
                en: 'Ranking items. value ≥ 0; href turns the whole row into a link.',
              },
            },
            {
              name: 'sort',
              type: "'desc' | 'asc' | 'none'",
              default: "'desc'",
              description: {
                pt: 'Maior primeiro, menor primeiro ou a ordem de data. Empates mantêm a ordem de data.',
                en: 'Largest first, smallest first or data order. Ties keep data order.',
              },
            },
            {
              name: 'valueFormat',
              type: '((n: number) => string) | Intl.NumberFormatOptions',
              description: {
                pt: (
                  <>
                    Formato dos valores no idioma do <Code>OrangeProvider</Code>. Ex.:{' '}
                    <Code>{"{ style: 'currency', currency: 'BRL' }"}</Code>.
                  </>
                ),
                en: (
                  <>
                    Value format in the <Code>OrangeProvider</Code> locale. E.g.{' '}
                    <Code>{"{ style: 'currency', currency: 'BRL' }"}</Code>.
                  </>
                ),
              },
            },
            {
              name: 'limit',
              type: 'number',
              description: {
                pt: 'Quantos itens mostrar recolhida. Se a lista for maior, aparece “Mostrar todos (N)”.',
                en: 'How many items to show when collapsed. If the list is longer, “Show all (N)” appears.',
              },
            },
            {
              name: 'expanded',
              type: 'boolean',
              description: {
                pt: 'Lista inteira visível (controlado). Use com onExpandedChange.',
                en: 'Full list visible (controlled). Use with onExpandedChange.',
              },
            },
            {
              name: 'defaultExpanded',
              type: 'boolean',
              default: 'false',
              description: {
                pt: 'Estado inicial (não controlado).',
                en: 'Initial state (uncontrolled).',
              },
            },
            {
              name: 'onExpandedChange',
              type: '(expanded: boolean) => void',
              description: {
                pt: 'Chamado ao mostrar todos / mostrar menos.',
                en: 'Called on show all / show less.',
              },
            },
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg'",
              default: "'md'",
              description: {
                pt: 'Densidade: texto, respiro e espessura da barra (4/6/8px).',
                en: 'Density: text, spacing and bar thickness (4/6/8px).',
              },
            },
            {
              name: 'color',
              type: 'string',
              default: "'var(--or-color-viz-1)'",
              description: {
                pt: 'Cor das barras (um token: --or-color-viz-*, --or-color-accent…).',
                en: 'Bar color (a token: --or-color-viz-*, --or-color-accent…).',
              },
            },
            {
              name: 'renderLink',
              type: '(props: RenderLinkProps) => ReactNode',
              description: {
                pt: (
                  <>
                    Renderiza os links das linhas com o roteador:{' '}
                    <Code>{'({ href, ...p }) => <RouterLink to={href} {...p} />'}</Code>.
                  </>
                ),
                en: (
                  <>
                    Renders row links with your router:{' '}
                    <Code>{'({ href, ...p }) => <RouterLink to={href} {...p} />'}</Code>.
                  </>
                ),
              },
            },
            {
              name: 'aria-label / aria-labelledby',
              type: 'string',
              description: {
                pt: 'Nome da lista. Vão para o <ul>, não para a raiz.',
                en: 'The list’s name. They go to the <ul>, not to the root.',
              },
            },
            {
              name: '...rest',
              type: 'HTMLAttributes<HTMLDivElement>',
              description: {
                pt: 'Repassado ao <div> raiz (ref também).',
                en: 'Passed to the root <div> (ref too).',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                É uma lista de verdade (<Code>&lt;ul role="list"&gt;</Code> e{' '}
                <Code>&lt;li&gt;</Code>): o leitor de tela anuncia a quantidade de itens e lê cada
                um como “Página inicial: 12.480” — a barra é decorativa (<Code>aria-hidden</Code>).
                Linhas com <Code>href</Code> são um único link com rótulo e valor no nome, com foco
                visível na linha inteira. O botão “Mostrar todos” informa o estado com{' '}
                <Code>aria-expanded</Code> e aponta para a lista com <Code>aria-controls</Code>; o
                foco continua nele ao alternar.
              </>
            }
            en={
              <>
                It is a real list (<Code>&lt;ul role="list"&gt;</Code> and <Code>&lt;li&gt;</Code>
                ): screen readers announce the item count and read each one as “Página inicial:
                12,480” — the bar is decorative (<Code>aria-hidden</Code>). Rows with{' '}
                <Code>href</Code> are a single link with label and value in its name, with visible
                focus on the whole row. The “Show all” button exposes its state with{' '}
                <Code>aria-expanded</Code> and points to the list with <Code>aria-controls</Code>;
                focus stays on it when toggling.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['Tab'],
              description: {
                pt: 'Passa pelas linhas com link e depois pelo botão Mostrar todos.',
                en: 'Moves through the linked rows, then the Show all button.',
              },
            },
            {
              keys: ['Enter'],
              description: {
                pt: 'Abre o link da linha / alterna a lista no botão.',
                en: 'Follows the row link / toggles the list on the button.',
              },
            },
            {
              keys: ['Space'],
              description: {
                pt: 'Alterna a lista no botão Mostrar todos.',
                en: 'Toggles the list on the Show all button.',
              },
            },
          ]}
        />
        <WcagList
          items={[
            {
              criterion: '1.1.1',
              description: {
                pt: 'O valor de cada barra está escrito no texto da linha.',
                en: 'Each bar’s value is written in the row text.',
              },
            },
            {
              criterion: '1.3.1',
              description: {
                pt: 'Estrutura de lista (ul/li) com nome via aria-label/aria-labelledby.',
                en: 'List structure (ul/li) named through aria-label/aria-labelledby.',
              },
            },
            {
              criterion: '1.4.1',
              description: {
                pt: 'Cor nunca sozinha: uma cor só, e cada linha tem rótulo e valor.',
                en: 'Never color alone: a single color, and every row has a label and value.',
              },
            },
            {
              criterion: '1.4.11',
              description: {
                pt: 'Barras nos tokens viz (≥ 3:1 contra o fundo); em alto contraste, CanvasText.',
                en: 'Bars use viz tokens (≥ 3:1 against the background); CanvasText in high contrast.',
              },
            },
            {
              criterion: '2.4.7',
              description: {
                pt: 'Foco visível na linha inteira (contorno de 2px) e no botão.',
                en: 'Visible focus on the whole row (2px outline) and on the button.',
              },
            },
            {
              criterion: '2.5.8',
              description: {
                pt: 'Linhas com link e o botão têm pelo menos 24px de altura.',
                en: 'Linked rows and the button are at least 24px tall.',
              },
            },
            {
              criterion: '4.1.2',
              description: {
                pt: 'Botão com aria-expanded e aria-controls.',
                en: 'Button with aria-expanded and aria-controls.',
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
