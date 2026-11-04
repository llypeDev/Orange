import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { useId, usePresence } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx, getFocusableElements, mergeRefs } from '../../utils'
import './ErrorSummary.css'

export interface ErrorSummaryItem {
  /** Id do campo com erro. O link aponta para `#id` e foca esse campo. */
  id: string
  /** Mensagem de erro — de preferência a mesma exibida junto ao campo. */
  message: ReactNode
}

export interface ErrorSummaryProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Lista de erros. Com a lista vazia, nada é renderizado. */
  errors: ErrorSummaryItem[]
  /** Título do painel. Padrão: "Corrija os seguintes erros". */
  title?: ReactNode
  /** Texto opcional entre o título e a lista. */
  description?: ReactNode
  /**
   * Move o foco para o painel quando ele aparece, para que leitores de tela o
   * anunciem. Sem foco automático, o painel usa `role="alert"`. Padrão: `true`.
   */
  autoFocus?: boolean
  /** Nível do título (h2–h6). Padrão: 2. */
  headingLevel?: 2 | 3 | 4 | 5 | 6
  /** Chamado ao clicar em um erro (antes de focar o campo). */
  onItemClick?: (item: ErrorSummaryItem, event: MouseEvent<HTMLAnchorElement>) => void
}

const NATIVE_FOCUSABLE = 'input:not([type="hidden"]), select, textarea, button, a[href], [tabindex]'

/** Encontra o elemento a focar: o próprio alvo ou, num grupo, a opção marcada/primeira. */
function resolveFocusTarget(target: HTMLElement): HTMLElement | null {
  if (target.matches(NATIVE_FOCUSABLE) && !(target as HTMLInputElement).disabled) return target
  const checked = target.querySelector<HTMLElement>('input:checked:not(:disabled)')
  if (checked) return checked
  return getFocusableElements(target)[0] ?? null
}

/**
 * Resumo de erros de um formulário: título, lista de links para os campos
 * inválidos e foco automático ao aparecer. Coloque-o no topo do formulário e
 * mostre-o após uma tentativa de envio.
 */
export const ErrorSummary = forwardRef<HTMLElement, ErrorSummaryProps>(function ErrorSummary(
  {
    errors,
    title,
    description,
    autoFocus = true,
    headingLevel = 2,
    onItemClick,
    className,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const titleId = useId('or-error-summary')
  const innerRef = useRef<HTMLElement>(null)
  const hasErrors = errors.length > 0
  // Saída animada (mais curta que a entrada): mantém a última lista enquanto some.
  const { present, state, nodeRef } = usePresence<HTMLElement>(hasErrors)
  const mergedRef = useMemo(() => mergeRefs(ref, innerRef, nodeRef), [ref, nodeRef])
  const lastErrors = useRef(errors)
  if (hasErrors) lastErrors.current = errors
  const shownErrors = hasErrors ? errors : lastErrors.current
  const Heading = `h${headingLevel}` as ElementType

  // Foca o painel quando ele aparece (montagem com erros ou lista que deixa de ser vazia).
  useEffect(() => {
    if (autoFocus && hasErrors) innerRef.current?.focus()
  }, [autoFocus, hasErrors])

  const handleClick = (item: ErrorSummaryItem) => (event: MouseEvent<HTMLAnchorElement>) => {
    onItemClick?.(item, event)
    if (event.defaultPrevented) return
    const target = document.getElementById(item.id)
    if (!target) return
    const focusTarget = resolveFocusTarget(target)
    if (!focusTarget) return
    event.preventDefault()
    // Mostra a pergunta junto com o campo: legenda do grupo ou rótulo do campo.
    const legend = target.tagName === 'FIELDSET' ? target.querySelector('legend') : null
    const label = (focusTarget as HTMLInputElement).labels?.[0] ?? null
    const anchor = legend ?? label ?? focusTarget
    anchor.scrollIntoView?.({ block: 'center' })
    focusTarget.focus({ preventScroll: true })
  }

  if (!present) return null

  return (
    <section
      ref={mergedRef}
      tabIndex={-1}
      role={autoFocus ? undefined : 'alert'}
      aria-labelledby={titleId}
      className={cx('or-error-summary', className)}
      data-state={state}
      inert={state === 'closed' || undefined}
      {...rest}
    >
      <Heading id={titleId} className="or-error-summary__title">
        <Icon name="alert-circle" size="md" className="or-error-summary__icon" />
        <span>{title ?? t('errorSummaryTitle')}</span>
      </Heading>
      {description && <div className="or-error-summary__description">{description}</div>}
      <ul className="or-error-summary__list">
        {shownErrors.map((item, index) => (
          <li key={item.id} style={{ '--_i': index } as CSSProperties}>
            <a href={`#${item.id}`} className="or-error-summary__link" onClick={handleClick(item)}>
              {item.message}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
})
