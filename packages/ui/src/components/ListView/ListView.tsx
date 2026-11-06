import {
  Children,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { useControllableState, useId, useIsomorphicLayoutEffect } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx, devWarning, mergeRefs } from '../../utils'
import { VisuallyHidden } from '../VisuallyHidden'
import './ListView.css'

export type ListViewSelectionMode = 'none' | 'single' | 'multiple'
export type ListViewSize = 'sm' | 'md'

export interface ListViewProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'defaultValue' | 'onChange' | 'onSelect'
> {
  /**
   * `none` (padrão, só navegação e ações), `single` (selecionar outra linha
   * substitui; a selecionada continua selecionada) ou `multiple` (alterna, com
   * caixas de seleção).
   */
  selectionMode?: ListViewSelectionMode
  /** Ids selecionados (controlado), na ordem das linhas. */
  selected?: string[]
  /** Ids selecionados inicialmente (não controlado). */
  defaultSelected?: string[]
  /** Chamado com os ids selecionados, na ordem das linhas, sempre que a seleção muda. */
  onSelectedChange?: (selected: string[]) => void
  /**
   * Ação principal da linha (abrir detalhes, navegar), chamada com o `id` do
   * item ao pressionar Enter ou clicar no fundo da linha. Com ela, a seleção
   * fica com Espaço e com a caixa de seleção.
   */
  onAction?: (id: string) => void
  /** Densidade das linhas: `sm` (40px) ou `md` (56px, padrão). */
  size?: ListViewSize
  /** Conteúdo exibido quando não há itens. Padrão: "Nenhum resultado encontrado". */
  emptyState?: ReactNode
  /** Os `<ListViewItem>`. */
  children?: ReactNode
}

export interface ListViewItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id' | 'children'> {
  /** Identificador único na lista. É o valor usado em `selected` e `onAction`. */
  id: string
  /** Conteúdo principal (título da linha). Dá o nome acessível da linha. */
  children?: ReactNode
  /** Texto secundário abaixo do título (função, status, metadados). Ligado por `aria-describedby`. */
  description?: ReactNode
  /** Visual à esquerda: ícone, avatar ou logotipo. Decorativo (`aria-hidden`). */
  icon?: ReactNode
  /** Conteúdo à direita: ações (`IconButton`, `Dropdown`) ou status (`Badge`). Alcançado com → / ←, fora da ordem de Tab. */
  actions?: ReactNode
  /** Texto da busca por digitação e nome acessível quando `children` não tem texto. Padrão: o texto de `children`. */
  textValue?: string
  /**
   * Linha desabilitada: continua focável (como no `Listbox` e no `TreeView`),
   * mas não pode ser selecionada nem dispara `onAction`. Desabilite também as `actions`.
   */
  disabled?: boolean
}

/* -------------------------------------------------------------------------- */
/* Contexto e helpers internos                                                 */
/* -------------------------------------------------------------------------- */

interface ListViewContextValue {
  selectionMode: ListViewSelectionMode
  selected: ReadonlySet<string>
  activeKey: string | null
  showCheckbox: boolean
  /** `name` dos botões de opção (seleção única com `onAction`). */
  radioName: string
  toggle: (key: string) => void
}

const ListViewContext = createContext<ListViewContextValue | null>(null)

const EMPTY: string[] = []
const TYPEAHEAD_TIMEOUT = 500
const ROW = '.or-list-view__item[data-key]'

/** Elementos que podem receber foco dentro de uma linha (saem da ordem de Tab). */
const CHILD_FOCUSABLE = [
  'a[href]',
  'area[href]',
  'button',
  'input:not([type="hidden"])',
  'select',
  'textarea',
  'summary',
  'iframe',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]',
].join(',')

/** Alvos de clique que têm comportamento próprio (não disparam a ação da linha). */
const INTERACTIVE =
  'a[href], button, input, select, textarea, label, summary, [contenteditable]:not([contenteditable="false"]), [role="button"], [role="link"], [role="checkbox"], [role="switch"], [role="menuitem"], [tabindex]'

/** Controles que usam as setas/Home/End para si mesmos (texto, listas nativas, sliders). */
const OWNS_KEYS =
  'textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"], [role="combobox"], [role="slider"], [role="spinbutton"], ' +
  'input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="image"]):not([type="file"]):not([type="color"])'

interface RowNode {
  key: string
  disabled: boolean
  el: HTMLElement
}

function hasContent(node: ReactNode) {
  return node !== undefined && node !== null && node !== false && node !== ''
}

/** Remove acentos e caixa para a busca por digitação ("são" casa com "Sao"). */
function normalizeText(text: string) {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase()
}

function sameValues(a: readonly string[], b: readonly string[]) {
  return a.length === b.length && a.every((v, i) => v === b[i])
}

function rowText(el: HTMLElement) {
  return el.dataset.textValue ?? el.querySelector('.or-list-view__label')?.textContent ?? ''
}

/** Elementos focáveis da linha, na ordem do DOM (a caixa de seleção e as ações). */
function rowFocusables(row: HTMLElement) {
  return Array.from(row.querySelectorAll<HTMLElement>(CHILD_FOCUSABLE)).filter(
    (el) =>
      !el.matches(':disabled') &&
      !el.closest('[inert], [hidden], [aria-hidden="true"]') &&
      el.closest(ROW) === row,
  )
}

/* -------------------------------------------------------------------------- */
/* ListView                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Lista interativa de linhas com seleção e ações (padrão Grid do WAI-ARIA APG
 * usado como lista de uma coluna): membros, arquivos, integrações,
 * configurações. Cada linha tem visual à esquerda, título, descrição e ações.
 * Só uma parada de Tab para a lista inteira: setas navegam entre as linhas e
 * → / ← entram nas ações. Para listas estáticas use `List`; para escolher
 * valores de formulário, `Listbox`.
 */
export const ListView = forwardRef<HTMLDivElement, ListViewProps>(function ListView(
  {
    selectionMode = 'none',
    selected: selectedProp,
    defaultSelected,
    onSelectedChange,
    onAction,
    size = 'md',
    emptyState,
    className,
    children,
    onKeyDown,
    onFocus,
    onBlur,
    onClick,
    ...rest
  },
  ref,
) {
  devWarning(
    !rest['aria-label'] && !rest['aria-labelledby'],
    'ListView precisa de `aria-label` ou `aria-labelledby`.',
  )
  const { t } = useLocale()
  const baseId = useId('or-list-view')
  const gridRef = useRef<HTMLDivElement>(null)
  const composedRef = useMemo(() => mergeRefs(ref, gridRef), [ref])
  const multiple = selectionMode === 'multiple'

  const [selected, setSelected] = useControllableState<string[]>({
    value: selectedProp,
    defaultValue: defaultSelected ?? EMPTY,
    onChange: onSelectedChange,
  })
  const selectedSet = useMemo(() => new Set(selected), [selected])

  // Linha que é a parada de Tab da lista (roving tabindex).
  const [activeKey, setActiveKey] = useState<string | null>(null)
  // Posição da linha ativa na última renderização: devolve o foco à vizinha se ela sumir.
  const lastIndexRef = useRef(0)
  // O foco está na lista (ou num menu aberto a partir dela, via portal).
  const focusInsideRef = useRef(false)
  // Última linha marcada (âncora) e extensão em andamento com Shift (âncora + seleção inicial).
  const anchorRef = useRef<string | null>(null)
  const rangeRef = useRef<{ anchor: string; base: string[] } | null>(null)
  const typeahead = useRef<{ buffer: string; timer?: ReturnType<typeof setTimeout> }>({
    buffer: '',
  })
  const [announcement, setAnnouncement] = useState('')

  const isEmpty = Children.toArray(children).length === 0

  /** Linhas na ordem do DOM, lidas na hora (aceita itens dentro de fragmentos e componentes). */
  const getRows = (): RowNode[] => {
    const grid = gridRef.current
    if (!grid) return []
    return Array.from(grid.querySelectorAll<HTMLElement>(ROW))
      .filter((el) => el.closest('[role="grid"]') === grid)
      .map((el) => ({
        key: el.dataset.key ?? '',
        disabled: el.getAttribute('aria-disabled') === 'true',
        el,
      }))
  }

  /** Tira da ordem de Tab tudo o que é focável dentro das linhas: a lista tem uma só parada. */
  const lockRowContent = () => {
    for (const row of getRows()) {
      row.el.querySelectorAll<HTMLElement>(CHILD_FOCUSABLE).forEach((el) => {
        if (el.getAttribute('tabindex') !== '-1') el.setAttribute('tabindex', '-1')
      })
    }
  }

  // A cada renderização: tira o conteúdo das linhas da ordem de Tab, garante uma
  // linha ativa válida e, se a linha focada sumiu (ex.: "Remover"), leva o foco
  // para a vizinha em vez de deixá-lo cair no <body>.
  useIsomorphicLayoutEffect(() => {
    const rows = getRows()
    lockRowContent()
    const keys = rows.map((row) => row.key)
    devWarning(new Set(keys).size !== keys.length, 'ListView: há `ListViewItem` com `id` repetido.')
    // Linhas desabilitadas também podem ser a linha ativa (são focáveis, como no Listbox/TreeView).
    const index = rows.findIndex((row) => row.key === activeKey)
    if (index >= 0) {
      lastIndexRef.current = index
      return
    }
    const removed = activeKey !== null
    // A linha ativa sumiu: a que ocupou o lugar dela (ou a última). Senão, APG: a
    // (primeira) linha selecionada ou a primeira linha.
    const next = removed
      ? rows[Math.min(lastIndexRef.current, rows.length - 1)]
      : (rows.find((row) => selectedSet.has(row.key)) ?? rows[0])
    const nextKey = next?.key ?? null
    if (nextKey !== activeKey) setActiveKey(nextKey)
    if (removed && next && focusInsideRef.current) {
      const current = document.activeElement
      if (!current || current === document.body || !current.isConnected)
        next.el.focus({ preventScroll: true })
    }
  })

  // Conteúdo que aparece dentro de uma linha sem a lista renderizar de novo.
  useEffect(() => {
    const grid = gridRef.current
    if (!grid || typeof MutationObserver === 'undefined') return
    const observer = new MutationObserver(() => lockRowContent())
    observer.observe(grid, { childList: true, subtree: true })
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const state = typeahead.current
    return () => clearTimeout(state.timer)
  }, [])

  /* Seleção ------------------------------------------------------------------ */

  /** Ordena pela posição das linhas; ids sem linha (ex.: vindos de `selected`) ficam no fim. */
  const inRowOrder = (values: Iterable<string>, rows: RowNode[]) => {
    const set = new Set(values)
    const ordered = rows.filter((row) => set.has(row.key)).map((row) => row.key)
    const known = new Set(ordered)
    return [...ordered, ...[...set].filter((v) => !known.has(v))]
  }

  const commit = (next: string[]) => {
    if (!sameValues(next, selected)) setSelected(next)
  }

  const announceCount = (count: number) => {
    const text =
      count === 0
        ? t('listViewSelectedNone')
        : count === 1
          ? t('listViewSelectedCountOne')
          : t('listViewSelectedCount', { count })
    // Mensagem repetida: um espaço invisível força o leitor de tela a reanunciar.
    setAnnouncement((prev) => (prev === text ? `${text}\u00a0` : text))
  }

  const toggle = (key: string) => {
    if (selectionMode === 'none') return
    const rows = getRows()
    if (rows.find((row) => row.key === key)?.disabled) return
    anchorRef.current = key
    rangeRef.current = null
    // Única: selecionar outra linha substitui; a já selecionada continua selecionada.
    if (selectionMode === 'single') commit([key])
    else
      commit(
        selectedSet.has(key)
          ? selected.filter((v) => v !== key)
          : inRowOrder([...selected, key], rows),
      )
  }

  /**
   * Estende a seleção até `target` a partir da âncora: a seleção de quando a
   * extensão começou + as linhas habilitadas entre a âncora e o alvo. Voltar
   * em direção à âncora encolhe a faixa.
   */
  const extendTo = (rows: RowNode[], target: number) => {
    let range = rangeRef.current
    if (!range || !rows.some((row) => row.key === range!.anchor)) {
      const anchor = activeKey ?? rows[target].key
      range = { anchor, base: selected }
      rangeRef.current = range
      anchorRef.current = anchor
    }
    let start = rows.findIndex((row) => row.key === range!.anchor)
    if (start < 0) start = target
    const [lo, hi] = start <= target ? [start, target] : [target, start]
    const between = rows
      .slice(lo, hi + 1)
      .filter((row) => !row.disabled)
      .map((row) => row.key)
    commit(inRowOrder([...range.base, ...between], rows))
  }

  const toggleAll = (rows: RowNode[]) => {
    const enabled = rows.filter((row) => !row.disabled).map((row) => row.key)
    const allSelected = enabled.length > 0 && enabled.every((key) => selectedSet.has(key))
    const next = allSelected
      ? selected.filter((key) => !enabled.includes(key))
      : inRowOrder([...selected, ...enabled], rows)
    rangeRef.current = null
    commit(next)
    announceCount(next.length)
  }

  /** Enter e clique no fundo da linha: `onAction` ou, sem ela, a seleção. Linhas desabilitadas não reagem. */
  const activate = (row: RowNode) => {
    if (row.disabled) return
    if (onAction) onAction(row.key)
    else toggle(row.key)
  }

  /* Foco --------------------------------------------------------------------- */

  const focusRow = (row: RowNode) => {
    setActiveKey(row.key)
    row.el.focus({ preventScroll: true })
    row.el.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
  }

  /**
   * PageUp/PageDown: a última linha que ainda cabe a uma "página" (altura da
   * lista, se ela rola, ou da janela) de distância da atual.
   */
  const page = (rows: RowNode[], index: number, dir: 1 | -1) => {
    const grid = gridRef.current!
    const scrolls =
      grid.scrollHeight > grid.clientHeight + 1 &&
      /auto|scroll/.test(getComputedStyle(grid).overflowY)
    const height = scrolls ? grid.clientHeight : window.innerHeight
    const origin = rows[index].el.getBoundingClientRect().top
    let target = index
    for (let i = index + dir; i >= 0 && i < rows.length; i += dir) {
      if (height > 0 && Math.abs(rows[i].el.getBoundingClientRect().top - origin) > height) break
      target = i
    }
    return target
  }

  const runTypeahead = (char: string, rows: RowNode[], index: number) => {
    const state = typeahead.current
    clearTimeout(state.timer)
    state.buffer += normalizeText(char)
    state.timer = setTimeout(() => {
      state.buffer = ''
    }, TYPEAHEAD_TIMEOUT)
    const query = state.buffer
    // A mesma letra repetida percorre as linhas que começam com ela.
    const cycling = query.length > 1 && Array.from(query).every((c) => c === query[0])
    const search = cycling ? query[0] : query
    // Uma letra começa na próxima linha; várias letras refinam a partir da atual.
    const begin = search.length === 1 ? index + 1 : Math.max(index, 0)
    for (let i = 0; i < rows.length; i++) {
      const row = rows[(begin + i) % rows.length]
      if (normalizeText(rowText(row.el)).startsWith(search)) {
        rangeRef.current = null
        focusRow(row)
        return
      }
    }
  }

  const resetTypeahead = () => {
    clearTimeout(typeahead.current.timer)
    typeahead.current.buffer = ''
  }

  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    onFocus?.(event)
    // Inclui menus abertos a partir das ações (portais): o foco continua "na lista".
    focusInsideRef.current = true
    const grid = gridRef.current
    const target = event.target as HTMLElement
    if (!grid || !grid.contains(target)) return
    const row = target.closest<HTMLElement>(ROW)
    if (row && row.closest('[role="grid"]') === grid) setActiveKey(row.dataset.key ?? null)
  }

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    onBlur?.(event)
    const next = event.relatedTarget as Node | null
    const grid = gridRef.current
    if (next ? !grid?.contains(next) : (event.target as Node).isConnected) {
      // Saiu da lista (ou foi para um portal: o onFocus de lá reativa a marca).
      // Sem relatedTarget e com o alvo desconectado, a linha foi removida: mantém a marca.
      focusInsideRef.current = false
      rangeRef.current = null
      resetTypeahead()
    }
  }

  /* Teclado ------------------------------------------------------------------ */

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    const grid = gridRef.current
    const target = event.target as HTMLElement
    // Eventos de portais (menus das ações) sobem pela árvore do React: ignore-os.
    if (event.defaultPrevented || !grid || !grid.contains(target)) return
    const rowEl = target.closest<HTMLElement>(ROW)
    if (!rowEl || rowEl.closest('[role="grid"]') !== grid) return
    const rows = getRows()
    const index = rows.findIndex((row) => row.el === rowEl)
    if (index < 0) return
    const row = rows[index]
    const onRow = target === rowEl
    const mod = event.ctrlKey || event.metaKey
    const { key, shiftKey: shift, altKey: alt } = event

    if (key === 'Tab') {
      // Shift+Tab numa ação: o foco passa pela linha para que o navegador saia da lista.
      if (!onRow && shift) rowEl.focus({ preventScroll: true })
      return
    }
    // Campos de texto e selects dentro da linha usam as próprias teclas.
    if (!onRow && target.matches(OWNS_KEYS)) return

    // A navegação passa por todas as linhas, inclusive as desabilitadas (Listbox/TreeView).
    if ((key === 'ArrowDown' || key === 'ArrowUp') && !alt) {
      const next = index + (key === 'ArrowDown' ? 1 : -1)
      if (next >= 0 && next < rows.length) {
        if (multiple && shift) extendTo(rows, next)
        else rangeRef.current = null
        focusRow(rows[next])
      }
    } else if ((key === 'Home' || key === 'End') && !alt) {
      const next = key === 'Home' ? 0 : rows.length - 1
      if (multiple && shift && mod) extendTo(rows, next)
      else rangeRef.current = null
      focusRow(rows[next])
    } else if ((key === 'PageDown' || key === 'PageUp') && !alt) {
      rangeRef.current = null
      focusRow(rows[page(rows, index, key === 'PageDown' ? 1 : -1)])
    } else if ((key === 'ArrowRight' || key === 'ArrowLeft') && !alt && !mod) {
      // → / ←: percorrem linha → caixa de seleção/ações → linha (como no GridList do React Aria).
      const items = rowFocusables(rowEl)
      if (items.length === 0) return
      const rtl = getComputedStyle(grid).direction === 'rtl'
      const forward = (key === 'ArrowRight') !== rtl
      const pos = onRow ? -1 : items.findIndex((el) => el === target || el.contains(target))
      let next: HTMLElement
      if (forward) next = pos === -1 ? items[0] : pos === items.length - 1 ? rowEl : items[pos + 1]
      else next = pos === -1 ? items[items.length - 1] : pos === 0 ? rowEl : items[pos - 1]
      next.focus({ preventScroll: true })
    } else if (!onRow) {
      // Espaço, Enter e letras numa ação ficam com a própria ação.
      return
    } else if (key === ' ' && typeahead.current.buffer && !mod && !alt) {
      // Espaço no meio da digitação faz parte da busca ("pão de queijo").
      runTypeahead(' ', rows, index)
    } else if (key === ' ' && !mod && !alt) {
      if (selectionMode !== 'none') toggle(row.key)
      else if (!row.disabled) onAction?.(row.key)
    } else if (key === 'Enter' && !mod && !alt) {
      activate(row)
    } else if (multiple && mod && !shift && !alt && key.toLowerCase() === 'a') {
      toggleAll(rows)
    } else if (key.length === 1 && !mod && !alt) {
      runTypeahead(key, rows, index)
    } else {
      return
    }
    event.preventDefault()
  }

  /* Ponteiro ----------------------------------------------------------------- */

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    onClick?.(event)
    const grid = gridRef.current
    const target = event.target as HTMLElement
    if (event.defaultPrevented || !grid || !grid.contains(target)) return
    const rowEl = target.closest<HTMLElement>(ROW)
    if (!rowEl || rowEl.closest('[role="grid"]') !== grid) return
    // Cliques na caixa de seleção e nas ações ficam com eles.
    const interactive = target.closest(INTERACTIVE)
    if (interactive && interactive !== rowEl && rowEl.contains(interactive)) return
    // Linha desabilitada: recebe o foco, mas não seleciona nem dispara a ação.
    if (!rowEl.contains(document.activeElement)) rowEl.focus({ preventScroll: true })
    activate({
      key: rowEl.dataset.key ?? '',
      disabled: rowEl.getAttribute('aria-disabled') === 'true',
      el: rowEl,
    })
  }

  /* Renderização --------------------------------------------------------------- */

  const context: ListViewContextValue = {
    selectionMode,
    selected: selectedSet,
    activeKey,
    // Na seleção única com onAction, o clique na linha é a ação: o botão de opção dá acesso à seleção pelo mouse.
    showCheckbox: multiple || (selectionMode === 'single' && !!onAction),
    radioName: `${baseId}-selection`,
    toggle,
  }

  return (
    <ListViewContext.Provider value={context}>
      {/* A grade não recebe foco: as linhas sim (roving tabindex, padrão APG). */}
      {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
      <div
        {...rest}
        ref={composedRef}
        role="grid"
        aria-multiselectable={multiple || undefined}
        className={cx(
          'or-list-view',
          `or-list-view--${size}`,
          (onAction || selectionMode !== 'none') && 'or-list-view--actionable',
          className,
        )}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={handleClick}
      >
        {isEmpty ? (
          <div role="row" className="or-list-view__empty-row">
            <div role="gridcell" className="or-list-view__empty">
              {emptyState ?? t('noResults')}
            </div>
          </div>
        ) : (
          children
        )}
      </div>
      {multiple && (
        <VisuallyHidden role="status" aria-live="polite" aria-atomic="true">
          {announcement}
        </VisuallyHidden>
      )}
    </ListViewContext.Provider>
  )
})

/* -------------------------------------------------------------------------- */
/* ListViewItem                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Uma linha do `ListView` (`role="row"` com uma `gridcell`). Slots: `icon` à
 * esquerda, `children` (título) e `description` no meio, `actions` à direita.
 */
export const ListViewItem = forwardRef<HTMLDivElement, ListViewItemProps>(function ListViewItem(
  {
    id: key,
    children,
    description,
    icon,
    actions,
    textValue,
    disabled = false,
    className,
    ...rest
  },
  ref,
) {
  const context = useContext(ListViewContext)
  if (!context) throw new Error('[Orange] ListViewItem precisa estar dentro de <ListView>.')
  const { t } = useLocale()
  const domId = useId('or-list-view-item')
  const labelId = `${domId}-label`
  const descriptionId = `${domId}-description`
  const checkId = `${domId}-check`
  const hasLabel = hasContent(children)
  const hasDescription = hasContent(description)
  const isSelected = context.selected.has(key)
  // Um nome explícito (aria-label/aria-labelledby nas props) substitui o do título.
  const customName = rest['aria-label'] !== undefined || rest['aria-labelledby'] !== undefined
  const describedBy = [rest['aria-describedby'], hasDescription && descriptionId]
    .filter(Boolean)
    .join(' ')
  const single = context.selectionMode === 'single'

  devWarning(
    !hasLabel && !textValue,
    `ListViewItem "${key}" precisa de conteúdo (children) ou de \`textValue\`.`,
  )

  return (
    <div
      {...rest}
      ref={ref}
      id={domId}
      role="row"
      data-key={key}
      data-text-value={textValue}
      aria-selected={context.selectionMode !== 'none' ? isSelected : undefined}
      aria-disabled={disabled || undefined}
      // Nome só do título (sem descrição nem ações); a descrição vai em aria-describedby.
      aria-labelledby={customName ? rest['aria-labelledby'] : hasLabel ? labelId : undefined}
      aria-label={customName ? rest['aria-label'] : hasLabel ? undefined : textValue}
      aria-describedby={describedBy || undefined}
      // Linhas desabilitadas continuam focáveis (como no Listbox e no TreeView).
      tabIndex={key === context.activeKey ? 0 : -1}
      className={cx('or-list-view__item', className)}
    >
      <div role="gridcell" className="or-list-view__cell">
        {context.showCheckbox && (
          // Seleção única: botão de opção (não desmarca); múltipla: caixa de seleção.
          <span className={cx('or-list-view__check', single && 'or-list-view__check--radio')}>
            <input
              id={checkId}
              type={single ? 'radio' : 'checkbox'}
              name={single ? context.radioName : undefined}
              className="or-list-view__check-input"
              tabIndex={-1}
              checked={isSelected}
              disabled={disabled}
              onChange={() => context.toggle(key)}
              {...(hasLabel
                ? { 'aria-label': t('listViewSelect'), 'aria-labelledby': `${checkId} ${labelId}` }
                : { 'aria-label': `${t('listViewSelect')} ${textValue ?? ''}`.trim() })}
            />
            <span className="or-list-view__check-box" aria-hidden="true">
              {isSelected && !single && <Icon name="check" size={12} strokeWidth={2.5} />}
            </span>
          </span>
        )}
        {hasContent(icon) && (
          <span className="or-list-view__icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <div className="or-list-view__content">
          {hasLabel && (
            <div id={labelId} className="or-list-view__label">
              {children}
            </div>
          )}
          {hasDescription && (
            <div id={descriptionId} className="or-list-view__description">
              {description}
            </div>
          )}
        </div>
        {hasContent(actions) && <div className="or-list-view__actions">{actions}</div>}
      </div>
    </div>
  )
})
