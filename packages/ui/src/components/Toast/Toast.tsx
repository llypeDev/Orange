import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx } from '../../utils'
import { feedbackIcons, feedbackLabelKeys, type FeedbackTone } from '../Alert/feedback'
import { Button } from '../Button'
import { VisuallyHidden } from '../VisuallyHidden'
import './Toast.css'

export type ToastTone = FeedbackTone

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Cor semântica e ícone. */
  tone?: ToastTone
  /** Mensagem principal, curta. */
  title?: ReactNode
  /** Detalhe opcional, em uma ou duas linhas. */
  description?: ReactNode
  /** Substitui o ícone do tom. `false` remove o ícone. */
  icon?: ReactNode | false
  /** Ação relacionada (ex.: "Desfazer"). */
  action?: ReactNode
  /** Quando informado, mostra o botão de fechar e o chama ao clicar. */
  onClose?: () => void
}

/**
 * Visual de uma notificação temporária. Normalmente é renderizado pelo
 * `ToastProvider` — chame `useToast().toast({...})` em vez de usá-lo direto.
 */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { tone = 'neutral', title, description, icon, action, onClose, className, ...rest },
  ref,
) {
  const { t } = useLocale()
  const labelKey = feedbackLabelKeys[tone]
  return (
    <div
      ref={ref}
      className={cx('or-toast', `or-toast--${tone}`, onClose && 'or-toast--closable', className)}
      {...rest}
    >
      {icon !== false && (
        <span className="or-toast__icon" aria-hidden="true">
          {icon ?? <Icon name={feedbackIcons[tone]} size="md" />}
        </span>
      )}
      <div className="or-toast__main">
        <div className="or-toast__message" data-toast-message="">
          {labelKey && <VisuallyHidden>{`${t(labelKey)}: `}</VisuallyHidden>}
          {title && <p className="or-toast__title">{title}</p>}
          {description && <div className="or-toast__description">{description}</div>}
        </div>
        {action && <div className="or-toast__action">{action}</div>}
      </div>
      {onClose && (
        <Button
          className="or-toast__close"
          variant="ghost"
          size="sm"
          iconOnly
          aria-label={t('close')}
          startIcon={<Icon name="close" size="sm" />}
          onClick={onClose}
        />
      )}
    </div>
  )
})
