import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react-dom'
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
  type ReactNode,
} from 'react'
import {
  useClickOutside,
  useControllableState,
  useDisclosure,
  useEventListener,
  useId,
  useIsomorphicLayoutEffect,
  usePresence,
} from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx, getFocusableElements, mergeRefs } from '../../utils'
import { Field, useFieldControlProps, type FieldControlProps } from '../Field'
import { Portal } from '../Portal'
import { Calendar, type CalendarWeekDay } from './Calendar'
import {
  formatDateInput,
  getDateFormatPattern,
  isOutOfRange,
  maskDateInput,
  parseDateInput,
  startOfDay,
  toISODate,
} from './dateUtils'
import './DatePicker.css'

export type DatePickerSize = 'sm' | 'md' | 'lg'

export interface DatePickerProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange' | 'size' | 'min' | 'max' | 'type'
> {
  /** Data selecionada (controlado). `null` = vazio. */
  value?: Date | null
  /** Data inicial (não controlado). */
  defaultValue?: Date | null
  /**
   * Chamado com a nova data — ou `null` quando o campo fica vazio ou o texto
   * digitado não forma uma data válida/disponível.
   */
  onChange?: (date: Date | null) => void
  /** Primeira data permitida. */
  min?: Date
  /** Última data permitida. */
  max?: Date
  /** Desabilita datas específicas (feriados, fins de semana…). */
  isDateDisabled?: (date: Date) => boolean
  /** Primeiro dia da semana no calendário: 0 = domingo (padrão), 1 = segunda… */
  weekStartsOn?: CalendarWeekDay
  /** Rótulo visível do campo. */
  label?: ReactNode
  /** Oculta o rótulo visualmente (continua acessível). */
  hideLabel?: boolean
  /** Texto de ajuda abaixo do rótulo. */
  description?: ReactNode
  /** Mensagem de erro. Substitui a validação interna de formato. */
  error?: ReactNode
  /** Força o estado inválido sem exibir mensagem (ex.: erro mostrado em um ErrorSummary). */
  invalid?: boolean
  /** Mostra "(opcional)" ao lado do rótulo. */
  optional?: boolean
  /** Altura do campo: `sm` 32px, `md` 40px, `lg` 48px. */
  size?: DatePickerSize
  /** Calendário aberto (controlado). */
  open?: boolean
  /** Calendário aberto inicialmente (não controlado). */
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

/** Renderiza os filhos com os atributos ARIA do `Field` que os envolve. */
function FieldControl({
  id,
  children,
}: {
  id?: string
  children: (props: FieldControlProps) => ReactNode
}) {
  return <>{children(useFieldControlProps({ id }))}</>
}

type InternalError = 'invalid' | 'unavailable' | null

/**
 * Campo de data com máscara conforme o idioma (dd/mm/aaaa em pt-BR,
 * mm/dd/yyyy em en-US) e um calendário em diálogo, seguindo o padrão
 * "Date Picker Dialog" do WAI-ARIA.
 */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker(
  {
    value: valueProp,
    defaultValue = null,
    onChange,
    min,
    max,
    isDateDisabled,
    weekStartsOn = 0,
    label,
    hideLabel,
    description,
    error,
    invalid: invalidProp = false,
    required,
    optional,
    disabled,
    readOnly,
    size = 'md',
    open: openProp,
    defaultOpen,
    onOpenChange,
    id,
    name,
    placeholder,
    className,
    style,
    onBlur,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const { t, locale } = useLocale()
  const pattern = useMemo(() => getDateFormatPattern(locale), [locale])
  const formatHint = useMemo(() => {
    const letters = {
      day: t('dayPlaceholder'),
      month: t('monthPlaceholder'),
      year: t('yearPlaceholder'),
    }
    return pattern.order.map((segment) => letters[segment]).join(pattern.separator)
  }, [pattern, t])
  const longFormatter = useMemo(() => {
    try {
      return new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    } catch {
      return new Intl.DateTimeFormat('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    }
  }, [locale])

  const baseId = useId('or-date-picker')
  const hintId = `${baseId}-hint`
  const dialogId = `${baseId}-dialog`
  const headingId = `${baseId}-heading`

  const [value, setValue] = useControllableState<Date | null>({
    value: valueProp,
    defaultValue,
    onChange,
  })
  const { isOpen, setOpen, close } = useDisclosure({ open: openProp, defaultOpen, onOpenChange })
  const [text, setText] = useState(() => (value ? formatDateInput(value, pattern) : ''))
  const [internalError, setInternalError] = useState<InternalError>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const caretRef = useRef<number | null>(null)
  const emittedRef = useRef<number | null | undefined>(undefined)

  // Saída animada: o diálogo continua montado (data-state="closed") até a animação acabar.
  const presence = usePresence<HTMLDivElement>(isOpen)
  const { refs, floatingStyles, placement } = useFloating({
    open: presence.present,
    placement: 'bottom-start',
    // top/left em vez de transform: o transform fica livre para a animação.
    transform: false,
    middleware: [offset(4), flip({ padding: 8 }), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  })
  const side = placement.split('-')[0]

  const isUnavailable = (date: Date) => isOutOfRange(date, min, max) || !!isDateDisabled?.(date)

  const emit = (date: Date | null) => {
    emittedRef.current = date ? startOfDay(date).getTime() : null
    setValue(date)
  }

  // Valor alterado por fora (controlado) ou troca de idioma → reescreve o texto.
  const valueKey = value ? startOfDay(value).getTime() : null
  useEffect(() => {
    if (emittedRef.current !== undefined && emittedRef.current === valueKey) {
      emittedRef.current = undefined
      return
    }
    emittedRef.current = undefined
    setText(valueKey === null ? '' : formatDateInput(new Date(valueKey), pattern))
    setInternalError(null)
  }, [valueKey, pattern])

  // Mantém o cursor no lugar depois de aplicar a máscara.
  useIsomorphicLayoutEffect(() => {
    const input = inputRef.current
    if (caretRef.current === null || !input || document.activeElement !== input) return
    input.setSelectionRange(caretRef.current, caretRef.current)
    caretRef.current = null
  })

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value
    const iso = /^\s*(\d{4})-(\d{2})-(\d{2})\s*$/.exec(raw)
    const masked = iso
      ? formatDateInput(new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])), pattern)
      : maskDateInput(raw, pattern)

    const caret = event.target.selectionStart ?? raw.length
    const digitsBefore = raw.slice(0, caret).replace(/\D/g, '').length
    let position = 0
    for (let count = 0; position < masked.length && count < digitsBefore; position++) {
      if (/\d/.test(masked[position])) count++
    }
    // Digitando no fim (caso comum) o cursor acompanha o fim do texto mascarado.
    caretRef.current = iso || caret >= raw.length ? masked.length : position

    setText(masked)
    const digits = masked.replace(/\D/g, '').length
    if (digits === 0) {
      setInternalError(null)
      emit(null)
      return
    }
    if (digits < 8) {
      setInternalError(null)
      emit(null)
      return
    }
    const parsed = parseDateInput(masked, pattern)
    if (!parsed) {
      setInternalError('invalid')
      emit(null)
    } else if (isUnavailable(parsed)) {
      setInternalError('unavailable')
      emit(null)
    } else {
      setInternalError(null)
      emit(parsed)
    }
  }

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    onBlur?.(event)
    const digits = text.replace(/\D/g, '').length
    if (digits > 0 && digits < 8) setInternalError('invalid')
  }

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    if (event.altKey && event.key === 'ArrowDown' && !disabled && !readOnly) {
      event.preventDefault()
      setOpen(true)
    }
  }

  const closeAndFocusButton = () => {
    close()
    buttonRef.current?.focus({ preventScroll: true })
  }

  const handleSelect = (date: Date) => {
    setInternalError(null)
    setText(formatDateInput(date, pattern))
    emit(date)
    closeAndFocusButton()
  }

  useClickOutside([frameRef, dialogRef], () => close(), isOpen)

  // Fecha o calendário se o campo for desabilitado enquanto aberto.
  useEffect(() => {
    if ((disabled || readOnly) && isOpen) close()
  }, [disabled, readOnly, isOpen, close])

  // Listener nativo no diálogo: Escape para aqui (não fecha um Modal por trás).
  const [dialogElement, setDialogElement] = useState<HTMLDivElement | null>(null)
  const frameRefCallback = useMemo(
    () => mergeRefs(frameRef, refs.setReference),
    [refs.setReference],
  )
  const presenceRef = presence.nodeRef
  const dialogRefCallback = useMemo(
    () => mergeRefs<HTMLDivElement>(dialogRef, presenceRef, refs.setFloating, setDialogElement),
    [refs.setFloating, presenceRef],
  )

  // Reaberto durante a animação de saída: o Calendar não remonta, então
  // o foco volta ao dia ativo aqui.
  useEffect(() => {
    if (!isOpen) return
    const cell = dialogRef.current?.querySelector<HTMLElement>('[role="gridcell"][tabindex="0"]')
    if (cell && !dialogRef.current?.contains(document.activeElement))
      cell.focus({ preventScroll: true })
  }, [isOpen])
  useEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        closeAndFocusButton()
        return
      }
      if (event.key !== 'Tab') return
      // Prende o foco dentro do diálogo modal.
      const focusables = getFocusableElements(dialogRef.current)
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    },
    dialogElement,
  )

  const errorMessage =
    error ??
    (internalError === 'invalid'
      ? t('invalidDate', { format: formatHint })
      : internalError === 'unavailable'
        ? t('dateUnavailable')
        : undefined)

  const buttonLabel = value
    ? t('changeDate', { date: longFormatter.format(value) })
    : t('chooseDate')
  const invalid = !!errorMessage || invalidProp

  return (
    <Field
      label={label}
      hideLabel={hideLabel}
      description={description}
      error={errorMessage}
      invalid={invalidProp}
      required={required}
      optional={optional}
      disabled={disabled}
      controlId={id}
      className={cx('or-date-picker', className)}
      style={style}
    >
      <FieldControl id={id}>
        {(fieldProps) => (
          <div
            ref={frameRefCallback}
            className={cx('or-control-frame', `or-control-frame--${size}`, 'or-date-picker__frame')}
            data-invalid={invalid || undefined}
            aria-disabled={disabled || undefined}
            data-disabled={disabled || undefined}
          >
            <input
              {...rest}
              {...fieldProps}
              ref={mergeRefs(inputRef, ref)}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              className="or-control-frame__input or-date-picker__input"
              placeholder={placeholder ?? formatHint}
              value={text}
              maxLength={10}
              readOnly={readOnly}
              disabled={disabled}
              aria-describedby={[fieldProps['aria-describedby'], hintId].filter(Boolean).join(' ')}
              aria-invalid={invalid || undefined}
              onChange={handleTextChange}
              onBlur={handleBlur}
              onKeyDown={handleInputKeyDown}
            />
            <span id={hintId} className="or-visually-hidden">
              {t('dateFormatHint', { format: formatHint })}
            </span>
            <button
              ref={buttonRef}
              type="button"
              className="or-control-frame__button or-date-picker__button"
              aria-label={buttonLabel}
              aria-haspopup="dialog"
              aria-expanded={isOpen}
              aria-controls={isOpen ? dialogId : undefined}
              disabled={disabled || readOnly}
              onClick={() => setOpen(!isOpen)}
            >
              <Icon name="calendar" size="sm" />
            </button>
          </div>
        )}
      </FieldControl>
      {name && (
        <input
          type="hidden"
          name={name}
          value={value ? toISODate(value) : ''}
          disabled={disabled}
        />
      )}
      {presence.present && (
        <Portal>
          <div
            ref={dialogRefCallback}
            id={dialogId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
            className="or-date-picker__dialog"
            data-state={presence.state}
            data-side={side}
            inert={presence.state === 'closed' || undefined}
            style={floatingStyles}
          >
            <Calendar
              headingId={headingId}
              value={value}
              onChange={handleSelect}
              min={min}
              max={max}
              isDateDisabled={isDateDisabled}
              weekStartsOn={weekStartsOn}
              showTodayButton
              autoFocus
            />
          </div>
        </Portal>
      )}
    </Field>
  )
})
