import {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { useControllableState, useId } from '../../hooks'
import { Icon } from '../../icons'
import { cx, devWarning, mergeRefs } from '../../utils'
import './TreeView.css'

export interface TreeViewItem {
  /** Identificador único em toda a árvore. */
  id: string
  /** Rótulo exibido. */
  label: ReactNode
  /** Texto usado na busca por digitação quando `label` não é uma string. */
  textValue?: string
  /** Ícone do item. Sem ele, pastas e arquivos usam ícones padrão (veja `defaultIcons`). */
  icon?: ReactNode
  /** Itens filhos. Um item com `children` (mesmo vazio) é tratado como pasta. */
  children?: TreeViewItem[]
  /** Item focável, mas que não pode ser selecionado nem expandido. */
  disabled?: boolean
}

export type TreeViewSelectionMode = 'single' | 'multiple' | 'none'

export interface TreeViewProps
  extends Omit<HTMLAttributes<HTMLUListElement>, 'onSelect' | 'defaultValue' | 'onChange' | 'children'> {
  /** Itens da árvore, aninhados via `children`. */
  items: TreeViewItem[]
  /** Ids dos itens expandidos (controlado). */
  expanded?: string[]
  /** Ids expandidos inicialmente (não controlado). */
  defaultExpanded?: string[]
  /** Chamado quando itens são expandidos ou recolhidos. */
  onExpandedChange?: (expanded: string[]) => void
  /** `single` (padrão), `multiple` ou `none` (só navegação). */
  selectionMode?: TreeViewSelectionMode
  /** Ids selecionados (controlado). */
  selected?: string[]
  /** Ids selecionados inicialmente (não controlado). */
  defaultSelected?: string[]
  /** Chamado quando a seleção muda. */
  onSelectedChange?: (selected: string[]) => void
  /** Ação padrão do item, disparada por Enter ou clique (ex.: abrir o arquivo). */
  onAction?: (item: TreeViewItem) => void
  /** Clicar na linha de uma pasta também a expande/recolhe. Padrão: `true`. */
  expandOnClick?: boolean
  /** Usa ícones de pasta/arquivo quando o item não define `icon`. Padrão: `true`. */
  defaultIcons?: boolean
  /** Altura das linhas: `sm` (28px) ou `md` (32px, padrão). */
  size?: 'sm' | 'md'
}

interface NodeInfo {
  item: TreeViewItem
  level: number
  parentId: string | null
  /** Ids dos irmãos (incluindo o próprio). */
  siblings: string[]
  domId: string
}

const isParent = (item: TreeViewItem) => Array.isArray(item.children)

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLocaleLowerCase()

/**
 * Árvore hierárquica navegável por teclado (padrão "tree view" do WAI-ARIA):
 * explorador de arquivos, categorias, estrutura de páginas.
 */
export const TreeView = forwardRef<HTMLUListElement, TreeViewProps>(function TreeView(
  {
    items,
    expanded: expandedProp,
    defaultExpanded = [],
    onExpandedChange,
    selectionMode = 'single',
    selected: selectedProp,
    defaultSelected = [],
    onSelectedChange,
    onAction,
    expandOnClick = true,
    defaultIcons = true,
    size = 'md',
    className,
    onKeyDown,
    onFocus,
    ...rest
  },
  ref,
) {
  devWarning(
    !rest['aria-label'] && !rest['aria-labelledby'],
    'TreeView precisa de `aria-label` ou `aria-labelledby`.',
  )
  const baseId = useId('or-tree')
  const treeRef = useRef<HTMLUListElement>(null)
  const composedRef = useMemo(() => mergeRefs(ref, treeRef), [ref])
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const typeahead = useRef({ buffer: '', timer: undefined as ReturnType<typeof setTimeout> | undefined })

  const [expanded, setExpanded] = useControllableState<string[]>({
    value: expandedProp,
    defaultValue: defaultExpanded,
    onChange: onExpandedChange,
  })
  const [selected, setSelected] = useControllableState<string[]>({
    value: selectedProp,
    defaultValue: defaultSelected,
    onChange: onSelectedChange,
  })
  const expandedSet = useMemo(() => new Set(expanded), [expanded])
  const selectedSet = useMemo(() => new Set(selected), [selected])

  // Índice de todos os nós (pais, irmãos, nível) — independe da expansão.
  const nodes = useMemo(() => {
    const map = new Map<string, NodeInfo>()
    let counter = 0
    const walk = (list: TreeViewItem[], level: number, parentId: string | null) => {
      const siblings = list.map((i) => i.id)
      for (const item of list) {
        devWarning(map.has(item.id), `TreeView: id duplicado "${item.id}".`)
        map.set(item.id, { item, level, parentId, siblings, domId: `${baseId}-${counter++}` })
        if (item.children) walk(item.children, level + 1, item.id)
      }
    }
    walk(items, 1, null)
    return map
  }, [items, baseId])

  // Itens visíveis na ordem em que aparecem (pais expandidos revelam filhos).
  const visible = useMemo(() => {
    const out: string[] = []
    const walk = (list: TreeViewItem[]) => {
      for (const item of list) {
        out.push(item.id)
        if (item.children && expandedSet.has(item.id)) walk(item.children)
      }
    }
    walk(items)
    return out
  }, [items, expandedSet])

  const visibleSet = useMemo(() => new Set(visible), [visible])
  const tabbableId =
    focusedId && visibleSet.has(focusedId)
      ? focusedId
      : (selected.find((id) => visibleSet.has(id)) ?? visible[0] ?? null)

  /* Ações ------------------------------------------------------------------ */

  const focusItem = useCallback(
    (id: string | undefined) => {
      if (!id) return
      const info = nodes.get(id)
      const el = info ? document.getElementById(info.domId) : null
      if (!el) return
      setFocusedId(id)
      el.focus({ preventScroll: true })
      el.scrollIntoView({ block: 'nearest' })
    },
    [nodes],
  )

  const setItemExpanded = useCallback(
    (id: string, open: boolean) => {
      const info = nodes.get(id)
      if (!info || !isParent(info.item) || info.item.disabled) return
      setExpanded((prev) => {
        const has = prev.includes(id)
        if (open === has) return prev
        return open ? [...prev, id] : prev.filter((x) => x !== id)
      })
    },
    [nodes, setExpanded],
  )

  const selectItem = useCallback(
    (id: string, mode: 'replace' | 'toggle' | 'add' = 'replace') => {
      const info = nodes.get(id)
      if (!info || info.item.disabled || selectionMode === 'none') return
      if (selectionMode === 'single') {
        setSelected((prev) => (prev.length === 1 && prev[0] === id ? prev : [id]))
        return
      }
      setSelected((prev) => {
        const has = prev.includes(id)
        if (mode === 'add') return has ? prev : [...prev, id]
        if (mode === 'toggle') return has ? prev.filter((x) => x !== id) : [...prev, id]
        return [id]
      })
    },
    [nodes, selectionMode, setSelected],
  )

  const activate = useCallback(
    (id: string) => {
      const info = nodes.get(id)
      if (!info || info.item.disabled) return
      if (selectionMode === 'none') {
        if (isParent(info.item) && !onAction) setItemExpanded(id, !expandedSet.has(id))
      } else {
        selectItem(id, selectionMode === 'multiple' ? 'toggle' : 'replace')
      }
      onAction?.(info.item)
    },
    [nodes, selectionMode, onAction, setItemExpanded, expandedSet, selectItem],
  )

  const runTypeahead = (char: string, currentId: string) => {
    const state = typeahead.current
    clearTimeout(state.timer)
    state.buffer += normalize(char)
    state.timer = setTimeout(() => {
      state.buffer = ''
    }, 500)
    const query = state.buffer
    // Mesma letra repetida: percorre os itens que começam com ela.
    const cycling = query.length > 1 && query.split('').every((c) => c === query[0])
    const search = cycling ? query[0] : query
    const start = visible.indexOf(currentId)
    const offset = search.length === 1 ? 1 : 0
    for (let i = 0; i < visible.length; i++) {
      const id = visible[(start + offset + i) % visible.length]
      const item = nodes.get(id)!.item
      const text = item.textValue ?? (typeof item.label === 'string' ? item.label : '')
      if (normalize(text).startsWith(search)) {
        focusItem(id)
        return
      }
    }
  }

  /* Teclado ---------------------------------------------------------------- */

  const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    const target = (event.target as HTMLElement).closest<HTMLElement>('[role="treeitem"]')
    const currentId = target?.dataset.treeId
    if (!currentId || !nodes.has(currentId)) return
    const info = nodes.get(currentId)!
    const index = visible.indexOf(currentId)
    const multi = selectionMode === 'multiple'
    const open = expandedSet.has(currentId)

    switch (event.key) {
      case 'ArrowDown': {
        const next = visible[index + 1]
        if (next) {
          focusItem(next)
          if (multi && event.shiftKey) selectItem(next, 'add')
        }
        break
      }
      case 'ArrowUp': {
        const prev = visible[index - 1]
        if (prev) {
          focusItem(prev)
          if (multi && event.shiftKey) selectItem(prev, 'add')
        }
        break
      }
      case 'ArrowRight':
        if (isParent(info.item) && !info.item.disabled) {
          if (!open) setItemExpanded(currentId, true)
          else if (info.item.children?.length) focusItem(info.item.children[0].id)
        }
        break
      case 'ArrowLeft':
        if (isParent(info.item) && open && !info.item.disabled) setItemExpanded(currentId, false)
        else if (info.parentId) focusItem(info.parentId)
        break
      case 'Home':
        focusItem(visible[0])
        break
      case 'End':
        focusItem(visible[visible.length - 1])
        break
      case 'Enter':
        activate(currentId)
        break
      case ' ':
        if (selectionMode === 'none') activate(currentId)
        else selectItem(currentId, multi ? 'toggle' : 'replace')
        break
      case '*': {
        const toOpen = info.siblings.filter((id) => {
          const sibling = nodes.get(id)!.item
          return isParent(sibling) && !sibling.disabled && !expandedSet.has(id)
        })
        if (toOpen.length) setExpanded((prev) => [...prev, ...toOpen])
        break
      }
      default:
        if (multi && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a') {
          const all = Array.from(nodes.values())
            .filter((n) => !n.item.disabled)
            .map((n) => n.item.id)
          setSelected(all.every((id) => selectedSet.has(id)) ? [] : all)
          break
        }
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey && event.key.trim()) {
          runTypeahead(event.key, currentId)
          break
        }
        return
    }
    event.preventDefault()
  }

  /* Mouse ------------------------------------------------------------------ */

  const handleRowClick = (event: MouseEvent, item: TreeViewItem) => {
    const fromToggle = (event.target as HTMLElement).closest('.or-tree__toggle')
    focusItem(item.id)
    if (item.disabled) return
    if (fromToggle) {
      setItemExpanded(item.id, !expandedSet.has(item.id))
      return
    }
    if (isParent(item) && expandOnClick) setItemExpanded(item.id, !expandedSet.has(item.id))
    if (selectionMode !== 'none') selectItem(item.id, selectionMode === 'multiple' ? 'toggle' : 'replace')
    onAction?.(item)
  }

  /* Renderização ----------------------------------------------------------- */

  const renderIcon = (item: TreeViewItem, open: boolean) => {
    if (item.icon !== undefined) return item.icon
    if (!defaultIcons) return null
    return <Icon name={isParent(item) ? (open ? 'folder-open' : 'folder') : 'file'} size="sm" />
  }

  /*
   * Estrutura do exemplo "Navigation Treeview" do APG: o <li> é apresentacional,
   * a linha é o `treeitem` e o grupo de filhos (irmão da linha) é associado por
   * `aria-owns`. O nome vem de `aria-labelledby` (só o rótulo, sem os filhos).
   */
  const renderItems = (list: TreeViewItem[], level: number): ReactNode =>
    list.map((item, index) => {
      const info = nodes.get(item.id)!
      const parent = isParent(item)
      const open = parent && expandedSet.has(item.id)
      const isSelected = selectedSet.has(item.id)
      const icon = renderIcon(item, open)
      const groupId = `${info.domId}-group`
      const labelId = `${info.domId}-label`
      const showGroup = open && item.children !== undefined && item.children.length > 0
      return (
        <li key={item.id} role="none" className="or-tree__node">
          {/* O teclado é tratado no onKeyDown da árvore (roving tabindex). */}
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
          <div
            id={info.domId}
            role="treeitem"
            className={cx('or-tree__item', item.disabled && 'or-tree__item--disabled')}
            style={{ '--_level': level } as CSSProperties}
            aria-level={level}
            aria-setsize={list.length}
            aria-posinset={index + 1}
            aria-expanded={parent ? open : undefined}
            aria-owns={showGroup ? groupId : undefined}
            aria-selected={
              selectionMode === 'multiple' ? isSelected : selectionMode === 'single' && isSelected ? true : undefined
            }
            aria-disabled={item.disabled || undefined}
            // nome só da própria linha (o conteúdo de aria-owns entraria no cálculo)
            aria-labelledby={labelId}
            tabIndex={item.id === tabbableId ? 0 : -1}
            data-tree-id={item.id}
            onClick={(event) => handleRowClick(event, item)}
          >
            <span className="or-tree__toggle" aria-hidden="true">
              {parent && <Icon name="chevron-right" size="sm" />}
            </span>
            {selectionMode === 'multiple' && (
              <span className="or-tree__checkbox" aria-hidden="true">
                {isSelected && <Icon name="check" size={12} strokeWidth={2.5} />}
              </span>
            )}
            {icon && (
              <span className="or-tree__icon" aria-hidden="true">
                {icon}
              </span>
            )}
            <span className="or-tree__label" id={labelId}>
              {item.label}
            </span>
          </div>
          {showGroup && (
            <ul id={groupId} role="group" className="or-tree__group">
              {renderItems(item.children!, level + 1)}
            </ul>
          )}
        </li>
      )
    })

  return (
    <ul
      ref={composedRef}
      role="tree"
      aria-multiselectable={selectionMode === 'multiple' || undefined}
      className={cx('or-tree', `or-tree--${size}`, `or-tree--select-${selectionMode}`, className)}
      onKeyDown={handleKeyDown}
      onFocus={(event) => {
        onFocus?.(event)
        const id = (event.target as HTMLElement).closest<HTMLElement>('[role="treeitem"]')?.dataset.treeId
        if (id) setFocusedId(id)
      }}
      {...rest}
    >
      {renderItems(items, 1)}
    </ul>
  )
})
