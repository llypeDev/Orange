import { Children, forwardRef, isValidElement, useMemo, type HTMLAttributes, type ReactElement } from 'react'
import { useLocale } from '../../providers'
import { cx, devWarning } from '../../utils'
import { AvatarGroupContext, type AvatarProps, type AvatarShape, type AvatarSize } from '../Avatar/Avatar'
import './AvatarGroup.css'

export interface AvatarGroupProps extends HTMLAttributes<HTMLUListElement> {
  /** Rótulo da lista (ex.: "Pessoas com acesso"). Obrigatório sem `aria-labelledby`. */
  label?: string
  /** Quantidade máxima de avatares visíveis; o restante vira o contador "+N". */
  max?: number
  /**
   * Total real de pessoas, quando apenas parte delas foi carregada. O contador
   * mostra `total - visíveis`.
   */
  total?: number
  /** Tamanho aplicado a todos os avatares. */
  size?: AvatarSize
  /** Forma aplicada a todos os avatares. */
  shape?: AvatarShape
}

/**
 * Avatares sobrepostos em uma lista rotulada, com contador "+N" para o
 * excedente. Os filhos devem ser `Avatar`.
 */
export const AvatarGroup = forwardRef<HTMLUListElement, AvatarGroupProps>(function AvatarGroup(
  { label, max, total, size = 'md', shape = 'square', className, children, ...rest },
  ref,
) {
  const { t } = useLocale()
  devWarning(
    !label && !rest['aria-label'] && !rest['aria-labelledby'],
    'AvatarGroup precisa de `label` (ou `aria-labelledby`) para nomear a lista.',
  )
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<AvatarProps>[]
  const limit = max !== undefined && max > 0 && items.length > max ? max : items.length
  const visible = items.slice(0, limit)
  const hidden = items.slice(limit)
  const hiddenCount = Math.max(total ?? items.length, items.length) - visible.length
  const hiddenNames = hidden
    .map((el) => el.props.name ?? el.props.alt)
    .filter(Boolean)
    .join(', ')
  const context = useMemo(() => ({ size, shape }), [size, shape])

  return (
    <AvatarGroupContext.Provider value={context}>
      <ul
        ref={ref}
        role="list"
        aria-label={label}
        className={cx('or-avatar-group', `or-avatar-group--${size}`, className)}
        {...rest}
      >
        {visible.map((child, index) => (
          <li key={child.key ?? index} className="or-avatar-group__item">
            {child}
          </li>
        ))}
        {hiddenCount > 0 && (
          <li className="or-avatar-group__item">
            <span
              className={cx('or-avatar', `or-avatar--${size}`, `or-avatar--${shape}`, 'or-avatar-group__more')}
              role="img"
              aria-label={t('avatarMore', { count: hiddenCount })}
              title={hiddenNames || undefined}
            >
              <span className="or-avatar__frame" aria-hidden="true">
                <span className="or-avatar__initials">+{hiddenCount}</span>
              </span>
            </span>
          </li>
        )}
      </ul>
    </AvatarGroupContext.Provider>
  )
})
