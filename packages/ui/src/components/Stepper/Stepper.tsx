import { forwardRef, type OlHTMLAttributes, type ReactNode } from 'react'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx } from '../../utils'
import { VisuallyHidden } from '../VisuallyHidden'
import './Stepper.css'

export type StepperStatus = 'complete' | 'current' | 'upcoming' | 'error'
export type StepperOrientation = 'horizontal' | 'vertical'

export interface StepperStep {
  /** Nome da etapa. */
  label: ReactNode
  /** Texto de apoio abaixo do nome. */
  description?: ReactNode
  /** Força um estado. Padrão: calculado a partir de `step`. Use `error` para etapas com problema. */
  status?: StepperStatus
  /** Conteúdo exibido sob a etapa atual (somente na orientação vertical). */
  content?: ReactNode
}

export interface StepperProps extends Omit<OlHTMLAttributes<HTMLOListElement>, 'children'> {
  /** Etapas do fluxo, em ordem. */
  steps: StepperStep[]
  /** Índice (a partir de 0) da etapa atual. Etapas anteriores ficam concluídas. Padrão: `0`. */
  step?: number
  /** Orientação. A horizontal vira compacta em contêineres estreitos. */
  orientation?: StepperOrientation
  /**
   * Torna as etapas concluídas clicáveis (para voltar e revisar). Etapas
   * atuais e futuras nunca são clicáveis.
   */
  onStepClick?: (index: number) => void
}

function getStatus(item: StepperStep, index: number, current: number): StepperStatus {
  if (item.status) return item.status
  if (index < current) return 'complete'
  if (index === current) return 'current'
  return 'upcoming'
}

/**
 * Mostra o progresso em um fluxo de várias etapas (checkout, cadastro,
 * configuração). Indica etapas concluídas, a atual e as próximas.
 */
export const Stepper = forwardRef<HTMLOListElement, StepperProps>(function Stepper(
  { steps, step: current = 0, orientation = 'horizontal', onStepClick, className, ...rest },
  ref,
) {
  const { t } = useLocale()
  const statusText: Record<StepperStatus, string | null> = {
    complete: t('completed'),
    current: t('current'),
    error: t('stepWithError'),
    upcoming: null,
  }

  return (
    <ol
      ref={ref}
      className={cx('or-stepper', `or-stepper--${orientation}`, className)}
      data-orientation={orientation}
      {...rest}
    >
      {steps.map((step, index) => {
        const status = getStatus(step, index, current)
        const isCurrent = index === current
        const clickable = Boolean(onStepClick) && status === 'complete'
        const hidden = statusText[status]
        const marker = (
          <span className="or-stepper__marker" aria-hidden="true">
            {status === 'complete' ? (
              <Icon name="check" size="sm" strokeWidth={2.25} />
            ) : status === 'error' ? (
              <Icon name="alert-triangle" size="sm" strokeWidth={2} />
            ) : (
              index + 1
            )}
          </span>
        )
        const text = (
          <span className="or-stepper__text">
            <span className="or-stepper__label">
              {step.label}
              {hidden && <VisuallyHidden> ({hidden})</VisuallyHidden>}
            </span>
            {step.description && <span className="or-stepper__description">{step.description}</span>}
          </span>
        )
        return (
          <li
            key={index}
            className="or-stepper__step"
            data-status={status}
            aria-current={isCurrent ? 'step' : undefined}
          >
            {clickable ? (
              <button type="button" className="or-stepper__trigger" onClick={() => onStepClick?.(index)}>
                {marker}
                {text}
              </button>
            ) : (
              <div className="or-stepper__trigger">
                {marker}
                {text}
              </div>
            )}
            {orientation === 'vertical' && isCurrent && step.content && (
              <div className="or-stepper__content">{step.content}</div>
            )}
          </li>
        )
      })}
    </ol>
  )
})
