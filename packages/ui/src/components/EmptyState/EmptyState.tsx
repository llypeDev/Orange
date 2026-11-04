import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode } from 'react'
import { Icon, iconPaths, type IconName } from '../../icons'
import { cx } from '../../utils'
import './EmptyState.css'

export type EmptyStateVariant = 'default' | 'compact'

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Título curto que explica o que está vazio. */
  title: ReactNode
  /** Nível semântico do título (`h2`–`h6`). Escolha pela hierarquia da página. */
  headingLevel?: 2 | 3 | 4 | 5 | 6
  /** Texto de apoio: por que está vazio e o que fazer. */
  description?: ReactNode
  /** Nome de um ícone do Orange ou um elemento. Fica dentro da ilustração geométrica. */
  icon?: IconName | ReactNode
  /** Substitui toda a ilustração. `false` remove a ilustração. */
  illustration?: ReactNode | false
  /** Ação principal (ex.: `<Button>Criar projeto</Button>`). */
  action?: ReactNode
  /** Ação secundária (ex.: um link para a documentação). */
  secondaryAction?: ReactNode
  /** `compact`: horizontal e menor, para painéis, listas e células. */
  variant?: EmptyStateVariant
  /**
   * Entrada ao montar: os quadrados da ilustração "caem" no lugar, um depois
   * do outro, e o texto sobe 8px. Desligado automaticamente com movimento
   * reduzido.
   */
  animated?: boolean
}

/**
 * Estado vazio: explica por que não há conteúdo (primeiro uso, busca sem
 * resultados, filtro restritivo) e oferece o próximo passo.
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  {
    title,
    headingLevel = 3,
    description,
    icon = 'inbox',
    illustration,
    action,
    secondaryAction,
    variant = 'default',
    animated = true,
    className,
    ...rest
  },
  ref,
) {
  const Heading: ElementType = `h${headingLevel}`
  const iconNode =
    typeof icon === 'string' && icon in iconPaths ? (
      <Icon name={icon as IconName} size={variant === 'compact' ? 'md' : 28} />
    ) : (
      icon
    )

  return (
    <div
      ref={ref}
      className={cx(
        'or-empty-state',
        `or-empty-state--${variant}`,
        animated && 'or-empty-state--animated',
        className,
      )}
      {...rest}
    >
      {illustration !== false &&
        (illustration ?? (
          <div className="or-empty-state__art" aria-hidden="true">
            <span className="or-empty-state__shape or-empty-state__shape--back" />
            <span className="or-empty-state__shape or-empty-state__shape--front">{iconNode}</span>
            <span className="or-empty-state__shape or-empty-state__shape--dot" />
          </div>
        ))}
      <div className="or-empty-state__body">
        <Heading className="or-empty-state__title">{title}</Heading>
        {description && <div className="or-empty-state__description">{description}</div>}
        {(action || secondaryAction) && (
          <div className="or-empty-state__actions">
            {action}
            {secondaryAction}
          </div>
        )}
      </div>
    </div>
  )
})
