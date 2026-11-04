import {
  cloneElement,
  forwardRef,
  useEffect,
  useMemo,
  useState,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from 'react'
import {
  useDisclosure,
  useId,
  useIsomorphicLayoutEffect,
  useMounted,
  usePresence,
} from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { composeEventHandlers, cx, getFocusableElements, mergeRefs } from '../../utils'
import { Button } from '../Button'
import { focusElement, getTabbableAfter, getThemeScope, useLayer } from '../Modal/overlay'
import { Portal } from '../Portal'
import {
  returnFocusIfLost,
  useFloatingPanel,
  useTriggerElement,
  type FloatingPlacement,
} from './floating'
import './Popover.css'

export type PopoverPlacement = FloatingPlacement

/** Funções entregues ao conteúdo quando `children` é uma função. */
export interface PopoverRenderProps {
  /** Fecha o popover e devolve o foco ao gatilho. */
  close: () => void
}

export interface PopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /**
   * Elemento que abre o popover (normalmente um `Button`). Recebe
   * `aria-haspopup="dialog"`, `aria-expanded` e `aria-controls`.
   */
  trigger: ReactElement
  /** Conteúdo. Aceita uma função `({ close }) => …`. */
  children?: ReactNode | ((props: PopoverRenderProps) => ReactNode)
  /** Título visível; nomeia o popover. Sem título, o nome vem do gatilho (ou de `aria-label`). */
  title?: ReactNode
  /** Aberto (controlado). Use com `onOpenChange`. */
  open?: boolean
  /** Aberto inicialmente (não controlado). */
  defaultOpen?: boolean
  /** Chamado quando o popover pede para abrir ou fechar. */
  onOpenChange?: (open: boolean) => void
  /** Posição preferida em relação ao gatilho; inverte sozinho se faltar espaço. */
  placement?: PopoverPlacement
  /** Distância do gatilho, em px. */
  offset?: number
  /** Mostra uma seta apontando para o gatilho. */
  arrow?: boolean
  /** Elemento que recebe o foco ao abrir. Padrão: primeiro focável (ou o próprio painel). */
  initialFocus?: RefObject<HTMLElement | null>
  /** Fecha ao clicar fora. */
  closeOnOutsideClick?: boolean
  /** Mostra um botão de fechar no cabeçalho. */
  showCloseButton?: boolean
}

/**
 * Painel não modal ancorado a um gatilho, para conteúdo e controles
 * complementares (filtros, detalhes, formulários curtos).
 */
export const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover(
  {
    trigger,
    children,
    title,
    open,
    defaultOpen,
    onOpenChange,
    placement = 'bottom',
    offset = 8,
    arrow = false,
    initialFocus,
    closeOnOutsideClick = true,
    showCloseButton = false,
    className,
    style,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const disclosure = useDisclosure({ open, defaultOpen, onOpenChange })
  const mounted = useMounted()
  const active = disclosure.isOpen && mounted
  // Mantém o painel montado durante a animação de saída.
  const { present, state, nodeRef } = usePresence<HTMLDivElement>(active)
  const [triggerEl, triggerRef] = useTriggerElement(trigger)
  const [panelEl, setPanelEl] = useState<HTMLDivElement | null>(null)
  const triggerProps = trigger.props as HTMLAttributes<HTMLElement>
  const triggerId = useId('or-popover-trigger', triggerProps.id)
  const panelId = useId('or-popover')
  const titleId = useId('or-popover-title')

  const floating = useFloatingPanel({
    open: present,
    reference: triggerEl,
    floating: panelEl,
    placement,
    offset,
    arrow,
  })

  const closeAndFocusTrigger = () => {
    disclosure.close()
    focusElement(triggerEl)
  }

  const { setNode, layerProps } = useLayer(active, {
    onEscape: closeAndFocusTrigger,
    onPointerDownOutside: closeOnOutsideClick
      ? () => {
          disclosure.close()
          returnFocusIfLost(triggerEl)
        }
      : undefined,
    onFocusOutside: () => disclosure.close(),
    insideElements: () => [triggerEl],
  })

  // Ao abrir, o foco vai para o conteúdo.
  useIsomorphicLayoutEffect(() => {
    if (!active || !panelEl) return
    if (panelEl.contains(document.activeElement)) return
    focusElement(initialFocus?.current ?? getFocusableElements(panelEl)[0] ?? panelEl)
  }, [active, panelEl])

  // Fechado com o foco dentro (ex.: estado controlado): devolve ao gatilho.
  useEffect(() => {
    if (!active || !panelEl) return
    return () => {
      const current = document.activeElement
      if (!current || current === document.body || panelEl.contains(current))
        focusElement(triggerEl)
    }
  }, [active, panelEl, triggerEl])

  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    // Tab no gatilho com o popover aberto entra no conteúdo, como se ele
    // estivesse logo depois do gatilho na página.
    if (event.key === 'Tab' && !event.shiftKey && active && panelEl) {
      event.preventDefault()
      focusElement(getFocusableElements(panelEl)[0] ?? panelEl)
    }
  }

  const handlePanelKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || event.key !== 'Tab' || !panelEl) return
    const current = document.activeElement as HTMLElement | null
    if (current && !panelEl.contains(current)) return
    const items = getFocusableElements(panelEl).filter((el) => el.tabIndex >= 0)
    const first = items[0]
    const last = items[items.length - 1]
    if (event.shiftKey && (current === first || current === panelEl || items.length === 0)) {
      event.preventDefault()
      focusElement(triggerEl)
    } else if (!event.shiftKey && (current === last || items.length === 0)) {
      event.preventDefault()
      disclosure.close()
      if (triggerEl) focusElement(getTabbableAfter(triggerEl, panelEl) ?? triggerEl)
    }
  }

  const panelRef = useMemo(
    () => mergeRefs<HTMLDivElement>(setPanelEl, setNode, nodeRef, ref),
    [setNode, nodeRef, ref],
  )

  const triggerElement = cloneElement(
    trigger as ReactElement<HTMLAttributes<HTMLElement> & { ref?: unknown }>,
    {
      ref: triggerRef,
      id: triggerId,
      'aria-haspopup': 'dialog',
      'aria-expanded': active,
      'aria-controls': active ? panelId : undefined,
      onClick: composeEventHandlers(triggerProps.onClick, (_event: ReactMouseEvent<HTMLElement>) =>
        disclosure.toggle(),
      ),
      onKeyDown: composeEventHandlers(triggerProps.onKeyDown, handleTriggerKeyDown),
    },
  )

  const labelled = rest['aria-label'] || rest['aria-labelledby']
  const content =
    typeof children === 'function' ? children({ close: closeAndFocusTrigger }) : children

  return (
    <>
      {triggerElement}
      <Portal>
        {present && (
          // onKeyDown só gerencia o Tab (ordem de foco); o diálogo em si não é um controle.
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-labelledby={labelled ? undefined : title ? titleId : triggerId}
            tabIndex={-1}
            data-state={state}
            inert={state === 'closed' || undefined}
            data-side={floating.side}
            data-theme={getThemeScope(triggerEl)}
            className={cx('or-floating', 'or-popover', className)}
            style={{ ...floating.floatingStyles, ...style }}
            onKeyDown={handlePanelKeyDown}
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
            {(title || showCloseButton) && (
              <div className="or-popover__header">
                {title && (
                  <h2 id={titleId} className="or-popover__title">
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    aria-label={t('close')}
                    startIcon={<Icon name="close" />}
                    className="or-popover__close"
                    onClick={closeAndFocusTrigger}
                  />
                )}
              </div>
            )}
            <div className="or-popover__body">{content}</div>
          </div>
        )}
      </Portal>
    </>
  )
})
