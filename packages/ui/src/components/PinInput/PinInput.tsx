import {
  forwardRef,
  Fragment,
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { useControllableState } from '../../hooks'
import { useLocale } from '../../providers'
import { cx } from '../../utils'
import { Field, useField } from '../Field'
import './PinInput.css'

export type PinInputSize = 'sm' | 'md' | 'lg'
export type PinInputType = 'numeric' | 'alphanumeric'

export interface PinInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Quantidade de caracteres. Padrão: 6. */
  length?: number
  /** Caracteres aceitos. `numeric` abre o teclado numérico no celular. */
  type?: PinInputType
  /** Código digitado (controlado). */
  value?: string
  /** Código inicial (não controlado). */
  defaultValue?: string
  /** Chamado a cada alteração. */
  onChange?: (value: string) => void
  /** Chamado quando todos os campos estão preenchidos. */
  onComplete?: (value: string) => void
  /** Oculta os caracteres (como em senhas). */
  mask?: boolean
  /** Agrupa visualmente os campos (ex.: 3 → "123 456"). */
  groupSize?: number
  /** Texto de exemplo em cada campo vazio (ex.: "○"). */
  placeholder?: string
  /** Rótulo do grupo. */
  label?: ReactNode
  hideLabel?: boolean
  description?: ReactNode
  error?: ReactNode
  /** Marca os campos como inválidos sem exibir mensagem. */
  invalid?: boolean
  required?: boolean
  disabled?: boolean
  /** Foca o primeiro campo ao montar. */
  autoFocus?: boolean
  /** Nome do campo oculto que envia o código completo no formulário. */
  name?: string
  /** Lado de cada campo: `sm` 32px, `md` 40px, `lg` 48px. */
  size?: PinInputSize
  /** Id do primeiro campo. */
  id?: string
}

const PATTERNS: Record<PinInputType, RegExp> = {
  numeric: /^[0-9]$/,
  alphanumeric: /^[a-zA-Z0-9]$/,
}

const toChars = (value: string, length: number) => Array.from({ length }, (_, i) => value[i] ?? '')

type ControlProps = Required<Pick<PinInputProps, 'length' | 'type' | 'size'>> &
  Pick<PinInputProps, 'value' | 'defaultValue' | 'onChange' | 'onComplete' | 'mask' | 'groupSize' | 'placeholder' | 'invalid' | 'autoFocus' | 'name'> & {
    hasLabel: boolean
    groupRef: React.Ref<HTMLDivElement>
    rest: HTMLAttributes<HTMLDivElement>
  }

function PinInputControl({
  length,
  type,
  size,
  value: valueProp,
  defaultValue = '',
  onChange,
  onComplete,
  mask = false,
  groupSize,
  placeholder = '',
  invalid,
  autoFocus,
  name,
  hasLabel,
  groupRef,
  rest,
}: ControlProps) {
  const { t } = useLocale()
  const field = useField()
  const pattern = PATTERNS[type]
  const inputs = useRef<(HTMLInputElement | null)[]>([])
  const [value, setValue] = useControllableState({ value: valueProp, defaultValue })
  // Guarda os caracteres por posição (permite lacunas enquanto o usuário edita).
  const [chars, setChars] = useState(() => toChars(value, length))
  useEffect(() => {
    if (value !== chars.join('')) setChars(toChars(value, length))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, length])

  useEffect(() => {
    if (autoFocus) inputs.current[0]?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isInvalid = invalid || Boolean(field?.invalid)
  const disabled = Boolean(field?.disabled)
  const required = Boolean(field?.required)
  const describedBy = [field?.descriptionId, field?.errorId].filter(Boolean).join(' ') || undefined
  const baseId = field?.controlId

  const focusAt = (index: number) => {
    const el = inputs.current[clampIndex(index)]
    el?.focus()
    el?.select()
  }
  const clampIndex = (index: number) => Math.max(0, Math.min(length - 1, index))

  const commit = (next: string[]) => {
    setChars(next)
    const joined = next.join('')
    setValue(joined)
    onChange?.(joined)
    if (next.every(Boolean)) onComplete?.(joined)
  }

  /** Distribui vários caracteres a partir de `start` (colar ou preenchimento automático do SMS). */
  const fill = (text: string, start: number) => {
    const valid = Array.from(text).filter((c) => pattern.test(c))
    if (valid.length === 0) return
    const from = valid.length >= length ? 0 : start
    const next = [...chars]
    valid.slice(0, length - from).forEach((c, i) => {
      next[from + i] = c
    })
    commit(next)
    focusAt(Math.min(from + valid.length, length - 1))
  }

  const handleInput = (index: number, raw: string) => {
    const previous = chars[index]
    if (raw.length > 1) {
      // Campo já preenchido + nova tecla: usa o caractere novo.
      if (raw.length === 2 && previous && raw.includes(previous)) {
        const typed = raw[0] === previous ? raw[1] : raw[0]
        if (!pattern.test(typed)) return
        const next = [...chars]
        next[index] = typed
        commit(next)
        if (index < length - 1) focusAt(index + 1)
        return
      }
      fill(raw, index)
      return
    }
    if (raw === '') {
      const next = [...chars]
      next[index] = ''
      commit(next)
      return
    }
    if (!pattern.test(raw)) return
    const next = [...chars]
    next[index] = raw
    commit(next)
    if (index < length - 1) focusAt(index + 1)
  }

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Backspace': {
        event.preventDefault()
        const next = [...chars]
        if (next[index]) {
          next[index] = ''
          commit(next)
        } else if (index > 0) {
          next[index - 1] = ''
          commit(next)
          focusAt(index - 1)
        }
        break
      }
      case 'Delete': {
        event.preventDefault()
        if (chars[index]) {
          const next = [...chars]
          next[index] = ''
          commit(next)
        }
        break
      }
      case 'ArrowLeft':
        event.preventDefault()
        focusAt(index - 1)
        break
      case 'ArrowRight':
        event.preventDefault()
        focusAt(index + 1)
        break
      case 'Home':
        event.preventDefault()
        focusAt(0)
        break
      case 'End':
        event.preventDefault()
        focusAt(length - 1)
        break
      default:
        // Mesma tecla do caractere atual: apenas avança (o onChange não dispara).
        if (event.key.length === 1 && event.key === chars[index] && !event.ctrlKey && !event.metaKey) {
          event.preventDefault()
          if (index < length - 1) focusAt(index + 1)
        }
    }
  }

  const handlePaste = (index: number, event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    fill(event.clipboardData.getData('text').trim(), index)
  }

  const labelledBy = hasLabel && field ? field.labelId : undefined
  const { 'aria-label': ariaLabel, ...groupRest } = rest

  return (
    <div
      ref={groupRef}
      role="group"
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : ariaLabel}
      aria-describedby={describedBy}
      className={cx('or-pin-input', `or-pin-input--${size}`)}
      data-invalid={isInvalid || undefined}
      data-disabled={disabled || undefined}
      {...groupRest}
    >
      {chars.map((char, index) => (
        <Fragment key={index}>
          {groupSize && index > 0 && index % groupSize === 0 && <span className="or-pin-input__separator" aria-hidden="true" />}
          <input
            ref={(el) => {
              inputs.current[index] = el
            }}
            id={index === 0 ? baseId : baseId ? `${baseId}-${index}` : undefined}
            type={mask ? 'password' : 'text'}
            inputMode={type === 'numeric' ? 'numeric' : 'text'}
            pattern={type === 'numeric' ? '[0-9]*' : undefined}
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            autoCapitalize={type === 'alphanumeric' ? 'characters' : 'off'}
            autoCorrect="off"
            spellCheck={false}
            className="or-pin-input__field"
            value={char}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            aria-invalid={isInvalid || undefined}
            aria-label={t(type === 'numeric' ? 'pinDigit' : 'pinCharacter', { index: index + 1, total: length })}
            data-filled={char ? '' : undefined}
            onChange={(event) => handleInput(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={(event) => handlePaste(index, event)}
            onFocus={(event) => event.target.select()}
          />
        </Fragment>
      ))}
      {name && <input type="hidden" name={name} value={value} disabled={disabled} />}
    </div>
  )
}

/**
 * Campos de um caractere para códigos de verificação (OTP/PIN): avança
 * sozinho, aceita colar o código inteiro e o preenchimento automático do SMS.
 */
export const PinInput = forwardRef<HTMLDivElement, PinInputProps>(function PinInput(
  {
    length = 6,
    type = 'numeric',
    size = 'md',
    value,
    defaultValue,
    onChange,
    onComplete,
    mask,
    groupSize,
    placeholder,
    label,
    hideLabel,
    description,
    error,
    invalid,
    required,
    disabled,
    autoFocus,
    name,
    id,
    className,
    ...rest
  },
  ref,
) {
  return (
    <Field
      label={label}
      hideLabel={hideLabel}
      description={description}
      error={error}
      required={required}
      disabled={disabled}
      controlId={id}
      className={cx('or-pin-input-field', className)}
    >
      <PinInputControl
        length={length}
        type={type}
        size={size}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onComplete={onComplete}
        mask={mask}
        groupSize={groupSize}
        placeholder={placeholder}
        invalid={invalid}
        autoFocus={autoFocus}
        name={name}
        hasLabel={Boolean(label)}
        groupRef={ref}
        rest={rest}
      />
    </Field>
  )
})
