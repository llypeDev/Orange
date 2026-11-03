import {
  cloneElement,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent as ReactFocusEvent,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
} from 'react'
import { useControllableState, useId, useMounted } from '../../hooks'
import { composeEventHandlers, cx, mergeRefs } from '../../utils'
import { getThemeScope, isFocusVisible, useLayer } from '../Modal/overlay'
import {
  joinIds,
  useFloatingPanel,
  useTriggerElement,
  type FloatingPlacement,
} from '../Popover/floating'
import { Portal } from '../Portal'
import './Tooltip.css'

export type TooltipPlacement = FloatingPlacement

export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content' | 'children'> {
  /** Texto curto e não interativo (sem links ou botões). */
  content: ReactNode
  /** Gatilho focável (um único elemento, ex.: `Button`). Recebe `aria-describedby`. */
  children: ReactElement
  /** Posição preferida; inverte sozinha se faltar espaço. */
  placement?: TooltipPlacement
  /** Atraso para abrir no hover, em ms. No foco por teclado abre na hora. */
  delay?: number
  /** Atraso para fechar ao sair com o ponteiro, em ms (tempo para alcançar o tooltip). */
  closeDelay?: number
  /** Distância do gatilho, em px. */
  offset?: number
  /** Mostra a seta apontando para o gatilho. */
  arrow?: boolean
  /** Aberto (controlado). */
  open?: boolean
  /** Aberto inicialmente (não controlado). */
  defaultOpen?: boolean
  /** Chamado quando o tooltip abre ou fecha. */
  onOpenChange?: (open: boolean) => void
  /** Desliga o tooltip (o gatilho é renderizado sem alterações). */
  disabled?: boolean
}

// Depois que um tooltip fecha, o próximo abre sem atraso por um instante
// (percorrer uma barra de ferramentas com o mouse fica fluido).
let lastClosedAt = 0
const WARM_WINDOW = 300

/**
 * Rótulo curto que aparece ao passar o ponteiro ou focar um elemento.
 * Complementa (não substitui) o nome acessível do gatilho.
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  {
    content,
    children,
    placement = 'top',
    delay = 400,
    closeDelay = 150,
    offset = 8,
    arrow = true,
    open,
    defaultOpen = false,
    onOpenChange,
    disabled = false,
    className,
    style,
    onPointerEnter,
    onPointerLeave,
    ...rest
  },
  ref,
) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })
  const mounted = useMounted()
  const visible = isOpen && mounted && !disabled
  const tooltipId = useId('or-tooltip')
  const [triggerEl, triggerRef] = useTriggerElement(children)
  const [tooltipEl, setTooltipEl] = useState<HTMLDivElement | null>(null)
  const openTimer = useRef<number | undefined>(undefined)
  const closeTimer = useRef<number | undefined>(undefined)
  const pointerFocus = useRef(false)

  const floating = useFloatingPanel({
    open: visible,
    reference: triggerEl,
    floating: tooltipEl,
    placement,
    offset,
    arrow,
  })

  const clearTimers = () => {
    window.clearTimeout(openTimer.current)
    window.clearTimeout(closeTimer.current)
  }

  const show = (immediate = false) => {
    window.clearTimeout(closeTimer.current)
    if (isOpen) return
    window.clearTimeout(openTimer.current)
    if (immediate || delay <= 0 || Date.now() - lastClosedAt < WARM_WINDOW) setOpen(true)
    else openTimer.current = window.setTimeout(() => setOpen(true), delay)
  }

  const hide = (immediate = false) => {
    window.clearTimeout(openTimer.current)
    window.clearTimeout(closeTimer.current)
    if (!isOpen) return
    const close = () => {
      lastClosedAt = Date.now()
      setOpen(false)
    }
    if (immediate || closeDelay <= 0) close()
    else closeTimer.current = window.setTimeout(close, closeDelay)
  }

  useEffect(() => clearTimers, [])

  // Escape fecha sem mover o foco nem o ponteiro (WCAG 1.4.13).
  const { setNode, layerProps } = useLayer(visible, { onEscape: () => hide(true) })

  const tooltipRef = useMemo(
    () => mergeRefs<HTMLDivElement>(setTooltipEl, setNode, ref),
    [setNode, ref],
  )

  if (disabled) return children

  const childProps = children.props as HTMLAttributes<HTMLElement>
  const trigger = cloneElement(
    children as ReactElement<HTMLAttributes<HTMLElement> & { ref?: unknown }>,
    {
      ref: triggerRef,
      'aria-describedby': joinIds(childProps['aria-describedby'], tooltipId),
      onPointerEnter: composeEventHandlers(
        childProps.onPointerEnter,
        (event: ReactPointerEvent<HTMLElement>) => {
          if (event.pointerType !== 'touch') show()
        },
      ),
      onPointerLeave: composeEventHandlers(
        childProps.onPointerLeave,
        (event: ReactPointerEvent<HTMLElement>) => {
          if (event.pointerType !== 'touch') hide()
        },
      ),
      onPointerDown: composeEventHandlers(childProps.onPointerDown, () => {
        // o foco que vem do clique não reabre o tooltip
        pointerFocus.current = true
        window.setTimeout(() => (pointerFocus.current = false), 0)
        hide(true)
      }),
      onFocus: composeEventHandlers(childProps.onFocus, (event: ReactFocusEvent<HTMLElement>) => {
        if (!pointerFocus.current && isFocusVisible(event.currentTarget)) show(true)
      }),
      onBlur: composeEventHandlers(childProps.onBlur, () => hide(true)),
    },
  )

  return (
    <>
      {trigger}
      <Portal>
        <div
          ref={visible ? tooltipRef : undefined}
          id={tooltipId}
          role="tooltip"
          hidden={!visible}
          data-side={floating.side}
          data-theme={visible ? getThemeScope(triggerEl) : undefined}
          className={cx('or-floating', 'or-tooltip', className)}
          style={visible ? { ...floating.floatingStyles, ...style } : style}
          onPointerEnter={composeEventHandlers(onPointerEnter, () =>
            window.clearTimeout(closeTimer.current),
          )}
          onPointerLeave={composeEventHandlers(onPointerLeave, () => hide())}
          {...rest}
          {...(visible ? layerProps : {})}
        >
          {content}
          {arrow && (
            <span
              ref={floating.arrowRef}
              className="or-floating-arrow"
              data-side={floating.side}
              style={floating.arrowStyle}
              aria-hidden="true"
            />
          )}
        </div>
      </Portal>
    </>
  )
})
