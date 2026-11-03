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
import { useFloatingPanel, useTriggerElement, type FloatingPlacement } from '../Popover/floating'
import { Portal } from '../Portal'
import './HoverCard.css'

export type HoverCardPlacement = FloatingPlacement

export interface HoverCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Link ou elemento focável que mostra o cartão (ex.: `<a href="/u/ana">@ana</a>`). */
  trigger: ReactElement
  /** Pré-visualização complementar. Não coloque aqui nada essencial. */
  children: ReactNode
  /** Atraso para abrir, em ms. */
  openDelay?: number
  /** Atraso para fechar ao sair, em ms (tempo para alcançar o cartão). */
  closeDelay?: number
  /** Posição preferida; inverte sozinha se faltar espaço. */
  placement?: HoverCardPlacement
  /** Distância do gatilho, em px. */
  offset?: number
  /** Mostra uma seta apontando para o gatilho. */
  arrow?: boolean
  /** Aberto (controlado). */
  open?: boolean
  /** Aberto inicialmente (não controlado). */
  defaultOpen?: boolean
  /** Chamado quando o cartão abre ou fecha. */
  onOpenChange?: (open: boolean) => void
}

/**
 * Cartão de pré-visualização exibido ao passar o ponteiro ou focar um link —
 * perfil de uma pessoa, resumo de um item. Conteúdo complementar: tudo nele
 * também precisa estar disponível no destino do link.
 */
export const HoverCard = forwardRef<HTMLDivElement, HoverCardProps>(function HoverCard(
  {
    trigger,
    children,
    openDelay = 600,
    closeDelay = 300,
    placement = 'bottom',
    offset = 8,
    arrow = false,
    open,
    defaultOpen = false,
    onOpenChange,
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
  const visible = isOpen && mounted
  const cardId = useId('or-hover-card')
  const [triggerEl, triggerRef] = useTriggerElement(trigger)
  const [cardEl, setCardEl] = useState<HTMLDivElement | null>(null)
  const openTimer = useRef<number | undefined>(undefined)
  const closeTimer = useRef<number | undefined>(undefined)
  const pointerFocus = useRef(false)

  const floating = useFloatingPanel({
    open: visible,
    reference: triggerEl,
    floating: cardEl,
    placement,
    offset,
    arrow,
  })

  const scheduleOpen = () => {
    window.clearTimeout(closeTimer.current)
    if (isOpen) return
    window.clearTimeout(openTimer.current)
    openTimer.current = window.setTimeout(() => setOpen(true), openDelay)
  }

  const scheduleClose = (immediate = false) => {
    window.clearTimeout(openTimer.current)
    window.clearTimeout(closeTimer.current)
    if (immediate) setOpen(false)
    else closeTimer.current = window.setTimeout(() => setOpen(false), closeDelay)
  }

  useEffect(
    () => () => {
      window.clearTimeout(openTimer.current)
      window.clearTimeout(closeTimer.current)
    },
    [],
  )

  const { setNode, layerProps } = useLayer(visible, {
    onEscape: () => scheduleClose(true),
    onPointerDownOutside: () => scheduleClose(true),
    insideElements: () => [triggerEl],
  })

  const cardRef = useMemo(() => mergeRefs<HTMLDivElement>(setCardEl, setNode, ref), [setNode, ref])

  const triggerProps = trigger.props as HTMLAttributes<HTMLElement>
  const triggerElement = cloneElement(
    trigger as ReactElement<HTMLAttributes<HTMLElement> & { ref?: unknown }>,
    {
      ref: triggerRef,
      onPointerEnter: composeEventHandlers(
        triggerProps.onPointerEnter,
        (event: ReactPointerEvent<HTMLElement>) => {
          if (event.pointerType !== 'touch') scheduleOpen()
        },
      ),
      onPointerLeave: composeEventHandlers(
        triggerProps.onPointerLeave,
        (event: ReactPointerEvent<HTMLElement>) => {
          if (event.pointerType !== 'touch') scheduleClose()
        },
      ),
      onPointerDown: composeEventHandlers(triggerProps.onPointerDown, () => {
        // o foco que vem do clique não abre o cartão
        pointerFocus.current = true
        window.setTimeout(() => (pointerFocus.current = false), 0)
      }),
      onFocus: composeEventHandlers(triggerProps.onFocus, (event: ReactFocusEvent<HTMLElement>) => {
        if (!pointerFocus.current && isFocusVisible(event.currentTarget)) scheduleOpen()
      }),
      onBlur: composeEventHandlers(triggerProps.onBlur, (event: ReactFocusEvent<HTMLElement>) => {
        const next = event.relatedTarget as Node | null
        if (!next || !cardEl?.contains(next)) scheduleClose(true)
      }),
    },
  )

  return (
    <>
      {triggerElement}
      <Portal>
        {visible && (
          <div
            ref={cardRef}
            id={cardId}
            data-side={floating.side}
            data-theme={getThemeScope(triggerEl)}
            className={cx('or-floating', 'or-hover-card', className)}
            style={{ ...floating.floatingStyles, ...style }}
            onPointerEnter={composeEventHandlers(onPointerEnter, () =>
              window.clearTimeout(closeTimer.current),
            )}
            onPointerLeave={composeEventHandlers(
              onPointerLeave,
              (event: ReactPointerEvent<HTMLDivElement>) => {
                if (event.pointerType !== 'touch') scheduleClose()
              },
            )}
            {...rest}
            {...layerProps}
          >
            {arrow && (
              <span
                ref={floating.arrowRef}
                className="or-floating-arrow"
                data-side={floating.side}
                style={floating.arrowStyle}
                aria-hidden="true"
              />
            )}
            {children}
          </div>
        )}
      </Portal>
    </>
  )
})
