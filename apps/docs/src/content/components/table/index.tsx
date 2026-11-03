import {
  Bullets,
  Callout,
  Code,
  ComponentPage,
  DefinitionTable,
  Example,
  KeyboardTable,
  PropsTable,
  Section,
  WcagList,
} from '../../../kit'
import { T } from '../../../i18n'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import ClickableRows from './examples/ClickableRows'
import ClickableRowsCode from './examples/ClickableRows?raw'
import DensitySticky from './examples/DensitySticky'
import DensityStickyCode from './examples/DensitySticky?raw'
import Selection from './examples/Selection'
import SelectionCode from './examples/Selection?raw'
import Sorting from './examples/Sorting'
import SortingCode from './examples/Sorting?raw'
import { meta } from './meta'

export default function TablePage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: (
                <>
                  Use tabelas para <strong>dados tabulares</strong> — linhas comparáveis com os mesmos atributos. Para
                  layout ou listas simples, use grid ou List.
                </>
              ),
              en: (
                <>
                  Use tables for <strong>tabular data</strong> — comparable rows sharing the same attributes. For layout
                  or simple lists, use a grid or List.
                </>
              ),
            },
            {
              pt: (
                <>
                  Sempre informe <Code>caption</Code>: ele dá nome à tabela. Se já houver um título visível, use{' '}
                  <Code>hideCaption</Code> em vez de removê-lo.
                </>
              ),
              en: (
                <>
                  Always provide a <Code>caption</Code>: it names the table. If a visible title already exists, use{' '}
                  <Code>hideCaption</Code> instead of removing it.
                </>
              ),
            },
            {
              pt: (
                <>
                  Marque a coluna que identifica cada linha com <Code>rowHeader</Code> (nome do cliente, número do
                  pedido). Leitores de tela anunciam esse valor ao navegar pelas células.
                </>
              ),
              en: (
                <>
                  Mark the column that identifies each row with <Code>rowHeader</Code> (customer name, order number).
                  Screen readers announce it while moving across cells.
                </>
              ),
            },
            {
              pt: 'Alinhe números à direita (align="end") com o mesmo formato e casas decimais, para facilitar a comparação.',
              en: 'Right-align numbers (align="end") using the same format and decimal places, so they are easy to compare.',
            },
            {
              pt: 'Ordenação, seleção e linha clicável são opcionais: ative só o que a tarefa precisa.',
              en: 'Sorting, selection and clickable rows are optional: enable only what the task needs.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Legenda', en: 'Caption' },
              description: { pt: 'O <caption> que nomeia a tabela. Pode ser oculto visualmente.', en: 'The <caption> naming the table. Can be visually hidden.' },
            },
            {
              term: { pt: 'Cabeçalho de coluna', en: 'Column header' },
              description: { pt: '<th scope="col">. Em colunas ordenáveis, contém um botão e recebe aria-sort.', en: '<th scope="col">. In sortable columns it holds a button and gets aria-sort.' },
            },
            {
              term: { pt: 'Cabeçalho de linha', en: 'Row header' },
              description: { pt: '<th scope="row"> na coluna marcada com rowHeader.', en: '<th scope="row"> in the column marked rowHeader.' },
            },
            {
              term: { pt: 'Seleção', en: 'Selection' },
              description: { pt: 'Checkbox nativo por linha e "selecionar todos" com estado indeterminado.', en: 'Native checkbox per row and "select all" with an indeterminate state.' },
            },
            {
              term: { pt: 'Estado vazio', en: 'Empty state' },
              description: { pt: 'Célula que ocupa todas as colunas quando não há dados.', en: 'A cell spanning all columns when there is no data.' },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Básico', en: 'Basic' }}
          description={{
            pt: 'Colunas definidas por columns; render personaliza a célula. Valores monetários alinhados à direita.',
            en: 'Columns defined by columns; render customizes the cell. Currency values right-aligned.',
          }}
          code={BasicCode}
          align="stretch"
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Ordenação', en: 'Sorting' }}
          description={{
            pt: 'Clique no cabeçalho para alternar entre crescente e decrescente. Números, datas e textos (com acentos) são comparados corretamente; use sortValue para valores derivados.',
            en: 'Click a header to toggle ascending and descending. Numbers, dates and text (with accents) are compared correctly; use sortValue for derived values.',
          }}
          code={SortingCode}
          align="stretch"
        >
          <Sorting />
        </Example>
        <Example
          title={{ pt: 'Seleção em massa', en: 'Bulk selection' }}
          description={{
            pt: 'Com selectable, cada linha ganha um checkbox. O cabeçalho seleciona todas e fica indeterminado em seleções parciais.',
            en: 'With selectable, each row gets a checkbox. The header selects all rows and becomes indeterminate on partial selections.',
          }}
          code={SelectionCode}
          align="stretch"
        >
          <Selection />
        </Example>
        <Example
          title={{ pt: 'Densidade, listras e cabeçalho fixo', en: 'Density, stripes and sticky header' }}
          description={{
            pt: 'density="compact" e striped para tabelas longas. maxHeight cria uma região rolável, focável pelo teclado, com o cabeçalho fixo.',
            en: 'density="compact" and striped for long tables. maxHeight creates a keyboard-focusable scroll region with a sticky header.',
          }}
          code={DensityStickyCode}
          align="stretch"
        >
          <DensitySticky />
        </Example>
        <Example
          title={{ pt: 'Linha clicável e estado vazio', en: 'Clickable rows and empty state' }}
          description={{
            pt: 'onRowClick torna a linha inteira clicável sem mudar a semântica da tabela: a célula principal vira um botão para quem usa teclado. Filtre por "Resolvidos" para ver o estado vazio.',
            en: 'onRowClick makes the whole row clickable without changing table semantics: the main cell becomes a button for keyboard users. Filter by "Resolved" to see the empty state.',
          }}
          code={ClickableRowsCode}
          align="stretch"
        >
          <ClickableRows />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'Table', en: 'Table' }}
          rows={[
            { name: 'columns', type: 'TableColumn<T>[]', required: true, description: { pt: 'Definição das colunas (veja abaixo).', en: 'Column definitions (see below).' } },
            { name: 'data', type: 'T[]', required: true, description: { pt: 'Linhas da tabela.', en: 'Table rows.' } },
            { name: 'caption', type: 'ReactNode', required: true, description: { pt: 'Título da tabela (<caption>).', en: 'Table title (<caption>).' } },
            { name: 'hideCaption', type: 'boolean', default: 'false', description: { pt: 'Esconde a legenda visualmente.', en: 'Visually hides the caption.' } },
            { name: 'getRowId', type: '(row: T, index: number) => string', default: 'row.id ?? index', description: { pt: 'Id estável de cada linha (usado na seleção).', en: 'Stable id for each row (used by selection).' } },
            { name: 'sort / defaultSort', type: "{ key: string; direction: 'ascending' | 'descending' } | null", description: { pt: 'Ordenação controlada / inicial.', en: 'Controlled / initial sorting.' } },
            { name: 'onSortChange', type: '(sort: TableSort | null) => void', description: { pt: 'Chamado quando o usuário ordena.', en: 'Called when the user sorts.' } },
            { name: 'manualSort', type: 'boolean', default: 'false', description: { pt: 'Não ordena internamente (ordenação no servidor).', en: 'Does not sort internally (server-side sorting).' } },
            { name: 'selectable', type: 'boolean', default: 'false', description: { pt: 'Mostra checkboxes de seleção.', en: 'Shows selection checkboxes.' } },
            { name: 'selectedRows / defaultSelectedRows', type: 'string[]', description: { pt: 'Ids selecionados (controlado / inicial).', en: 'Selected ids (controlled / initial).' } },
            { name: 'onSelectionChange', type: '(ids: string[]) => void', description: { pt: 'Chamado quando a seleção muda.', en: 'Called when the selection changes.' } },
            { name: 'getRowLabel', type: '(row: T) => string', description: { pt: <>Identifica a linha no rótulo do checkbox. Padrão: o conteúdo da coluna <Code>rowHeader</Code>.</>, en: <>Identifies the row in the checkbox label. Default: the <Code>rowHeader</Code> column content.</> } },
            { name: 'density', type: "'normal' | 'compact'", default: "'normal'", description: { pt: 'Espaçamento das células.', en: 'Cell spacing.' } },
            { name: 'striped', type: 'boolean', default: 'false', description: { pt: 'Alterna o fundo das linhas.', en: 'Alternates row backgrounds.' } },
            { name: 'maxHeight', type: 'number | string', description: { pt: 'Altura máxima com rolagem e cabeçalho fixo.', en: 'Maximum height with scrolling and sticky header.' } },
            { name: 'emptyState', type: 'ReactNode', default: 't("noResults")', description: { pt: 'Conteúdo quando não há linhas.', en: 'Content when there are no rows.' } },
            { name: 'onRowClick', type: '(row: T, event) => void', description: { pt: 'Torna a linha clicável; a célula principal vira um botão.', en: 'Makes the row clickable; the main cell becomes a button.' } },
            { name: 'containerProps', type: 'HTMLAttributes<HTMLDivElement>', description: { pt: 'Atributos do contêiner com borda e rolagem.', en: 'Attributes for the bordered scroll container.' } },
            { name: '...rest', type: 'TableHTMLAttributes', description: { pt: 'Atributos nativos de <table> (ref aponta para a <table>).', en: 'Native <table> attributes (ref points to the <table>).' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'TableColumn<T>', en: 'TableColumn<T>' }}
          rows={[
            { name: 'key', type: 'string', required: true, description: { pt: <>Identificador da coluna; sem <Code>render</Code>, mostra <Code>row[key]</Code>.</>, en: <>Column id; without <Code>render</Code>, shows <Code>row[key]</Code>.</> } },
            { name: 'header', type: 'ReactNode', required: true, description: { pt: 'Conteúdo do cabeçalho.', en: 'Header content.' } },
            { name: 'render', type: '(row: T, index: number) => ReactNode', description: { pt: 'Conteúdo personalizado da célula.', en: 'Custom cell content.' } },
            { name: 'sortable', type: 'boolean', default: 'false', description: { pt: 'Permite ordenar pela coluna.', en: 'Allows sorting by the column.' } },
            { name: 'sortValue', type: '(row: T) => string | number | Date | boolean | null', description: { pt: 'Valor usado na ordenação. Vazios ficam sempre no fim.', en: 'Value used for sorting. Empty values always go last.' } },
            { name: 'align', type: "'start' | 'center' | 'end'", default: "'start'", description: { pt: 'Alinhamento horizontal.', en: 'Horizontal alignment.' } },
            { name: 'width', type: 'number | string', description: { pt: 'Largura da coluna.', en: 'Column width.' } },
            { name: 'rowHeader', type: 'boolean', default: 'false', description: { pt: 'Células viram <th scope="row">.', en: 'Cells become <th scope="row">.' } },
            { name: 'hideHeader', type: 'boolean', default: 'false', description: { pt: 'Esconde o texto do cabeçalho (ex.: coluna de ações).', en: 'Hides the header text (e.g. actions column).' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                É uma <Code>&lt;table&gt;</Code> nativa — não um grid ARIA —, então leitores de tela oferecem a navegação
                por células de sempre. Colunas ordenáveis expõem <Code>aria-sort</Code> (<Code>ascending</Code>,{' '}
                <Code>descending</Code> ou <Code>none</Code>) e cada mudança é anunciada em uma região de status
                ("Cliente, ordenado de forma crescente").
              </>
            }
            en={
              <>
                It is a native <Code>&lt;table&gt;</Code> — not an ARIA grid — so screen readers keep their usual cell
                navigation. Sortable columns expose <Code>aria-sort</Code> (<Code>ascending</Code>,{' '}
                <Code>descending</Code> or <Code>none</Code>) and every change is announced in a status region
                ("Customer, sorted ascending").
              </>
            }
          />
        </p>
        <p>
          <T
            pt={
              <>
                Na linha clicável, o clique do mouse vale para a linha inteira, mas o <Code>&lt;tr&gt;</Code> não recebe{' '}
                <Code>role</Code> nem foco: o acesso por teclado é um botão real na célula principal. Cliques em
                checkboxes, links e botões dentro da linha não disparam <Code>onRowClick</Code>.
              </>
            }
            en={
              <>
                With clickable rows, mouse clicks work on the whole row, but the <Code>&lt;tr&gt;</Code> gets no{' '}
                <Code>role</Code> or focus: keyboard access is a real button in the main cell. Clicks on checkboxes,
                links and buttons inside the row do not trigger <Code>onRowClick</Code>.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Move o foco entre botões de ordenação, checkboxes, a região rolável e ações das linhas.', en: 'Moves focus between sort buttons, checkboxes, the scroll region and row actions.' } },
            { keys: ['Enter'], description: { pt: 'Ordena pela coluna focada ou abre a linha (botão da célula principal).', en: 'Sorts by the focused column or opens the row (main cell button).' } },
            { keys: ['Space'], description: { pt: 'Ordena pela coluna ou marca/desmarca o checkbox focado.', en: 'Sorts by the column or toggles the focused checkbox.' } },
            { keys: ['↑', '↓'], description: { pt: 'Com a região rolável focada, rola a tabela.', en: 'With the scroll region focused, scrolls the table.' } },
          ]}
        />
        <Callout tone="info" title={{ pt: 'Seleção e leitores de tela', en: 'Selection and screen readers' }}>
          <T
            pt={<>Cada checkbox é rotulado como "Selecionar linha" seguido do cabeçalho da linha (ex.: "Selecionar linha Mariana Lopes"). Sem coluna <Code>rowHeader</Code>, use <Code>getRowLabel</Code>.</>}
            en={<>Each checkbox is labelled "Select row" followed by the row header (e.g. "Select row Mariana Lopes"). Without a <Code>rowHeader</Code> column, use <Code>getRowLabel</Code>.</>}
          />
        </Callout>
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: <>Estrutura com <Code>caption</Code>, <Code>th scope="col"</Code> e <Code>th scope="row"</Code>.</>, en: <>Structure with <Code>caption</Code>, <Code>th scope="col"</Code> and <Code>th scope="row"</Code>.</> } },
            { criterion: '2.1.1', description: { pt: 'Ordenação, seleção, rolagem e linha clicável funcionam pelo teclado.', en: 'Sorting, selection, scrolling and clickable rows work with the keyboard.' } },
            { criterion: '2.4.7', description: { pt: 'Foco visível em botões de ordenação, checkboxes e na região rolável.', en: 'Visible focus on sort buttons, checkboxes and the scroll region.' } },
            { criterion: '4.1.2', description: { pt: <>Estado de ordenação em <Code>aria-sort</Code>; checkbox "selecionar todos" com estado indeterminado.</>, en: <>Sort state in <Code>aria-sort</Code>; "select all" checkbox with an indeterminate state.</> } },
            { criterion: '4.1.3', description: { pt: 'Mudanças de ordenação anunciadas em role="status".', en: 'Sort changes announced in role="status".' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
