import {
  forwardRef,
  useCallback,
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type RefObject,
} from 'react'
import { useReducedMotion } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { canUseDOM, cx } from '../../utils'
import './BackToTop.css'

type ElementTarget = HTMLElement | null | RefObject<HTMLElement | null> | (() => HTMLElement | null)

export interface BackToTopProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Distância rolada (px) a partir da qual o botão aparece. Padrão: 400. */
  threshold?: number
  /**
   * Elemento que recebe o foco depois de voltar ao topo. Aceita elemento, ref,
   * função ou seletor CSS. Padrão: o `<main>` da página ou o `<body>`.
   */
  focusTarget?: ElementTarget | string
  /**
   * Contêiner rolável observado. Padrão: a janela. Use quando o conteúdo rola
   * dentro de um painel com `overflow: auto`.
   */
  scrollContainer?: ElementTarget
  /**
   * `fixed` (padrão) prende o botão no canto da janela; `sticky` o mantém no
   * fim do contêiner rolável (posicione-o como último filho).
   */
  position?: 'fixed' | 'sticky'
  /** Mostra o rótulo ao lado do ícone. Padrão: só o ícone (com `aria-label`). */
  showLabel?: boolean
  /** Rótulo. Padrão: `t('backToTop')` — "Voltar ao topo". */
  label?: string
}

function resolve(target: ElementTarget | string | undefined): HTMLElement | null {
  if (!canUseDOM || target == null) return null
  if (typeof target === 'string') return document.querySelector<HTMLElement>(target)
  if (typeof target === 'function') return target()
  if ('current' in target) return target.current
  return target
}

function focusElement(el: HTMLElement) {
  const focusable = el.matches('a[href], button, input, select, textarea, [tabindex]')
  if (!focusable) {
    el.setAttribute('tabindex', '-1')
    el.addEventListener('blur', () => el.removeAttribute('tabindex'), { once: true })
  }
  el.focus({ preventScroll: true })
}

/**
 * Botão "Voltar ao topo": aparece depois que a página é rolada além de
 * `threshold`, rola suavemente até o início (instantâneo com movimento
 * reduzido) e devolve o foco ao início do conteúdo.
 */
export const BackToTop = forwardRef<HTMLButtonElement, BackToTopProps>(function BackToTop(
  {
    threshold = 400,
    focusTarget,
    scrollContainer,
    position = 'fixed',
    showLabel = false,
    label,
    className,
    onClick,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const reducedMotion = useReducedMotion()
  const [visible, setVisible] = useState(false)
  const text = label ?? t('backToTop')

  const getScroller = useCallback((): HTMLElement | Window | null => {
    if (!canUseDOM) return null
    return scrollContainer === undefined ? window : resolve(scrollContainer)
  }, [scrollContainer])

  useEffect(() => {
    const scroller = getScroller()
    if (!scroller) return
    const update = () => {
      const top = scroller === window ? window.scrollY : (scroller as HTMLElement).scrollTop
      setVisible(top > threshold)
    }
    update()
    scroller.addEventListener('scroll', update, { passive: true })
    return () => scroller.removeEventListener('scroll', update)
  }, [getScroller, threshold])

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (event.defaultPrevented) return
    const scroller = getScroller()
    if (!scroller) return
    if (typeof scroller.scrollTo === 'function') {
      scroller.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
    } else {
      ;(scroller as HTMLElement).scrollTop = 0
    }
    const target =
      resolve(focusTarget) ??
      (scroller === window ? document.querySelector<HTMLElement>('main') : (scroller as HTMLElement)) ??
      document.body
    focusElement(target)
  }

  return (
    <button
      ref={ref}
      type="button"
      className={cx(
        'or-back-to-top',
        `or-back-to-top--${position}`,
        showLabel && 'or-back-to-top--labeled',
        className,
      )}
      data-visible={visible || undefined}
      aria-label={showLabel ? undefined : text}
      onClick={handleClick}
      {...rest}
    >
      <Icon name="arrow-up" className="or-back-to-top__icon" />
      {showLabel && <span className="or-back-to-top__label">{text}</span>}
    </button>
  )
})
