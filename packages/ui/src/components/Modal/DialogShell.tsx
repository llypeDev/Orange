import {
  useEffect,
  useMemo,
  useRef,
  type FocusEvent as ReactFocusEvent,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react'
import { useIsomorphicLayoutEffect, useLockBodyScroll, useMounted } from '../../hooks'
import { canUseDOM, cx, getFocusableElements, mergeRefs } from '../../utils'
import { Portal } from '../Portal'
import { focusElement, getThemeScope, useLayer, usePresence } from './overlay'
import './DialogShell.css'

export interface DialogShellProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
  open: boolean
  /** Pedido de fechamento (Escape, clique no fundo, foco). */
  onDismiss: () => void
  role?: 'dialog' | 'alertdialog' | (string & {})
  initialFocus?: RefObject<HTMLElement | null>
  finalFocus?: RefObject<HTMLElement | null>
  closeOnEscape?: boolean
  closeOnOverlayClick?: boolean
  /** Classe do contêiner fixo (fundo + painel). */
  rootClassName?: string
  panelRef?: Ref<HTMLDivElement>
  children: ReactNode
}

/**
 * Casca interna dos diálogos modais (Modal, Drawer, ConfirmDialog,
 * CommandPalette): portal, fundo, armadilha de foco, foco inicial e de
 * retorno, Escape, scroll lock, tema herdado e animação de saída.
 */
export function DialogShell({
  open,
  onDismiss,
  role = 'dialog',
  initialFocus,
  finalFocus,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  rootClassName,
  panelRef: externalPanelRef,
  className,
  children,
  onKeyDown,
  onFocus,
  ...rest
}: DialogShellProps) {
  const mounted = useMounted()
  const active = open && mounted
  const { present, state, nodeRef } = usePresence(active)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const restoreRef = useRef<HTMLElement | null>(null)
  const lastFocusedRef = useRef<HTMLElement | null>(null)
  const themeRef = useRef<string | undefined>(undefined)
  const wasActiveRef = useRef(false)
  const pointerDownOnOverlayRef = useRef(false)

  // Captura a origem do foco no render em que o diálogo abre — antes que
  // qualquer `autoFocus` do conteúdo mova o foco.
  if (active && !wasActiveRef.current && canUseDOM) {
    const current = document.activeElement
    restoreRef.current =
      current instanceof HTMLElement && current !== document.body ? current : null
    themeRef.current = getThemeScope(restoreRef.current ?? document.documentElement)
  }
  wasActiveRef.current = active

  const dismissRef = useRef(onDismiss)
  dismissRef.current = onDismiss

  const { setNode, isTop, release, layerProps } = useLayer(active, {
    modal: true,
    onEscape: closeOnEscape ? () => dismissRef.current() : undefined,
    onFocusOutside: () => {
      const panel = panelRef.current
      focusElement(lastFocusedRef.current?.isConnected ? lastFocusedRef.current : panel)
    },
  })

  useLockBodyScroll(active)

  // Foco inicial: no layout effect, antes da pintura.
  useIsomorphicLayoutEffect(() => {
    if (!active) return
    const panel = panelRef.current
    if (!panel || panel.contains(document.activeElement)) return
    const focusables = getFocusableElements(panel)
    const target =
      initialFocus?.current ??
      panel.querySelector<HTMLElement>('[data-autofocus]') ??
      focusables.find((el) => !el.hasAttribute('data-or-dialog-close')) ??
      focusables[0] ??
      panel
    focusElement(target)
  }, [active])

  // Foco de retorno: no cleanup passivo, depois que o React terminou o commit
  // (no commit ele restaura o foco anterior e desfaria a mudança).
  useEffect(() => {
    if (!active) return
    const panel = panelRef.current
    // lido no fechamento: o alvo pode ter mudado enquanto o diálogo estava aberto
    const getFinalFocus = () => finalFocus?.current
    return () => {
      release()
      const target = getFinalFocus() ?? restoreRef.current
      const current = document.activeElement
      const focusLost = !current || current === document.body || !!panel?.contains(current)
      if (target?.isConnected && focusLost) focusElement(target)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  const panelRefs = useMemo(
    () => mergeRefs<HTMLDivElement>(panelRef, nodeRef as Ref<HTMLDivElement>, externalPanelRef),
    [nodeRef, externalPanelRef],
  )

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || event.key !== 'Tab') return
    const panel = panelRef.current
    if (!panel) return
    const current = document.activeElement as HTMLElement | null
    // foco em um portal aninhado (ex.: Popover dentro do Modal): deixa com ele
    if (current && !panel.contains(current)) return
    const items = getFocusableElements(panel).filter(
      (el) => el.tabIndex >= 0 && !el.closest('[hidden]'),
    )
    if (items.length === 0) {
      event.preventDefault()
      return
    }
    const first = items[0]
    const last = items[items.length - 1]
    if (event.shiftKey && (current === first || current === panel)) {
      event.preventDefault()
      focusElement(last)
    } else if (!event.shiftKey && current === last) {
      event.preventDefault()
      focusElement(first)
    }
  }

  const handleFocus = (event: ReactFocusEvent<HTMLDivElement>) => {
    onFocus?.(event)
    if (panelRef.current?.contains(event.target))
      lastFocusedRef.current = event.target as HTMLElement
  }

  return (
    <Portal>
      {present && (
        <div
          ref={setNode}
          className={cx('or-dialog', rootClassName)}
          data-state={state}
          inert={state === 'closed' || undefined}
          data-theme={themeRef.current}
          {...layerProps}
        >
          <div
            className="or-dialog__backdrop"
            data-state={state}
            aria-hidden="true"
            onMouseDown={(event) => event.preventDefault()}
            onPointerDown={(event) => {
              pointerDownOnOverlayRef.current = event.button === 0 && isTop()
            }}
            onClick={() => {
              if (pointerDownOnOverlayRef.current && closeOnOverlayClick && active)
                dismissRef.current()
              pointerDownOnOverlayRef.current = false
            }}
          />
          <div
            ref={panelRefs}
            role={role}
            aria-modal="true"
            tabIndex={-1}
            data-state={state}
            className={cx('or-dialog__panel', className)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            {...rest}
          >
            {children}
          </div>
        </div>
      )}
    </Portal>
  )
}
