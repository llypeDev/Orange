import {
  forwardRef,
  useRef,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import { useControllableState } from '../../hooks'
import { Icon } from '../../icons'
import { cx, mergeRefs } from '../../utils'
import { Field, useFieldControlProps, type FieldControlProps } from '../Field'
import './TimeField.css'

export type TimeFieldSize = 'sm' | 'md' | 'lg'

export interface TimeFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange' | 'size' | 'type'
> {
  /** Horário no formato `HH:mm` (ou `HH:mm:ss` com `step` < 60). Controlado. */
  value?: string
  /** Horário inicial (não controlado). */
  defaultValue?: string
  /** Chamado com o novo horário (`HH:mm`) ou `''` quando apagado. */
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void
  /** Horário mínimo (`HH:mm`). */
  min?: string
  /** Horário máximo (`HH:mm`). */
  max?: string
  /** Intervalo em segundos entre horários válidos. Ex.: `900` = 15 minutos. Padrão: 60. */
  step?: number
  /** Rótulo visível do campo. */
  label?: ReactNode
  /** Oculta o rótulo visualmente (continua acessível). */
  hideLabel?: boolean
  /** Texto de ajuda abaixo do rótulo. */
  description?: ReactNode
  /** Mensagem de erro. Quando presente, o campo fica inválido. */
  error?: ReactNode
  /** Mostra "(opcional)" ao lado do rótulo. */
  optional?: boolean
  /** Altura do campo: `sm` 32px, `md` 40px, `lg` 48px. */
  size?: TimeFieldSize
}

function FieldControl({
  id,
  children,
}: {
  id?: string
  children: (props: FieldControlProps) => ReactNode
}) {
  return <>{children(useFieldControlProps({ id }))}</>
}

/**
 * Campo de horário: `<input type="time">` nativo com a aparência do Orange.
 * O navegador cuida da digitação por segmentos, do formato 12/24h do
 * sistema e do seletor nativo — com teclado e leitores de tela completos.
 */
export const TimeField = forwardRef<HTMLInputElement, TimeFieldProps>(function TimeField(
  {
    value: valueProp,
    defaultValue = '',
    onChange,
    min,
    max,
    step,
    label,
    hideLabel,
    description,
    error,
    required,
    optional,
    disabled,
    readOnly,
    size = 'md',
    id,
    className,
    style,
    ...rest
  },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useControllableState({ value: valueProp, defaultValue })
  const hasError = error !== undefined && error !== null && error !== false && error !== ''

  const openPicker = () => {
    const input = inputRef.current
    if (!input || disabled || readOnly) return
    input.focus()
    try {
      input.showPicker?.()
    } catch {
      // showPicker pode falhar sem gesto do usuário ou em navegadores antigos.
    }
  }

  return (
    <Field
      label={label}
      hideLabel={hideLabel}
      description={description}
      error={error}
      required={required}
      optional={optional}
      disabled={disabled}
      controlId={id}
      className={cx('or-time-field', className)}
      style={style}
    >
      <FieldControl id={id}>
        {(fieldProps) => (
          <div
            className={cx('or-control-frame', `or-control-frame--${size}`, 'or-time-field__frame')}
            data-invalid={hasError || undefined}
            aria-disabled={disabled || undefined}
            data-disabled={disabled || undefined}
            data-readonly={readOnly || undefined}
          >
            {/* Atalho só para ponteiro: pelo teclado o horário é editado direto no campo. */}
            <span
              className="or-control-frame__addon or-control-frame__addon--start or-time-field__icon"
              onPointerDown={(event) => {
                event.preventDefault()
                openPicker()
              }}
            >
              <Icon name="clock" size="sm" />
            </span>
            <input
              {...rest}
              {...fieldProps}
              ref={mergeRefs(inputRef, ref)}
              type="time"
              className="or-control-frame__input or-time-field__input"
              value={value}
              min={min}
              max={max}
              step={step}
              readOnly={readOnly}
              disabled={disabled}
              onChange={(event) => {
                setValue(event.target.value)
                onChange?.(event.target.value, event)
              }}
            />
          </div>
        )}
      </FieldControl>
    </Field>
  )
})
