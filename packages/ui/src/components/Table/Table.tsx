import {
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ForwardedRef,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
  type TableHTMLAttributes,
} from 'react'
import { useControllableState, useId } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx } from '../../utils'
import { VisuallyHidden } from '../VisuallyHidden'
import './Table.css'

export type TableAlign = 'start' | 'center' | 'end'
export type TableSortDirection = 'ascending' | 'descending'
export type TableDensity = 'compact' | 'normal'
export type TableSortValue = string | number | boolean | Date | null | undefined

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
  /** Mostra checkboxes para selecionar linhas. */
  selectable?: boolean
  /** Ids das linhas selecionadas (controlado). */
  selectedRows?: string[]
  /** Ids selecionados inicialmente (não controlado). */
  defaultSelectedRows?: string[]
  /** Chamado com os ids selecionados sempre que a seleção muda. */
  onSelectionChange?: (ids: string[]) => void
  /** Texto que identifica a linha no rótulo do checkbox ("Selecionar linha: …"). */
  getRowLabel?: (row: T) => string
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
    selectable = false,
    selectedRows,
    defaultSelectedRows,
    onSelectionChange,
    getRowLabel,
    density = 'normal',
    striped = false,
    maxHeight,
    emptyState,
    onRowClick,
    containerProps,
    className,
    ...rest
  }: TableProps<T>,
  ref: ForwardedRef<HTMLTableElement>,
) {
  const { t, locale } = useLocale()
  const tableId = useId('or-table')
  const captionId = `${tableId}-caption`
  const selectAllRef = useRef<HTMLInputElement>(null)
  const [announcement, setAnnouncement] = useState('')
  const sortedByUser = useRef(false)

  const [sort, setSort] = useControllableState<TableSort | null>({
    value: sortProp,
    defaultValue: defaultSort,
    onChange: onSortChange,
  })
  const [selected, setSelected] = useControllableState<string[]>({
    value: selectedRows,
    defaultValue: defaultSelectedRows ?? [],
    onChange: onSelectionChange,
  })

  const collator = useMemo(() => {
    try {
      return new Intl.Collator(locale, { numeric: true, sensitivity: 'base' })
    } catch {
      return new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
    }
  }, [locale])

  const entries = useMemo(
    () => data.map((row, index) => ({ row, index, id: getRowId ? getRowId(row, index) : defaultRowId(row, index) })),
    [data, getRowId],
  )

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
  const selectedSet = useMemo(() => new Set(selected), [selected])
  const visibleIds = entries.map((e) => e.id)
  const selectedCount = visibleIds.filter((id) => selectedSet.has(id)).length
  const allSelected = visibleIds.length > 0 && selectedCount === visibleIds.length
  const someSelected = selectedCount > 0 && !allSelected

  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = someSelected
  }, [someSelected])

  const toggleAll = () => {
    if (allSelected) setSelected(selected.filter((id) => !visibleIds.includes(id)))
    else setSelected([...selected, ...visibleIds.filter((id) => !selectedSet.has(id))])
  }

  const toggleRow = (id: string) => {
    setSelected(selectedSet.has(id) ? selected.filter((s) => s !== id) : [...selected, id])
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

  // Linha clicável ---------------------------------------------------------
  const primaryKey = (columns.find((c) => c.rowHeader) ?? columns[0])?.key
  const rowHeaderKey = columns.find((c) => c.rowHeader)?.key

  const handleRowClick = (row: T) => (event: MouseEvent<HTMLTableRowElement>) => {
    if (!onRowClick) return
    const target = event.target as Element
    const interactive = target.closest(INTERACTIVE)
    if (interactive && event.currentTarget.contains(interactive)) return
    if (typeof window !== 'undefined' && window.getSelection?.()?.toString()) return
    onRowClick(row, event)
  }

  const colCount = columns.length + (selectable ? 1 : 0)
  const scrollable = maxHeight !== undefined
  const containerStyle: CSSProperties = { ...containerProps?.style, ...(scrollable ? { maxHeight } : null) }

  return (
    <div
      {...containerProps}
      className={cx('or-table-container', scrollable && 'or-table-container--scroll', containerProps?.className)}
      style={containerStyle}
      {...(scrollable ? { role: 'region', 'aria-labelledby': captionId, tabIndex: 0 } : null)}
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
          className,
        )}
        {...rest}
      >
        <caption id={captionId} className={cx('or-table__caption', hideCaption && 'or-visually-hidden')}>
          {caption}
        </caption>
        <thead>
          <tr>
            {selectable && (
              <th scope="col" className="or-table__select">
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
            {columns.map((column) => {
              const active = sort?.key === column.key
              const ariaSort = column.sortable ? (active ? sort!.direction : 'none') : undefined
              const label = column.hideHeader ? <VisuallyHidden>{column.header}</VisuallyHidden> : column.header
              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={ariaSort}
                  className={cx(
                    'or-table__th',
                    column.align && `or-table__cell--${column.align}`,
                    active && 'or-table__th--sorted',
                  )}
                  style={column.width !== undefined ? { width: column.width } : undefined}
                >
                  {column.sortable ? (
                    <button type="button" className="or-table__sort" onClick={() => handleSort(column)}>
                      <span className="or-table__sort-label">{label}</span>
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
                  ) : (
                    label
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr className="or-table__empty-row">
              <td colSpan={colCount} className="or-table__empty">
                {emptyState ?? t('noResults')}
              </td>
            </tr>
          ) : (
            rows.map(({ row, id }, rowIndex) => {
              const isSelected = selectedSet.has(id)
              const headerCellId = `${tableId}-r${rowIndex}-h`
              const checkboxId = `${tableId}-r${rowIndex}-cb`
              const rowLabel = getRowLabel?.(row)
              return (
                <tr
                  key={id}
                  data-selected={isSelected || undefined}
                  className="or-table__row"
                  onClick={onRowClick ? handleRowClick(row) : undefined}
                >
                  {selectable && (
                    <td className="or-table__select">
                      <span className="or-table__check">
                        <input
                          id={checkboxId}
                          type="checkbox"
                          className="or-table__check-input"
                          checked={isSelected}
                          onChange={() => toggleRow(id)}
                          {...(rowLabel
                            ? { 'aria-label': `${t('selectRow')}: ${rowLabel}` }
                            : rowHeaderKey
                              ? { 'aria-label': t('selectRow'), 'aria-labelledby': `${checkboxId} ${headerCellId}` }
                              : { 'aria-label': `${t('selectRow')} ${rowIndex + 1}` })}
                        />
                        <span className="or-table__check-box" aria-hidden="true">
                          <Icon name="check" className="or-table__check-icon" strokeWidth={2.5} />
                        </span>
                      </span>
                    </td>
                  )}
                  {columns.map((column) => {
                    const raw = column.render ? column.render(row, rowIndex) : (readValue(row, column.key) as ReactNode)
                    const content =
                      onRowClick && column.key === primaryKey ? (
                        <button
                          type="button"
                          className="or-table__row-action"
                          onClick={(event) => onRowClick(row, event)}
                        >
                          {raw}
                        </button>
                      ) : (
                        raw
                      )
                    const cellClass = cx('or-table__cell', column.align && `or-table__cell--${column.align}`)
                    return column.rowHeader ? (
                      <th key={column.key} scope="row" id={headerCellId} className={cx(cellClass, 'or-table__row-header')}>
                        {content}
                      </th>
                    ) : (
                      <td key={column.key} className={cellClass}>
                        {content}
                      </td>
                    )
                  })}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
      <VisuallyHidden role="status">{announcement}</VisuallyHidden>
    </div>
  )
}

/**
 * Tabela de dados semântica: legenda, cabeçalhos com `scope`, ordenação por
 * coluna (`aria-sort`), seleção de linhas, cabeçalho fixo e estado vazio.
 */
const ForwardedTable = forwardRef(TableInner)
ForwardedTable.displayName = 'Table'

export const Table = ForwardedTable as <T>(
  props: TableProps<T> & { ref?: Ref<HTMLTableElement> },
) => ReactElement | null
