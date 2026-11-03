import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { flushSync } from 'react-dom'
import { useControllableState, useId } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { clamp, cx, mergeRefs } from '../../utils'
import { Field } from '../Field'
import { InputControl } from '../TextField/InputControl'
import type { TextFieldBaseProps } from '../TextField/TextField'
import './NumberField.css'

export interface NumberFieldProps
  extends Omit<TextFieldBaseProps, 'onValueChange'>,
    Omit<
      InputHTMLAttributes<HTMLInputElement>,
      'size' | 'prefix' | 'type' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step'
    > {
  /** Valor (controlado). `null` representa o campo vazio. */
  value?: number | null
  /** Valor inicial (não controlado). */
  defaultValue?: number | null
  /** Chamado com o novo valor numérico (ou `null` quando vazio). */
  onChange?: (value: number | null) => void
  /** Valor mínimo. `Home` leva até ele. */
  min?: number
  /** Valor máximo. `End` leva até ele. */
  max?: number
  /** Incremento das setas e dos botões. Padrão: 1. */
  step?: number
  /** Incremento de `PageUp`/`PageDown`. Padrão: `step × 10`. */
  largeStep?: number
  /**
   * Opções de `Intl.NumberFormat` (moeda, porcentagem, unidade, casas
   * decimais). O idioma vem do `OrangeProvider`.
   */
  formatOptions?: Intl.NumberFormatOptions
  /** Ícone decorativo no início do campo. */
  startIcon?: ReactNode
  /** Texto fixo antes do valor (ex.: `R$`). */
  prefix?: ReactNode
  /** Texto fixo depois do valor (ex.: `kg`, `un.`). */
  suffix?: ReactNode
  /** Oculta os botões − / +. O teclado continua funcionando. */
  hideStepper?: boolean
}

function decimalsOf(value: number): number {
  if (!Number.isFinite(value)) return 0
  const text = String(value)
  const exp = text.match(/e-(\d+)$/)
  if (exp) return Number(exp[1])
  const dot = text.indexOf('.')
  return dot === -1 ? 0 : text.length - dot - 1
}

function roundTo(value: number, digits: number): number {
  return Number(value.toFixed(Math.min(Math.max(digits, 0), 20)))
}

/** Cria um leitor de números que entende separadores do idioma, moeda e %. */
function createParser(locale: string, percent: boolean) {
  let group = ','
  let decimal = '.'
  try {
    const parts = new Intl.NumberFormat(locale, { useGrouping: true }).formatToParts(-12345.6)
    group = parts.find((p) => p.type === 'group')?.value ?? group
    decimal = parts.find((p) => p.type === 'decimal')?.value ?? decimal
  } catch {
    /* locale inválido: usa o padrão en */
  }
  return (text: string): number | null => {
    let s = text.replace(/[\s\u00a0\u202f]/g, '').replace(/[\u2212\u2012\u2013]/g, '-')
    if (s === '') return null
    const isSpaceGroup = /\s/.test(group) || group === '\u00a0' || group === '\u202f'
    if (!isSpaceGroup && !s.includes(decimal)) {
      // "1.5" em pt-BR: um único separador de milhar sem 3 dígitos depois → decimal.
      const pieces = s.split(group)
      if (pieces.length === 2 && pieces[1].replace(/\D/g, '').length !== 3) s = pieces.join(decimal)
    }
    if (!isSpaceGroup) s = s.split(group).join('')
    s = s.split(decimal).join('.')
    s = s.replace(/[^\d.-]/g, '')
    if (!/^-?\d*\.?\d*$/.test(s) || !/\d/.test(s)) return Number.NaN
    const n = Number.parseFloat(s)
    return percent ? n / 100 : n
  }
}

/**
 * Campo numérico no padrão spinbutton do WAI-ARIA: setas, PageUp/PageDown,
 * Home/End e botões − / +. Aceita formatação por `Intl.NumberFormat`
 * (moeda, porcentagem, unidades) e trabalha com `number | null`.
 */
export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(function NumberField(
  {
    label,
    hideLabel,
    description,
    error,
    invalid,
    required,
    optional,
    labelAside,
    disabled,
    readOnly,
    id,
    className,
    style,
    size = 'md',
    value: valueProp,
    defaultValue = null,
    onChange,
    min,
    max,
    step = 1,
    largeStep,
    formatOptions,
    startIcon,
    prefix,
    suffix,
    hideStepper = false,
    name,
    form,
    inputMode,
    onKeyDown,
    onBlur,
    ...rest
  },
  ref,
) {
  const { locale, t } = useLocale()
  const inputId = useId('or-number-field', id)
  const innerRef = useRef<HTMLInputElement>(null)
  const mergedRef = useMemo(() => mergeRefs(ref, innerRef), [ref])
  const [value, setValue] = useControllableState<number | null>({ value: valueProp, defaultValue, onChange })
  const [editingText, setEditingText] = useState<string | null>(null)
  const editingRef = useRef<string | null>(null)
  editingRef.current = editingText

  const optionsKey = JSON.stringify(formatOptions ?? null)
  const { formatter, parse, maxFractionDigits } = useMemo(() => {
    const options: Intl.NumberFormatOptions = formatOptions ?? { maximumFractionDigits: Math.max(3, decimalsOf(step)) }
    let nf: Intl.NumberFormat
    try {
      nf = new Intl.NumberFormat(locale, options)
    } catch {
      nf = new Intl.NumberFormat(undefined, options)
    }
    const percent = options.style === 'percent'
    const resolved = nf.resolvedOptions()
    return {
      formatter: nf,
      parse: createParser(locale, percent),
      maxFractionDigits: (resolved.maximumFractionDigits ?? 3) + (percent ? 2 : 0),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, optionsKey, step])

  const format = (n: number | null) => (n === null || Number.isNaN(n) ? '' : formatter.format(n))
  const lower = min ?? Number.NEGATIVE_INFINITY
  const upper = max ?? Number.POSITIVE_INFINITY
  const big = largeStep ?? step * 10
  const interactive = !disabled && !readOnly

  /** Lê o texto digitado (se houver) ou o valor atual. */
  const resolveCurrent = (prev: number | null): number | null => {
    const typed = editingRef.current
    if (typed === null) return prev
    const parsed = parse(typed)
    return parsed === null || Number.isNaN(parsed) ? prev : parsed
  }

  const stepBy = (delta: number) => {
    setValue((prev) => {
      const current = resolveCurrent(prev)
      if (current === null) return clamp(0, lower, upper)
      const precision = Math.max(decimalsOf(step), decimalsOf(current), decimalsOf(delta))
      return clamp(roundTo(current + delta, precision), lower, upper)
    })
    editingRef.current = null
    setEditingText(null)
  }

  const setTo = (next: number) => {
    setValue(next)
    editingRef.current = null
    setEditingText(null)
  }

  const commit = () => {
    const typed = editingRef.current
    if (typed === null) return
    const parsed = parse(typed)
    editingRef.current = null
    setEditingText(null)
    if (parsed === null) {
      setValue(null)
      return
    }
    if (Number.isNaN(parsed)) return // texto inválido: volta ao último valor
    setValue(clamp(roundTo(parsed, maxFractionDigits), lower, upper))
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || !interactive || event.altKey || event.metaKey || event.ctrlKey) return
    switch (event.key) {
      case 'ArrowUp':
        stepBy(step)
        break
      case 'ArrowDown':
        stepBy(-step)
        break
      case 'PageUp':
        stepBy(big)
        break
      case 'PageDown':
        stepBy(-big)
        break
      case 'Home':
        if (min === undefined) return
        setTo(min)
        break
      case 'End':
        if (max === undefined) return
        setTo(max)
        break
      case 'Enter':
        // Confirma antes do envio implícito do formulário.
        flushSync(commit)
        return
      default:
        return
    }
    event.preventDefault()
  }

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    commit()
    onBlur?.(event)
  }

  // Botões −/+: clique simples ou pressionar e segurar para repetir.
  const repeatTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const pointerStepped = useRef(false)
  const stopRepeat = () => clearTimeout(repeatTimer.current)
  useEffect(() => stopRepeat, [])

  const stepperProps = (delta: number, enabled: boolean) => ({
    type: 'button' as const,
    tabIndex: -1,
    disabled: !enabled,
    'aria-controls': inputId,
    className: 'or-control-frame__button or-number-field__step',
    onMouseDown: (event: { preventDefault: () => void }) => event.preventDefault(),
    onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0) return
      event.preventDefault()
      pointerStepped.current = true
      if (event.pointerType === 'mouse') innerRef.current?.focus({ preventScroll: true })
      stepBy(delta)
      stopRepeat()
      const tick = (delay: number) => {
        repeatTimer.current = setTimeout(() => {
          stepBy(delta)
          tick(60)
        }, delay)
      }
      tick(400)
      window.addEventListener('pointerup', stopRepeat, { once: true })
      window.addEventListener('pointercancel', stopRepeat, { once: true })
    },
    onPointerUp: stopRepeat,
    onPointerLeave: stopRepeat,
    onClick: () => {
      // Cliques sem pointerdown (leitores de tela, testes) também contam.
      if (pointerStepped.current) {
        pointerStepped.current = false
        return
      }
      stepBy(delta)
    },
  })

  const canDecrement = interactive && (value === null || value > lower)
  const canIncrement = interactive && (value === null || value < upper)
  const allowsNegative = min === undefined || min < 0
  const allowsFraction = decimalsOf(step) > 0 || maxFractionDigits > 0
  const display = editingText ?? format(value)

  return (
    <Field
      label={label}
      hideLabel={hideLabel}
      description={description}
      error={error}
      required={required}
      optional={optional}
      disabled={disabled}
      controlId={inputId}
      labelAside={labelAside}
      className={cx('or-number-field', className)}
      style={style}
    >
      <InputControl
        ref={mergedRef}
        type="text"
        role="spinbutton"
        size={size}
        invalid={invalid}
        readOnly={readOnly}
        startIcon={startIcon}
        prefix={prefix}
        suffix={suffix}
        frameClassName="or-number-field__frame"
        inputMode={inputMode ?? (allowsNegative ? 'text' : allowsFraction ? 'decimal' : 'numeric')}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        value={display}
        aria-valuenow={value ?? undefined}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuetext={value === null ? undefined : format(value)}
        form={form}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          editingRef.current = event.target.value
          setEditingText(event.target.value)
        }}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        trailing={
          hideStepper ? null : (
            <>
              <button {...stepperProps(-step, canDecrement)} aria-label={t('decrement')}>
                <Icon name="minus" />
              </button>
              <button {...stepperProps(step, canIncrement)} aria-label={t('increment')}>
                <Icon name="plus" />
              </button>
            </>
          )
        }
        after={name ? <input type="hidden" name={name} form={form} value={value ?? ''} /> : null}
        {...rest}
      />
    </Field>
  )
})
