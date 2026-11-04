import { forwardRef, useRef, type HTMLAttributes, type ReactNode } from 'react'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx, mergeRefs } from '../../utils'
import { Button } from '../Button'
import { VisuallyHidden } from '../VisuallyHidden'
import {
  feedbackIcons,
  feedbackLabelKeys,
  liveRoleFor,
  moveFocusOutOf,
  useFeedbackPresence,
  type FeedbackTone,
} from './feedback'
import './Alert.css'

export type AlertTone = FeedbackTone

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Cor semântica e ícone. */
  tone?: AlertTone
  /** Título curto, em negrito. */
  title?: ReactNode
  /** Substitui o ícone do tom. Use `false` para não exibir ícone. */
  icon?: ReactNode | false
  /** Ações relacionadas à mensagem (ex.: um `Button` `sm` ou um link). */
  action?: ReactNode
  /** Mostra o botão de fechar. */
  dismissible?: boolean
  /** Chamado ao clicar em fechar. */
  onDismiss?: () => void
  /**
   * Visibilidade controlada. Sem esta prop, o Alert se esconde sozinho ao ser
   * fechado.
   */
  open?: boolean
  /**
   * Para mensagens que aparecem dinamicamente: aplica `role="alert"` (tons
   * `danger` e `warning`, anúncio imediato) ou `role="status"` (demais tons,
   * anúncio educado). Mensagens estáticas, presentes no carregamento da
   * página, não devem usar `live`.
   */
  live?: boolean
}

/**
 * Mensagem inline e contextual — confirma, informa, alerta ou aponta um erro
 * relacionado a uma parte da página.
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    tone = 'info',
    title,
    icon,
    action,
    dismissible = false,
    onDismiss,
    open,
    live = false,
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

  const labelKey = feedbackLabelKeys[tone]
  const role = live ? liveRoleFor(tone) : undefined

  const dismiss = () => {
    // o foco sai antes da animação de saída começar
    moveFocusOutOf(rootRef.current)
    hide()
    onDismiss?.()
  }

  return (
    // Invólucro de presença: na saída, recolhe a altura (grid 1fr → 0fr) enquanto o Alert esmaece.
    <div ref={nodeRef} className="or-alert-presence" data-state={state}>
      <div className="or-alert-presence__inner">
        <div
          ref={mergeRefs(ref, rootRef)}
          className={cx(
            'or-alert',
            `or-alert--${tone}`,
            dismissible && 'or-alert--dismissible',
            enter && 'or-alert--enter',
            className,
          )}
          {...rest}
        >
          {icon !== false && (
            <span className="or-alert__icon" aria-hidden="true">
              {icon ?? <Icon name={feedbackIcons[tone]} size="md" />}
            </span>
          )}
          <div className="or-alert__main">
            {/* A região viva envolve só a mensagem: ações e o botão de fechar não são lidos no anúncio. */}
            <div className="or-alert__message" role={role} aria-atomic={role ? true : undefined}>
              {labelKey && <VisuallyHidden>{`${t(labelKey)}: `}</VisuallyHidden>}
              {title && <p className="or-alert__title">{title}</p>}
              {children && <div className="or-alert__body">{children}</div>}
            </div>
            {action && <div className="or-alert__actions">{action}</div>}
          </div>
          {dismissible && (
            <Button
              className="or-alert__close"
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
