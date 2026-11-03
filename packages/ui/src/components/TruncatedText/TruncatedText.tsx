import {
  forwardRef,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
} from 'react'
import { useIsomorphicLayoutEffect } from '../../hooks'
import { cx, mergeRefs } from '../../utils'
import './TruncatedText.css'

export interface TruncatedTextProps extends HTMLAttributes<HTMLElement> {
  /** Elemento renderizado. Padrão: `span` (exibido como bloco). */
  as?: ElementType
  /** Número máximo de linhas visíveis antes das reticências. Padrão: `1`. */
  lines?: number
  /**
   * Quando o texto estiver cortado, mostra o texto completo no `title` nativo
   * (dica ao passar o mouse). Um `title` passado explicitamente tem prioridade.
   */
  showTitle?: boolean
  /** Chamado quando o texto passa a estar (ou deixa de estar) cortado. */
  onTruncatedChange?: (truncated: boolean) => void
}

/**
 * Corta textos longos em um número fixo de linhas com reticências. O texto
 * completo continua no DOM — leitores de tela e a busca da página o encontram.
 */
export const TruncatedText = forwardRef<HTMLElement, TruncatedTextProps>(function TruncatedText(
  { as: Component = 'span', lines = 1, showTitle = false, onTruncatedChange, className, style, title, children, ...rest },
  ref,
) {
  const innerRef = useRef<HTMLElement>(null)
  const composedRef = useMemo(() => mergeRefs(ref, innerRef), [ref])
  const [truncated, setTruncated] = useState(false)
  const [fullText, setFullText] = useState('')
  const onChangeRef = useRef(onTruncatedChange)
  onChangeRef.current = onTruncatedChange
  const lastReported = useRef<boolean | null>(null)
  const clamp = Math.max(1, Math.floor(lines))

  useIsomorphicLayoutEffect(() => {
    const el = innerRef.current
    if (!el) return
    const measure = () => {
      const next = clamp === 1 ? el.scrollWidth > el.clientWidth + 1 : el.scrollHeight > el.clientHeight + 1
      setTruncated(next)
      setFullText(el.textContent ?? '')
      if (lastReported.current !== next) {
        lastReported.current = next
        onChangeRef.current?.(next)
      }
    }
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [clamp, children])

  return (
    <Component
      ref={composedRef}
      className={cx(
        'or-truncated-text',
        clamp === 1 ? 'or-truncated-text--single' : 'or-truncated-text--multi',
        className,
      )}
      style={clamp === 1 ? style : ({ '--_lines': clamp, ...style } as CSSProperties)}
      title={title ?? (showTitle && truncated ? fullText : undefined)}
      data-truncated={truncated || undefined}
      {...rest}
    >
      {children}
    </Component>
  )
})
