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
import ExpandableRows from './examples/ExpandableRows'
import ExpandableRowsCode from './examples/ExpandableRows?raw'
import Selection from './examples/Selection'
import SelectionCode from './examples/Selection?raw'
import Sorting from './examples/Sorting'
import SortingCode from './examples/Sorting?raw'
import VisibleColumns from './examples/VisibleColumns'
import VisibleColumnsCode from './examples/VisibleColumns?raw'
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
            {
              pt: (
                <>
                  Use linhas expansíveis (<Code>renderExpanded</Code>) para detalhes secundários — itens de um pedido,
                  histórico, observações. O que é preciso para comparar as linhas fica nas colunas, não escondido no
                  painel.
                </>
              ),
              en: (
                <>
                  Use expandable rows (<Code>renderExpanded</Code>) for secondary details — order lines, history,
                  notes. Whatever is needed to compare rows belongs in the columns, not hidden in the panel.
                </>
              ),
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
              term: { pt: 'Expansão', en: 'Expansion' },
              description: { pt: 'Coluna inicial ("Detalhes", oculta visualmente) com um botão por linha (aria-expanded, aria-controls). O painel é uma linha logo abaixo, com uma única célula que ocupa todas as colunas.', en: 'Leading column ("Details", visually hidden) with one button per row (aria-expanded, aria-controls). The panel is a row right below, with a single cell spanning all columns.' },
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
        <Example
          title={{ pt: 'Pedidos com detalhes', en: 'Orders with details' }}
          description={{
            pt: 'renderExpanded mostra os itens do pedido num painel abaixo da linha. O estado é controlado (expandedRows + onExpandedRowsChange) para o botão "Expandir todos"; ele guarda ids, então acompanha a linha ao ordenar. Use isRowExpandable para tirar o botão de linhas sem detalhe.',
            en: 'renderExpanded shows the order lines in a panel below the row. State is controlled (expandedRows + onExpandedRowsChange) to drive the "Expand all" button; it stores ids, so it follows the row when sorting. Use isRowExpandable to remove the button from rows without details.',
          }}
          code={ExpandableRowsCode}
          align="stretch"
        >
          <ExpandableRows />
        </Example>
        <Example
          title={{ pt: 'Colunas visíveis', en: 'Visible columns' }}
          description={{
            pt: 'A Table não tem API própria para isso: a aplicação filtra o array columns. Aqui um Dropdown com DropdownCheckboxItem liga e desliga as colunas, mantendo a ordem original; a coluna rowHeader fica sempre visível. Guarde a escolha (ex.: nas preferências do usuário) se ela precisar persistir.',
            en: 'Table has no dedicated API for this: the app filters the columns array. Here a Dropdown with DropdownCheckboxItem toggles columns while keeping their original order; the rowHeader column always stays visible. Store the choice (e.g. in user preferences) if it must persist.',
          }}
          code={VisibleColumnsCode}
          align="stretch"
        >
          <VisibleColumns />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Hover de linha', en: 'Row hover' }, description: { pt: 'Fundo da linha em --or-duration-fast (160ms). Em linhas clicáveis, uma barra laranja de 2px entra pela esquerda e o texto principal ganha sublinhado que cresce (250ms).', en: 'Row background in --or-duration-fast (160ms). On clickable rows, a 2px orange bar enters from the left and the main text gets a growing underline (250ms).' } },
            { term: { pt: 'Ordenar', en: 'Sort' }, description: { pt: 'Crossfade entre o ícone neutro e a seta (160ms); a seta gira 180° entre crescente e decrescente com --or-ease-spring (250ms). O botão afunda 1px ao clicar (90ms).', en: 'Crossfade between the neutral icon and the arrow (160ms); the arrow turns 180° between ascending and descending with --or-ease-spring (250ms). The button sinks 1px on click (90ms).' } },
            { term: { pt: 'Selecionar', en: 'Select' }, description: { pt: 'Fundo da linha em 160ms. A caixa encolhe ao pressionar e volta com --or-ease-bounce; o check é desenhado (stroke-dashoffset, 250ms) e o traço indeterminado cresce com spring.', en: 'Row background in 160ms. The box shrinks on press and springs back with --or-ease-bounce; the check is drawn (stroke-dashoffset, 250ms) and the indeterminate dash grows with spring.' } },
            { term: { pt: 'Expandir', en: 'Expand' }, description: { pt: 'O painel abre com grid-template-rows 0fr → 1fr em --or-duration-slow (400ms) e fecha mais rápido (250ms); o conteúdo entra com fade e desliza 4px. O chevron gira 180° com --or-ease-spring. Sem movimento em prefers-reduced-motion.', en: 'The panel opens with grid-template-rows 0fr → 1fr in --or-duration-slow (400ms) and closes faster (250ms); content fades in and slides 4px. The chevron turns 180° with --or-ease-spring. No motion under prefers-reduced-motion.' } },
            { term: { pt: 'Estado vazio', en: 'Empty state' }, description: { pt: 'Entra com fade (250ms).', en: 'Fades in (250ms).' } },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          caption={{ pt: 'Table', en: 'Table' }}
          rows={[
            { name: 'columns', type: 'TableColumn<T>[]', required: true, description: { pt: 'Definição das colunas (veja abaixo).', en: 'Column definitions (see below).' } },
            { name: 'data', type: 'T[]', required: true, description: { pt: 'Linhas da tabela.', en: 'Table rows.' } },
            { name: 'caption', type: 'ReactNode', required: true, description: { pt: 'Título da tabela (<caption>).', en: 'Table title (<caption>).' } },
            { name: 'hideCaption', type: 'boolean', default: 'false', description: { pt: 'Esconde a legenda visualmente.', en: 'Visually hides the caption.' } },
            { name: 'getRowId', type: '(row: T, index: number) => string', default: 'row.id ?? index', description: { pt: 'Id estável de cada linha (usado na seleção e na expansão).', en: 'Stable id for each row (used by selection and expansion).' } },
            { name: 'sort', type: "{ key: string; direction: 'ascending' | 'descending' } | null", description: { pt: 'Ordenação controlada.', en: 'Controlled sorting.' } },
            { name: 'defaultSort', type: 'TableSort | null', default: 'null', description: { pt: 'Ordenação inicial (não controlada).', en: 'Initial sorting (uncontrolled).' } },
            { name: 'onSortChange', type: '(sort: TableSort | null) => void', description: { pt: 'Chamado quando o usuário ordena.', en: 'Called when the user sorts.' } },
            { name: 'manualSort', type: 'boolean', default: 'false', description: { pt: 'Não ordena internamente (ordenação no servidor).', en: 'Does not sort internally (server-side sorting).' } },
            { name: 'selectable', type: 'boolean', default: 'false', description: { pt: 'Mostra checkboxes de seleção.', en: 'Shows selection checkboxes.' } },
            { name: 'selectedRows', type: 'string[]', description: { pt: 'Ids selecionados (controlado).', en: 'Selected ids (controlled).' } },
            { name: 'defaultSelectedRows', type: 'string[]', default: '[]', description: { pt: 'Ids selecionados inicialmente.', en: 'Initially selected ids.' } },
            { name: 'onSelectedRowsChange', type: '(ids: string[]) => void', description: { pt: 'Chamado quando a seleção muda.', en: 'Called when the selection changes.' } },
            { name: 'getRowLabel', type: '(row: T) => string', description: { pt: <>Identifica a linha no rótulo do checkbox e do botão de expandir. Padrão: o conteúdo da coluna <Code>rowHeader</Code>.</>, en: <>Identifies the row in the checkbox and expand button labels. Default: the <Code>rowHeader</Code> column content.</> } },
            { name: 'renderExpanded', type: '(row: T) => ReactNode', description: { pt: 'Conteúdo do painel de detalhes. Ativa as linhas expansíveis: botão na primeira coluna e painel numa linha logo abaixo.', en: 'Detail panel content. Enables expandable rows: a button in the first column and the panel in a row right below.' } },
            { name: 'expandedRows', type: 'string[]', description: { pt: 'Ids expandidos (controlado).', en: 'Expanded ids (controlled).' } },
            { name: 'defaultExpandedRows', type: 'string[]', default: '[]', description: { pt: 'Ids expandidos inicialmente.', en: 'Initially expanded ids.' } },
            { name: 'onExpandedRowsChange', type: '(ids: string[]) => void', description: { pt: 'Chamado quando uma linha abre ou fecha.', en: 'Called when a row opens or closes.' } },
            { name: 'isRowExpandable', type: '(row: T) => boolean', default: '() => true', description: { pt: <>Quais linhas têm painel. As demais ficam sem botão. Só vale com <Code>renderExpanded</Code>.</>, en: <>Which rows have a panel. The others get no button. Only applies with <Code>renderExpanded</Code>.</> } },
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
        <p>
          <T
            pt={
              <>
                Nas linhas expansíveis, o botão de cada linha segue o padrão disclosure: <Code>aria-expanded</Code> diz
                se o painel está aberto e, aberto, <Code>aria-controls</Code> aponta para a célula do painel (fechado, o
                painel sai do DOM). O nome segue a lógica do checkbox: "Expandir linha" ou "Recolher linha" seguido do
                cabeçalho da linha. A ordem na linha é botão de expandir, checkbox e células; o clique no botão não
                dispara <Code>onRowClick</Code>.
              </>
            }
            en={
              <>
                In expandable rows, each row's button follows the disclosure pattern: <Code>aria-expanded</Code> tells
                whether the panel is open and, when open, <Code>aria-controls</Code> points to the panel cell (when
                closed, the panel leaves the DOM). The name follows the checkbox logic: "Expand row" or "Collapse row"
                followed by the row header. The order in the row is expand button, checkbox, then cells; clicking the
                button does not trigger <Code>onRowClick</Code>.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Move o foco entre botões de ordenação, botões de expandir, checkboxes, a região rolável e ações das linhas.', en: 'Moves focus between sort buttons, expand buttons, checkboxes, the scroll region and row actions.' } },
            { keys: ['Enter'], description: { pt: 'Ordena pela coluna focada, abre/fecha o painel da linha ou abre a linha (botão da célula principal).', en: 'Sorts by the focused column, opens/closes the row panel or opens the row (main cell button).' } },
            { keys: ['Space'], description: { pt: 'Ordena pela coluna, abre/fecha o painel da linha ou marca/desmarca o checkbox focado.', en: 'Sorts by the column, opens/closes the row panel or toggles the focused checkbox.' } },
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
            { criterion: '2.1.1', description: { pt: 'Ordenação, seleção, expansão, rolagem e linha clicável funcionam pelo teclado.', en: 'Sorting, selection, expansion, scrolling and clickable rows work with the keyboard.' } },
            { criterion: '2.4.7', description: { pt: 'Foco visível em botões de ordenação e de expandir, checkboxes e na região rolável.', en: 'Visible focus on sort and expand buttons, checkboxes and the scroll region.' } },
            { criterion: '2.4.11', description: { pt: <>Com o cabeçalho fixo (<Code>maxHeight</Code>), a região rolável reserva a altura dele (<Code>scroll-padding-top</Code>): o foco que sobe pela tabela nunca fica escondido sob o cabeçalho.</>, en: <>With the sticky header (<Code>maxHeight</Code>), the scroll region reserves its height (<Code>scroll-padding-top</Code>): focus moving up the table is never hidden under the header.</> } },
            { criterion: '4.1.2', description: { pt: <>Estado de ordenação em <Code>aria-sort</Code>; checkbox "selecionar todos" com estado indeterminado; painel de detalhes em <Code>aria-expanded</Code>.</>, en: <>Sort state in <Code>aria-sort</Code>; "select all" checkbox with an indeterminate state; detail panel in <Code>aria-expanded</Code>.</> } },
            { criterion: '4.1.3', description: { pt: 'Mudanças de ordenação anunciadas em role="status".', en: 'Sort changes announced in role="status".' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
