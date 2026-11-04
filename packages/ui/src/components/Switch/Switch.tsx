import { forwardRef, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react'
import { useControllableState, useId } from '../../hooks'
import { cx, devWarning } from '../../utils'
import { hasContent } from '../Fieldset/FieldsetBase'
import './Switch.css'

export type SwitchSize = 'sm' | 'md'

export interface SwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value' | 'defaultValue' | 'type'> {
  /** Rótulo associado (clicável). Descreva a configuração, não o estado: "Notificações por e-mail". */
  label?: ReactNode
  /** Texto de apoio, ligado por `aria-describedby`. */
  description?: ReactNode
  /** Tamanho do trilho: `sm` ou `md` (padrão). */
  size?: SwitchSize
  /** Ligado (controlado). */
  checked?: boolean
  /** Ligado inicialmente (não controlado). */
  defaultChecked?: boolean
  /** Chamado com o novo estado. */
  onCheckedChange?: (checked: boolean) => void
  /** Posição do rótulo: `end` (depois do switch, padrão) ou `start` (antes, alinhado à esquerda — listas de configurações). */
  labelPosition?: 'start' | 'end'
  /** Envia `name=value` no formulário quando ligado. */
  name?: string
  /** Valor enviado quando ligado. Padrão: `on`. */
  value?: string
}

/**
 * Liga/desliga uma configuração com efeito imediato. `<button role="switch">`
 * com `aria-checked`; Espaço e Enter alternam. Para escolhas que só valem ao
 * enviar um formulário, prefira `Checkbox`.
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    label,
    description,
    size = 'md',
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    labelPosition = 'end',
    name,
    value = 'on',
    disabled,
    id,
    className,
    style,
    onClick,
    form,
    'aria-describedby': ariaDescribedBy,
    ...rest
  },
  ref,
) {
  const switchId = useId('or-switch', id)
  const labelId = `${switchId}-label`
  const hasLabel = hasContent(label)
  const hasDescription = hasContent(description)
  const descriptionId = hasDescription ? `${switchId}-description` : undefined
  const [checked, setChecked] = useControllableState({
    value: checkedProp,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  })

  devWarning(
    !hasLabel && !rest['aria-label'] && !rest['aria-labelledby'],
    'Switch sem `label` precisa de `aria-label` ou `aria-labelledby`.',
  )

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (event.defaultPrevented) return
    setChecked(!checked)
  }

  return (
    <div
      className={cx('or-switch', `or-switch--${size}`, `or-switch--label-${labelPosition}`, className)}
      style={style}
      data-disabled={disabled || undefined}
    >
      <div className="or-switch__row">
        <button
          ref={ref}
          type="button"
          role="switch"
          id={switchId}
          className="or-switch__control"
          aria-checked={checked}
          aria-labelledby={hasLabel ? labelId : undefined}
          aria-describedby={[ariaDescribedBy, descriptionId].filter(Boolean).join(' ') || undefined}
          data-state={checked ? 'on' : 'off'}
          disabled={disabled}
          form={form}
          onClick={handleClick}
          {...rest}
        >
          <span className="or-switch__thumb" aria-hidden="true" />
        </button>
        {hasLabel && (
          <label id={labelId} htmlFor={switchId} className="or-switch__label">
            {label}
          </label>
        )}
      </div>
      {hasDescription && (
        <p id={descriptionId} className="or-switch__description">
          {description}
        </p>
      )}
      {name && checked && <input type="hidden" name={name} value={value} form={form} disabled={disabled} />}
    </div>
  )
})
