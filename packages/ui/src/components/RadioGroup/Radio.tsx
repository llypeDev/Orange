import { forwardRef, type ChangeEvent, type InputHTMLAttributes, type ReactNode } from 'react'
import { useId } from '../../hooks'
import { cx, devWarning } from '../../utils'
import { hasContent } from '../Fieldset/FieldsetBase'
import { useRadioGroup } from './RadioGroupContext'
import './RadioGroup.css'

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'value'> {
  /** Valor enviado quando esta opção está selecionada. */
  value: string
  /** Rótulo da opção (clicável). */
  label: ReactNode
  /** Texto de apoio da opção, ligado por `aria-describedby`. */
  description?: ReactNode
}

/**
 * Opção de um `RadioGroup`: `<input type="radio">` nativo estilizado. As setas
 * do teclado movem a seleção entre as opções (comportamento nativo).
 * A `ref` e as props nativas vão para o `<input>`; `className` e `style`, para o contêiner.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    value,
    label,
    description,
    disabled,
    id,
    className,
    style,
    name,
    checked,
    required,
    onChange,
    'aria-describedby': ariaDescribedBy,
    ...rest
  },
  ref,
) {
  const group = useRadioGroup()
  devWarning(group === null, 'Radio deve ser usado dentro de um RadioGroup.')
  const inputId = useId('or-radio', id)
  const labelId = `${inputId}-label`
  const hasDescription = hasContent(description)
  const descriptionId = hasDescription ? `${inputId}-description` : undefined
  const isDisabled = Boolean(disabled || group?.disabled)
  const isChecked = group ? group.value === value : checked
  const variant = group?.variant ?? 'default'

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event)
    if (group && event.target.checked) group.select(value)
  }

  return (
    <label
      htmlFor={inputId}
      className={cx('or-radio', `or-radio--${variant}`, className)}
      style={style}
      data-checked={isChecked || undefined}
      data-disabled={isDisabled || undefined}
    >
      <span className="or-radio__control">
        <input
          ref={ref}
          type="radio"
          id={inputId}
          className="or-radio__input"
          name={name ?? group?.name}
          value={value}
          checked={isChecked}
          required={required ?? group?.required}
          disabled={isDisabled}
          aria-labelledby={labelId}
          aria-describedby={[ariaDescribedBy, descriptionId].filter(Boolean).join(' ') || undefined}
          onChange={handleChange}
          {...rest}
        />
        <span className="or-radio__indicator" aria-hidden="true" />
      </span>
      <span className="or-radio__body">
        <span id={labelId} className="or-radio__label">
          {label}
        </span>
        {hasDescription && (
          <span id={descriptionId} className="or-radio__description">
            {description}
          </span>
        )}
      </span>
    </label>
  )
})
