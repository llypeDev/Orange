import { forwardRef, useRef, type HTMLAttributes, type ReactNode } from 'react'
import { useIsomorphicLayoutEffect } from '../../hooks'
import { useLocale } from '../../providers'
import { cx } from '../../utils'
import { Spinner, type SpinnerSize } from '../Spinner'
import './LoadingOverlay.css'

export interface LoadingOverlayProps extends HTMLAttributes<HTMLDivElement> {
  /** Mostra a sobreposição e bloqueia o conteúdo coberto. */
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
    { visible = false, message, spinnerSize = 'md', className, children, ...rest },
    ref,
  ) {
    const { t } = useLocale()
    const contentRef = useRef<HTMLDivElement>(null)
    const panelRef = useRef<HTMLDivElement>(null)
    const restoreFocus = useRef<HTMLElement | null>(null)

    // `inert` via DOM (compatível com React 18 e 19). Se o foco estava no conteúdo,
    // ele é "estacionado" no painel e devolvido quando o carregamento termina.
    useIsomorphicLayoutEffect(() => {
      const content = contentRef.current
      const panel = panelRef.current
      if (!content) return
      if (visible) {
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
    }, [visible])

    return (
      <div
        ref={ref}
        className={cx('or-loading-overlay', className)}
        data-state={visible ? 'visible' : 'hidden'}
        {...rest}
      >
        <div
          ref={contentRef}
          className="or-loading-overlay__content"
          aria-busy={visible || undefined}
        >
          {children}
        </div>
        <div className="or-loading-overlay__backdrop">
          <div ref={panelRef} className="or-loading-overlay__panel" tabIndex={-1}>
            {visible && <Spinner size={spinnerSize} decorative />}
            {/* sempre montada para que a troca de texto seja anunciada */}
            <p className="or-loading-overlay__message" role="status">
              {visible ? (message ?? t('loading')) : null}
            </p>
          </div>
        </div>
      </div>
    )
  },
)
