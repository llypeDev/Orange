import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
} from 'react'
import { useControllableState, useId, useIsomorphicLayoutEffect, usePresence } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx } from '../../utils'
import './ExpandableText.css'

export interface ExpandableTextProps extends HTMLAttributes<HTMLDivElement> {
  /** Linhas visíveis quando recolhido. Padrão: `3`. */
  lines?: number
  /** Estado expandido (controlado). */
  expanded?: boolean
  /** Estado inicial (não controlado). Padrão: `false`. */
  defaultExpanded?: boolean
  /** Chamado ao expandir/recolher. */
  onExpandedChange?: (expanded: boolean) => void
  /** Elemento que envolve o texto. Padrão: `div` (aceita vários parágrafos). */
  as?: ElementType
  /** Rótulo do botão quando recolhido. Padrão: `t('showMore')`. */
  showMoreLabel?: string
  /** Rótulo do botão quando expandido. Padrão: `t('showLess')`. */
  showLessLabel?: string
}

function lineHeightOf(el: HTMLElement): number {
  const style = getComputedStyle(el)
  const lineHeight = parseFloat(style.lineHeight)
  if (!Number.isNaN(lineHeight)) return lineHeight
  return parseFloat(style.fontSize) * 1.2
}

/**
 * Texto longo recolhido em algumas linhas, com botão "Mostrar mais". O botão
 * só aparece quando o conteúdo realmente não cabe.
 */
export const ExpandableText = forwardRef<HTMLDivElement, ExpandableTextProps>(function ExpandableText(
  {
    lines = 3,
    expanded: expandedProp,
    defaultExpanded = false,
    onExpandedChange,
    as: Content = 'div',
    showMoreLabel,
    showLessLabel,
    className,
    children,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const contentId = useId('or-expandable-text')
  const contentRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [overflowing, setOverflowing] = useState(false)
  const [expanded, setExpanded] = useControllableState({
    value: expandedProp,
    defaultValue: defaultExpanded,
    onChange: onExpandedChange,
  })
  const clamp = Math.max(1, Math.floor(lines))
  // `unclamped` continua verdadeiro durante a transição de recolher: o texto só
  // volta ao line-clamp (com reticências) quando a altura chega a `lines` linhas.
  const { present: unclamped, state, nodeRef } = usePresence<HTMLDivElement>(expanded)

  useIsomorphicLayoutEffect(() => {
    const el = contentRef.current
    if (!el) return
    const measure = () => {
      if (!expanded) {
        setOverflowing(el.scrollHeight > el.clientHeight + 1)
        return
      }
      // Expandido: compara a altura total com a altura de `lines` linhas.
      const lineHeight = lineHeightOf(el)
      if (!Number.isNaN(lineHeight) && lineHeight > 0) setOverflowing(el.scrollHeight > lineHeight * clamp + 1)
    }
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [expanded, clamp, children])

  // Ao terminar de recolher um texto longo, mantém o botão (com foco) na tela.
  const wasUnclamped = useRef(unclamped)
  useEffect(() => {
    if (wasUnclamped.current && !unclamped && document.activeElement === buttonRef.current) {
      buttonRef.current?.scrollIntoView({ block: 'nearest' })
    }
    wasUnclamped.current = unclamped
  }, [unclamped])

  const showButton = overflowing

  return (
    <div ref={ref} className={cx('or-expandable-text', className)} {...rest}>
      <div
        ref={nodeRef}
        className="or-expandable-text__viewport"
        // Só anima a altura quando há o que expandir (sem botão, nada muda).
        data-state={overflowing ? state : undefined}
        style={{ '--_lines': clamp } as CSSProperties}
      >
        <Content
          ref={contentRef}
          id={contentId}
          className="or-expandable-text__content"
          data-expanded={expanded || undefined}
          data-clamped={unclamped ? undefined : true}
        >
          {children}
        </Content>
      </div>
      {showButton && (
        <button
          ref={buttonRef}
          type="button"
          className="or-expandable-text__toggle"
          aria-expanded={expanded}
          aria-controls={contentId}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (showLessLabel ?? t('showLess')) : (showMoreLabel ?? t('showMore'))}
          <Icon name="chevron-down" size="sm" />
        </button>
      )}
    </div>
  )
})
