import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react'
import { useIsomorphicLayoutEffect, useRovingFocus } from '../../hooks'
import { cx, devWarning, mergeRefs } from '../../utils'
import type { ButtonSize } from '../Button'
import { ButtonGroup, type ButtonGroupProps } from '../ButtonGroup/ButtonGroup'
import {
  ActionGroupContext,
  applyGroupDefaults,
  useActionGroup,
  type ActionGroupContextValue,
} from '../ButtonGroup/context'
import './Toolbar.css'

export type ToolbarOrientation = 'horizontal' | 'vertical'

const ITEM_SELECTOR = '[data-roving-item]'
const ENABLED_ITEM_SELECTOR = '[data-roving-item]:not([disabled])'

/** Campos de texto usam as setas para mover o cursor: a Toolbar não interfere. */
function capturesArrowKeys(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  if (
    target.isContentEditable ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  )
    return true
  if (target instanceof HTMLInputElement) {
    return !['button', 'checkbox', 'reset', 'submit', 'image', 'color', 'file'].includes(
      target.type,
    )
  }
  return false
}

export interface ToolbarProps extends HTMLAttributes<HTMLDivElement> {
  /** Direção da barra. Define quais setas movem o foco (←/→ ou ↑/↓). */
  orientation?: ToolbarOrientation
  /** Tamanho repassado aos botões da barra. */
  size?: ButtonSize
  /** Volta ao primeiro item depois do último (e vice-versa). */
  loop?: boolean
  /** Desenha a moldura (borda e fundo) da barra. */
  bordered?: boolean
}

/**
 * Barra de ferramentas (`role="toolbar"`) com roving tabindex: a barra inteira
 * ocupa uma única parada de Tab e as setas movem o foco entre os itens.
 * Itens são os elementos com `data-roving-item` — IconButton, ToggleButton,
 * CopyButton, SplitButton e os `Button` filhos diretos são marcados
 * automaticamente.
 */
export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar(
  {
    orientation = 'horizontal',
    size,
    loop = true,
    bordered = true,
    className,
    children,
    onKeyDown,
    onFocus,
    ...rest
  },
  ref,
) {
  devWarning(
    !rest['aria-label'] && !rest['aria-labelledby'],
    'Toolbar precisa de `aria-label` ou `aria-labelledby` (ex.: "Formatação de texto").',
  )

  const containerRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLElement | null>(null)
  const roving = useRovingFocus(containerRef, {
    orientation,
    loop,
    selector: ENABLED_ITEM_SELECTOR,
  })

  /** Garante uma única parada de Tab: o último item focado (ou o primeiro habilitado). */
  const syncTabStops = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const items = Array.from(container.querySelectorAll<HTMLElement>(ITEM_SELECTOR))
    const enabled = items.filter((el) => !el.hasAttribute('disabled'))
    if (!activeRef.current || !enabled.includes(activeRef.current))
      activeRef.current = enabled[0] ?? null
    for (const el of items) {
      const value = el === activeRef.current ? '0' : '-1'
      if (el.getAttribute('tabindex') !== value) el.setAttribute('tabindex', value)
    }
  }, [])

  useIsomorphicLayoutEffect(syncTabStops)

  // Itens podem surgir, sumir ou ser desabilitados sem que a Toolbar renderize.
  useEffect(() => {
    const container = containerRef.current
    if (!container || typeof MutationObserver === 'undefined') return
    const observer = new MutationObserver(syncTabStops)
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['disabled', 'data-roving-item'],
    })
    return () => observer.disconnect()
  }, [syncTabStops])

  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    onFocus?.(event)
    const target = event.target as HTMLElement
    const item = target.closest<HTMLElement>(ITEM_SELECTOR)
    if (item && containerRef.current?.contains(item) && item !== activeRef.current) {
      activeRef.current = item
      syncTabStops()
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return
    // Eventos de portais (ex.: menu do SplitButton) borbulham pela árvore React.
    if (!containerRef.current?.contains(event.target as Node)) return
    if (capturesArrowKeys(event.target)) return
    roving(event)
  }

  const ctx = useMemo<ActionGroupContextValue>(
    () => ({ size, variant: 'ghost', orientation, roving: true }),
    [size, orientation],
  )

  return (
    <ActionGroupContext.Provider value={ctx}>
      <div
        ref={mergeRefs(ref, containerRef)}
        role="toolbar"
        aria-orientation={orientation}
        className={cx(
          'or-toolbar',
          `or-toolbar--${orientation}`,
          bordered && 'or-toolbar--bordered',
          className,
        )}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        {...rest}
      >
        {applyGroupDefaults(children, ctx)}
      </div>
    </ActionGroupContext.Provider>
  )
})

export type ToolbarGroupProps = ButtonGroupProps

/**
 * Agrupa itens relacionados dentro da Toolbar (`role="group"`). Use
 * `aria-label` quando o agrupamento tiver um nome ("Alinhamento").
 */
export const ToolbarGroup = forwardRef<HTMLDivElement, ToolbarGroupProps>(function ToolbarGroup(
  { className, ...rest },
  ref,
) {
  return <ButtonGroup ref={ref} className={cx('or-toolbar__group', className)} {...rest} />
})

export type ToolbarSeparatorProps = HTMLAttributes<HTMLDivElement>

/** Divisor visual entre grupos de uma Toolbar (`role="separator"`, não focável). */
export const ToolbarSeparator = forwardRef<HTMLDivElement, ToolbarSeparatorProps>(
  function ToolbarSeparator({ className, ...rest }, ref) {
    const orientation = useActionGroup()?.orientation ?? 'horizontal'
    const separatorOrientation = orientation === 'horizontal' ? 'vertical' : 'horizontal'
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={separatorOrientation}
        className={cx('or-toolbar__separator', className)}
        {...rest}
      />
    )
  },
)
