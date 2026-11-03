import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from 'react'
import { useLocale } from '../../providers'
import { cx } from '../../utils'
import './SkipLink.css'

export interface SkipLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Âncora do conteúdo de destino (`#id`). O elemento precisa existir na
   * página. Padrão: `#main`.
   */
  href?: string
}

/** Move o foco para o elemento de destino, tornando-o focável se necessário. */
function focusTarget(target: HTMLElement) {
  const focusable = target.matches('a[href], button, input, select, textarea, [tabindex]')
  if (!focusable) {
    target.setAttribute('tabindex', '-1')
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true })
  }
  target.focus({ preventScroll: true })
  target.scrollIntoView({ block: 'start' })
}

/**
 * Link de atalho "Pular para o conteúdo principal". Fica invisível até
 * receber foco pelo teclado — deve ser o primeiro elemento focável da página.
 */
export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(function SkipLink(
  { href = '#main', className, children, onClick, ...rest },
  ref,
) {
  const { t } = useLocale()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || !href.startsWith('#')) return
    const target = document.getElementById(decodeURIComponent(href.slice(1)))
    if (!target) return
    // Evita que roteadores baseados em hash interpretem a âncora como rota.
    event.preventDefault()
    focusTarget(target)
  }

  return (
    <a ref={ref} href={href} className={cx('or-skip-link', className)} onClick={handleClick} {...rest}>
      {children ?? t('skipToContent')}
    </a>
  )
})
