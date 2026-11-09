import {
  forwardRef,
  Fragment,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type ForwardedRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
  type TableHTMLAttributes,
} from 'react'
import { useControllableState, useId, usePresence } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { clamp, cx, devWarning, normalizeText } from '../../utils'
import { VisuallyHidden } from '../VisuallyHidden'
import { useVirtualRows } from './useVirtualRows'
import './Table.css'

export type TableAlign = 'start' | 'center' | 'end'
export type TableSortDirection = 'ascending' | 'descending'
export type TableDensity = 'compact' | 'normal'
export type TableSortValue = string | number | boolean | Date | null | undefined

/** Opção de um filtro `select` da coluna. */
export interface TableFilterOption {
  value: string
  label: string
}

/** Filtros ativos: o texto (ou o `value` da opção) por `key` de coluna. Vazio = sem filtro. */
export type TableFilters = Record<string, string>

/** Larguras das colunas em px, por `key`. */
export type TableColumnWidths = Record<string, number>

export interface TableSort {
  /** `key` da coluna ordenada. */
  key: string
  direction: TableSortDirection
}

export interface TableColumn<T> {
  /** Identificador único da coluna. Sem `render`, a célula mostra `row[key]`. */
  key: string
  /** Conteúdo do cabeçalho (`<th scope="col">`). */
  header: ReactNode
  /** Renderiza o conteúdo da célula. */
  render?: (row: T, index: number) => ReactNode
  /** Permite ordenar pela coluna (botão no cabeçalho). */
  sortable?: boolean
  /** Valor usado na ordenação. Padrão: `row[key]`. */
  sortValue?: (row: T) => TableSortValue
  /** Alinhamento horizontal. Use `end` para números. */
  align?: TableAlign
  /** Largura da coluna (px ou qualquer unidade CSS). */
  width?: number | string
  /** Células desta coluna viram cabeçalhos de linha (`<th scope="row">`). */
  rowHeader?: boolean
  /** Esconde o texto do cabeçalho visualmente (continua acessível). */
  hideHeader?: boolean
  /**
   * Mostra um filtro sob o cabeçalho da coluna. `text`: a célula contém o texto digitado, sem
   * diferenciar acentos nem maiúsculas. `select`: valor exato entre `filterOptions`.
   */
  filter?: 'text' | 'select'
  /** Opções do filtro `select`. A primeira opção ("Todos") é incluída pela tabela. */
  filterOptions?: TableFilterOption[]
  /** Texto comparado pelo filtro. Padrão: `row[key]`. Informe quando a coluna usa `render`. */
  filterValue?: (row: T) => string
  /** `false` tira a coluna do `TableColumnsMenu`: ela não pode ser ocultada. Padrão: `true`. */
  hideable?: boolean
  /**
   * Fixa a coluna numa borda enquanto a tabela rola na horizontal: `start` (com a seleção e o
   * botão de expandir) ou `end` (bom para ações). Colunas fixas vão para a borda, na ordem dada.
   */
  pinned?: 'start' | 'end'
  /**
   * Deixa a pessoa mudar a largura da coluna: arrastando a borda direita do cabeçalho ou, com o
   * foco nela, pelas setas (Shift para passos maiores), Home e End. Clique duplo (ou Enter) ajusta
   * a coluna ao conteúdo.
   */
  resizable?: boolean
  /** Menor largura ao redimensionar, em px. Padrão: `80`. */
  minWidth?: number
  /** Maior largura ao redimensionar, em px. Padrão: `640`. */
  maxWidth?: number
}

export interface TableProps<T> extends Omit<TableHTMLAttributes<HTMLTableElement>, 'children'> {
  /** Definição das colunas. */
  columns: TableColumn<T>[]
  /** Linhas da tabela. */
  data: T[]
  /** Id estável de cada linha. Padrão: `row.id` ou o índice. */
  getRowId?: (row: T, index: number) => string
  /** Título da tabela (`<caption>`). Obrigatório para dar nome à tabela. */
  caption: ReactNode
  /** Esconde a legenda visualmente, mantendo-a para leitores de tela. */
  hideCaption?: boolean
  /** Ordenação controlada. */
  sort?: TableSort | null
  /** Ordenação inicial (não controlada). */
  defaultSort?: TableSort | null
  /** Chamado quando o usuário muda a ordenação. */
  onSortChange?: (sort: TableSort | null) => void
  /** Não ordena `data` internamente (ordenação feita no servidor). */
  manualSort?: boolean
  /** Filtros das colunas com `filter` (controlado): `{ [key]: texto }`. */
  filters?: TableFilters
  /** Filtros iniciais (não controlado). */
  defaultFilters?: TableFilters
  /** Chamado quando o usuário muda um filtro. */
  onFiltersChange?: (filters: TableFilters) => void
  /** Não filtra `data` internamente (filtro feito no servidor). */
  manualFilter?: boolean
  /** `key` das colunas ocultas. Use com o `TableColumnsMenu` para a pessoa escolher as colunas. */
  hiddenColumns?: string[]
  /**
   * Larguras das colunas em px (controlado). Na primeira vez que a pessoa redimensiona uma coluna,
   * a tabela registra a largura de todas e passa a ter largura fixa: mudar uma coluna não mexe
   * nas outras.
   */
  columnWidths?: TableColumnWidths
  /** Larguras iniciais (não controlado). */
  defaultColumnWidths?: TableColumnWidths
  /** Chamado enquanto a pessoa redimensiona uma coluna. */
  onColumnWidthsChange?: (widths: TableColumnWidths) => void
  /**
   * Renderiza só as linhas à vista — para milhares de linhas. Exige `maxHeight` e linhas de mesma
   * altura (as células não quebram linha); não se combina com `renderExpanded`.
   */
  virtualized?: boolean
  /** Com `virtualized`: altura estimada da linha em px, usada até a tabela medir a real. */
  rowHeight?: number
  /** Com `virtualized`: linhas a mais renderizadas acima e abaixo da área visível. Padrão: `8`. */
  overscan?: number
  /** Mostra checkboxes para selecionar linhas. */
  selectable?: boolean
  /** Ids das linhas selecionadas (controlado). */
  selectedRows?: string[]
  /** Ids selecionados inicialmente (não controlado). */
  defaultSelectedRows?: string[]
  /** Chamado com os ids selecionados sempre que a seleção muda. */
  onSelectedRowsChange?: (ids: string[]) => void
  /**
   * Texto que identifica a linha no rótulo do checkbox ("Selecionar linha: …") e do botão de
   * expandir ("Expandir linha: …"). Padrão: o cabeçalho de linha (`rowHeader`).
   */
  getRowLabel?: (row: T) => string
  /**
   * Conteúdo do painel de detalhes da linha. Com esta prop, cada linha expansível ganha um
   * botão de expandir/recolher na primeira coluna, e o painel aparece logo abaixo da linha,
   * em uma célula que ocupa todas as colunas.
   */
  renderExpanded?: (row: T) => ReactNode
  /** Ids das linhas expandidas (controlado). */
  expandedRows?: string[]
  /** Ids expandidos inicialmente (não controlado). */
  defaultExpandedRows?: string[]
  /** Chamado com os ids expandidos sempre que uma linha abre ou fecha. */
  onExpandedRowsChange?: (ids: string[]) => void
  /** Diz quais linhas podem ser expandidas. Padrão: todas (quando há `renderExpanded`). */
  isRowExpandable?: (row: T) => boolean
  /** Espaçamento das células. */
  density?: TableDensity
  /** Alterna a cor de fundo das linhas. */
  striped?: boolean
  /** Altura máxima: o corpo rola e o cabeçalho fica fixo. */
  maxHeight?: number | string
  /** Conteúdo exibido quando `data` está vazio. */
  emptyState?: ReactNode
  /**
   * Torna a linha clicável. A célula principal (cabeçalho de linha ou primeira
   * coluna) vira um botão, garantindo o acesso por teclado.
   */
  onRowClick?: (row: T, event: MouseEvent<HTMLElement>) => void
  /** Atributos do contêiner com borda/rolagem que envolve a tabela. */
  containerProps?: HTMLAttributes<HTMLDivElement>
}

const INTERACTIVE = 'a, button, input, select, textarea, label, summary, [role="button"], [role="link"], [tabindex]'

/** Extrai o texto de um ReactNode (para anúncios e rótulos). */
function nodeText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(nodeText).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) return nodeText(node.props.children)
  return ''
}

function defaultRowId(row: unknown, index: number): string {
  if (row && typeof row === 'object' && 'id' in row) {
    const id = (row as { id: unknown }).id
    if (typeof id === 'string' || typeof id === 'number') return String(id)
  }
  return String(index)
}

function readValue<T>(row: T, key: string): unknown {
  return row && typeof row === 'object' ? (row as Record<string, unknown>)[key] : undefined
}

function isEmpty(value: TableSortValue) {
  return value === null || value === undefined || value === ''
}

function TableInner<T>(
  {
    columns,
    data,
    getRowId,
    caption,
    hideCaption = false,
    sort: sortProp,
    defaultSort = null,
    onSortChange,
    manualSort = false,
    filters: filtersProp,
    defaultFilters,
    onFiltersChange,
    manualFilter = false,
    hiddenColumns,
    columnWidths,
    defaultColumnWidths,
    onColumnWidthsChange,
    virtualized = false,
    rowHeight,
    overscan = 8,
    selectable = false,
    selectedRows,
    defaultSelectedRows,
    onSelectedRowsChange,
    getRowLabel,
    renderExpanded,
    expandedRows,
    defaultExpandedRows,
    onExpandedRowsChange,
    isRowExpandable,
    density = 'normal',
    striped = false,
    maxHeight,
    emptyState,
    onRowClick,
    containerProps,
    className,
    style,
    ...rest
  }: TableProps<T>,
  ref: ForwardedRef<HTMLTableElement>,
) {
  const { t, locale } = useLocale()
  const tableId = useId('or-table')
  const captionId = `${tableId}-caption`
  const selectAllRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLTableSectionElement>(null)
  const bodyRef = useRef<HTMLTableSectionElement>(null)
  const [announcement, setAnnouncement] = useState('')
  const sortedByUser = useRef(false)
  const filteredByUser = useRef(false)

  const [sort, setSort] = useControllableState<TableSort | null>({
    value: sortProp,
    defaultValue: defaultSort,
    onChange: onSortChange,
  })
  const [filters, setFilters] = useControllableState<TableFilters>({
    value: filtersProp,
    defaultValue: defaultFilters ?? {},
    onChange: onFiltersChange,
  })
  const [selected, setSelected] = useControllableState<string[]>({
    value: selectedRows,
    defaultValue: defaultSelectedRows ?? [],
    onChange: onSelectedRowsChange,
  })
  const [expanded, setExpanded] = useControllableState<string[]>({
    value: expandedRows,
    defaultValue: defaultExpandedRows ?? [],
    onChange: onExpandedRowsChange,
  })

  const collator = useMemo(() => {
    try {
      return new Intl.Collator(locale, { numeric: true, sensitivity: 'base' })
    } catch {
      return new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
    }
  }, [locale])

  // Colunas ---------------------------------------------------------------
  // Sem as ocultas e com as fixas nas bordas (início, meio, fim), cada grupo na ordem dada.
  const visibleColumns = useMemo(() => {
    const hidden = new Set(hiddenColumns)
    const shown = hidden.size ? columns.filter((column) => !hidden.has(column.key)) : columns
    if (!shown.some((column) => column.pinned)) return shown
    return [
      ...shown.filter((column) => column.pinned === 'start'),
      ...shown.filter((column) => !column.pinned),
      ...shown.filter((column) => column.pinned === 'end'),
    ]
  }, [columns, hiddenColumns])
  const hasFilters = visibleColumns.some((column) => column.filter)

  const allEntries = useMemo(
    () => data.map((row, index) => ({ row, index, id: getRowId ? getRowId(row, index) : defaultRowId(row, index) })),
    [data, getRowId],
  )

  // Filtro: só as colunas visíveis filtram (um filtro que a pessoa não vê não pode esconder linhas).
  const activeFilters = useMemo(
    () =>
      visibleColumns.flatMap((column) => {
        const query = column.filter ? (filters[column.key] ?? '').trim() : ''
        return query ? [{ column, query, text: normalizeText(query) }] : []
      }),
    [visibleColumns, filters],
  )
  const entries = useMemo(() => {
    if (manualFilter || activeFilters.length === 0) return allEntries
    return allEntries.filter(({ row }) =>
      activeFilters.every(({ column, query, text }) => {
        const value = column.filterValue ? column.filterValue(row) : String(readValue(row, column.key) ?? '')
        return column.filter === 'select' ? value === query : normalizeText(value).includes(text)
      }),
    )
  }, [allEntries, activeFilters, manualFilter])

  const rows = useMemo(() => {
    if (!sort || manualSort) return entries
    const column = columns.find((c) => c.key === sort.key)
    if (!column) return entries
    const getValue = column.sortValue ?? ((row: T) => readValue(row, column.key) as TableSortValue)
    const factor = sort.direction === 'ascending' ? 1 : -1
    return [...entries].sort((a, b) => {
      const va = getValue(a.row)
      const vb = getValue(b.row)
      // valores vazios sempre ao final, independentemente da direção
      if (isEmpty(va) || isEmpty(vb)) {
        if (isEmpty(va) && isEmpty(vb)) return a.index - b.index
        return isEmpty(va) ? 1 : -1
      }
      let result: number
      if (typeof va === 'number' && typeof vb === 'number') result = va - vb
      else if (va instanceof Date && vb instanceof Date) result = va.getTime() - vb.getTime()
      else if (typeof va === 'boolean' && typeof vb === 'boolean') result = Number(va) - Number(vb)
      else result = collator.compare(String(va), String(vb))
      return result * factor || a.index - b.index
    })
  }, [entries, sort, manualSort, columns, collator])

  // Seleção ----------------------------------------------------------------
  // "Selecionar todos" vale para as linhas à vista (depois do filtro). Conjuntos: custo linear
  // mesmo com milhares de linhas.
  const selectedSet = useMemo(() => new Set(selected), [selected])
  const visibleIds = useMemo(() => entries.map((e) => e.id), [entries])
  const selectedCount = useMemo(
    () => visibleIds.reduce((count, id) => count + (selectedSet.has(id) ? 1 : 0), 0),
    [visibleIds, selectedSet],
  )
  const allSelected = visibleIds.length > 0 && selectedCount === visibleIds.length
  const someSelected = selectedCount > 0 && !allSelected

  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = someSelected
  }, [someSelected])

  const toggleAll = () => {
    if (allSelected) {
      const visible = new Set(visibleIds)
      setSelected(selected.filter((id) => !visible.has(id)))
    } else setSelected([...selected, ...visibleIds.filter((id) => !selectedSet.has(id))])
  }

  const toggleRow = (id: string) => {
    setSelected(selectedSet.has(id) ? selected.filter((s) => s !== id) : [...selected, id])
  }

  // Expansão ---------------------------------------------------------------
  // O estado guarda ids (getRowId), então acompanha a linha quando a ordenação muda.
  const expandable = renderExpanded !== undefined
  const expandedSet = useMemo(() => new Set(expanded), [expanded])

  const toggleExpanded = (id: string) => {
    setExpanded(expandedSet.has(id) ? expanded.filter((e) => e !== id) : [...expanded, id])
  }

  // Ordenação --------------------------------------------------------------
  const handleSort = (column: TableColumn<T>) => {
    const direction: TableSortDirection =
      sort?.key === column.key && sort.direction === 'ascending' ? 'descending' : 'ascending'
    sortedByUser.current = true
    setSort({ key: column.key, direction })
  }

  useEffect(() => {
    if (!sortedByUser.current || !sort) return
    sortedByUser.current = false
    const column = columns.find((c) => c.key === sort.key)
    if (!column) return
    const label = nodeText(column.header) || column.key
    setAnnouncement(`${label}, ${t(sort.direction === 'ascending' ? 'sortAscending' : 'sortDescending')}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort?.key, sort?.direction])

  // Filtro ------------------------------------------------------------------
  const changeFilter = (key: string, value: string) => {
    filteredByUser.current = true
    const next = { ...filters }
    if (value) next[key] = value
    else delete next[key]
    setFilters(next)
  }

  const clearFilters = () => {
    filteredByUser.current = true
    setFilters({})
  }

  // Quem não vê a tabela encolher ouve quantas linhas sobraram.
  const resultCount = rows.length
  useEffect(() => {
    if (!filteredByUser.current) return
    filteredByUser.current = false
    setAnnouncement(
      resultCount === 0
        ? t('noResults')
        : resultCount === 1
          ? t('resultsCountOne')
          : t('resultsCount', { count: resultCount }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, resultCount])

  // Linha clicável ---------------------------------------------------------
  const primaryKey = (visibleColumns.find((c) => c.rowHeader) ?? visibleColumns[0])?.key
  const rowHeaderKey = visibleColumns.find((c) => c.rowHeader)?.key

  const handleRowClick = (row: T) => (event: MouseEvent<HTMLTableRowElement>) => {
    if (!onRowClick) return
    const target = event.target as Element
    const interactive = target.closest(INTERACTIVE)
    if (interactive && event.currentTarget.contains(interactive)) return
    if (typeof window !== 'undefined' && window.getSelection?.()?.toString()) return
    onRowClick(row, event)
  }

  const colCount = visibleColumns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0)
  const overflowX = useHorizontalOverflow(containerRef, expandable)
  // Contêiner rolável (altura máxima ou tabela mais larga que a tela) vira região focável, para o
  // teclado alcançar a rolagem (WCAG 2.1.1).
  const scrollable = maxHeight !== undefined
  useStickyHeadHeight(containerRef, headRef, scrollable)
  const focusableRegion = scrollable || overflowX
  const headRowCount = hasFilters ? 2 : 1

  // Virtualização ----------------------------------------------------------
  devWarning(virtualized && !scrollable, 'Table: `virtualized` precisa de `maxHeight` (uma área que rola).')
  devWarning(
    virtualized && expandable,
    'Table: `virtualized` não se combina com `renderExpanded`; todas as linhas serão renderizadas.',
  )
  const virtual = virtualized && scrollable && !expandable
  const range = useVirtualRows({
    enabled: virtual,
    count: rows.length,
    containerRef,
    bodyRef,
    // Altura medida das linhas de uma linha de texto; o checkbox de seleção (24px) soma 6px.
    estimate: rowHeight ?? (density === 'compact' ? 35 : 47) + (selectable ? 6 : 0),
    overscan,
    fallbackViewport: typeof maxHeight === 'number' ? maxHeight : 600,
  })
  // A linha com o foco continua no DOM mesmo fora da janela: rolar não pode jogar o foco fora.
  const [focusedRow, setFocusedRow] = useState<string | null>(null)
  const indexById = useMemo(
    () => (virtual ? new Map(rows.map((entry, index) => [entry.id, index])) : null),
    [virtual, rows],
  )
  const renderedIndexes = useMemo(() => {
    if (!virtual) return null
    const focused = focusedRow !== null ? indexById?.get(focusedRow) : undefined
    const list: number[] = []
    if (focused !== undefined && focused < range.start) list.push(focused)
    for (let index = range.start; index < range.end; index++) list.push(index)
    if (focused !== undefined && focused >= range.end) list.push(focused)
    return list
  }, [virtual, focusedRow, indexById, range.start, range.end])

  const handleBodyFocus = (event: FocusEvent<HTMLTableSectionElement>) => {
    setFocusedRow((event.target as Element).closest<HTMLElement>('tr[data-row-id]')?.dataset.rowId ?? null)
  }
  const handleBodyBlur = (event: FocusEvent<HTMLTableSectionElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusedRow(null)
  }

  // Larguras, colunas fixas e redimensionamento ------------------------------
  const hasPinned = visibleColumns.some((column) => column.pinned)
  const hasPinnedStart = visibleColumns.some((column) => column.pinned === 'start')
  const hasResizable = visibleColumns.some((column) => column.resizable)
  const measured = useHeadWidths(
    headRef,
    hasPinned || hasResizable,
    `${visibleColumns.map((column) => column.key).join('\u0000')}|${selectable}|${expandable}|${density}`,
  )
  const [widths, setWidths] = useControllableState<TableColumnWidths>({
    value: columnWidths,
    defaultValue: defaultColumnWidths ?? {},
    onChange: onColumnWidthsChange,
  })
  const [resizing, setResizing] = useState<string | null>(null)
  const stopResize = useRef<(() => void) | null>(null)
  useEffect(() => () => stopResize.current?.(), [])

  // Com a largura de todas as colunas à vista conhecida, a tabela passa a ter layout fixo: cada
  // coluna tem exatamente a sua largura e a tabela, a soma delas (rola se não couber).
  const fixedLayout = visibleColumns.length > 0 && visibleColumns.every((column) => widths[column.key] !== undefined)
  const fixedWidth = fixedLayout ? visibleColumns.reduce((sum, column) => sum + widths[column.key], 0) : 0

  // Distância de cada célula fixa até a borda: a soma das larguras das fixas antes dela.
  const pin = useMemo(() => {
    const start: Record<string, number> = {}
    const end: Record<string, number> = {}
    let lastStart: string | undefined
    let firstEnd: string | undefined
    if (!hasPinned) return { start, end, lastStart, firstEnd, startWidth: 0, endWidth: 0 }
    const widthOf = (key: string) => widths[key] ?? measured[key] ?? 0
    let offset = 0
    if (hasPinnedStart) {
      if (expandable) {
        start.__expand = offset
        offset += measured.__expand ?? 0
      }
      if (selectable) {
        start.__select = offset
        offset += measured.__select ?? 0
      }
    }
    for (const column of visibleColumns) {
      if (column.pinned !== 'start') continue
      start[column.key] = offset
      offset += widthOf(column.key)
      lastStart = column.key
    }
    const startWidth = offset
    offset = 0
    for (let index = visibleColumns.length - 1; index >= 0; index--) {
      const column = visibleColumns[index]
      if (column.pinned !== 'end') continue
      end[column.key] = offset
      offset += widthOf(column.key)
      firstEnd = column.key
    }
    return { start, end, lastStart, firstEnd, startWidth, endWidth: offset }
  }, [hasPinned, hasPinnedStart, expandable, selectable, visibleColumns, widths, measured])

  const pinCell = (key: string): { className?: string; style?: CSSProperties } => {
    const start = pin.start[key]
    const end = pin.end[key]
    if (start === undefined && end === undefined) return {}
    return {
      className: cx(
        'or-table__cell--pinned',
        key === pin.lastStart && 'or-table__cell--pinned-edge-start',
        key === pin.firstEnd && 'or-table__cell--pinned-edge-end',
      ),
      style: start !== undefined ? { insetInlineStart: start } : { insetInlineEnd: end },
    }
  }

  const resizeLimits = (column: TableColumn<T>) => {
    const min = column.minWidth ?? 80
    return { min, max: Math.max(column.maxWidth ?? 640, min) }
  }

  // Largura atual de todas as colunas à vista: a registrada ou, antes do primeiro
  // redimensionamento, a que o navegador deu à coluna.
  const snapshotWidths = (): TableColumnWidths => {
    const next = { ...widths }
    for (const column of visibleColumns) {
      next[column.key] = Math.round(
        widths[column.key] ?? (measured[column.key] || (typeof column.width === 'number' ? column.width : 160)),
      )
    }
    return next
  }

  const resizeTo = (column: TableColumn<T>, value: number, base: TableColumnWidths) => {
    const { min, max } = resizeLimits(column)
    setWidths({ ...base, [column.key]: clamp(Math.round(value), min, max) })
  }

  const handleResizePointerDown = (column: TableColumn<T>) => (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    event.preventDefault()
    stopResize.current?.()
    const base = snapshotWidths()
    const startX = event.clientX
    const startWidth = base[column.key]
    const move = (moveEvent: PointerEvent) => resizeTo(column, startWidth + moveEvent.clientX - startX, base)
    const stop = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
      stopResize.current = null
      setResizing(null)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
    stopResize.current = stop
    setResizing(column.key)
  }

  // Ajusta a coluna ao conteúdo das linhas no DOM: clique duplo no separador ou Enter com o foco
  // nele. É a alternativa de ponteiro único ao arraste (WCAG 2.5.7).
  const autoFit = (column: TableColumn<T>) => {
    const table = headRef.current?.closest('table')
    if (!table) return
    const position = visibleColumns.indexOf(column) + (expandable ? 1 : 0) + (selectable ? 1 : 0)
    // As células medem o conteúdo numa linha só (o CSS tira a quebra enquanto o atributo existe).
    table.setAttribute('data-measuring', '')
    let width = 0
    const rows = [table.tHead?.rows[0], ...Array.from(table.tBodies[0]?.rows ?? [])]
    for (const row of rows) {
      const cell = row?.cells[position]
      if (cell && cell.colSpan === 1) width = Math.max(width, contentWidth(cell))
    }
    table.removeAttribute('data-measuring')
    if (width > 0) resizeTo(column, Math.ceil(width), snapshotWidths())
  }

  const handleResizeKeyDown = (column: TableColumn<T>) => (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      autoFit(column)
      return
    }
    const { min, max } = resizeLimits(column)
    const base = snapshotWidths()
    const step = event.shiftKey ? 64 : 16
    let next: number
    if (event.key === 'ArrowRight') next = base[column.key] + step
    else if (event.key === 'ArrowLeft') next = base[column.key] - step
    else if (event.key === 'Home') next = min
    else if (event.key === 'End') next = max
    else return
    event.preventDefault()
    resizeTo(column, next, base)
  }

  // Largura das faixas fixas, para o CSS reservá-las ao rolar até o foco (scroll-padding-inline):
  // um controle que recebe o foco nunca fica escondido sob uma coluna fixa (WCAG 2.4.11).
  const containerStyle = {
    ...containerProps?.style,
    ...(scrollable ? { maxHeight } : null),
    ...(hasPinned ? { '--_pin-start': `${pin.startWidth}px`, '--_pin-end': `${pin.endWidth}px` } : null),
  } as CSSProperties

  const lastColumnKey = visibleColumns[visibleColumns.length - 1]?.key
  const expandPin = pinCell('__expand')
  const selectPin = pinCell('__select')

  const renderRow = ({ row, id }: { row: T; id: string }, rowIndex: number) => {
    const isSelected = selectedSet.has(id)
    const headerCellId = `${tableId}-r${rowIndex}-h`
    const checkboxId = `${tableId}-r${rowIndex}-cb`
    const expandId = `${tableId}-r${rowIndex}-x`
    const detailId = `${tableId}-r${rowIndex}-detail`
    const rowLabel = getRowLabel?.(row)
    const canExpand = expandable && (isRowExpandable ? isRowExpandable(row) : true)
    const isExpanded = canExpand && expandedSet.has(id)
    // Mesmo rótulo do checkbox e do botão de expandir: getRowLabel, o cabeçalho de linha
    // (aria-labelledby) ou, sem nenhum dos dois, a posição da linha.
    const labelProps = (action: string, ownId: string) =>
      rowLabel
        ? { 'aria-label': `${action}: ${rowLabel}` }
        : rowHeaderKey
          ? { 'aria-label': action, 'aria-labelledby': `${ownId} ${headerCellId}` }
          : { 'aria-label': `${action} ${rowIndex + 1}` }
    return (
      <Fragment key={id}>
        <tr
          data-selected={isSelected || undefined}
          data-expanded={isExpanded || undefined}
          // Com virtualização: o id acha a linha focada e a posição real vai para o leitor de tela.
          data-row-id={virtual ? id : undefined}
          aria-rowindex={virtual ? rowIndex + headRowCount + 1 : undefined}
          className={cx('or-table__row', virtual && rowIndex % 2 === 1 && 'or-table__row--alt')}
          onClick={onRowClick ? handleRowClick(row) : undefined}
        >
          {expandable && (
            <td className={cx('or-table__expand', expandPin.className)} style={expandPin.style}>
              {canExpand && (
                <button
                  type="button"
                  id={expandId}
                  className="or-table__expand-button"
                  aria-expanded={isExpanded}
                  // Só aponta para o painel enquanto ele existe (fechado, ele sai do DOM).
                  aria-controls={isExpanded ? detailId : undefined}
                  onClick={() => toggleExpanded(id)}
                  {...labelProps(t(isExpanded ? 'tableCollapseRow' : 'tableExpandRow'), expandId)}
                >
                  <Icon name="chevron-down" size={16} className="or-table__expand-icon" />
                </button>
              )}
            </td>
          )}
          {selectable && (
            <td className={cx('or-table__select', selectPin.className)} style={selectPin.style}>
              <span className="or-table__check">
                <input
                  id={checkboxId}
                  type="checkbox"
                  className="or-table__check-input"
                  checked={isSelected}
                  onChange={() => toggleRow(id)}
                  {...labelProps(t('selectRow'), checkboxId)}
                />
                <span className="or-table__check-box" aria-hidden="true">
                  <Icon name="check" className="or-table__check-icon" strokeWidth={2.5} />
                </span>
              </span>
            </td>
          )}
          {visibleColumns.map((column) => {
            const raw = column.render ? column.render(row, rowIndex) : (readValue(row, column.key) as ReactNode)
            const content =
              onRowClick && column.key === primaryKey ? (
                <button type="button" className="or-table__row-action" onClick={(event) => onRowClick(row, event)}>
                  {raw}
                </button>
              ) : (
                raw
              )
            const pinned = pinCell(column.key)
            const cellClass = cx(
              'or-table__cell',
              column.align && `or-table__cell--${column.align}`,
              column.resizable && column.key === lastColumnKey && 'or-table__cell--resize-end',
              pinned.className,
            )
            return column.rowHeader ? (
              <th
                key={column.key}
                scope="row"
                id={headerCellId}
                className={cx(cellClass, 'or-table__row-header')}
                style={pinned.style}
              >
                {content}
              </th>
            ) : (
              <td key={column.key} className={cellClass} style={pinned.style}>
                {content}
              </td>
            )
          })}
        </tr>
        {canExpand && (
          <TableDetailRow open={isExpanded} id={detailId} colSpan={colCount}>
            {() => renderExpanded?.(row)}
          </TableDetailRow>
        )}
      </Fragment>
    )
  }

  // Só a janela de linhas, com espaçadores do tamanho das que ficaram de fora.
  const renderVirtualRows = (indexes: number[]) => {
    const out: ReactNode[] = []
    let previous = -1
    const spacer = (count: number, key: string) => {
      if (count <= 0) return
      out.push(
        <tr key={key} className="or-table__spacer" aria-hidden="true">
          <td colSpan={colCount} style={{ height: count * range.rowHeight }} />
        </tr>,
      )
    }
    for (const index of indexes) {
      spacer(index - previous - 1, `spacer-${previous}`)
      out.push(renderRow(rows[index], index))
      previous = index
    }
    spacer(rows.length - 1 - previous, 'spacer-end')
    return out
  }

  return (
    <div
      {...containerProps}
      ref={containerRef}
      className={cx(
        'or-table-container',
        scrollable && 'or-table-container--scroll',
        hasPinned && 'or-table-container--pinned',
        containerProps?.className,
      )}
      style={containerStyle}
      data-resizing={resizing !== null || undefined}
      {...(focusableRegion ? { role: 'region', 'aria-labelledby': captionId, tabIndex: 0 } : null)}
    >
      <table
        ref={ref}
        id={tableId}
        className={cx(
          'or-table',
          `or-table--${density}`,
          striped && 'or-table--striped',
          scrollable && 'or-table--sticky',
          onRowClick && 'or-table--clickable',
          expandable && 'or-table--expandable',
          selectable && 'or-table--selectable',
          hasFilters && 'or-table--filters',
          virtual && 'or-table--virtual',
          hasPinned && 'or-table--pinned',
          hasResizable && 'or-table--resizable',
          fixedLayout && 'or-table--fixed',
          className,
        )}
        style={fixedLayout ? { ...style, width: `calc(${fixedWidth}px + var(--_util-width, 0px))` } : style}
        // Com virtualização, o leitor de tela fica sabendo o total de linhas, não só as do DOM.
        aria-rowcount={virtual ? rows.length + headRowCount : undefined}
        {...rest}
      >
        <caption id={captionId} className={cx('or-table__caption', hideCaption && 'or-visually-hidden')}>
          {caption}
        </caption>
        <thead ref={headRef}>
          <tr aria-rowindex={virtual ? 1 : undefined}>
            {expandable && (
              <th
                scope="col"
                data-col="__expand"
                className={cx('or-table__expand', expandPin.className)}
                style={expandPin.style}
              >
                <VisuallyHidden>{t('tableDetails')}</VisuallyHidden>
              </th>
            )}
            {selectable && (
              <th
                scope="col"
                data-col="__select"
                className={cx('or-table__select', selectPin.className)}
                style={selectPin.style}
              >
                <span className="or-table__check">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    className="or-table__check-input"
                    aria-label={t('selectAll')}
                    checked={allSelected}
                    disabled={visibleIds.length === 0}
                    onChange={toggleAll}
                  />
                  <span className="or-table__check-box" aria-hidden="true">
                    <Icon name="check" className="or-table__check-icon" strokeWidth={2.5} />
                    <Icon name="minus" className="or-table__check-icon or-table__check-icon--minus" strokeWidth={2.5} />
                  </span>
                </span>
              </th>
            )}
            {visibleColumns.map((column, columnIndex) => {
              const active = sort?.key === column.key
              const ariaSort = column.sortable ? (active ? sort!.direction : 'none') : undefined
              const label = column.hideHeader ? <VisuallyHidden>{column.header}</VisuallyHidden> : column.header
              const previous = visibleColumns[columnIndex - 1]
              const pinned = pinCell(column.key)
              const width = widths[column.key] ?? column.width
              const limits = column.resizable ? resizeLimits(column) : null
              // Com o separador dentro do <th>, o nome da coluna passa a vir só do rótulo: sem isso
              // o leitor de tela leria "Cliente Redimensionar coluna Cliente" em cada célula.
              const labelId = limits ? `${tableId}-c${columnIndex}` : undefined
              return (
                <th
                  key={column.key}
                  scope="col"
                  data-col={column.key}
                  aria-sort={ariaSort}
                  aria-labelledby={labelId}
                  className={cx(
                    'or-table__th',
                    column.align && `or-table__cell--${column.align}`,
                    active && 'or-table__th--sorted',
                    column.resizable && column.key === lastColumnKey && 'or-table__cell--resize-end',
                    pinned.className,
                  )}
                  style={width !== undefined || pinned.style ? { width, ...pinned.style } : undefined}
                >
                  {/* Metade da área de arrasto da coluna anterior fica deste lado da borda: juntas,
                      as duas metades somam 24px. Só para o ponteiro; o teclado usa o separador. */}
                  {previous?.resizable && (
                    <span
                      aria-hidden="true"
                      className="or-table__resize-grab"
                      onPointerDown={handleResizePointerDown(previous)}
                      onDoubleClick={() => autoFit(previous)}
                    />
                  )}
                  {column.sortable ? (
                    <button type="button" className="or-table__sort" onClick={() => handleSort(column)}>
                      <span className="or-table__sort-label" id={labelId}>
                        {label}
                      </span>
                      {/* Os dois ícones ficam sobrepostos: a troca é um crossfade e a seta gira 180° entre crescente e decrescente. */}
                      <span
                        className="or-table__sort-icon"
                        aria-hidden="true"
                        data-direction={active ? sort!.direction : undefined}
                      >
                        <Icon name="chevrons-up-down" size={14} className="or-table__sort-idle" />
                        <Icon name="arrow-up" size={14} className="or-table__sort-arrow" />
                      </span>
                    </button>
                  ) : labelId ? (
                    <span id={labelId}>{label}</span>
                  ) : (
                    label
                  )}
                  {limits && (
                    // Separador focável (padrão "window splitter" do APG): o teclado redimensiona
                    // pelas setas, então ele precisa de foco e de eventos.
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                    <span
                      role="separator"
                      aria-orientation="vertical"
                      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- separador focável (ver acima)
                      tabIndex={0}
                      className="or-table__resize"
                      data-active={resizing === column.key || undefined}
                      aria-label={t('tableResizeColumn', { column: nodeText(column.header) || column.key })}
                      aria-valuenow={Math.round(widths[column.key] ?? (measured[column.key] || limits.min))}
                      aria-valuemin={limits.min}
                      aria-valuemax={limits.max}
                      onPointerDown={handleResizePointerDown(column)}
                      onDoubleClick={() => autoFit(column)}
                      onKeyDown={handleResizeKeyDown(column)}
                    />
                  )}
                </th>
              )
            })}
          </tr>
          {hasFilters && (
            // Células <td>: os filtros não são cabeçalhos de coluna (não entram no nome das células).
            <tr className="or-table__filter-row" aria-rowindex={virtual ? 2 : undefined}>
              {expandable && <td className={cx('or-table__filter', expandPin.className)} style={expandPin.style} />}
              {selectable && <td className={cx('or-table__filter', selectPin.className)} style={selectPin.style} />}
              {visibleColumns.map((column) => {
                const name = t('tableFilterBy', { column: nodeText(column.header) || column.key })
                const value = filters[column.key] ?? ''
                const pinned = pinCell(column.key)
                return (
                  <td key={column.key} className={cx('or-table__filter', pinned.className)} style={pinned.style}>
                    {column.filter === 'select' ? (
                      <select
                        className="or-table__filter-control"
                        aria-label={name}
                        value={value}
                        onChange={(event) => changeFilter(column.key, event.target.value)}
                      >
                        <option value="">{t('tableFilterAll')}</option>
                        {column.filterOptions?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : column.filter === 'text' ? (
                      <input
                        type="search"
                        className="or-table__filter-control"
                        aria-label={name}
                        value={value}
                        onChange={(event) => changeFilter(column.key, event.target.value)}
                      />
                    ) : null}
                  </td>
                )
              })}
            </tr>
          )}
        </thead>
        <tbody
          ref={bodyRef}
          onFocus={virtual ? handleBodyFocus : undefined}
          onBlur={virtual ? handleBodyBlur : undefined}
        >
          {rows.length === 0 ? (
            <tr className="or-table__empty-row">
              <td colSpan={colCount} className="or-table__empty">
                {/* Há dados, mas o filtro escondeu todos: diz isso e oferece a saída. */}
                {allEntries.length > 0 && activeFilters.length > 0 ? (
                  <>
                    {t('noResults')}{' '}
                    <button type="button" className="or-table__clear-filters" onClick={clearFilters}>
                      {t('tableClearFilters')}
                    </button>
                  </>
                ) : (
                  (emptyState ?? t('noResults'))
                )}
              </td>
            </tr>
          ) : renderedIndexes ? (
            renderVirtualRows(renderedIndexes)
          ) : (
            rows.map(renderRow)
          )}
        </tbody>
      </table>
      <VisuallyHidden role="status">{announcement}</VisuallyHidden>
    </div>
  )
}

/**
 * Tabela de dados semântica: legenda, cabeçalhos com `scope`, ordenação por
 * coluna (`aria-sort`), seleção de linhas, linhas expansíveis (painel de
 * detalhes), cabeçalho fixo e estado vazio.
 */
const ForwardedTable = forwardRef(TableInner)
ForwardedTable.displayName = 'Table'

export const Table = ForwardedTable as <T>(
  props: TableProps<T> & { ref?: Ref<HTMLTableElement> },
) => ReactElement | null

/**
 * Linha de detalhes de uma linha expansível: um `<tr>` com uma única célula que ocupa todas as
 * colunas (o `id` dela é o alvo do `aria-controls` do botão). Só existe no DOM enquanto está
 * aberta ou animando a saída (`usePresence`) e fica `inert` durante a saída. Abre com
 * `grid-template-rows: 0fr → 1fr`, como o Accordion; sem movimento em `prefers-reduced-motion`.
 */
function TableDetailRow({
  open,
  id,
  colSpan,
  children,
}: {
  open: boolean
  id: string
  colSpan: number
  children: () => ReactNode
}) {
  const { present, nodeRef } = usePresence<HTMLDivElement>(open)
  // Ao abrir, o painel fica um quadro em 0fr para a transição ter um ponto de partida. Linhas
  // já expandidas na montagem (defaultExpandedRows) aparecem abertas, sem animar.
  const [expanded, setExpanded] = useState(open)

  useEffect(() => {
    if (!open) {
      setExpanded(false)
      return
    }
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setExpanded(true))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [open])

  if (!present) return null
  return (
    // Fora da ordem de Tab e da árvore de acessibilidade já durante a animação de saída.
    <tr className="or-table__detail-row" inert={open ? undefined : true}>
      <td id={id} colSpan={colSpan} className="or-table__detail">
        <div ref={nodeRef} className="or-table__detail-panel" data-state={open && expanded ? 'open' : 'closed'}>
          <div className="or-table__detail-clip">
            <div className="or-table__detail-content">{children()}</div>
          </div>
        </div>
      </td>
    </tr>
  )
}

/**
 * Largura (px) de que a célula precisa para mostrar o conteúdo numa linha só: o conteúdo mais o
 * respiro e as bordas. No cabeçalho mede só o rótulo (ou o botão de ordenar) — o separador de
 * redimensionar é absoluto e ocupa a altura toda da célula.
 */
function contentWidth(cell: HTMLTableCellElement): number {
  const style = getComputedStyle(cell)
  const box = ['paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth'] as const
  const extra = box.reduce((sum, property) => sum + (parseFloat(style[property]) || 0), 0)
  const label = cell.closest('thead') ? cell.querySelector(':scope > .or-table__sort, :scope > span[id]') : null
  if (label) return label.getBoundingClientRect().width + extra
  const range = document.createRange()
  range.selectNodeContents(cell)
  // Sem layout (jsdom), o Range não mede.
  const width = typeof range.getBoundingClientRect === 'function' ? range.getBoundingClientRect().width : 0
  return width ? width + extra : 0
}

/**
 * Verdadeiro quando o contêiner rola na horizontal (tabela mais larga que o espaço disponível).
 * Com `trackWidth`, enquanto rola, publica a largura visível em `--_detail-width` (direto no
 * estilo do contêiner, sem re-renderizar a tabela): o painel das linhas expandidas fica do
 * tamanho da área visível e preso a ela (sticky), em vez de se esticar pela tabela inteira.
 */
function useHorizontalOverflow(ref: { current: HTMLElement | null }, trackWidth = false): boolean {
  const [overflow, setOverflow] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const check = () => {
      const overflowing = el.scrollWidth > el.clientWidth + 1
      setOverflow(overflowing)
      if (trackWidth && overflowing) el.style.setProperty('--_detail-width', `${el.clientWidth}px`)
      else el.style.removeProperty('--_detail-width')
    }
    check()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(check)
    observer.observe(el)
    if (el.firstElementChild) observer.observe(el.firstElementChild)
    return () => {
      observer.disconnect()
      el.style.removeProperty('--_detail-width')
    }
  }, [ref, trackWidth])
  return overflow
}

/**
 * Largura real (px) de cada célula da primeira linha do cabeçalho, pela chave em `data-col`
 * (`__expand` e `__select` para as colunas de expandir e de seleção). Colunas fixas usam essas
 * medidas para saber a que distância da borda ficam; o redimensionamento parte delas.
 */
function useHeadWidths(
  headRef: { current: HTMLTableSectionElement | null },
  enabled: boolean,
  key: string,
): Record<string, number> {
  const [widths, setWidths] = useState<Record<string, number>>({})
  useEffect(() => {
    const head = headRef.current
    if (!enabled || !head) return
    const cells = Array.from(head.querySelectorAll<HTMLElement>(':scope > tr:first-child > [data-col]'))
    const measure = () => {
      const next: Record<string, number> = {}
      for (const cell of cells) next[cell.dataset.col as string] = cell.getBoundingClientRect().width
      setWidths((prev) => {
        const keys = Object.keys(next)
        return keys.length === Object.keys(prev).length && keys.every((k) => prev[k] === next[k]) ? prev : next
      })
    }
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    cells.forEach((cell) => observer.observe(cell))
    return () => observer.disconnect()
  }, [headRef, enabled, key])
  return widths
}

/**
 * Com o cabeçalho fixo (`maxHeight`), publica a altura real do `<thead>` em `--_head-height` no
 * contêiner rolável; o CSS a usa em `scroll-padding-top`. Assim, quando o foco sobe pela tabela
 * (Shift+Tab), o navegador rola o elemento para baixo do cabeçalho em vez de deixá-lo escondido
 * sob ele (WCAG 2.4.11). A altura é medida porque muda com a densidade, a fonte e a quebra dos
 * títulos.
 */
function useStickyHeadHeight(
  containerRef: { current: HTMLElement | null },
  headRef: { current: HTMLTableSectionElement | null },
  enabled: boolean,
) {
  useEffect(() => {
    const container = containerRef.current
    const head = headRef.current
    if (!enabled || !container || !head) return
    const update = () => {
      container.style.setProperty('--_head-height', `${head.offsetHeight}px`)
      // A linha de filtros gruda logo abaixo da primeira linha do cabeçalho.
      const first = head.rows[0]
      if (first) container.style.setProperty('--_head-row-height', `${first.offsetHeight}px`)
    }
    update()
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update)
    observer?.observe(head)
    return () => {
      observer?.disconnect()
      container.style.removeProperty('--_head-height')
      container.style.removeProperty('--_head-row-height')
    }
  }, [containerRef, headRef, enabled])
}
