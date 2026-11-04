import {
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { canUseDOM, cx, mergeRefs } from '../../utils'
import './Tag.css'

export type TagTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'
export type TagVariant = 'outline' | 'solid'
export type TagSize = 'sm' | 'md' | 'lg'

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** Cor semântica do marcador (e do fundo, na variante `solid`). */
  tone?: TagTone
  /** `outline` (borda, padrão) ou `solid` (fundo suave do tom). */
  variant?: TagVariant
  /** Altura: `sm` 22px, `md` 28px, `lg` 32px. */
  size?: TagSize
  /** Mostra o marcador quadrado colorido. Padrão: `true`. */
  marker?: boolean
  /** Ícone no lugar do marcador. */
  icon?: ReactNode
  /**
   * Mostra o botão de remover. É chamado quando a animação de saída termina
   * (imediatamente em movimento reduzido) — remova a tag da lista nesse momento.
   */
  onRemove?: (event: MouseEvent<HTMLButtonElement>) => void
  /** Rótulo acessível do botão de remover. Padrão: "Remover {texto da tag}". */
  removeLabel?: string
  /** Desabilita o botão de remover. */
  disabled?: boolean
}

function animationSeconds(value: string) {
  return Math.max(0, ...value.split(',').map((v) => (v.trim().endsWith('ms') ? parseFloat(v) / 1000 : parseFloat(v) || 0)))
}

function nodeText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(nodeText).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) return nodeText(node.props.children)
  return ''
}

/**
 * Rótulo estático para categorizar ou indicar status, com marcador quadrado
 * colorido e botão de remover opcional.
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  {
    tone = 'neutral',
    variant = 'outline',
    size = 'md',
    marker = true,
    icon,
    onRemove,
    removeLabel,
    disabled = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const nodeRef = useRef<HTMLSpanElement>(null)
  const composedRef = useMemo(() => mergeRefs(ref, nodeRef), [ref])
  const [leaving, setLeaving] = useState(false)
  const pendingEvent = useRef<MouseEvent<HTMLButtonElement> | null>(null)
  const onRemoveRef = useRef(onRemove)
  onRemoveRef.current = onRemove

  // Saída animada: a tag encolhe e some; só então avisa o pai.
  useEffect(() => {
    if (!leaving) return
    const node = nodeRef.current
    const finish = () => {
      const event = pendingEvent.current
      pendingEvent.current = null
      setLeaving(false)
      if (event) onRemoveRef.current?.(event)
    }
    const style = node && canUseDOM ? getComputedStyle(node) : null
    const animated = !!style && style.animationName !== 'none' && !!style.animationName && animationSeconds(style.animationDuration) > 0
    if (!node || !animated) {
      finish()
      return
    }
    const onEnd = (event: AnimationEvent) => {
      if (event.target === node) finish()
    }
    node.addEventListener('animationend', onEnd)
    const fallback = window.setTimeout(finish, 600)
    return () => {
      node.removeEventListener('animationend', onEnd)
      window.clearTimeout(fallback)
    }
  }, [leaving])

  const handleRemove = (event: MouseEvent<HTMLButtonElement>) => {
    if (leaving) return
    pendingEvent.current = event
    setLeaving(true)
  }

  return (
    <span
      ref={composedRef}
      className={cx(
        'or-tag',
        `or-tag--${tone}`,
        `or-tag--${variant}`,
        `or-tag--${size}`,
        onRemove && 'or-tag--removable',
        className,
      )}
      data-disabled={disabled || undefined}
      data-leaving={leaving || undefined}
      {...rest}
    >
      {icon ? (
        <span className="or-tag__icon" aria-hidden="true">
          {icon}
        </span>
      ) : (
        marker && <span className="or-tag__marker" aria-hidden="true" />
      )}
      <span className="or-tag__label">{children}</span>
      {onRemove && (
        <button
          type="button"
          className="or-tag__remove"
          aria-label={removeLabel ?? t('removeItem', { label: nodeText(children) })}
          disabled={disabled}
          onClick={handleRemove}
        >
          <Icon name="close" size={size === 'sm' ? 12 : 14} strokeWidth={2} />
        </button>
      )}
    </span>
  )
})
