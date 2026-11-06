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
import type { CalendarWeekDay } from '../DatePicker'
import {
  formatDateInput,
  getDateFormatPattern,
  startOfDay,
  toISODate,
} from '../DatePicker/dateUtils'
import { Field, useField, useFieldControlProps, type FieldControlProps } from '../Field'
import { Portal } from '../Portal'
import { RangeCalendar } from './RangeCalendar'
import {
  applyDateMask,
  dayKey,
  getRangeError,
  isDateUnavailable,
  isRangeAllowed,
  isSameRange,
  presetLabelKeys,
  readDateInput,
  resolvePresetRange,
  type CompleteDateRange,
  type DateRange,
  type DateRangePreset,
  type DateRangePresetKey,
} from './rangeUtils'
import './DateRangePicker.css'

export type DateRangePickerSize = 'sm' | 'md' | 'lg'

export interface DateRangePickerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange' | 'children'
> {
  /** Período (controlado). Use `{ start: null, end: null }` para vazio. */
  value?: DateRange
  /** Período inicial (não controlado). */
  defaultValue?: DateRange
  /**
   * Chamado com o novo período. Cada ponta vira `null` enquanto estiver vazia,
   * incompleta, inválida ou indisponível; o fim também vira `null` quando
   * quebra a ordem (fim antes do início) ou os limites de comprimento.
   */
  onChange?: (range: DateRange) => void
  /** Primeira data permitida. */
  min?: Date
  /** Última data permitida. */
  max?: Date
  /** Desabilita datas específicas (feriados, fins de semana…). */
  isDateDisabled?: (date: Date) => boolean
  /** Comprimento mínimo em dias entre início e fim (`fim − início`, como noites). */
  minLength?: number
  /** Comprimento máximo em dias entre início e fim. */
  maxLength?: number
  /** Primeiro dia da semana no calendário: 0 = domingo (padrão), 1 = segunda… */
  weekStartsOn?: CalendarWeekDay
  /** Meses lado a lado no calendário (em telas estreitas, sempre 1). Padrão: 2. */
  visibleMonths?: 1 | 2
  /**
   * Atalhos ao lado do calendário: chaves prontas (`'last7Days'`,
   * `'thisMonth'`, `'lastMonth'`…) e/ou `{ label, range }` próprios.
   */
  presets?: (DateRangePreset | DateRangePresetKey)[]
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
  /** Marca os dois campos como obrigatórios. */
  required?: boolean
  /** Mostra "(opcional)" ao lado do rótulo. */
  optional?: boolean
  /** Desabilita os campos e o botão do calendário. */
  disabled?: boolean
  /** Somente leitura: os campos não editam e o calendário não abre. */
  readOnly?: boolean
  /** Altura do campo: `sm` 32px, `md` 40px, `lg` 48px. */
  size?: DateRangePickerSize
  /**
   * Envia o período no formulário em dois inputs ocultos, `name[start]` e
   * `name[end]`, no formato ISO `aaaa-mm-dd`.
   */
  name?: string
  /** Calendário aberto (controlado). */
  open?: boolean
  /** Calendário aberto inicialmente (não controlado). */
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

const EMPTY_RANGE: DateRange = { start: null, end: null }
const rangeKey = (range: DateRange) => `${dayKey(range.start)}|${dayKey(range.end)}`

type Edge = 'start' | 'end'

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
 * Campo de período: duas datas com máscara conforme o idioma dentro de um
 * só controle, um calendário de período em diálogo (um ou dois meses) e
 * atalhos opcionais ("Últimos 7 dias", "Mês passado").
 */
export const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(
  function DateRangePicker(
    {
      value: valueProp,
      defaultValue = EMPTY_RANGE,
      onChange,
      min,
      max,
      isDateDisabled,
      minLength,
      maxLength,
      weekStartsOn = 0,
      visibleMonths = 2,
      presets,
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
      name,
      open: openProp,
      defaultOpen,
      onOpenChange,
      id,
      className,
      style,
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
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
      try {
        return new Intl.DateTimeFormat(locale, options)
      } catch {
        return new Intl.DateTimeFormat('pt-BR', options)
      }
    }, [locale])

    const baseId = useId('or-date-range-picker')
    const hintId = `${baseId}-hint`
    const dialogId = `${baseId}-dialog`

    const [value, setValue] = useControllableState<DateRange>({
      value: valueProp,
      defaultValue,
      onChange,
    })
    const { isOpen, setOpen, close } = useDisclosure({ open: openProp, defaultOpen, onOpenChange })
    const [texts, setTexts] = useState<Record<Edge, string>>(() => ({
      start: value.start ? formatDateInput(value.start, pattern) : '',
      end: value.end ? formatDateInput(value.end, pattern) : '',
    }))
    // Campo deixado incompleto (erro só aparece depois de sair dele).
    const [blurred, setBlurred] = useState<Record<Edge, boolean>>({ start: false, end: false })
    const [announcement, setAnnouncement] = useState('')

    const buttonRef = useRef<HTMLButtonElement>(null)
    const frameRef = useRef<HTMLDivElement>(null)
    const dialogRef = useRef<HTMLDivElement>(null)
    const caretRef = useRef<{ input: HTMLInputElement; position: number } | null>(null)
    const emittedRef = useRef<string | undefined>(undefined)

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

    const constraints = { min, max, isDateDisabled, minLength, maxLength }
    const isUnavailable = (date: Date) => isDateUnavailable(date, constraints)
    const read = (text: string) => readDateInput(text, pattern, isUnavailable)

    /** Período válido descrito pelos textos (pontas inválidas viram `null`). */
    const rangeFromTexts = (next: Record<Edge, string>): DateRange => {
      const start = read(next.start)
      const end = read(next.end)
      const startDate = start.status === 'valid' ? start.date : null
      let endDate = end.status === 'valid' ? end.date : null
      if (startDate && endDate && getRangeError(startDate, endDate, minLength, maxLength))
        endDate = null
      return { start: startDate, end: endDate }
    }

    const emit = (next: DateRange) => {
      if (isSameRange(next, value)) return
      emittedRef.current = rangeKey(next)
      setValue(next)
    }

    // Valor alterado por fora (controlado, atalho) ou troca de idioma → reescreve os textos.
    const valueKey = rangeKey(value)
    useEffect(() => {
      if (emittedRef.current !== undefined && emittedRef.current === valueKey) {
        emittedRef.current = undefined
        return
      }
      emittedRef.current = undefined
      const [startKey, endKey] = valueKey.split('|')
      const format = (key: string) =>
        key === 'null' ? '' : formatDateInput(new Date(Number(key)), pattern)
      setTexts({ start: format(startKey), end: format(endKey) })
      setBlurred({ start: false, end: false })
    }, [valueKey, pattern])

    // Mantém o cursor no lugar depois de aplicar a máscara.
    useIsomorphicLayoutEffect(() => {
      const caret = caretRef.current
      if (!caret || document.activeElement !== caret.input) return
      caret.input.setSelectionRange(caret.position, caret.position)
      caretRef.current = null
    })

    const handleTextChange = (edge: Edge) => (event: ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value
      const masked = applyDateMask(raw, event.target.selectionStart ?? raw.length, pattern)
      caretRef.current = { input: event.target, position: masked.caret }
      const next = { ...texts, [edge]: masked.text }
      setTexts(next)
      setBlurred((prev) => (prev[edge] ? { ...prev, [edge]: false } : prev))
      emit(rangeFromTexts(next))
    }

    const handleBlur = (edge: Edge) => (event: FocusEvent<HTMLInputElement>) => {
      if (read(event.target.value).status === 'incomplete')
        setBlurred((prev) => ({ ...prev, [edge]: true }))
    }

    const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.altKey && event.key === 'ArrowDown' && !disabled && !readOnly) {
        event.preventDefault()
        setOpen(true)
      }
    }

    const closeAndFocusButton = () => {
      close()
      buttonRef.current?.focus({ preventScroll: true })
    }

    /** Período escolhido no calendário ou por um atalho. */
    const applyRange = (range: CompleteDateRange) => {
      const start = startOfDay(range.start)
      const end = startOfDay(range.end)
      setTexts({ start: formatDateInput(start, pattern), end: formatDateInput(end, pattern) })
      setBlurred({ start: false, end: false })
      emit({ start, end })
      setAnnouncement(
        t('dateRangeSelected', {
          start: longFormatter.format(start),
          end: longFormatter.format(end),
        }),
      )
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
      () =>
        mergeRefs<HTMLDivElement>(dialogRef, presenceRef, refs.setFloating, setDialogElement),
      [refs.setFloating, presenceRef],
    )

    // Reaberto durante a animação de saída: o calendário não remonta, então
    // o foco volta ao dia ativo aqui.
    useEffect(() => {
      if (!isOpen) return
      const cell = dialogRef.current?.querySelector<HTMLElement>(
        '[role="gridcell"][tabindex="0"]',
      )
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
    const startInput = read(texts.start)
    const endInput = read(texts.end)
    const edgeError = (edge: Edge, status: string) => {
      if (status === 'invalid' || (status === 'incomplete' && blurred[edge]))
        return t(edge === 'start' ? 'dateRangeInvalidStart' : 'dateRangeInvalidEnd', {
          format: formatHint,
        })
      if (status === 'unavailable')
        return t(edge === 'start' ? 'dateRangeUnavailableStart' : 'dateRangeUnavailableEnd')
      return null
    }
    const startError = edgeError('start', startInput.status)
    const endError = edgeError('end', endInput.status)
    const rangeError =
      startInput.status === 'valid' && endInput.status === 'valid'
        ? getRangeError(startInput.date as Date, endInput.date as Date, minLength, maxLength)
        : null
    const days = (count = 0) =>
      count === 1 ? t('dateRangeDayCountOne') : t('dateRangeDayCount', { count })
    const rangeMessage =
      rangeError === 'order'
        ? t('dateRangeEndBeforeStart')
        : rangeError === 'tooShort'
          ? t('dateRangeTooShort', { length: days(minLength) })
          : rangeError === 'tooLong'
            ? t('dateRangeTooLong', { length: days(maxLength) })
            : null
    const errorMessage = error ?? startError ?? endError ?? rangeMessage ?? undefined
    const hasExternalError = error !== undefined && error !== null && error !== false && error !== ''
    const invalid = {
      start: invalidProp || hasExternalError || !!startError,
      end: invalidProp || hasExternalError || !!endError || !!rangeError,
    }
    const shake = useShake(
      typeof errorMessage === 'string' ? errorMessage : !!errorMessage || invalidProp,
    )

    const buttonLabel =
      value.start && value.end
        ? t('dateRangeChange', {
            start: longFormatter.format(value.start),
            end: longFormatter.format(value.end),
          })
        : t('dateRangeChoose')

    const resolvedPresets = (presets ?? []).map((preset) =>
      typeof preset === 'string'
        ? {
            key: preset,
            label: t(presetLabelKeys[preset]),
            range: resolvePresetRange(preset, new Date(), weekStartsOn),
          }
        : { key: preset.label, label: preset.label, range: preset.range() },
    )

    const renderInput = (edge: Edge, fieldProps: FieldControlProps) => (
      <input
        id={edge === 'start' ? fieldProps.id : `${fieldProps.id}-end`}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        className={cx(
          'or-control-frame__input',
          'or-date-range-picker__input',
          `or-date-range-picker__input--${edge}`,
        )}
        placeholder={formatHint}
        value={texts[edge]}
        maxLength={10}
        readOnly={readOnly}
        disabled={disabled}
        required={fieldProps.required}
        aria-label={t(edge === 'start' ? 'dateRangeStart' : 'dateRangeEnd')}
        aria-describedby={[fieldProps['aria-describedby'], hintId].filter(Boolean).join(' ')}
        aria-invalid={invalid[edge] || undefined}
        onChange={handleTextChange(edge)}
        onBlur={handleBlur(edge)}
        onKeyDown={handleInputKeyDown}
      />
    )

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
        className={cx('or-date-range-picker', className)}
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
                'or-date-range-picker__frame',
              )}
              data-invalid={!!errorMessage || invalidProp || undefined}
              aria-disabled={disabled || undefined}
              data-disabled={disabled || undefined}
              {...shake}
              {...rest}
            >
              {renderInput('start', fieldProps)}
              <span className="or-date-range-picker__separator" aria-hidden="true">
                –
              </span>
              {renderInput('end', fieldProps)}
              <span id={hintId} className="or-visually-hidden">
                {t('dateFormatHint', { format: formatHint })}
              </span>
              <button
                ref={buttonRef}
                type="button"
                className="or-control-frame__button or-date-range-picker__button"
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
          <>
            <input
              type="hidden"
              name={`${name}[start]`}
              value={value.start ? toISODate(value.start) : ''}
              disabled={disabled}
            />
            <input
              type="hidden"
              name={`${name}[end]`}
              value={value.end ? toISODate(value.end) : ''}
              disabled={disabled}
            />
          </>
        )}
        <div role="status" className="or-visually-hidden">
          {announcement}
        </div>
        {presence.present && (
          <Portal>
            <div
              ref={dialogRefCallback}
              id={dialogId}
              role="dialog"
              aria-modal="true"
              aria-label={t('dateRangeChoose')}
              className="or-date-range-picker__dialog"
              data-state={presence.state}
              data-side={side}
              inert={presence.state === 'closed' || undefined}
              style={floatingStyles}
            >
              <div className="or-date-range-picker__panel">
                {resolvedPresets.length > 0 && (
                  <ul
                    role="list"
                    className="or-date-range-picker__presets"
                    aria-label={t('dateRangePresets')}
                  >
                    {resolvedPresets.map((preset) => {
                      const allowed = isRangeAllowed(preset.range, constraints)
                      const current = isSameRange(preset.range, value)
                      return (
                        <li key={preset.key}>
                          <button
                            type="button"
                            className="or-date-range-picker__preset"
                            aria-disabled={!allowed || undefined}
                            aria-current={current || undefined}
                            onClick={() => {
                              if (allowed) applyRange(preset.range)
                            }}
                          >
                            {preset.label}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
                <RangeCalendar
                  value={value}
                  onChange={applyRange}
                  min={min}
                  max={max}
                  isDateDisabled={isDateDisabled}
                  minLength={minLength}
                  maxLength={maxLength}
                  weekStartsOn={weekStartsOn}
                  visibleMonths={visibleMonths}
                  autoFocus
                />
              </div>
            </div>
          </Portal>
        )}
      </Field>
    )
  },
)
