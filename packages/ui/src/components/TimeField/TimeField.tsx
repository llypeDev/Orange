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
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import {
  useClickOutside,
  useControllableState,
  useEventListener,
  useId,
  usePresence,
} from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx, mergeRefs } from '../../utils'
import {
  Field,
  useField,
  useFieldControlProps,
  type FieldContextValue,
  type FieldControlProps,
} from '../Field'
import { getThemeScope } from '../Modal/overlay'
import { returnFocusIfLost, useFloatingPanel } from '../Popover/floating'
import { Portal } from '../Portal'
import {
  displayTime,
  formatInterval,
  parseTime,
  timeOptions,
  timeProblem,
  toSeconds,
  type TimeParts,
} from './time'
import { TimeSegments, useTimeSegments } from './TimeSegments'
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
  /** Chamado com o novo horário (`HH:mm`) ou `''` quando apagado ou ainda incompleto. */
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void
  /** Horário mínimo (`HH:mm`). Depois de `max`, o intervalo atravessa a meia-noite. */
  min?: string
  /** Horário máximo (`HH:mm`). */
  max?: string
  /** Intervalo em segundos entre horários válidos. Ex.: `900` = 15 minutos. Padrão: 60. */
  step?: number
  /**
   * Relógio de 12 horas (com AM/PM) ou de 24. Padrão: o do idioma do `OrangeProvider`
   * (24 em `pt-BR` e `es-ES`, 12 em `en-US`). O valor é sempre `HH:mm` em 24 horas.
   */
  hourCycle?: 12 | 24
  /**
   * Intervalo, em segundos, entre os horários da lista que o botão do relógio abre. Padrão: o
   * `step`, quando ele é de 5 minutos ou mais; senão 30 minutos. `false` tira o botão e a lista.
   */
  listStep?: number | false
  /** Rótulo visível do campo. */
  label?: ReactNode
  /** Oculta o rótulo visualmente (continua acessível). */
  hideLabel?: boolean
  /** Texto de ajuda abaixo do rótulo. */
  description?: ReactNode
  /** Mensagem de erro. Substitui os avisos do próprio campo (fora do limite, incompleto). */
  error?: ReactNode
  /** Força o estado inválido sem exibir mensagem (ex.: erro mostrado em um ErrorSummary). */
  invalid?: boolean
  /** Mostra "(opcional)" ao lado do rótulo. */
  optional?: boolean
  /** Altura do campo: `sm` 32px, `md` 40px, `lg` 48px. */
  size?: TimeFieldSize
}

/** Lê o `Field` em volta (ids do rótulo, da descrição e do erro) para ligar os segmentos a eles. */
function WithField({
  id,
  children,
}: {
  id?: string
  children: (field: FieldContextValue | null, props: FieldControlProps) => ReactNode
}) {
  return <>{children(useField(), useFieldControlProps({ id }))}</>
}

/**
 * Campo de horário em segmentos (hora, minuto, segundo, AM/PM), cada um editável pelo teclado,
 * com a aparência do Orange e o formato do idioma do provider — igual em todos os navegadores.
 * O botão do relógio abre uma lista de horários. O valor é sempre `HH:mm` em 24 horas; um
 * `<input type="time">` oculto guarda esse valor para formulários, `ref` e validação nativa.
 */
export const TimeField = forwardRef<HTMLInputElement, TimeFieldProps>(function TimeField(
  {
    value: valueProp,
    defaultValue = '',
    onChange,
    min,
    max,
    step,
    hourCycle: hourCycleProp,
    listStep,
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
    id,
    className,
    style,
    onFocus,
    onBlur,
    onKeyDown,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ...rest
  },
  ref,
) {
  const { t, locale } = useLocale()
  const baseId = useId('or-time-field')
  const listId = `${baseId}-list`
  const [value, setValue] = useControllableState({ value: valueProp, defaultValue })

  const stepSeconds = step !== undefined && step > 0 ? step : 60
  const limits = useMemo(
    () => ({ min: parseTime(min), max: parseTime(max), step: stepSeconds }),
    [min, max, stepSeconds],
  )
  /** Saiu do campo com o horário pela metade. */
  const [incomplete, setIncomplete] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  /** Leva o valor ao input oculto como se fosse digitado: o `onChange` recebe um evento de verdade. */
  const emit = (next: string) => {
    const input = inputRef.current
    if (!input) return
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(input, next)
    input.dispatchEvent(new Event('input', { bubbles: true }))
  }

  // Segmentos ----------------------------------------------------------------
  // Digitação, setas, passo e limites moram em `TimeSegments` (o DateTimePicker usa os mesmos).
  // O passo é contado a partir de `min`.
  const segments = useTimeSegments({
    value,
    onChange: emit,
    limits,
    stepFrom: limits.min,
    hourCycle: hourCycleProp,
    disabled,
    readOnly,
    onDraftChange: (partial) => {
      if (!partial) setIncomplete(false)
    },
  })
  const { time, display, editable, partial, typing } = segments
  const { hourCycle, periods, withSeconds } = display
  const normalized = segments.value

  // Para o formulário, horário pela metade é valor inválido (o `badInput` do input nativo): o
  // envio para no campo em vez de mandar vazio.
  const incompleteMessage = t('timeIncomplete')
  useEffect(() => {
    inputRef.current?.setCustomValidity(partial ? incompleteMessage : '')
  }, [partial, incompleteMessage])

  // Lista de horários --------------------------------------------------------
  const listSeconds = listStep === false ? 0 : (listStep ?? (stepSeconds >= 300 ? stepSeconds : 1800))
  const hasList = listSeconds > 0
  const options = useMemo(
    () => (listSeconds > 0 ? timeOptions(limits, listSeconds) : []),
    [limits, listSeconds],
  )
  const listDisplay = { hourCycle, periods, withSeconds: withSeconds && listSeconds % 60 !== 0 }
  const [openState, setOpen] = useState(false)
  const open = openState && editable && hasList
  const [activeIndex, setActiveIndex] = useState(0)
  const presence = usePresence<HTMLDivElement>(open)
  const [frameElement, setFrameElement] = useState<HTMLDivElement | null>(null)
  const [popupElement, setPopupElement] = useState<HTMLDivElement | null>(null)
  // Refs estáveis: uma função nova a cada render faria o React desligar e religar a ref — e, com
  // ela, o estado do elemento — em todo commit.
  const frameRefs = useMemo(() => mergeRefs<HTMLDivElement>(frameRef, setFrameElement), [])
  const popupRefs = useMemo(
    () => mergeRefs<HTMLDivElement>(popupRef, presence.nodeRef, setPopupElement),
    [presence.nodeRef],
  )
  const inputRefs = useMemo(() => mergeRefs<HTMLInputElement>(inputRef, ref), [ref])
  const floating = useFloatingPanel({
    open: presence.present,
    reference: frameElement,
    floating: popupElement,
    placement: 'bottom-start',
    offset: 4,
  })
  const selectedIndex = time
    ? options.findIndex((option) => toSeconds(option) === toSeconds(time))
    : -1

  const openList = () => {
    // Começa no horário escolhido; sem um, no primeiro que não é anterior ao que está no campo.
    const now = time ? toSeconds(time) : -1
    const nearest = options.findIndex((option) => toSeconds(option) >= now)
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : Math.max(nearest, 0))
    setOpen(true)
  }
  const closeList = (focusButton: boolean) => {
    setOpen(false)
    if (focusButton) buttonRef.current?.focus({ preventScroll: true })
  }

  useClickOutside(
    [frameRef, popupRef],
    () => {
      closeList(false)
      returnFocusIfLost(buttonRef.current)
    },
    open,
  )

  /** Foca a opção e a deixa inteira à vista dentro da lista (sem rolar a página). */
  const revealOption = (index: number, center = false) => {
    const list = popupRef.current?.querySelector<HTMLElement>('[role="listbox"]')
    const option = list?.children[index] as HTMLElement | undefined
    if (!list || !option) return
    option.focus({ preventScroll: true })
    const top = option.offsetTop
    const bottom = top + option.offsetHeight
    if (center) list.scrollTop = top - (list.clientHeight - option.offsetHeight) / 2
    else if (top < list.scrollTop) list.scrollTop = top
    else if (bottom > list.scrollTop + list.clientHeight)
      list.scrollTop = Math.ceil(bottom - list.clientHeight)
  }

  // Ao abrir, o foco entra na lista, na opção ativa, no meio da área visível.
  useEffect(() => {
    if (open && popupElement) revealOption(activeIndex, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- só ao abrir; depois as setas cuidam do foco
  }, [open, popupElement])

  const selectOption = (option: TimeParts) => {
    segments.setTime(option)
    closeList(true)
  }

  const listTyped = useRef({ text: '', at: 0 })
  // Listener nativo: o Escape para aqui (não fecha um Modal por trás).
  useEventListener(
    'keydown',
    (event) => {
      const move = (index: number) => {
        const next = Math.min(Math.max(index, 0), options.length - 1)
        event.preventDefault()
        setActiveIndex(next)
        revealOption(next)
      }
      const { key } = event
      if (key === 'Escape' || key === 'Tab') {
        event.preventDefault()
        event.stopPropagation()
        closeList(true)
      } else if (key === 'ArrowDown') move(activeIndex + 1)
      else if (key === 'ArrowUp') move(activeIndex - 1)
      else if (key === 'PageDown') move(activeIndex + 8)
      else if (key === 'PageUp') move(activeIndex - 8)
      else if (key === 'Home') move(0)
      else if (key === 'End') move(options.length - 1)
      else if (key === 'Enter' || key === ' ') {
        event.preventDefault()
        if (options[activeIndex]) selectOption(options[activeIndex])
      } else if (/^\d$/.test(key)) {
        // Digitar "14" leva às 14:00; "930", às 09:30.
        const now = Date.now()
        const text = (now - listTyped.current.at < 800 ? listTyped.current.text : '') + key
        listTyped.current = { text, at: now }
        const match = options.findIndex((option) => {
          const digits = displayTime(option, listDisplay).replace(/\D/g, '')
          return digits.startsWith(text) || digits.replace(/^0/, '').startsWith(text)
        })
        if (match >= 0) move(match)
      }
    },
    popupElement,
  )

  // Foco -------------------------------------------------------------------
  // "Dentro do campo" inclui a lista de horários, que mora num portal.
  const isInside = (node: EventTarget | null) =>
    node instanceof Node &&
    (!!frameRef.current?.contains(node) || !!popupRef.current?.contains(node))

  const handleFocusIn = (event: FocusEvent<HTMLElement>) => {
    if (!isInside(event.relatedTarget)) onFocus?.(event as unknown as FocusEvent<HTMLInputElement>)
  }

  const handleFocusOut = (event: FocusEvent<HTMLElement>) => {
    if (isInside(event.relatedTarget)) return
    segments.resetTyping()
    // Saiu com o horário pela metade: avisa (o valor, até aqui, é vazio).
    setIncomplete(partial)
    onBlur?.(event as unknown as FocusEvent<HTMLInputElement>)
  }

  /** Clique na área livre do campo: o foco vai para o primeiro segmento, como num input. */
  const handleFramePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const target = event.target as Element
    if (disabled || target.closest('.or-time-field__segment, .or-time-field__button')) return
    event.preventDefault()
    segments.focusFirst()
  }

  // Validação --------------------------------------------------------------
  const problem = typing
    ? null
    : time
      ? timeProblem(time, limits)
      : incomplete && partial
        ? 'incomplete'
        : null
  const internalError =
    problem === 'early' && limits.min
      ? t('dateTimeTooEarly', { time: displayTime(limits.min, display) })
      : problem === 'late' && limits.max
        ? t('dateTimeTooLate', { time: displayTime(limits.max, display) })
        : problem === 'step'
          ? t('timeStepMismatch', { interval: formatInterval(stepSeconds, locale) })
          : problem === 'incomplete'
            ? incompleteMessage
            : undefined

  const buttonLabel = time ? t('changeTime', { time: displayTime(time, display) }) : t('chooseTime')

  return (
    <Field
      label={label}
      hideLabel={hideLabel}
      description={description}
      error={error ?? internalError}
      invalid={invalidProp}
      required={required}
      optional={optional}
      disabled={disabled}
      controlId={id}
      className={cx('or-time-field', className)}
      style={style}
    >
      <WithField id={id}>
        {(field, fieldProps) => {
          const invalid = field?.invalid ?? invalidProp
          // O nome do campo fica no grupo: o rótulo visível ou, sem ele, o `aria-labelledby` ou
          // o `aria-label` recebido.
          const labelId = (label && field ? field.labelId : undefined) ?? ariaLabelledBy
          return (
            <div
              ref={frameRefs}
              className={cx('or-control-frame', `or-control-frame--${size}`, 'or-time-field__frame')}
              data-invalid={invalid || undefined}
              data-disabled={disabled || undefined}
              data-readonly={readOnly || undefined}
              onFocus={handleFocusIn}
              onBlur={handleFocusOut}
              onPointerDown={handleFramePointerDown}
            >
              <TimeSegments
                segments={segments}
                labelId={labelId}
                label={ariaLabel}
                describedBy={fieldProps['aria-describedby']}
                invalid={invalid}
                required={required}
                onKeyDown={(event) => onKeyDown?.(event as unknown as KeyboardEvent<HTMLInputElement>)}
                onEnter={() => inputRef.current?.form?.requestSubmit?.()}
                onOpen={() => {
                  if (hasList) openList()
                }}
              />
              {/* O valor de verdade (`HH:mm`): formulários, `ref`, `name` e validação nativa.
                  Fora da ordem de Tab e dos leitores de tela; se receber o foco (clique no rótulo,
                  `ref.focus()`, validação do formulário), ele passa para o primeiro segmento. */}
              <input
                {...rest}
                {...fieldProps}
                ref={inputRefs}
                type="time"
                className="or-time-field__input"
                tabIndex={-1}
                aria-hidden="true"
                value={normalized}
                min={min}
                max={max}
                step={step}
                readOnly={readOnly}
                onChange={(event) => {
                  setValue(event.target.value)
                  onChange?.(event.target.value, event)
                }}
                onFocus={() => segments.focusFirst()}
              />
              {hasList && (
                <button
                  ref={buttonRef}
                  type="button"
                  className="or-control-frame__button or-time-field__button"
                  aria-label={buttonLabel}
                  aria-haspopup="listbox"
                  aria-expanded={open}
                  aria-controls={open ? listId : undefined}
                  disabled={!editable}
                  onClick={() => (open ? closeList(false) : openList())}
                >
                  <Icon name="clock" size="sm" />
                </button>
              )}
            </div>
          )
        }}
      </WithField>
      {hasList && presence.present && (
        <Portal>
          <div
            ref={popupRefs}
            className="or-floating or-time-field__popup"
            // O portal sai da árvore de `[data-theme]`: a lista leva o tema do campo.
            data-theme={getThemeScope(frameElement)}
            data-state={presence.state}
            data-side={floating.side}
            inert={presence.state === 'closed' || undefined}
            style={floating.floatingStyles}
            onFocus={handleFocusIn}
            onBlur={handleFocusOut}
          >
            <div
              id={listId}
              role="listbox"
              aria-label={t('timeOptions')}
              className="or-time-field__listbox"
            >
              {options.map((option, index) => (
                // O teclado é tratado no painel (listener nativo, para o Escape parar aqui).
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                <div
                  key={toSeconds(option)}
                  role="option"
                  tabIndex={index === activeIndex ? 0 : -1}
                  aria-selected={index === selectedIndex}
                  className="or-time-field__option"
                  onClick={() => selectOption(option)}
                >
                  <span className="or-time-field__option-label">
                    {displayTime(option, listDisplay)}
                  </span>
                  <Icon
                    name="check"
                    size="sm"
                    strokeWidth={2.25}
                    className="or-time-field__option-check"
                  />
                </div>
              ))}
            </div>
          </div>
        </Portal>
      )}
    </Field>
  )
})
