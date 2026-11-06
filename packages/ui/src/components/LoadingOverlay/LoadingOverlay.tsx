import { forwardRef, useRef, type HTMLAttributes, type ReactNode } from 'react'
import { useIsomorphicLayoutEffect, usePresence } from '../../hooks'
import { useLocale } from '../../providers'
import { cx, deprecate } from '../../utils'
import { Spinner, type SpinnerSize } from '../Spinner'
import './LoadingOverlay.css'

export interface LoadingOverlayProps extends HTMLAttributes<HTMLDivElement> {
  /** Mostra a sobreposição e bloqueia o conteúdo coberto. */
  open?: boolean
  /** @deprecated Use `open` (o mesmo nome das outras sobreposições). Sai na v1.0. */
  visible?: boolean
  /** Mensagem exibida e anunciada. Padrão: `t('loading')`. */
  message?: ReactNode
  /** Tamanho do spinner. */
  spinnerSize?: SpinnerSize
  /** Conteúdo que será coberto. */
  children?: ReactNode
}

/**
 * Cobre uma área (tabela, cartão, painel) enquanto ela é atualizada. O
 * conteúdo coberto fica `inert` e `aria-busy`; a mensagem é anunciada numa
 * região `role="status"` que fica fora dele.
 */
export const LoadingOverlay = forwardRef<HTMLDivElement, LoadingOverlayProps>(
  function LoadingOverlay(
    { open: openProp, visible, message, spinnerSize = 'md', className, children, ...rest },
    ref,
  ) {
    const { t } = useLocale()
    if (visible !== undefined) {
      deprecate(
        'LoadingOverlay: `visible` está depreciado e sai na v1.0. Use `open`.',
        'loading-overlay.visible',
      )
    }
    const open = openProp ?? visible ?? false
    const contentRef = useRef<HTMLDivElement>(null)
    const panelRef = useRef<HTMLDivElement>(null)
    const restoreFocus = useRef<HTMLElement | null>(null)
    // Saída animada: spinner e mensagem continuam no painel enquanto ele esmaece.
    const { present, nodeRef: backdropRef } = usePresence<HTMLDivElement>(open)

    // `inert` via DOM (compatível com React 18 e 19). Se o foco estava no conteúdo,
    // ele é "estacionado" no painel e devolvido quando o carregamento termina.
    useIsomorphicLayoutEffect(() => {
      const content = contentRef.current
      const panel = panelRef.current
      if (!content) return
      if (open) {
        const active = document.activeElement as HTMLElement | null
        content.setAttribute('inert', '')
        if (active && content.contains(active)) {
          restoreFocus.current = active
          panel?.focus({ preventScroll: true })
        }
        return
      }
      content.removeAttribute('inert')
      const target = restoreFocus.current
      restoreFocus.current = null
      const active = document.activeElement
      if (target?.isConnected && (!active || active === document.body || active === panel)) {
        target.focus({ preventScroll: true })
      }
    }, [open])

    return (
      <div
        ref={ref}
        className={cx('or-loading-overlay', className)}
        data-state={open ? 'visible' : 'hidden'}
        {...rest}
      >
        <div ref={contentRef} className="or-loading-overlay__content" aria-busy={open || undefined}>
          {children}
        </div>
        <div ref={backdropRef} className="or-loading-overlay__backdrop">
          <div ref={panelRef} className="or-loading-overlay__panel" tabIndex={-1}>
            {present && <Spinner size={spinnerSize} decorative />}
            {/* sempre montada para que a troca de texto seja anunciada */}
            <p className="or-loading-overlay__message" role="status">
              {present ? (message ?? t('loading')) : null}
            </p>
          </div>
        </div>
      </div>
    )
  },
)
