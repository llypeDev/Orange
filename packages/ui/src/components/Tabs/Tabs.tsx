import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { useId, useIsomorphicLayoutEffect } from '../../hooks'
import { composeEventHandlers, cx, devWarning, mergeRefs } from '../../utils'
import { useSlidingIndicator } from './useSlidingIndicator'
import './Tabs.css'

export type TabsVariant = 'line' | 'enclosed'
export type TabsOrientation = 'horizontal' | 'vertical'
export type TabsActivation = 'automatic' | 'manual'
export type TabsSize = 'sm' | 'md' | 'lg'

interface TabsContextValue {
  value: string | undefined
  select: (value: string) => void
  initialize: (value: string) => void
  baseId: string
  /** Valores com `TabPanel` montado: só eles recebem `aria-controls`. */
  panels: ReadonlySet<string>
  registerPanel: (value: string) => () => void
  orientation: TabsOrientation
  activation: TabsActivation
  variant: TabsVariant
  /** Liga a entrada animada dos painéis depois da primeira troca de aba (não anima ao montar). */
  animatePanels: boolean
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext(component: string): TabsContextValue {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error(`<${component}> precisa estar dentro de <Tabs>.`)
  return ctx
}

const toIdPart = (value: string) => value.replace(/[^\w-]/g, '_')

/**
 * Rola só a lista (nunca a página) até a aba ficar inteira na área visível. O
 * `focus()` do Chromium não rola uma aba que já está parcialmente visível, e a
 * aba focada/selecionada ficava cortada na borda da lista.
 */
function revealTab(list: HTMLElement, tab: HTMLElement) {
  const box = list.getBoundingClientRect()
  const rect = tab.getBoundingClientRect()
  if (rect.left < box.left) list.scrollLeft -= box.left - rect.left
  else if (rect.right > box.right) list.scrollLeft += rect.right - box.right
  if (rect.top < box.top) list.scrollTop -= box.top - rect.top
  else if (rect.bottom > box.bottom) list.scrollTop += rect.bottom - box.bottom
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Aba selecionada (controlado). */
  value?: string
  /** Aba selecionada inicialmente (não controlado). Padrão: a primeira aba habilitada. */
  defaultValue?: string
  /** Chamado quando outra aba é selecionada. */
  onChange?: (value: string) => void
  /**
   * `automatic` (padrão) seleciona a aba ao receber foco pelas setas;
   * `manual` só seleciona com Enter/Espaço — use quando trocar de painel é lento.
   */
  activation?: TabsActivation
  /** Orientação da lista de abas. `vertical` usa ↑/↓; `horizontal` usa ←/→. */
  orientation?: TabsOrientation
  /** `line`: sublinhado laranja de 2px. `enclosed`: abas com borda, unidas ao painel. */
  variant?: TabsVariant
  /** Altura das abas: `sm` 32px, `md` 40px, `lg` 48px. */
  size?: TabsSize
  /** As abas dividem igualmente a largura disponível. */
  fitted?: boolean
  children?: ReactNode
}

/**
 * Abas organizam conteúdo relacionado em painéis, mostrando um por vez.
 * Implementa o padrão Tabs do WAI-ARIA com `TabList`, `Tab` e `TabPanel`.
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    value: valueProp,
    defaultValue,
    onChange,
    activation = 'automatic',
    orientation = 'horizontal',
    variant = 'line',
    size = 'md',
    fitted = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  const baseId = useId('or-tabs', rest.id)
  const [internal, setInternal] = useState<string | undefined>(defaultValue)
  const isControlled = valueProp !== undefined
  const value = isControlled ? valueProp : internal
  const valueRef = useRef(value)
  valueRef.current = value
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const select = useCallback(
    (next: string) => {
      if (next === valueRef.current) return
      if (!isControlled) setInternal(next)
      valueRef.current = next
      onChangeRef.current?.(next)
    },
    [isControlled],
  )

  // Sem valor inicial: seleciona a primeira aba habilitada sem disparar onChange.
  const initialize = useCallback(
    (next: string) => {
      if (!isControlled && valueRef.current === undefined) setInternal(next)
    },
    [isControlled],
  )

  const [panels, setPanels] = useState<ReadonlySet<string>>(() => new Set())
  const registerPanel = useCallback((panelValue: string) => {
    setPanels((prev) => (prev.has(panelValue) ? prev : new Set(prev).add(panelValue)))
    return () =>
      setPanels((prev) => {
        if (!prev.has(panelValue)) return prev
        const next = new Set(prev)
        next.delete(panelValue)
        return next
      })
  }, [])

  // Painéis só entram animados depois que a aba muda pela primeira vez.
  const [prevValue, setPrevValue] = useState(value)
  const [animatePanels, setAnimatePanels] = useState(false)
  if (value !== prevValue) {
    setPrevValue(value)
    if (prevValue !== undefined) setAnimatePanels(true)
  }

  const ctx = useMemo<TabsContextValue>(
    () => ({ value, select, initialize, baseId, panels, registerPanel, orientation, activation, variant, animatePanels }),
    [value, select, initialize, baseId, panels, registerPanel, orientation, activation, variant, animatePanels],
  )

  return (
    <TabsContext.Provider value={ctx}>
      <div
        ref={ref}
        className={cx(
          'or-tabs',
          `or-tabs--${variant}`,
          `or-tabs--${orientation}`,
          `or-tabs--${size}`,
          fitted && 'or-tabs--fitted',
          className,
        )}
        data-orientation={orientation}
        {...rest}
      >
        {children}
      </div>
    </TabsContext.Provider>
  )
})

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

/** Contêiner das abas (`role="tablist"`). Dê um nome com `aria-label` ou `aria-labelledby`. */
export const TabList = forwardRef<HTMLDivElement, TabListProps>(function TabList(
  { className, children, onKeyDown, ...rest },
  ref,
) {
  const { orientation, activation, select, initialize, value, variant } = useTabsContext('TabList')
  const listRef = useRef<HTMLDivElement>(null)
  const indicator = useSlidingIndicator(
    listRef,
    '[role="tab"][aria-selected="true"]',
    orientation === 'vertical' ? 'y' : 'x',
    `${value}|${orientation}|${variant}`,
  )

  devWarning(
    !rest['aria-label'] && !rest['aria-labelledby'],
    'TabList precisa de `aria-label` ou `aria-labelledby` descrevendo o conjunto de abas.',
  )

  const getTabs = useCallback(() => {
    const list = listRef.current
    if (!list) return []
    return Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]')).filter(
      (tab) => tab.closest('[role="tablist"]') === list,
    )
  }, [])

  useIsomorphicLayoutEffect(() => {
    if (value !== undefined) return
    const first = getTabs().find((tab) => !tab.disabled)
    if (first?.dataset.value) initialize(first.dataset.value)
  })

  // A aba selecionada (por teclado, clique, valor inicial ou controlado) fica visível na lista.
  useIsomorphicLayoutEffect(() => {
    const list = listRef.current
    const selected = getTabs().find((tab) => tab.dataset.value === value)
    if (list && selected) revealTab(list, selected)
  }, [value, getTabs])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const tabs = getTabs().filter((tab) => !tab.disabled)
    const index = tabs.indexOf(document.activeElement as HTMLButtonElement)
    if (index === -1 || tabs.length === 0) return
    const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
    const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight'
    let next = -1
    if (event.key === nextKey) next = (index + 1) % tabs.length
    else if (event.key === prevKey) next = (index - 1 + tabs.length) % tabs.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = tabs.length - 1
    else return
    event.preventDefault()
    const tab = tabs[next]
    tab.focus()
    // Na ativação manual a aba focada ainda não está selecionada: revela aqui também.
    if (listRef.current) revealTab(listRef.current, tab)
    if (activation === 'automatic' && tab.dataset.value) select(tab.dataset.value)
  }

  return (
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus -- o foco fica nas abas (roving tabindex); o tablist só delega as setas
    <div
      ref={mergeRefs(ref, listRef)}
      role="tablist"
      aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
      className={cx('or-tabs__list', className)}
      data-indicator={variant === 'line' && indicator.ready ? 'ready' : undefined}
      onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
      {...rest}
    >
      {children}
      {variant === 'line' && (
        // Indicador único que desliza entre as abas (só transform).
        <span
          className="or-tabs__indicator"
          aria-hidden="true"
          data-visible={indicator.visible || undefined}
          data-ready={indicator.ready || undefined}
          style={indicator.style}
        />
      )}
    </div>
  )
})

export interface TabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  /** Identificador da aba; liga a aba ao `TabPanel` de mesmo `value`. */
  value: string
  /** Ícone antes do rótulo (decorativo). */
  icon?: ReactNode
  /** Contador ou selo após o rótulo (ex.: número de itens). */
  badge?: ReactNode
}

/** Uma aba. Fica fora da ordem de Tab quando não está selecionada (roving tabindex). */
export const Tab = forwardRef<HTMLButtonElement, TabProps>(function Tab(
  { value, icon, badge, disabled, className, children, onClick, ...rest },
  ref,
) {
  const ctx = useTabsContext('Tab')
  const selected = ctx.value === value
  const id = `${ctx.baseId}-tab-${toIdPart(value)}`
  const panelId = `${ctx.baseId}-panel-${toIdPart(value)}`

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      id={id}
      aria-selected={selected}
      aria-controls={ctx.panels.has(value) ? panelId : undefined}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      data-value={value}
      data-state={selected ? 'active' : 'inactive'}
      className={cx('or-tabs__tab', className)}
      onClick={composeEventHandlers(onClick, () => ctx.select(value))}
      {...rest}
    >
      {icon && (
        <span className="or-tabs__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="or-tabs__label">{children}</span>
      {badge !== undefined && badge !== null && <span className="or-tabs__badge">{badge}</span>}
    </button>
  )
})

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** O `value` da aba que controla este painel. */
  value: string
  /** Mantém o conteúdo montado (apenas escondido) quando o painel está inativo. */
  keepMounted?: boolean
  children?: ReactNode
}

/** Painel de conteúdo de uma aba (`role="tabpanel"`). */
export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(function TabPanel(
  { value, keepMounted = false, className, children, ...rest },
  ref,
) {
  const ctx = useTabsContext('TabPanel')
  const selected = ctx.value === value
  const { registerPanel } = ctx
  useEffect(() => registerPanel(value), [registerPanel, value])
  return (
    <div
      ref={ref}
      role="tabpanel"
      id={`${ctx.baseId}-panel-${toIdPart(value)}`}
      aria-labelledby={`${ctx.baseId}-tab-${toIdPart(value)}`}
      tabIndex={0}
      hidden={!selected}
      data-state={selected ? 'active' : 'inactive'}
      data-motion={ctx.animatePanels || undefined}
      className={cx('or-tabs__panel', className)}
      {...rest}
    >
      {selected || keepMounted ? children : null}
    </div>
  )
})
