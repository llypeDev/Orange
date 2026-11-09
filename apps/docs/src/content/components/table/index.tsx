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
import ColumnFilters from './examples/ColumnFilters'
import ColumnFiltersCode from './examples/ColumnFilters?raw'
import DensitySticky from './examples/DensitySticky'
import DensityStickyCode from './examples/DensitySticky?raw'
import ExpandableRows from './examples/ExpandableRows'
import ExpandableRowsCode from './examples/ExpandableRows?raw'
import PinnedResizable from './examples/PinnedResizable'
import PinnedResizableCode from './examples/PinnedResizable?raw'
import Selection from './examples/Selection'
import SelectionCode from './examples/Selection?raw'
import Sorting from './examples/Sorting'
import SortingCode from './examples/Sorting?raw'
import VisibleColumns from './examples/VisibleColumns'
import VisibleColumnsCode from './examples/VisibleColumns?raw'
import Virtualized from './examples/Virtualized'
import VirtualizedCode from './examples/Virtualized?raw'
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
            {
              pt: (
                <>
                  Ponha <Code>filter</Code> nas colunas pelas quais a pessoa procura — não em todas. Com poucas
                  linhas, ordenar costuma bastar.
                </>
              ),
              en: (
                <>
                  Put <Code>filter</Code> on the columns people search by — not on all of them. With few rows, sorting
                  is usually enough.
                </>
              ),
            },
            {
              pt: (
                <>
                  Para milhares de linhas, escolha entre paginar e virtualizar. A paginação (Paginator) dá posição
                  estável, endereço por página e funciona com a busca do navegador; <Code>virtualized</Code> serve
                  quando a pessoa percorre e compara uma lista longa de uma vez.
                </>
              ),
              en: (
                <>
                  For thousands of rows, choose between paginating and virtualizing. Pagination (Paginator) gives a stable
                  position, a URL per page and works with the browser's find; <Code>virtualized</Code> fits when
                  people scan and compare one long list in a single pass.
                </>
              ),
            },
            {
              pt: 'Fixe poucas colunas: a que identifica a linha no início e, se houver, a de total ou de ações no fim. Em telas estreitas, as colunas fixas tomam o espaço das que rolam.',
              en: 'Pin few columns: the one identifying the row at the start and, if any, the total or actions column at the end. On narrow screens, pinned columns take space from the scrolling ones.',
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
              term: { pt: 'Filtros', en: 'Filters' },
              description: { pt: 'Segunda linha do cabeçalho, com um campo de busca ou um select nativo sob cada coluna com filter. As células são <td>: os filtros não entram no nome das colunas.', en: 'Second header row, with a search field or a native select under each column that has filter. The cells are <td>: filters do not become part of the column names.' },
            },
            {
              term: { pt: 'Separador de coluna', en: 'Column separator' },
              description: { pt: 'Na borda direita do cabeçalho das colunas resizable: role="separator" focável, com a largura em aria-valuenow. A área de arrasto tem 24px.', en: 'On the right edge of resizable column headers: a focusable role="separator" with the width in aria-valuenow. The drag area is 24px wide.' },
            },
            {
              term: { pt: 'Estado vazio', en: 'Empty state' },
              description: { pt: 'Célula que ocupa todas as colunas quando não há dados. Quando são os filtros que escondem tudo, mostra "Nenhum resultado encontrado" e o botão "Limpar filtros".', en: 'A cell spanning all columns when there is no data. When the filters hide everything, it shows "No results found" and the "Clear filters" button.' },
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
          title={{ pt: 'Filtros por coluna', en: 'Column filters' }}
          description={{
            pt: 'filter na coluna mostra um campo sob o cabeçalho: "text" (contém, sem diferenciar acentos nem maiúsculas) ou "select" (valor exato entre filterOptions). Os filtros se combinam, a tabela anuncia quantas linhas sobraram e "Selecionar todos" vale só para elas. Em colunas com render, informe filterValue. Com filters, onFiltersChange e manualFilter o filtro é feito no servidor.',
            en: 'filter on a column shows a field under the header: "text" (contains, ignoring accents and case) or "select" (exact value among filterOptions). Filters combine, the table announces how many rows are left and "Select all" applies only to them. For columns with render, provide filterValue. With filters, onFiltersChange and manualFilter the filtering happens on the server.',
          }}
          code={ColumnFiltersCode}
          align="stretch"
        >
          <ColumnFilters />
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
            pt: 'TableColumnsMenu lista as colunas como itens marcáveis e a aplicação guarda hiddenColumns, que vai para o menu e para a tabela. As colunas voltam para o lugar de origem; hideable: false tira uma coluna do menu (aqui, a que identifica a linha). Os children do menu entram no fim — por exemplo, "Restaurar padrão".',
            en: 'TableColumnsMenu lists the columns as checkable items and the app keeps hiddenColumns, passed to both the menu and the table. Columns return to their original place; hideable: false keeps a column out of the menu (here, the one identifying the row). The menu children go at the end — for instance, "Restore default".',
          }}
          code={VisibleColumnsCode}
          align="stretch"
        >
          <VisibleColumns />
        </Example>
        <Example
          title={{ pt: 'Colunas fixas e redimensionáveis', en: 'Pinned and resizable columns' }}
          description={{
            pt: 'pinned: "start" ou "end" prende a coluna à borda enquanto as outras rolam (a seleção acompanha as do início). resizable põe um separador na borda direita do cabeçalho: arraste, use as setas com o foco nele ou dê um clique duplo para ajustar ao conteúdo. Com a largura de todas as colunas informada (columnWidths ou defaultColumnWidths), a tabela tem largura fixa — a soma delas — e mudar uma coluna não mexe nas outras; sem isso, as larguras são registradas no primeiro redimensionamento.',
            en: 'pinned: "start" or "end" keeps the column at the edge while the others scroll (selection follows the start ones). resizable puts a separator on the right edge of the header: drag it, use the arrow keys while it has focus, or double-click to fit the content. With the width of every column provided (columnWidths or defaultColumnWidths), the table has a fixed width — their sum — and changing one column does not move the others; otherwise the widths are recorded on the first resize.',
          }}
          code={PinnedResizableCode}
          align="stretch"
        >
          <PinnedResizable />
        </Example>
        <Example
          title={{ pt: 'Dez mil linhas', en: 'Ten thousand rows' }}
          description={{
            pt: 'virtualized com maxHeight: só as linhas à vista (e algumas a mais) existem no DOM, então ordenar, filtrar e selecionar continuam rápidos. As linhas têm a mesma altura — as células não quebram linha — e a tabela informa o total ao leitor de tela. Não se combina com renderExpanded.',
            en: 'virtualized with maxHeight: only the rows in view (plus a few more) exist in the DOM, so sorting, filtering and selecting stay fast. Rows share the same height — cells do not wrap — and the table tells screen readers the total. It does not combine with renderExpanded.',
          }}
          code={VirtualizedCode}
          align="stretch"
        >
          <Virtualized />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Hover de linha', en: 'Row hover' }, description: { pt: 'Fundo da linha em --or-duration-fast (160ms). Em linhas clicáveis, uma barra laranja de 2px entra pela esquerda e o texto principal ganha sublinhado que cresce (250ms).', en: 'Row background in --or-duration-fast (160ms). On clickable rows, a 2px orange bar enters from the left and the main text gets a growing underline (250ms).' } },
            { term: { pt: 'Ordenar', en: 'Sort' }, description: { pt: 'Crossfade entre o ícone neutro e a seta (160ms); a seta gira 180° entre crescente e decrescente com --or-ease-spring (250ms). O botão afunda 1px ao clicar (90ms).', en: 'Crossfade between the neutral icon and the arrow (160ms); the arrow turns 180° between ascending and descending with --or-ease-spring (250ms). The button sinks 1px on click (90ms).' } },
            { term: { pt: 'Selecionar', en: 'Select' }, description: { pt: 'Fundo da linha em 160ms. A caixa encolhe ao pressionar e volta com --or-ease-bounce; o check é desenhado (stroke-dashoffset, 250ms) e o traço indeterminado cresce com spring.', en: 'Row background in 160ms. The box shrinks on press and springs back with --or-ease-bounce; the check is drawn (stroke-dashoffset, 250ms) and the indeterminate dash grows with spring.' } },
            { term: { pt: 'Expandir', en: 'Expand' }, description: { pt: 'O painel abre com grid-template-rows 0fr → 1fr em --or-duration-slow (400ms) e fecha mais rápido (250ms); o conteúdo entra com fade e desliza 4px. O chevron gira 180° com --or-ease-spring. Sem movimento em prefers-reduced-motion.', en: 'The panel opens with grid-template-rows 0fr → 1fr in --or-duration-slow (400ms) and closes faster (250ms); content fades in and slides 4px. The chevron turns 180° with --or-ease-spring. No motion under prefers-reduced-motion.' } },
            { term: { pt: 'Redimensionar', en: 'Resize' }, description: { pt: 'A linha do separador engrossa e fica laranja no hover, no foco e durante o arraste (160ms). A largura segue o ponteiro sem animação.', en: 'The separator line thickens and turns orange on hover, on focus and while dragging (160ms). The width follows the pointer with no animation.' } },
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
            { name: 'filters', type: 'Record<string, string>', description: { pt: <>Filtros das colunas com <Code>filter</Code> (controlado): o texto ou o valor da opção por <Code>key</Code>.</>, en: <>Filters of the columns with <Code>filter</Code> (controlled): the text or option value by <Code>key</Code>.</> } },
            { name: 'defaultFilters', type: 'Record<string, string>', default: '{}', description: { pt: 'Filtros iniciais (não controlado).', en: 'Initial filters (uncontrolled).' } },
            { name: 'onFiltersChange', type: '(filters: TableFilters) => void', description: { pt: 'Chamado quando o usuário muda um filtro.', en: 'Called when the user changes a filter.' } },
            { name: 'manualFilter', type: 'boolean', default: 'false', description: { pt: 'Não filtra internamente (filtro no servidor).', en: 'Does not filter internally (server-side filtering).' } },
            { name: 'hiddenColumns', type: 'string[]', description: { pt: <><Code>key</Code> das colunas ocultas. Use com o <Code>TableColumnsMenu</Code>.</>, en: <><Code>key</Code> of the hidden columns. Use with <Code>TableColumnsMenu</Code>.</> } },
            { name: 'columnWidths', type: 'Record<string, number>', description: { pt: 'Larguras das colunas em px (controlado). Registradas no primeiro redimensionamento.', en: 'Column widths in px (controlled). Recorded on the first resize.' } },
            { name: 'defaultColumnWidths', type: 'Record<string, number>', default: '{}', description: { pt: 'Larguras iniciais (não controlado).', en: 'Initial widths (uncontrolled).' } },
            { name: 'onColumnWidthsChange', type: '(widths: TableColumnWidths) => void', description: { pt: 'Chamado enquanto a pessoa redimensiona uma coluna.', en: 'Called while the user resizes a column.' } },
            { name: 'virtualized', type: 'boolean', default: 'false', description: { pt: <>Renderiza só as linhas à vista. Exige <Code>maxHeight</Code> e linhas de mesma altura; não se combina com <Code>renderExpanded</Code>.</>, en: <>Renders only the rows in view. Requires <Code>maxHeight</Code> and rows of equal height; does not combine with <Code>renderExpanded</Code>.</> } },
            { name: 'rowHeight', type: 'number', description: { pt: <>Com <Code>virtualized</Code>: altura estimada da linha em px, usada até a tabela medir a real.</>, en: <>With <Code>virtualized</Code>: estimated row height in px, used until the table measures the real one.</> } },
            { name: 'overscan', type: 'number', default: '8', description: { pt: <>Com <Code>virtualized</Code>: linhas a mais renderizadas acima e abaixo da área visível.</>, en: <>With <Code>virtualized</Code>: extra rows rendered above and below the visible area.</> } },
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
            { name: 'filter', type: "'text' | 'select'", description: { pt: <>Mostra um filtro sob o cabeçalho. <Code>text</Code>: contém, sem diferenciar acentos nem maiúsculas. <Code>select</Code>: valor exato entre <Code>filterOptions</Code>.</>, en: <>Shows a filter under the header. <Code>text</Code>: contains, ignoring accents and case. <Code>select</Code>: exact value among <Code>filterOptions</Code>.</> } },
            { name: 'filterOptions', type: '{ value: string; label: string }[]', description: { pt: <>Opções do filtro <Code>select</Code>. "Todos" é incluído pela tabela.</>, en: <>Options of the <Code>select</Code> filter. "All" is added by the table.</> } },
            { name: 'filterValue', type: '(row: T) => string', default: 'row[key]', description: { pt: <>Texto comparado pelo filtro. Informe quando a coluna usa <Code>render</Code>.</>, en: <>Text the filter compares. Provide it when the column uses <Code>render</Code>.</> } },
            { name: 'hideable', type: 'boolean', default: 'true', description: { pt: <><Code>false</Code> tira a coluna do <Code>TableColumnsMenu</Code>.</>, en: <><Code>false</Code> keeps the column out of <Code>TableColumnsMenu</Code>.</> } },
            { name: 'pinned', type: "'start' | 'end'", description: { pt: 'Fixa a coluna numa borda durante a rolagem horizontal. As fixas vão para a borda, na ordem dada.', en: 'Pins the column to an edge during horizontal scrolling. Pinned columns move to the edge, in the given order.' } },
            { name: 'resizable', type: 'boolean', default: 'false', description: { pt: 'Permite mudar a largura: arraste, teclado ou clique duplo (ajusta ao conteúdo).', en: 'Allows changing the width: drag, keyboard or double-click (fits the content).' } },
            { name: 'minWidth', type: 'number', default: '80', description: { pt: 'Menor largura ao redimensionar, em px.', en: 'Smallest width when resizing, in px.' } },
            { name: 'maxWidth', type: 'number', default: '640', description: { pt: 'Maior largura ao redimensionar, em px.', en: 'Largest width when resizing, in px.' } },
          ]}
        />
        <PropsTable
          caption={{ pt: 'TableColumnsMenu', en: 'TableColumnsMenu' }}
          rows={[
            { name: 'columns', type: 'TableColumn<T>[]', required: true, description: { pt: <>As mesmas colunas da <Code>Table</Code>. As com <Code>hideable: false</Code> não entram no menu.</>, en: <>The same columns as the <Code>Table</Code>. Those with <Code>hideable: false</Code> are left out of the menu.</> } },
            { name: 'hiddenColumns', type: 'string[]', required: true, description: { pt: <><Code>key</Code> das colunas ocultas (o mesmo valor passado à tabela).</>, en: <><Code>key</Code> of the hidden columns (the same value passed to the table).</> } },
            { name: 'onHiddenColumnsChange', type: '(hidden: string[]) => void', required: true, description: { pt: 'Chamado com a nova lista, na ordem das colunas.', en: 'Called with the new list, in column order.' } },
            { name: 'label', type: 'ReactNode', default: 't("tableColumns")', description: { pt: 'Texto do botão ("Colunas").', en: 'Button text ("Columns").' } },
            { name: 'trigger', type: 'ReactElement', description: { pt: 'Botão próprio no lugar do padrão.', en: 'Your own button instead of the default one.' } },
            { name: 'placement', type: 'DropdownPlacement', default: "'bottom-end'", description: { pt: 'Posição do menu em relação ao botão.', en: 'Menu position relative to the button.' } },
            { name: 'children', type: 'ReactNode', description: { pt: 'Itens a mais no fim do menu (separador, "Restaurar padrão").', en: 'Extra items at the end of the menu (separator, "Restore default").' } },
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
        <p>
          <T
            pt={
              <>
                Cada filtro é um campo nativo com nome próprio ("Filtrar por Cliente"). Ao filtrar, a região de status
                anuncia quantas linhas sobraram ("12 resultados disponíveis") ou que não há nenhuma. Só as colunas
                visíveis filtram: um filtro que a pessoa não vê não esconde linhas.
              </>
            }
            en={
              <>
                Each filter is a native field with its own name ("Filter by Customer"). When filtering, the status
                region announces how many rows are left ("12 results available") or that there are none. Only visible
                columns filter: a filter the person cannot see does not hide rows.
              </>
            }
          />
        </p>
        <p>
          <T
            pt={
              <>
                O separador das colunas redimensionáveis segue o padrão <em>window splitter</em>: recebe foco, tem
                nome ("Redimensionar coluna Cliente") e expõe a largura em <Code>aria-valuenow</Code>, com mínimo e
                máximo. O arraste nunca é o único caminho: as setas mudam a largura e o clique duplo (ou Enter)
                ajusta a coluna ao conteúdo. O nome da coluna continua sendo só o do cabeçalho.
              </>
            }
            en={
              <>
                The separator of resizable columns follows the <em>window splitter</em> pattern: it takes focus, has
                a name ("Resize column Customer") and exposes the width in <Code>aria-valuenow</Code>, with minimum
                and maximum. Dragging is never the only way: the arrow keys change the width and a double-click (or
                Enter) fits the column to its content. The column name is still just the header text.
              </>
            }
          />
        </p>
        <p>
          <T
            pt={
              <>
                Com <Code>virtualized</Code>, a tabela informa o total em <Code>aria-rowcount</Code> e a posição de
                cada linha em <Code>aria-rowindex</Code>; a linha que está com o foco continua no DOM mesmo depois de
                rolar para fora da área visível. As linhas que ainda não foram renderizadas não existem para a busca
                do navegador (Ctrl+F) nem para a leitura contínua do leitor de tela — ofereça filtros e, se isso for
                um problema para a tarefa, prefira paginação.
              </>
            }
            en={
              <>
                With <Code>virtualized</Code>, the table reports the total in <Code>aria-rowcount</Code> and each
                row's position in <Code>aria-rowindex</Code>; the row holding focus stays in the DOM even after it
                scrolls out of view. Rows not yet rendered do not exist for the browser's find (Ctrl+F) or for a
                screen reader's continuous reading — offer filters and, if that is a problem for the task, prefer
                pagination.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Move o foco entre botões de ordenação, separadores de coluna, filtros, botões de expandir, checkboxes, a região rolável e ações das linhas.', en: 'Moves focus between sort buttons, column separators, filters, expand buttons, checkboxes, the scroll region and row actions.' } },
            { keys: ['Enter'], description: { pt: 'Ordena pela coluna focada, abre/fecha o painel da linha ou abre a linha (botão da célula principal).', en: 'Sorts by the focused column, opens/closes the row panel or opens the row (main cell button).' } },
            { keys: ['Space'], description: { pt: 'Ordena pela coluna, abre/fecha o painel da linha ou marca/desmarca o checkbox focado.', en: 'Sorts by the column, opens/closes the row panel or toggles the focused checkbox.' } },
            { keys: ['↑', '↓'], description: { pt: 'Com a região rolável focada, rola a tabela.', en: 'With the scroll region focused, scrolls the table.' } },
            { keys: ['←', '→'], description: { pt: 'No separador de coluna: diminui ou aumenta a largura em 16px (64px com Shift). Com a região rolável focada, rola na horizontal.', en: 'On a column separator: shrinks or grows the width by 16px (64px with Shift). With the scroll region focused, scrolls horizontally.' } },
            { keys: ['Home', 'End'], description: { pt: 'No separador de coluna: largura mínima ou máxima.', en: 'On a column separator: minimum or maximum width.' } },
            { keys: ['Enter'], description: { pt: 'No separador de coluna: ajusta a largura ao conteúdo (o mesmo do clique duplo).', en: 'On a column separator: fits the width to the content (same as double-click).' } },
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
            { criterion: '2.1.1', description: { pt: 'Ordenação, filtros, seleção, expansão, redimensionamento, rolagem e linha clicável funcionam pelo teclado.', en: 'Sorting, filters, selection, expansion, resizing, scrolling and clickable rows work with the keyboard.' } },
            { criterion: '2.4.7', description: { pt: 'Foco visível em botões de ordenação e de expandir, checkboxes e na região rolável.', en: 'Visible focus on sort and expand buttons, checkboxes and the scroll region.' } },
            { criterion: '2.4.11', description: { pt: <>Com o cabeçalho fixo (<Code>maxHeight</Code>), a região rolável reserva a altura dele (<Code>scroll-padding-top</Code>): o foco que sobe pela tabela nunca fica escondido sob o cabeçalho. As colunas fixas reservam a largura delas do mesmo jeito (<Code>scroll-padding-inline</Code>).</>, en: <>With the sticky header (<Code>maxHeight</Code>), the scroll region reserves its height (<Code>scroll-padding-top</Code>): focus moving up the table is never hidden under the header. Pinned columns reserve their width in the same way (<Code>scroll-padding-inline</Code>).</> } },
            { criterion: '2.5.7', description: { pt: 'Redimensionar não depende de arrastar: o clique duplo no separador ajusta a coluna ao conteúdo e o teclado cobre o resto.', en: 'Resizing does not depend on dragging: double-clicking the separator fits the column to its content and the keyboard covers the rest.' } },
            { criterion: '2.5.8', description: { pt: 'A área de arrasto do separador tem 24px de largura (12px de cada lado da borda da coluna).', en: 'The separator drag area is 24px wide (12px on each side of the column edge).' } },
            { criterion: '4.1.2', description: { pt: <>Estado de ordenação em <Code>aria-sort</Code>; checkbox "selecionar todos" com estado indeterminado; painel de detalhes em <Code>aria-expanded</Code>; largura da coluna em <Code>aria-valuenow</Code>; total e posição das linhas virtualizadas em <Code>aria-rowcount</Code> e <Code>aria-rowindex</Code>.</>, en: <>Sort state in <Code>aria-sort</Code>; "select all" checkbox with an indeterminate state; detail panel in <Code>aria-expanded</Code>; column width in <Code>aria-valuenow</Code>; total and position of virtualized rows in <Code>aria-rowcount</Code> and <Code>aria-rowindex</Code>.</> } },
            { criterion: '4.1.3', description: { pt: 'Mudanças de ordenação e o número de linhas depois de filtrar são anunciados em role="status".', en: 'Sort changes and the number of rows after filtering are announced in role="status".' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
