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
  type PointerEvent as ReactPointerEvent,
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
import { displayTime, formatTime, parseTime } from '../TimeField/time'
import { TimeSegments, useTimeSegments } from '../TimeField/TimeSegments'
import { combineDateTime, timeLimitOn, timeOfDate, toISODateTime, usesSeconds } from './timeUtils'
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
  /**
   * Primeiro instante permitido (data e hora). Dias anteriores ficam desabilitados no calendário
   * e, no dia de `min`, as setas da hora param nesse horário.
   */
  min?: Date
  /**
   * Último instante permitido (data e hora). Dias posteriores ficam desabilitados no calendário
   * e, no dia de `max`, as setas da hora param nesse horário.
   */
  max?: Date
  /** Desabilita datas específicas (feriados, fins de semana…). */
  isDateDisabled?: (date: Date) => boolean
  /**
   * Intervalo em segundos em que as setas andam na hora, contado a partir da meia-noite
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
  /** Desabilita a data, a hora e o botão do calendário. */
  disabled?: boolean
  /** Somente leitura: a data e a hora não editam e o calendário não abre. */
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
 * Campo de data e hora num só controle: a data com máscara conforme o idioma (como no
 * `DatePicker`), o calendário em diálogo para escolher o dia e a hora em segmentos (como no
 * `TimeField`), no relógio de 12 ou 24 horas do idioma do provider.
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
    const longDate = useMemo(() => {
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }
      try {
        return new Intl.DateTimeFormat(locale, options)
      } catch {
        return new Intl.DateTimeFormat('pt-BR', options)
      }
    }, [locale])

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
      time: value ? formatTime(timeOfDate(value), withSeconds) : '',
    }))
    // Data deixada incompleta (o erro só aparece depois de sair do campo).
    const [dateBlurred, setDateBlurred] = useState(false)
    // Foco saiu do grupo com só um dos campos preenchido ("Informe a hora.").
    const [groupBlurred, setGroupBlurred] = useState(false)

    const dateInputRef = useRef<HTMLInputElement>(null)
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
      const time = parseTime(next.time)
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
        time: date ? formatTime(timeOfDate(date), withSeconds) : '',
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

    // Hora em segmentos ------------------------------------------------------------
    // Os mesmos do TimeField. Aqui o texto da hora (`HH:mm`) fica vazio enquanto ela está pela
    // metade; o limite de horário só existe no dia de `min` e no de `max`, e o passo é contado a
    // partir da meia-noite (o `min` é um instante, não um horário que se repete todo dia).
    const dateInput = readDate(texts.date)
    const day = dateInput.status === 'valid' ? dateInput.date : null
    const timeLimits = {
      min: timeLimitOn(day, min, 'min', withSeconds),
      max: timeLimitOn(day, max, 'max', withSeconds),
      step: step !== undefined && step > 0 ? step : 60,
    }
    const segments = useTimeSegments({
      value: texts.time,
      onChange: (time) => update({ ...texts, time }),
      limits: timeLimits,
      disabled,
      readOnly,
    })

    const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value
      const masked = applyDateMask(raw, event.target.selectionStart ?? raw.length, pattern)
      caretRef.current = masked.caret
      setDateBlurred(false)
      update({ ...texts, date: masked.text })
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

    /** Clique na área livre da hora (ou no relógio): o foco vai para o primeiro segmento. */
    const handleTimePointerDown = (event: ReactPointerEvent<HTMLSpanElement>) => {
      if (disabled || (event.target as Element).closest('.or-time-field__segment')) return
      event.preventDefault()
      segments.focusFirst()
    }

    /** O foco saiu da hora: um número pela metade ("1" à espera do "5") para de segurar os avisos. */
    const handleTimeBlur = (event: FocusEvent<HTMLSpanElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) segments.resetTyping()
    }

    const closeAndFocusButton = () => {
      close()
      buttonRef.current?.focus({ preventScroll: true })
    }

    /** Dia escolhido no calendário: mantém a hora digitada (ou usa `defaultTime`). */
    const handleSelect = (day: Date) => {
      const fallback = parseTime(texts.time) ? null : parseTime(defaultTime)
      const time = fallback ? formatTime(fallback, withSeconds) : texts.time
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
    const time = parseTime(texts.time)
    const combined = day && time ? combineDateTime(day, time) : null
    // No meio de um número ("1" à espera do "5" de "15"), o aviso espera a pessoa terminar.
    const rangeError = segments.typing
      ? null
      : combined && min && combined < min
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
    // O horário do aviso é escrito como o dos segmentos: no relógio do idioma do provider.
    const rangeMessage =
      rangeError === 'early' && timeLimits.min
        ? t('dateTimeTooEarly', { time: displayTime(timeLimits.min, segments.display) })
        : rangeError === 'late' && timeLimits.max
          ? t('dateTimeTooLate', { time: displayTime(timeLimits.max, segments.display) })
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

    // Para a validação nativa do formulário, a hora pela metade (ou faltando, num campo
    // obrigatório) invalida o campo de data — o controle do grupo que o navegador consegue focar.
    const timeValidity = segments.partial
      ? t('timeIncomplete')
      : required && texts.date !== '' && !time
        ? t('dateTimeMissingTime')
        : ''
    useEffect(() => {
      dateInputRef.current?.setCustomValidity(timeValidity)
    }, [timeValidity])

    // O botão fala do dia (digitado ou escolhido), mesmo antes de a hora ser preenchida.
    const buttonLabel = day ? t('changeDate', { date: longDate.format(day) }) : t('chooseDate')

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
              <span
                className="or-date-time-picker__time"
                onPointerDown={handleTimePointerDown}
                onBlur={handleTimeBlur}
              >
                <span className="or-control-frame__addon or-control-frame__addon--start or-date-time-picker__clock">
                  <Icon name="clock" size="sm" />
                </span>
                <TimeSegments
                  segments={segments}
                  // O grupo em volta já leva o nome do campo; este é a "Hora" dentro dele.
                  label={t('dateTimeTime')}
                  describedBy={fieldProps['aria-describedby']}
                  invalid={invalid.time}
                  required={fieldProps.required}
                  // Como na data: Enter envia o formulário em volta.
                  onEnter={(event) => event.currentTarget.closest('form')?.requestSubmit?.()}
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
                value={day}
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
