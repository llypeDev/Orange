import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FocusEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { useControllableState, useId } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx } from '../../utils'
import {
  Field,
  useField,
  useFieldControlProps,
  type FieldContextValue,
  type FieldControlProps,
} from '../Field'
import './ColorField.css'

export interface ColorSwatch {
  /** Cor em hexadecimal (`#rrggbb` ou `#rgb`). */
  value: string
  /** Nome acessível da cor ("Laranja Orange"). Padrão: o próprio hexadecimal. */
  label?: string
}

export type ColorFieldSize = 'sm' | 'md' | 'lg'

export interface ColorFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange' | 'size' | 'type'
> {
  /** Cor no formato `#rrggbb` (controlado). `''` = sem cor. */
  value?: string
  /** Cor inicial (não controlado). */
  defaultValue?: string
  /** Chamado com a cor normalizada (`#rrggbb`, minúsculas) sempre que ela for válida. */
  onChange?: (value: string) => void
  /** Cores sugeridas, exibidas como grupo de opções (radiogroup). */
  swatches?: (string | ColorSwatch)[]
  /** Rótulo visível do campo. */
  label?: ReactNode
  /** Oculta o rótulo visualmente (continua acessível). */
  hideLabel?: boolean
  /** Texto de ajuda abaixo do rótulo. */
  description?: ReactNode
  /** Mensagem de erro. Substitui a validação interna de formato. */
  error?: ReactNode
  /** Mostra "(opcional)" ao lado do rótulo. */
  optional?: boolean
  /** Altura do campo: `sm` 32px, `md` 40px, `lg` 48px. */
  size?: ColorFieldSize
}

/** Normaliza `#RGB`, `RGB`, `#RRGGBB` ou `RRGGBB` para `#rrggbb`. Retorna `null` se inválido. */
function normalizeHex(input: string): string | null {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(input.trim())
  if (!match) return null
  const hex = match[1].length === 3 ? [...match[1]].map((c) => c + c).join('') : match[1]
  return `#${hex.toLowerCase()}`
}

/** Luminância relativa (WCAG) para escolher a cor do ícone sobre a amostra. */
function isLightColor(hex: string): boolean {
  const channel = (i: number) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5) > 0.4
}

function FieldSlot({
  id,
  children,
}: {
  id?: string
  children: (field: FieldContextValue | null, controlProps: FieldControlProps) => ReactNode
}) {
  return <>{children(useField(), useFieldControlProps({ id }))}</>
}

/**
 * Campo de cor: seletor nativo (`<input type="color">`) sincronizado com um
 * campo hexadecimal validado e, opcionalmente, uma paleta de cores sugeridas.
 */
export const ColorField = forwardRef<HTMLInputElement, ColorFieldProps>(function ColorField(
  {
    value: valueProp,
    defaultValue = '',
    onChange,
    swatches,
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
    placeholder = '#rrggbb',
    onBlur,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const baseId = useId('or-color-field')
  const pickerTextId = `${baseId}-picker`
  const swatchesTextId = `${baseId}-swatches`
  const swatchesRef = useRef<HTMLDivElement>(null)

  const [value, setValue] = useControllableState({
    value: valueProp === undefined ? undefined : (normalizeHex(valueProp) ?? valueProp),
    defaultValue: normalizeHex(defaultValue) ?? '',
    onChange,
  })
  const [text, setText] = useState(value)
  const [formatError, setFormatError] = useState(false)

  // Valor alterado por fora → atualiza o texto (sem atropelar o que já é igual).
  useEffect(() => {
    setText((current) => (normalizeHex(current) === value ? current : value))
    if (value) setFormatError(false)
  }, [value])

  const options = (swatches ?? []).map((swatch) =>
    typeof swatch === 'string'
      ? { value: normalizeHex(swatch) ?? swatch, label: swatch }
      : {
          ...swatch,
          value: normalizeHex(swatch.value) ?? swatch.value,
          label: swatch.label ?? swatch.value,
        },
  )
  const checkedIndex = options.findIndex((option) => option.value === value)

  // Cor escolhida na paleta nesta sessão: a amostra ganha o "pop".
  const [popped, setPopped] = useState<string | null>(null)

  const commit = (next: string) => {
    setFormatError(false)
    setText(next)
    setValue(next)
  }

  const commitSwatch = (next: string) => {
    setPopped(next)
    commit(next)
  }

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value
    setText(raw)
    if (raw.trim() === '') {
      setFormatError(false)
      setValue('')
      return
    }
    const normalized = normalizeHex(raw)
    if (normalized) {
      setFormatError(false)
      setValue(normalized)
    }
  }

  const handleTextBlur = (event: FocusEvent<HTMLInputElement>) => {
    onBlur?.(event)
    if (text.trim() === '') return
    const normalized = normalizeHex(text)
    if (normalized) setText(normalized)
    else setFormatError(true)
  }

  const swatchesDisabled = disabled || readOnly
  const handleSwatchKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = options.length - 1
    let next = -1
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown')
      next = index === last ? 0 : index + 1
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
      next = index === 0 ? last : index - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    else return
    event.preventDefault()
    if (swatchesDisabled) return
    commitSwatch(options[next].value)
    swatchesRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next]?.focus()
  }

  const errorMessage = error ?? (formatError ? t('invalidColor') : undefined)
  const invalid = !!errorMessage

  return (
    <Field
      label={label}
      hideLabel={hideLabel}
      description={description}
      error={errorMessage}
      required={required}
      optional={optional}
      disabled={disabled}
      controlId={id}
      className={cx('or-color-field', className)}
      style={style}
    >
      <FieldSlot id={id}>
        {(field, controlProps) => (
          <>
            <div
              className={cx(
                'or-control-frame',
                `or-control-frame--${size}`,
                'or-color-field__frame',
              )}
              data-invalid={invalid || undefined}
              data-disabled={disabled || undefined}
            >
              <span
                className="or-color-field__picker"
                data-empty={!value || undefined}
                data-disabled={disabled || readOnly || undefined}
              >
                <input
                  type="color"
                  className="or-color-field__native"
                  value={value || '#000000'}
                  disabled={disabled || readOnly}
                  aria-labelledby={[field?.labelId, pickerTextId].filter(Boolean).join(' ')}
                  onChange={(event) => commit(event.target.value.toLowerCase())}
                />
                {/* Camada sobre a amostra nativa: faz o crossfade entre as cores. */}
                <span
                  className="or-color-field__preview"
                  style={value ? { backgroundColor: value } : undefined}
                  aria-hidden="true"
                />
              </span>
              <span id={pickerTextId} hidden>
                {t('colorPicker')}
              </span>
              <input
                {...rest}
                {...controlProps}
                ref={ref}
                type="text"
                className="or-control-frame__input or-color-field__input"
                value={text}
                placeholder={placeholder}
                maxLength={7}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                readOnly={readOnly}
                disabled={disabled}
                aria-invalid={invalid || undefined}
                onChange={handleTextChange}
                onBlur={handleTextBlur}
              />
            </div>
            {options.length > 0 && (
              <div
                ref={swatchesRef}
                role="radiogroup"
                aria-labelledby={[field?.labelId, swatchesTextId].filter(Boolean).join(' ')}
                aria-disabled={swatchesDisabled || undefined}
                className="or-color-field__swatches"
              >
                <span id={swatchesTextId} hidden>
                  {t('suggestedColors')}
                </span>
                {options.map((option, index) => {
                  const checked = index === checkedIndex
                  const focusable = checkedIndex === -1 ? index === 0 : checked
                  const valid = /^#[0-9a-f]{6}$/.test(option.value)
                  return (
                    <button
                      key={`${option.value}-${index}`}
                      type="button"
                      role="radio"
                      aria-checked={checked}
                      aria-label={option.label}
                      tabIndex={focusable ? 0 : -1}
                      disabled={disabled}
                      aria-disabled={readOnly || undefined}
                      className={cx(
                        'or-color-field__swatch',
                        checked && popped === option.value && 'or-color-field__swatch--pop',
                      )}
                      style={{ '--_swatch': option.value } as CSSProperties}
                      data-tone={valid && isLightColor(option.value) ? 'light' : 'dark'}
                      onClick={() => {
                        if (!swatchesDisabled) commitSwatch(option.value)
                      }}
                      onKeyDown={(event) => handleSwatchKeyDown(event, index)}
                    >
                      <span
                        className="or-color-field__chip"
                        style={{ backgroundColor: option.value }}
                        aria-hidden="true"
                      >
                        {checked && <Icon name="check" size="sm" strokeWidth={2.5} />}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </>
        )}
      </FieldSlot>
    </Field>
  )
})
