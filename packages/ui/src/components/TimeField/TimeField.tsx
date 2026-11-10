import {
  forwardRef,
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
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
import { useLocale, type MessageKey } from '../../providers'
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
  clampTime,
  dayPeriodInfo,
  displayTime,
  formatInterval,
  formatTime,
  hourCycleOf,
  parseLooseTime,
  parseTime,
  timeOptions,
  timeProblem,
  to12Hour,
  to24Hour,
  toSeconds,
  type DayPeriod,
  type HourCycle,
  type TimeParts,
} from './time'
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

type SegmentKind = 'hour' | 'minute' | 'second' | 'period'
type NumberKind = Exclude<SegmentKind, 'period'>
type SpinAction = 'up' | 'down' | 'pageUp' | 'pageDown' | 'home' | 'end'

/** O que está escrito no campo, segmento a segmento (`null` = ainda vazio). */
interface Draft {
  /** A hora como aparece: 0–23 no relógio de 24h, 1–12 no de 12h. */
  hour: number | null
  minute: number | null
  second: number | null
  period: DayPeriod | null
  cycle: HourCycle
}

const SEGMENT_LABEL: Record<SegmentKind, MessageKey> = {
  hour: 'timeHour',
  minute: 'timeMinute',
  second: 'timeSecond',
  period: 'timeDayPeriod',
}

const SPIN_KEYS: Record<string, SpinAction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  PageUp: 'pageUp',
  PageDown: 'pageDown',
  Home: 'home',
  End: 'end',
}

/** Caracteres que, digitados, passam para o próximo segmento. */
const SEPARATORS = ':.,;/- h'

const pad = (value: number) => String(value).padStart(2, '0')

function draftFromTime(time: TimeParts | null, cycle: HourCycle): Draft {
  if (!time) return { hour: null, minute: null, second: null, period: null, cycle }
  const { hour, period } = to12Hour(time.hour)
  return cycle === 24
    ? { hour: time.hour, minute: time.minute, second: time.second, period: null, cycle }
    : { hour, minute: time.minute, second: time.second, period, cycle }
}

/** O horário do rascunho, ou `null` enquanto faltar algum segmento. */
function draftTime(draft: Draft, withSeconds: boolean): TimeParts | null {
  const { hour, minute, second, period, cycle } = draft
  if (hour === null || minute === null || (withSeconds && second === null)) return null
  if (cycle === 12 && period === null) return null
  return {
    hour: cycle === 12 ? to24Hour(hour, period as DayPeriod) : hour,
    minute,
    second: withSeconds ? (second as number) : 0,
  }
}

function isEmptyDraft(draft: Draft, withSeconds: boolean) {
  return (
    draft.hour === null &&
    draft.minute === null &&
    draft.period === null &&
    (!withSeconds || draft.second === null)
  )
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

  const hourCycle: HourCycle = hourCycleProp ?? hourCycleOf(locale)
  const periods = useMemo(() => dayPeriodInfo(locale), [locale])
  const time = parseTime(value)
  const stepSeconds = step !== undefined && step > 0 ? step : 60
  // Como no input nativo: os segundos aparecem quando o passo os permite ou o valor os traz.
  const withSeconds = stepSeconds % 60 !== 0 || (time?.second ?? 0) !== 0
  const normalized = time ? formatTime(time, withSeconds) : ''
  const limits = useMemo(
    () => ({ min: parseTime(min), max: parseTime(max), step: stepSeconds }),
    [min, max, stepSeconds],
  )
  const display = { hourCycle, withSeconds, periods }
  const editable = !disabled && !readOnly

  // Rascunho ---------------------------------------------------------------
  // Enquanto a pessoa digita, o valor é '' (como no input nativo) e o que já foi escrito mora
  // aqui. Se o valor mudar por fora (controlado, formulário), o rascunho é refeito a partir dele.
  const [draft, setDraft] = useState<Draft>(() => draftFromTime(time, hourCycle))
  const draftParts = draft.cycle === hourCycle ? draftTime(draft, withSeconds) : null
  const inSync =
    draft.cycle === hourCycle &&
    (draftParts ? formatTime(draftParts, withSeconds) : '') === normalized
  const view = inSync ? draft : draftFromTime(time, hourCycle)
  /** Horário pela metade: alguns segmentos preenchidos, outros não. */
  const partial = !isEmptyDraft(view, withSeconds) && !draftTime(view, withSeconds)
  /** Saiu do campo com o horário pela metade. */
  const [incomplete, setIncomplete] = useState(false)
  /** No meio de um número ("1" esperando o "5" de "15"): os avisos esperam a pessoa terminar. */
  const [typing, setTyping] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const segmentRefs = useRef<Partial<Record<SegmentKind, HTMLSpanElement | null>>>({})
  /** Dígitos já digitados no segmento com foco. */
  const typed = useRef('')
  const resetTyped = () => {
    typed.current = ''
    setTyping(false)
  }

  // Para o formulário, horário pela metade é valor inválido (o `badInput` do input nativo): o
  // envio para no campo em vez de mandar vazio.
  const incompleteMessage = t('timeIncomplete')
  useEffect(() => {
    inputRef.current?.setCustomValidity(partial ? incompleteMessage : '')
  }, [partial, incompleteMessage])

  const kinds = useMemo<SegmentKind[]>(() => {
    const clock: SegmentKind[] = withSeconds ? ['hour', 'minute', 'second'] : ['hour', 'minute']
    if (hourCycle === 24) return clock
    return periods.first ? ['period', ...clock] : [...clock, 'period']
  }, [withSeconds, hourCycle, periods.first])

  const focusSegment = (kind: SegmentKind | undefined) => {
    if (kind) segmentRefs.current[kind]?.focus()
  }
  const neighbor = (kind: SegmentKind, direction: 1 | -1) => kinds[kinds.indexOf(kind) + direction]

  /** Leva o valor ao input oculto como se fosse digitado: o `onChange` recebe um evento de verdade. */
  const emit = (next: string) => {
    const input = inputRef.current
    if (!input) return
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(input, next)
    input.dispatchEvent(new Event('input', { bubbles: true }))
  }

  // O rascunho e o valor mais recentes: um teclado virtual pode mandar vários caracteres de uma
  // vez (texto composto, ditado), e cada um precisa partir do resultado do anterior.
  const latest = useRef({ view, value: normalized })
  latest.current = { view, value: normalized }

  const commit = (next: Draft) => {
    setDraft(next)
    const parts = draftTime(next, withSeconds)
    if (parts || isEmptyDraft(next, withSeconds)) setIncomplete(false)
    const nextValue = parts ? formatTime(parts, withSeconds) : ''
    const changed = nextValue !== latest.current.value
    latest.current = { view: next, value: nextValue }
    if (changed) emit(nextValue)
  }

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
    resetTyped()
    commit(draftFromTime(option, hourCycle))
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

  // Segmentos --------------------------------------------------------------
  const rangeOf = (kind: NumberKind): [number, number] =>
    kind === 'hour' ? (hourCycle === 12 ? [1, 12] : [0, 23]) : [0, 59]

  /**
   * De quanto em quanto as setas andam no segmento e a partir de qual valor (o do `min`). Só segue
   * o passo quando ele divide a volta inteira (15 min em 1 h); senão anda de um em um.
   */
  const stepOf = (kind: NumberKind): { unit: number; offset: number } => {
    const from = limits.min
    const turn = kind === 'hour' ? (hourCycle === 12 ? 43200 : 86400) : kind === 'minute' ? 3600 : 60
    const base = kind === 'hour' ? 3600 : kind === 'minute' ? 60 : 1
    const unit = stepSeconds % base === 0 && turn % stepSeconds === 0 ? stepSeconds / base : 1
    return { unit, offset: (from?.[kind] ?? 0) % unit }
  }

  /** Trata um caractere digitado no segmento e devolve o segmento que recebe o próximo. */
  const typeChar = (kind: SegmentKind, char: string): SegmentKind => {
    const current = latest.current.view
    const next = neighbor(kind, 1)
    if (kind === 'period') {
      const letter = char.toLowerCase()
      const initial = (name: string) => name.trim().charAt(0).toLowerCase()
      if (letter === 'a' || letter === initial(periods.am)) commit({ ...current, period: 'am' })
      else if (letter === 'p' || letter === initial(periods.pm)) commit({ ...current, period: 'pm' })
      return kind
    }
    if (/^\d$/.test(char)) {
      const [low, high] = rangeOf(kind)
      let text = typed.current + char
      if (Number(text) > high) text = char // não cabe: começa de novo por este dígito
      const number = Number(text)
      // No relógio de 12h um "0" sozinho é só o zero à esquerda de "07".
      if (number >= low) commit({ ...current, [kind]: number })
      // Sem espaço para mais um dígito: passa para o próximo segmento.
      const done = text.length >= 2 || Number(`${text}0`) > high
      typed.current = done ? '' : text
      setTyping(!done)
      if (!done || !next) return kind
      focusSegment(next)
      return next
    }
    if (SEPARATORS.includes(char.toLowerCase()) && current[kind] !== null && next) {
      focusSegment(next)
      return next
    }
    return kind
  }

  const typeText = (kind: SegmentKind, text: string) => {
    let target = kind
    for (const char of text) target = typeChar(target, char)
  }

  const spin = (kind: SegmentKind, action: SpinAction) => {
    const up = action === 'up' || action === 'pageUp'
    const before = latest.current.view
    let next: Draft
    if (kind === 'period') {
      const flipped: DayPeriod = before.period === 'am' ? 'pm' : 'am'
      const period: DayPeriod =
        action === 'home' ? 'am' : action === 'end' ? 'pm' : before.period ? flipped : up ? 'am' : 'pm'
      next = { ...before, period }
    } else {
      // No relógio de 12h a hora anda como no mostrador: 12, 1, 2 … 11.
      const twelve = kind === 'hour' && hourCycle === 12
      const [low, high] = twelve ? [0, 11] : rangeOf(kind)
      const { unit, offset } = stepOf(kind)
      const first = low + offset
      const last = first + Math.floor((high - first) / unit) * unit
      const page = action === 'pageUp' || action === 'pageDown'
      const amount = page ? Math.ceil((kind === 'hour' ? 2 : 15) / unit) * unit : unit
      const shown = before[kind]
      const current = shown === null ? null : twelve ? shown % 12 : shown
      let number: number
      if (action === 'home') number = first
      else if (action === 'end') number = last
      else if (current === null) number = up ? first : last
      else if (up) {
        number = first + Math.floor((current - first) / unit) * unit + amount
        if (number > high) number = first
      } else {
        number = first + Math.ceil((current - first) / unit) * unit - amount
        if (number < low) number = last
      }
      next = { ...before, [kind]: twelve ? number || 12 : number }
    }
    // As setas não saem de min/max: param no limite.
    const parts = draftTime(next, withSeconds)
    if (parts) next = draftFromTime(clampTime(parts, limits), hourCycle)
    resetTyped()
    commit(next)
  }

  const clearSegment = (kind: SegmentKind, back: boolean) => {
    const current = latest.current.view
    resetTyped()
    if (current[kind] !== null) commit({ ...current, [kind]: null })
    else if (back) focusSegment(neighbor(kind, -1))
  }

  const handleSegmentKeyDown = (kind: SegmentKind) => (event: KeyboardEvent<HTMLSpanElement>) => {
    onKeyDown?.(event as unknown as KeyboardEvent<HTMLInputElement>)
    if (event.defaultPrevented) return
    const { key } = event
    // Atalhos do navegador (copiar, colar, recarregar) seguem o caminho deles.
    if (key === 'Tab' || event.ctrlKey || event.metaKey) return
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      event.preventDefault()
      resetTyped()
      focusSegment(neighbor(kind, key === 'ArrowRight' ? 1 : -1))
      return
    }
    if (key === 'Enter') {
      // Como num input: Enter envia o formulário (e nunca quebra a linha do segmento).
      event.preventDefault()
      inputRef.current?.form?.requestSubmit?.()
      return
    }
    if (!editable) {
      if (key.length === 1) event.preventDefault()
      return
    }
    if (event.altKey && key === 'ArrowDown') {
      event.preventDefault()
      if (hasList) openList()
    } else if (SPIN_KEYS[key]) {
      event.preventDefault()
      spin(kind, SPIN_KEYS[key])
    } else if (key === 'Backspace' || key === 'Delete') {
      event.preventDefault()
      clearSegment(kind, key === 'Backspace')
    } else if (key.length === 1) {
      // Qualquer caractere é tratado aqui, nunca inserido pelo navegador no segmento.
      event.preventDefault()
      typeChar(kind, key)
    }
  }

  // Teclados virtuais (celular) não mandam a tecla no keydown: o texto chega por beforeinput.
  // Listeners nativos, porque o React não tem `onBeforeInput` com `inputType`.
  const segmentInput = useRef({ typeText, clearSegment, editable })
  segmentInput.current = { typeText, clearSegment, editable }
  const kindsKey = kinds.join(' ')
  useEffect(() => {
    const cleanups = (kindsKey.split(' ') as SegmentKind[]).map((kind) => {
      const element = segmentRefs.current[kind]
      if (!element) return () => {}
      // O texto do segmento é sempre o nosso: o que o navegador escrever é desfeito.
      const restore = () => {
        const text = element.dataset.text ?? ''
        if (element.textContent !== text) element.textContent = text
      }
      const beforeInput = (event: InputEvent) => {
        // Texto em composição não pode ser cancelado: é desfeito e tratado no `input`.
        if (event.inputType === 'insertCompositionText') return
        event.preventDefault()
        if (!segmentInput.current.editable) return
        if (event.inputType.startsWith('delete')) segmentInput.current.clearSegment(kind, true)
        else if (event.data) segmentInput.current.typeText(kind, event.data)
      }
      const input = (event: Event) => {
        const { inputType, data } = event as InputEvent
        restore()
        // A composição traz o texto inteiro a cada tecla ("p", depois "pm"): vale a última.
        if (inputType === 'insertCompositionText' && data && segmentInput.current.editable)
          segmentInput.current.typeText(kind, data.slice(-1))
      }
      element.addEventListener('beforeinput', beforeInput)
      element.addEventListener('input', input)
      element.addEventListener('compositionend', restore)
      return () => {
        element.removeEventListener('beforeinput', beforeInput)
        element.removeEventListener('input', input)
        element.removeEventListener('compositionend', restore)
      }
    })
    return () => cleanups.forEach((cleanup) => cleanup())
  }, [kindsKey])

  const handlePaste = (event: ClipboardEvent<HTMLSpanElement>) => {
    event.preventDefault()
    if (!editable) return
    const pasted = parseLooseTime(event.clipboardData.getData('text'))
    if (!pasted) return
    resetTyped()
    commit(draftFromTime(pasted, hourCycle))
  }

  const handleCopy = (event: ClipboardEvent<HTMLSpanElement>) => {
    if (!time) return
    event.preventDefault()
    event.clipboardData.setData('text/plain', displayTime(time, display))
  }

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
    resetTyped()
    // Saiu com o horário pela metade: avisa (o valor, até aqui, é vazio).
    setIncomplete(partial)
    onBlur?.(event as unknown as FocusEvent<HTMLInputElement>)
  }

  /** Clique na área livre do campo: o foco vai para o primeiro segmento, como num input. */
  const handleFramePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const target = event.target as Element
    if (disabled || target.closest('.or-time-field__segment, .or-time-field__button')) return
    event.preventDefault()
    focusSegment(kinds[0])
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
              <div
                role="group"
                aria-labelledby={labelId}
                aria-label={labelId ? undefined : ariaLabel}
                aria-disabled={disabled || undefined}
                className="or-time-field__segments"
              >
                {kinds.map((kind, index) => {
                  const current = view[kind]
                  const text =
                    current === null
                      ? '--'
                      : kind === 'period'
                        ? periods[current as DayPeriod]
                        : pad(current as number)
                  const name = t(SEGMENT_LABEL[kind])
                  const [low, high] = kind === 'period' ? [0, 1] : rangeOf(kind)
                  const now =
                    current === null
                      ? undefined
                      : kind === 'period'
                        ? current === 'am'
                          ? 0
                          : 1
                        : (current as number)
                  return (
                    <Fragment key={kind}>
                      {/* Dois-pontos entre os números; espaço antes ou depois do AM/PM. */}
                      {index > 0 && (
                        <span className="or-time-field__literal" aria-hidden="true">
                          {kind === 'period' || kinds[index - 1] === 'period' ? ' ' : ':'}
                        </span>
                      )}
                      <span
                        ref={(element) => {
                          segmentRefs.current[kind] = element
                        }}
                        role="spinbutton"
                        tabIndex={disabled ? -1 : 0}
                        // Editável para o teclado virtual do celular abrir; o texto é sempre o nosso.
                        contentEditable={editable || undefined}
                        suppressContentEditableWarning
                        inputMode={kind === 'period' ? 'text' : 'numeric'}
                        enterKeyHint="next"
                        autoCapitalize="off"
                        autoCorrect="off"
                        spellCheck={false}
                        className="or-time-field__segment"
                        data-kind={kind}
                        data-text={text}
                        data-placeholder={current === null || undefined}
                        // Só o nome do segmento ("hora"): o nome do campo vem do grupo em volta. Sem
                        // `id` + `aria-labelledby` aqui: com eles, o Firefox dos testes (Playwright
                        // e o axe do Storybook na mesma página) derrubava o processo da página.
                        aria-label={name}
                        // Descrição e erro uma vez só, no primeiro segmento.
                        aria-describedby={index === 0 ? fieldProps['aria-describedby'] : undefined}
                        aria-valuenow={now}
                        aria-valuemin={low}
                        aria-valuemax={high}
                        aria-valuetext={current === null ? t('emptyValue') : text}
                        aria-invalid={invalid || undefined}
                        aria-required={required || undefined}
                        aria-readonly={readOnly || undefined}
                        aria-disabled={disabled || undefined}
                        onKeyDown={handleSegmentKeyDown(kind)}
                        onFocus={resetTyped}
                        onPaste={handlePaste}
                        onCopy={handleCopy}
                      >
                        {text}
                      </span>
                    </Fragment>
                  )
                })}
              </div>
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
                onFocus={() => focusSegment(kinds[0])}
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
