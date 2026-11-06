import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react-dom'
import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type HTMLAttributes,
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
import { useShake } from '../Combobox/motion'
import { Calendar, type CalendarWeekDay } from '../DatePicker'
import { formatDateInput, getDateFormatPattern, isOutOfRange } from '../DatePicker/dateUtils'
import { applyDateMask, readDateInput } from '../DateRangePicker/rangeUtils'
import { Field, useField, useFieldControlProps, type FieldControlProps } from '../Field'
import { Portal } from '../Portal'
import {
  combineDateTime,
  formatTimeValue,
  parseTimeValue,
  toISODateTime,
  usesSeconds,
} from './timeUtils'
import './DateTimePicker.css'

export type DateTimePickerSize = 'sm' | 'md' | 'lg'

export interface DateTimePickerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange' | 'children'
> {
  /** Data e hora (controlado), no fuso local. `null` = vazio. */
  value?: Date | null
  /** Data e hora iniciais (não controlado). */
  defaultValue?: Date | null
  /**
   * Chamado com a nova data e hora — ou `null` quando a data ou a hora fica
   * vazia/incompleta, ou quando a combinação é inválida ou indisponível.
   */
  onChange?: (date: Date | null) => void
  /** Primeiro instante permitido (data e hora). Dias anteriores ficam desabilitados no calendário. */
  min?: Date
  /** Último instante permitido (data e hora). Dias posteriores ficam desabilitados no calendário. */
  max?: Date
  /** Desabilita datas específicas (feriados, fins de semana…). */
  isDateDisabled?: (date: Date) => boolean
  /**
   * Intervalo em segundos entre horários válidos, como no `TimeField`
   * (ex.: `900` = 15 minutos). Fora de múltiplos de 60, o campo mostra os segundos.
   */
  step?: number
  /**
   * Horário (`HH:mm`) aplicado quando um dia é escolhido no calendário e a hora
   * está vazia (ex.: `'09:00'`). Sem ele, a hora continua vazia até ser digitada.
   */
  defaultTime?: string
  /** Primeiro dia da semana no calendário: 0 = domingo (padrão), 1 = segunda… */
  weekStartsOn?: CalendarWeekDay
  /** Rótulo visível do campo (também nomeia o grupo dos dois campos). */
  label?: ReactNode
  /** Oculta o rótulo visualmente (continua acessível). */
  hideLabel?: boolean
  /** Texto de ajuda abaixo do rótulo. */
  description?: ReactNode
  /** Mensagem de erro. Substitui a validação interna. */
  error?: ReactNode
  /** Força o estado inválido sem exibir mensagem (ex.: erro mostrado em um ErrorSummary). */
  invalid?: boolean
  /** Marca a data e a hora como obrigatórias. */
  required?: boolean
  /** Mostra "(opcional)" ao lado do rótulo. */
  optional?: boolean
  /** Desabilita os dois campos e o botão do calendário. */
  disabled?: boolean
  /** Somente leitura: os campos não editam e o calendário não abre. */
  readOnly?: boolean
  /** Altura do campo: `sm` 32px, `md` 40px, `lg` 48px. */
  size?: DateTimePickerSize
  /** Placeholder do campo de data. Padrão: o formato do idioma (`dd/mm/aaaa`). */
  placeholder?: string
  /**
   * Envia o valor no formulário em um input oculto, em hora local no formato
   * `aaaa-mm-ddTHH:mm` (com `:ss` quando o `step` pede segundos) — o mesmo do
   * `<input type="datetime-local">`. Vazio enquanto o valor for `null`.
   */
  name?: string
  /** Calendário aberto (controlado). */
  open?: boolean
  /** Calendário aberto inicialmente (não controlado). */
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

interface Texts {
  date: string
  time: string
}

const timeKey = (date: Date | null | undefined) => (date ? date.getTime() : null)

/** Renderiza os filhos com os atributos ARIA do `Field` e o id do rótulo. */
function FieldControl({
  id,
  children,
}: {
  id?: string
  children: (props: FieldControlProps, labelId: string | undefined) => ReactNode
}) {
  const field = useField()
  return <>{children(useFieldControlProps({ id }), field?.labelId)}</>
}

/**
 * Campo de data e hora: a data com máscara conforme o idioma (como no
 * `DatePicker`) e a hora no `<input type="time">` nativo (como no `TimeField`)
 * dentro de um só controle, com o calendário em diálogo para escolher o dia.
 */
export const DateTimePicker = forwardRef<HTMLDivElement, DateTimePickerProps>(
  function DateTimePicker(
    {
      value: valueProp,
      defaultValue = null,
      onChange,
      min,
      max,
      isDateDisabled,
      step,
      defaultTime,
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
      placeholder,
      name,
      open: openProp,
      defaultOpen,
      onOpenChange,
      id,
      className,
      style,
      onBlur,
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
    const withSeconds = usesSeconds(step)
    const formatters = useMemo(() => {
      const make = (options: Intl.DateTimeFormatOptions) => {
        try {
          return new Intl.DateTimeFormat(locale, options)
        } catch {
          return new Intl.DateTimeFormat('pt-BR', options)
        }
      }
      return {
        long: make({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
        time: make({
          hour: '2-digit',
          minute: '2-digit',
          second: withSeconds ? '2-digit' : undefined,
        }),
      }
    }, [locale, withSeconds])

    const baseId = useId('or-date-time-picker')
    const hintId = `${baseId}-hint`
    const dialogId = `${baseId}-dialog`
    const headingId = `${baseId}-heading`

    const [value, setValue] = useControllableState<Date | null>({
      value: valueProp,
      defaultValue,
      onChange,
    })
    const { isOpen, setOpen, close } = useDisclosure({ open: openProp, defaultOpen, onOpenChange })
    const [texts, setTexts] = useState<Texts>(() => ({
      date: value ? formatDateInput(value, pattern) : '',
      time: value ? formatTimeValue(value, withSeconds) : '',
    }))
    // Data deixada incompleta (o erro só aparece depois de sair do campo).
    const [dateBlurred, setDateBlurred] = useState(false)
    // Foco saiu do grupo com só um dos campos preenchido ("Informe a hora.").
    const [groupBlurred, setGroupBlurred] = useState(false)

    const dateInputRef = useRef<HTMLInputElement>(null)
    const timeInputRef = useRef<HTMLInputElement>(null)
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

    const isDayUnavailable = (date: Date) =>
      isOutOfRange(date, min, max) || !!isDateDisabled?.(date)
    const readDate = (text: string) => readDateInput(text, pattern, isDayUnavailable)

    /** Data e hora descritas pelos textos — `null` se faltar algo ou sair de min/max. */
    const valueFromTexts = (next: Texts): Date | null => {
      const date = readDate(next.date)
      const time = parseTimeValue(next.time)
      if (date.status !== 'valid' || !date.date || !time) return null
      const combined = combineDateTime(date.date, time)
      if ((min && combined < min) || (max && combined > max)) return null
      return combined
    }

    const emit = (next: Date | null) => {
      if (timeKey(next) === timeKey(value)) return
      emittedRef.current = timeKey(next)
      setValue(next)
    }

    // Valor alterado por fora (controlado), troca de idioma ou de step → reescreve os textos.
    const valueKey = timeKey(value)
    useEffect(() => {
      if (emittedRef.current !== undefined && emittedRef.current === valueKey) {
        emittedRef.current = undefined
        return
      }
      emittedRef.current = undefined
      const date = valueKey === null ? null : new Date(valueKey)
      const next = {
        date: date ? formatDateInput(date, pattern) : '',
        time: date ? formatTimeValue(date, withSeconds) : '',
      }
      setTexts((prev) => (prev.date === next.date && prev.time === next.time ? prev : next))
      setDateBlurred(false)
      setGroupBlurred(false)
    }, [valueKey, pattern, withSeconds])

    // Mantém o cursor no lugar depois de aplicar a máscara.
    useIsomorphicLayoutEffect(() => {
      const input = dateInputRef.current
      if (caretRef.current === null || !input || document.activeElement !== input) return
      input.setSelectionRange(caretRef.current, caretRef.current)
      caretRef.current = null
    })

    const update = (next: Texts) => {
      setTexts(next)
      setGroupBlurred(false)
      emit(valueFromTexts(next))
    }

    const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value
      const masked = applyDateMask(raw, event.target.selectionStart ?? raw.length, pattern)
      caretRef.current = masked.caret
      setDateBlurred(false)
      update({ ...texts, date: masked.text })
    }

    const handleTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
      update({ ...texts, time: event.target.value })
    }

    const handleDateBlur = (event: FocusEvent<HTMLInputElement>) => {
      if (readDate(event.target.value).status === 'incomplete') setDateBlurred(true)
    }

    // Saída do grupo inteiro (não conta ir de um campo ao outro nem para o calendário).
    const handleGroupBlur = (event: FocusEvent<HTMLDivElement>) => {
      onBlur?.(event)
      const next = event.relatedTarget as Node | null
      if (next && (frameRef.current?.contains(next) || dialogRef.current?.contains(next))) return
      setGroupBlurred(true)
    }

    const handleDateKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.altKey && event.key === 'ArrowDown' && !disabled && !readOnly) {
        event.preventDefault()
        setOpen(true)
      }
    }

    const openTimePicker = () => {
      const input = timeInputRef.current
      if (!input || disabled || readOnly) return
      input.focus()
      try {
        input.showPicker?.()
      } catch {
        // showPicker pode falhar sem gesto do usuário ou em navegadores antigos.
      }
    }

    const closeAndFocusButton = () => {
      close()
      buttonRef.current?.focus({ preventScroll: true })
    }

    /** Dia escolhido no calendário: mantém a hora digitada (ou usa `defaultTime`). */
    const handleSelect = (day: Date) => {
      const fallback = parseTimeValue(texts.time) ? null : parseTimeValue(defaultTime)
      const time = fallback ? formatTimeValue(fallback, withSeconds) : texts.time
      setDateBlurred(false)
      update({ date: formatDateInput(day, pattern), time })
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
      () => mergeRefs(frameRef, refs.setReference, ref),
      [refs.setReference, ref],
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

    // Validação derivada dos textos ------------------------------------------------
    const dateInput = readDate(texts.date)
    const time = parseTimeValue(texts.time)
    const combined =
      dateInput.status === 'valid' && dateInput.date && time
        ? combineDateTime(dateInput.date, time)
        : null
    const rangeError =
      combined && min && combined < min
        ? 'early'
        : combined && max && combined > max
          ? 'late'
          : null

    const dateError =
      dateInput.status === 'invalid' || (dateInput.status === 'incomplete' && dateBlurred)
        ? t('invalidDate', { format: formatHint })
        : dateInput.status === 'unavailable'
          ? t('dateUnavailable')
          : null
    const rangeMessage =
      rangeError === 'early' && min
        ? t('dateTimeTooEarly', { time: formatters.time.format(min) })
        : rangeError === 'late' && max
          ? t('dateTimeTooLate', { time: formatters.time.format(max) })
          : null
    const missingTime = groupBlurred && dateInput.status === 'valid' && !time
    const missingDate = groupBlurred && dateInput.status === 'empty' && texts.time !== ''
    const missingMessage = missingTime
      ? t('dateTimeMissingTime')
      : missingDate
        ? t('dateTimeMissingDate')
        : null

    const errorMessage = error ?? dateError ?? rangeMessage ?? missingMessage ?? undefined
    const hasExternalError =
      error !== undefined && error !== null && error !== false && error !== ''
    const invalid = {
      date: invalidProp || hasExternalError || !!dateError || missingDate,
      time: invalidProp || hasExternalError || !!rangeError || missingTime,
    }
    const shake = useShake(
      typeof errorMessage === 'string' ? errorMessage : !!errorMessage || invalidProp,
    )

    // O botão fala do dia (digitado ou escolhido), mesmo antes de a hora ser preenchida.
    const calendarDate = dateInput.status === 'valid' ? dateInput.date : null
    const buttonLabel = calendarDate
      ? t('changeDate', { date: formatters.long.format(calendarDate) })
      : t('chooseDate')

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
        className={cx('or-date-time-picker', className)}
        style={style}
      >
        <FieldControl id={id}>
          {(fieldProps, labelId) => (
            <div
              ref={frameRefCallback}
              role="group"
              aria-labelledby={label ? labelId : undefined}
              className={cx(
                'or-control-frame',
                `or-control-frame--${size}`,
                'or-date-time-picker__frame',
              )}
              data-invalid={!!errorMessage || invalidProp || undefined}
              aria-disabled={disabled || undefined}
              data-disabled={disabled || undefined}
              data-readonly={readOnly || undefined}
              {...shake}
              {...rest}
              onBlur={handleGroupBlur}
            >
              <span className="or-date-time-picker__date">
                <input
                  ref={dateInputRef}
                  id={fieldProps.id}
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  className="or-control-frame__input or-date-time-picker__date-input"
                  placeholder={placeholder ?? formatHint}
                  value={texts.date}
                  maxLength={10}
                  readOnly={readOnly}
                  disabled={disabled}
                  required={fieldProps.required}
                  aria-label={t('dateTimeDate')}
                  aria-describedby={[fieldProps['aria-describedby'], hintId]
                    .filter(Boolean)
                    .join(' ')}
                  aria-invalid={invalid.date || undefined}
                  onChange={handleDateChange}
                  onBlur={handleDateBlur}
                  onKeyDown={handleDateKeyDown}
                />
                <button
                  ref={buttonRef}
                  type="button"
                  className="or-control-frame__button or-date-time-picker__button"
                  aria-label={buttonLabel}
                  aria-haspopup="dialog"
                  aria-expanded={isOpen}
                  aria-controls={isOpen ? dialogId : undefined}
                  disabled={disabled || readOnly}
                  onClick={() => setOpen(!isOpen)}
                >
                  <Icon name="calendar" size="sm" />
                </button>
              </span>
              <span className="or-date-time-picker__time">
                {/* Atalho só para ponteiro: pelo teclado a hora é editada direto no campo. */}
                <span
                  className="or-control-frame__addon or-control-frame__addon--start or-date-time-picker__clock"
                  onPointerDown={(event) => {
                    event.preventDefault()
                    openTimePicker()
                  }}
                >
                  <Icon name="clock" size="sm" />
                </span>
                <input
                  ref={timeInputRef}
                  id={`${fieldProps.id}-time`}
                  type="time"
                  className="or-control-frame__input or-date-time-picker__time-input"
                  value={texts.time}
                  step={step}
                  readOnly={readOnly}
                  disabled={disabled}
                  required={fieldProps.required}
                  aria-label={t('dateTimeTime')}
                  aria-describedby={fieldProps['aria-describedby']}
                  aria-invalid={invalid.time || undefined}
                  onChange={handleTimeChange}
                />
              </span>
              <span id={hintId} className="or-visually-hidden">
                {t('dateFormatHint', { format: formatHint })}
              </span>
            </div>
          )}
        </FieldControl>
        {name && (
          <input
            type="hidden"
            name={name}
            value={value ? toISODateTime(value, withSeconds) : ''}
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
              className="or-date-time-picker__dialog"
              data-state={presence.state}
              data-side={side}
              inert={presence.state === 'closed' || undefined}
              style={floatingStyles}
            >
              <Calendar
                headingId={headingId}
                value={calendarDate}
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
  },
)
