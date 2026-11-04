import {
  forwardRef,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import { useControllableState, useId, useIsomorphicLayoutEffect } from '../../hooks'
import { useLocale } from '../../providers'
import { clamp, cx, mergeRefs } from '../../utils'
import { useShake } from '../Combobox/motion'
import { Field, useFieldControlProps } from '../Field'
import { VisuallyHidden } from '../VisuallyHidden'
import './CurrencyField.css'

export type CurrencyFieldSize = 'sm' | 'md' | 'lg'

export interface CurrencyFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange' | 'size' | 'type' | 'min' | 'max' | 'step' | 'inputMode'
> {
  /** Valor numérico (controlado). `null` = vazio. */
  value?: number | null
  /** Valor inicial (não controlado). */
  defaultValue?: number | null
  /** Chamado com o número interpretado a cada digitação e com o valor final ao sair do campo. */
  onChange?: (value: number | null) => void
  /** Código ISO 4217 da moeda. Padrão: `'BRL'`. */
  currency?: string
  /** Locale da formatação. Padrão: o idioma do `OrangeProvider` (pt-BR). */
  locale?: string
  /** Como exibir a moeda: símbolo (`R$`), símbolo curto (`$`) ou código (`BRL`). */
  currencyDisplay?: 'symbol' | 'narrowSymbol' | 'code'
  /** Valor mínimo (aplicado ao sair do campo). Valores negativos só são aceitos se `min < 0`. */
  min?: number
  /** Valor máximo (aplicado ao sair do campo). */
  max?: number
  label?: ReactNode
  hideLabel?: boolean
  description?: ReactNode
  error?: ReactNode
  invalid?: boolean
  /** Altura do controle: `sm` 32px, `md` 40px, `lg` 48px. */
  size?: CurrencyFieldSize
  /** Classe aplicada ao contêiner externo. */
  className?: string
}

interface CurrencyFormat {
  symbol: string
  symbolAfter: boolean
  fractionDigits: number
  decimal: string
  group: string
  currencyName: string
  display: Intl.NumberFormat
}

function getCurrencyFormat(
  locale: string,
  currency: string,
  currencyDisplay: CurrencyFieldProps['currencyDisplay'],
): CurrencyFormat {
  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay,
  })
  const parts = currencyFormatter.formatToParts(1234.5)
  const symbolIndex = parts.findIndex((p) => p.type === 'currency')
  const integerIndex = parts.findIndex((p) => p.type === 'integer')
  const fractionDigits = currencyFormatter.resolvedOptions().maximumFractionDigits ?? 2
  let currencyName = currency
  try {
    currencyName = new Intl.DisplayNames(locale, { type: 'currency' }).of(currency) ?? currency
  } catch {
    // Intl.DisplayNames indisponível: usa o código ISO.
  }
  return {
    symbol: parts[symbolIndex]?.value ?? currency,
    symbolAfter: symbolIndex > integerIndex,
    fractionDigits,
    decimal: parts.find((p) => p.type === 'decimal')?.value ?? '.',
    group: parts.find((p) => p.type === 'group')?.value ?? ',',
    currencyName,
    display: new Intl.NumberFormat(locale, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }),
  }
}

/**
 * Interpreta o texto digitado. Aceita o separador decimal do locale e também
 * o "outro" (ponto ou vírgula): `1.234,5`, `1234,5`, `1234.5` e `1,5` viram
 * números; um único separador seguido de exatamente 3 dígitos é tratado como
 * milhar (`1.500` → 1500 em pt-BR).
 */
function parseAmount(text: string, decimal: string): number | null {
  let s = text.replace(/[\s\u00a0\u202f']/g, '')
  const negative = s.includes('-')
  s = s.replace(/-/g, '')
  if (!/[0-9]/.test(s)) return null
  const lastDot = s.lastIndexOf('.')
  const lastComma = s.lastIndexOf(',')
  let decimalIndex = -1
  if (lastDot >= 0 && lastComma >= 0) decimalIndex = Math.max(lastDot, lastComma)
  else if (lastDot >= 0 || lastComma >= 0) {
    const sep = lastDot >= 0 ? '.' : ','
    const index = s.lastIndexOf(sep)
    const occurrences = s.split(sep).length - 1
    const digitsAfter = s.length - index - 1
    if (sep === decimal || (occurrences === 1 && digitsAfter !== 3)) decimalIndex = index
  }
  const integer = (decimalIndex >= 0 ? s.slice(0, decimalIndex) : s).replace(/[.,]/g, '')
  const fraction = decimalIndex >= 0 ? s.slice(decimalIndex + 1).replace(/[.,]/g, '') : ''
  const n = Number(`${integer || '0'}.${fraction || '0'}`)
  if (!Number.isFinite(n)) return null
  return negative ? -n : n
}

const round = (n: number, digits: number) => {
  const f = 10 ** digits
  return Math.round(n * f) / f
}

/**
 * Campo de valor monetário: digitação natural (vírgula ou ponto), símbolo da
 * moeda no campo e formatação com `Intl.NumberFormat` ao sair. Entrega um
 * `number` (ou `null`) — nunca uma string formatada.
 */
export const CurrencyField = forwardRef<HTMLInputElement, CurrencyFieldProps>(
  function CurrencyField(
    { label, hideLabel, description, error, required, disabled, id, className, ...rest },
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
        className={cx('or-currency-field', className)}
      >
        <CurrencyFieldControl
          inputRef={ref}
          required={required}
          disabled={disabled}
          errorSignal={typeof error === 'string' ? error : Boolean(error)}
          {...rest}
        />
      </Field>
    )
  },
)

type ControlProps = Omit<
  CurrencyFieldProps,
  'label' | 'hideLabel' | 'description' | 'error' | 'className' | 'id'
> & {
  inputRef: React.Ref<HTMLInputElement>
  /** Muda quando a mensagem de erro surge/muda — dispara o tremor do campo. */
  errorSignal: string | boolean
}

function CurrencyFieldControl({
  inputRef,
  errorSignal,
  value: valueProp,
  defaultValue = null,
  onChange,
  currency = 'BRL',
  locale: localeProp,
  currencyDisplay = 'symbol',
  min,
  max,
  invalid,
  size = 'md',
  required,
  disabled,
  readOnly,
  name,
  placeholder,
  onFocus,
  onBlur,
  ...rest
}: ControlProps) {
  const { locale: providerLocale, t } = useLocale()
  const locale = localeProp ?? providerLocale
  const format = useMemo(
    () => getCurrencyFormat(locale, currency, currencyDisplay),
    [locale, currency, currencyDisplay],
  )
  const hintId = useId('or-currency-hint')
  const controlProps = useFieldControlProps({
    required,
    disabled,
    'aria-invalid': invalid || undefined,
    'aria-describedby': [rest['aria-describedby'], hintId].filter(Boolean).join(' '),
  })
  const isDisabled = Boolean(controlProps.disabled)
  const shake = useShake(errorSignal)
  const allowNegative = min !== undefined && min < 0

  const [value, setValue] = useControllableState<number | null>({ value: valueProp, defaultValue })
  const [focused, setFocused] = useState(false)
  const [text, setText] = useState('')
  const inputEl = useRef<HTMLInputElement>(null)
  const caret = useRef<number | null>(null)

  const formatted = value === null || Number.isNaN(value) ? '' : format.display.format(value)
  const display = focused ? text : formatted

  // Restaura a posição do cursor depois de descartar caracteres inválidos.
  useIsomorphicLayoutEffect(() => {
    if (caret.current === null || !inputEl.current) return
    inputEl.current.setSelectionRange(caret.current, caret.current)
    caret.current = null
  })

  const emit = (next: number | null) => {
    if (next === value) return
    setValue(next)
    onChange?.(next)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value
    const allowed = allowNegative ? /[^0-9.,\-\s\u00a0\u202f]/g : /[^0-9.,\s\u00a0\u202f]/g
    const position = event.target.selectionStart ?? raw.length
    const removedBefore = (raw.slice(0, position).match(allowed) ?? []).length
    let next = raw.replace(allowed, '')
    // Só um sinal de menos, sempre no início.
    if (allowNegative && next.includes('-')) next = `-${next.replace(/-/g, '')}`
    if (next !== raw) caret.current = Math.max(0, position - removedBefore)
    setText(next)
    const parsed = parseAmount(next, format.decimal)
    emit(parsed === null ? null : round(parsed, format.fractionDigits))
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(event)
    setFocused(false)
    const parsed = parseAmount(text, format.decimal)
    if (parsed === null) {
      emit(null)
      return
    }
    let next = round(parsed, format.fractionDigits)
    if (min !== undefined || max !== undefined)
      next = clamp(next, min ?? -Infinity, max ?? Infinity)
    if (!allowNegative && next < 0) next = Math.abs(next)
    emit(next)
  }

  const addon = (
    <span
      className={cx(
        'or-control-frame__addon',
        format.symbolAfter ? 'or-control-frame__addon--end' : 'or-control-frame__addon--start',
        'or-currency-field__symbol',
      )}
      aria-hidden="true"
    >
      {format.symbol}
    </span>
  )

  return (
    // O mousedown só amplia a área de clique do input (que já é focável por teclado).
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={cx('or-control-frame', `or-control-frame--${size}`, 'or-currency-field__frame')}
      data-invalid={controlProps['aria-invalid'] || undefined}
      {...shake}
      data-disabled={isDisabled || undefined}
      onMouseDown={(event) => {
        if (event.target !== inputEl.current) {
          event.preventDefault()
          inputEl.current?.focus()
        }
      }}
    >
      {!format.symbolAfter && addon}
      <input
        ref={mergeRefs(inputEl, inputRef)}
        type="text"
        inputMode={allowNegative ? 'text' : 'decimal'}
        autoComplete="off"
        className="or-control-frame__input or-currency-field__input"
        value={display}
        placeholder={placeholder ?? format.display.format(0)}
        readOnly={readOnly}
        onFocus={(event) => {
          onFocus?.(event)
          setText(formatted)
          setFocused(true)
        }}
        onChange={handleChange}
        onBlur={handleBlur}
        {...rest}
        {...controlProps}
      />
      {format.symbolAfter && addon}
      <VisuallyHidden id={hintId}>
        {t('currencyLabel', { currency: format.currencyName })}
      </VisuallyHidden>
      {name && <input type="hidden" name={name} value={value ?? ''} disabled={isDisabled} />}
    </div>
  )
}
