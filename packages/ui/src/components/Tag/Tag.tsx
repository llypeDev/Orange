import {
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx } from '../../utils'
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
  /** Mostra o botão de remover e é chamado ao clicá-lo. */
  onRemove?: (event: MouseEvent<HTMLButtonElement>) => void
  /** Rótulo acessível do botão de remover. Padrão: "Remover {texto da tag}". */
  removeLabel?: string
  /** Desabilita o botão de remover. */
  disabled?: boolean
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
  return (
    <span
      ref={ref}
      className={cx(
        'or-tag',
        `or-tag--${tone}`,
        `or-tag--${variant}`,
        `or-tag--${size}`,
        onRemove && 'or-tag--removable',
        className,
      )}
      data-disabled={disabled || undefined}
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
          onClick={onRemove}
        >
          <Icon name="close" size={size === 'sm' ? 12 : 14} strokeWidth={2} />
        </button>
      )}
    </span>
  )
})
