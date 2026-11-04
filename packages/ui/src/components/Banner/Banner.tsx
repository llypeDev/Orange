import { forwardRef, useRef, type ElementType, type HTMLAttributes, type ReactNode } from 'react'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx, mergeRefs } from '../../utils'
import {
  feedbackIcons,
  feedbackLabelKeys,
  liveRoleFor,
  moveFocusOutOf,
  useFeedbackPresence,
  type FeedbackTone,
} from '../Alert/feedback'
import { Button } from '../Button'
import { VisuallyHidden } from '../VisuallyHidden'
import './Banner.css'

export type BannerTone = FeedbackTone
export type BannerVariant = 'default' | 'accent'

export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Cor semântica e ícone (variante `default`). */
  tone?: BannerTone
  /**
   * `default`: faixa compacta com fundo do tom, para avisos do sistema.
   * `accent`: chamada com borda laranja e título grande (anúncios, convites).
   */
  variant?: BannerVariant
  /** Título curto. Na variante `accent`, é exibido em destaque. */
  title?: ReactNode
  /** Nível de heading do título (`2`–`6`). Sem esta prop, o título é um parágrafo. */
  headingLevel?: 2 | 3 | 4 | 5 | 6
  /** Substitui o ícone do tom. `false` remove o ícone (padrão na variante `accent`). */
  icon?: ReactNode | false
  /** Ação principal: um link ou `Button`. */
  action?: ReactNode
  /** Mostra o botão de fechar. */
  dismissible?: boolean
  /** Chamado ao clicar em fechar. */
  onDismiss?: () => void
  /** Visibilidade controlada. Sem esta prop, o Banner se esconde sozinho ao ser fechado. */
  open?: boolean
  /**
   * Para avisos que surgem com a página já aberta (ex.: queda de conexão):
   * `role="alert"` em `danger`/`warning`, `role="status"` nos demais tons.
   */
  live?: boolean
  /**
   * Indicador "ao vivo": o ícone ganha um anel pulsando na cor do tom — para
   * situações em andamento (incidente, manutenção acontecendo agora). O
   * movimento é só um reforço: o texto precisa dizer que é ao vivo.
   */
  pulse?: boolean
}

/**
 * Faixa de largura total para avisos do sistema ou da página — manutenção,
 * instabilidade, prazos, convites. Fica no topo, acima do conteúdo.
 */
export const Banner = forwardRef<HTMLDivElement, BannerProps>(function Banner(
  {
    tone = 'info',
    variant = 'default',
    title,
    headingLevel,
    icon,
    action,
    dismissible = false,
    onDismiss,
    open,
    live = false,
    pulse = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const rootRef = useRef<HTMLDivElement>(null)
  const { present, state, nodeRef, enter, hide } = useFeedbackPresence(open, live)
  if (!present) return null

  const isAccent = variant === 'accent'
  const labelKey = isAccent ? null : feedbackLabelKeys[tone]
  const role = live ? liveRoleFor(isAccent ? 'info' : tone) : undefined
  const TitleTag: ElementType = headingLevel ? `h${headingLevel}` : 'p'
  const iconNode =
    icon === false
      ? null
      : (icon ?? (isAccent ? null : <Icon name={feedbackIcons[tone]} size="md" />))

  const dismiss = () => {
    // o foco sai antes da animação de saída começar
    moveFocusOutOf(rootRef.current)
    hide()
    onDismiss?.()
  }

  return (
    // Invólucro de presença: na saída, recolhe a altura (grid 1fr → 0fr) enquanto o Banner esmaece.
    <div ref={nodeRef} className="or-banner-presence" data-state={state}>
      <div className="or-banner-presence__inner">
        <div
          ref={mergeRefs(ref, rootRef)}
          className={cx(
            'or-banner',
            `or-banner--${variant}`,
            !isAccent && `or-banner--${tone}`,
            enter && 'or-banner--enter',
            className,
          )}
          {...rest}
        >
          {iconNode && (
            <span
              className={cx('or-banner__icon', pulse && 'or-banner__icon--pulse or-pulse')}
              aria-hidden="true"
            >
              {iconNode}
            </span>
          )}
          <div className="or-banner__content" role={role} aria-atomic={role ? true : undefined}>
            {labelKey && <VisuallyHidden>{`${t(labelKey)}: `}</VisuallyHidden>}
            {title && <TitleTag className="or-banner__title">{title}</TitleTag>}
            {children && <div className="or-banner__body">{children}</div>}
          </div>
          {action && <div className="or-banner__action">{action}</div>}
          {dismissible && (
            <Button
              className="or-banner__close"
              variant="ghost"
              size="sm"
              iconOnly
              aria-label={t('close')}
              startIcon={<Icon name="close" size="sm" />}
              onClick={dismiss}
            />
          )}
        </div>
      </div>
    </div>
  )
})
