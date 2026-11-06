import { forwardRef, useMemo, useRef, type ChangeEvent, type InputHTMLAttributes, type ReactNode } from 'react'
import { useId, useIsomorphicLayoutEffect } from '../../hooks'
import { Icon } from '../../icons'
import { cx, devWarning, mergeRefs } from '../../utils'
import { hasContent } from '../Fieldset/FieldsetBase'
import { useErrorShake } from '../TextField/useErrorShake'
import { useCheckboxGroup } from './CheckboxGroupContext'
import '../TextField/FormMotion.css'
import './Checkbox.css'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Rótulo clicável ao lado da caixa. Sem rótulo visível, informe `aria-label`. */
  label?: ReactNode
  /** Texto de ajuda abaixo do rótulo, ligado por `aria-describedby`. */
  description?: ReactNode
  /** Mensagem de erro. Quando presente, a caixa fica inválida. */
  error?: ReactNode
  /** Força o estado inválido sem exibir mensagem. */
  invalid?: boolean
  /** Estado misto (ex.: "selecionar todos" com parte dos itens marcada). */
  indeterminate?: boolean
  /** Chamado com o novo estado marcado (atalho para `onChange`). */
  onCheckedChange?: (checked: boolean) => void
}

/**
 * Caixa de seleção nativa estilizada. Use sozinha (aceite de termos) ou dentro
 * de um `CheckboxGroup`. A `ref` e as props nativas vão para o `<input>`;
 * `className` e `style` vão para o contêiner. Num `CheckboxGroup` com
 * `variant="card"`, o contêiner é um `<label>`: o cartão inteiro é clicável.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    label,
    description,
    error,
    invalid = false,
    indeterminate = false,
    required,
    disabled,
    id,
    className,
    style,
    checked,
    name,
    value,
    onChange,
    onCheckedChange,
    'aria-describedby': ariaDescribedBy,
    ...rest
  },
  ref,
) {
  const group = useCheckboxGroup()
  const inputId = useId('or-checkbox', id)
  const innerRef = useRef<HTMLInputElement>(null)
  const mergedRef = useMemo(() => mergeRefs(ref, innerRef), [ref])
  const hasDescription = hasContent(description)
  const hasError = hasContent(error)
  const descriptionId = hasDescription ? `${inputId}-description` : undefined
  const errorId = hasError ? `${inputId}-error` : undefined
  const isInvalid = hasError || invalid
  const isDisabled = Boolean(disabled || group?.disabled)
  const inGroup = group !== null && value !== undefined
  const card = group?.variant === 'card'
  const labelId = card && hasContent(label) ? `${inputId}-label` : undefined
  const isChecked = inGroup ? group.value.includes(String(value)) : checked
  const { shakeClassName, onAnimationEnd } = useErrorShake(isInvalid)

  devWarning(group !== null && value === undefined, 'Checkbox dentro de CheckboxGroup precisa de `value`.')
  devWarning(
    !hasContent(label) && !rest['aria-label'] && !rest['aria-labelledby'],
    'Checkbox sem `label` precisa de `aria-label` ou `aria-labelledby`.',
  )

  // `indeterminate` só existe como propriedade do DOM.
  useIsomorphicLayoutEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate
  }, [indeterminate, isChecked])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event)
    onCheckedChange?.(event.target.checked)
    if (inGroup) group.toggle(String(value), event.target.checked)
  }

  const control = (
    <span className="or-checkbox__control">
      <input
        ref={mergedRef}
        type="checkbox"
        id={inputId}
        className="or-checkbox__input"
        name={name ?? group?.name}
        value={value}
        checked={isChecked}
        required={required}
        disabled={isDisabled}
        aria-invalid={isInvalid || undefined}
        // No cartão, o <label> envolve também descrição e erro: o nome vem só do rótulo.
        aria-labelledby={labelId}
        aria-describedby={[ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(' ') || undefined}
        onChange={handleChange}
        {...rest}
      />
      <span className={cx('or-checkbox__box', shakeClassName)} aria-hidden="true" onAnimationEnd={onAnimationEnd}>
        <Icon name="check" size={14} strokeWidth={3} className="or-checkbox__check" />
        <Icon name="minus" size={14} strokeWidth={3} className="or-checkbox__dash" />
      </span>
    </span>
  )

  if (card) {
    // Mesma marcação do Radio em cartão: o <label> é o cartão inteiro.
    return (
      <label
        htmlFor={inputId}
        className={cx('or-checkbox', 'or-checkbox--card', className)}
        style={style}
        data-checked={isChecked || undefined}
        data-invalid={isInvalid || undefined}
        data-disabled={isDisabled || undefined}
      >
        {control}
        <span className="or-checkbox__body">
          {hasContent(label) && (
            <span id={labelId} className="or-checkbox__label">
              {label}
              {required && (
                <span className="or-checkbox__required" aria-hidden="true">
                  *
                </span>
              )}
            </span>
          )}
          {hasDescription && (
            <span id={descriptionId} className="or-checkbox__description">
              {description}
            </span>
          )}
          {hasError && (
            <span id={errorId} className="or-checkbox__error">
              <Icon name="alert-circle" size="sm" />
              <span>{error}</span>
            </span>
          )}
        </span>
      </label>
    )
  }

  return (
    <div
      className={cx('or-checkbox', className)}
      style={style}
      data-invalid={isInvalid || undefined}
      data-disabled={isDisabled || undefined}
    >
      <div className="or-checkbox__row">
        {control}
        {hasContent(label) && (
          <label htmlFor={inputId} className="or-checkbox__label">
            {label}
            {required && (
              <span className="or-checkbox__required" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
      </div>
      {hasDescription && (
        <p id={descriptionId} className="or-checkbox__description">
          {description}
        </p>
      )}
      {hasError && (
        <p id={errorId} className="or-checkbox__error">
          <Icon name="alert-circle" size="sm" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
})
