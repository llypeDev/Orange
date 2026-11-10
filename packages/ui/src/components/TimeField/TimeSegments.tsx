/*
 * Segmentos de horário (hora, minuto, segundo, AM/PM): a parte do TimeField que o DateTimePicker
 * também usa. `useTimeSegments` guarda o que está escrito e trata digitação, setas, passo e
 * limites; `TimeSegments` desenha os segmentos. Interno — não é exportado pela biblioteca.
 */
import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
  type RefObject,
} from 'react'
import { useLocale, type MessageKey } from '../../providers'
import { cx } from '../../utils'
import {
  clampTime,
  dayPeriodInfo,
  displayTime,
  formatTime,
  hourCycleOf,
  parseLooseTime,
  parseTime,
  to12Hour,
  to24Hour,
  type DayPeriod,
  type DisplayOptions,
  type HourCycle,
  type TimeLimits,
  type TimeParts,
} from './time'
import './TimeSegments.css'

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

export interface TimeSegmentsOptions {
  /** O horário (`HH:mm` ou `HH:mm:ss`, em 24 horas); `''` enquanto vazio ou pela metade. */
  value: string
  /** Chamado com o novo horário, ou `''` quando ele fica vazio ou pela metade. */
  onChange: (value: string) => void
  /** `min` e `max` em que as setas param, e o passo (em segundos) em que elas andam. */
  limits: TimeLimits
  /** De onde o passo é contado (no TimeField, o `min`). Padrão: a meia-noite. */
  stepFrom?: TimeParts | null
  /** Relógio de 12 ou de 24 horas. Padrão: o do idioma do `OrangeProvider`. */
  hourCycle?: HourCycle
  disabled?: boolean
  readOnly?: boolean
  /** Chamado a cada mudança no que está escrito; `partial` diz se o horário ficou pela metade. */
  onDraftChange?: (partial: boolean) => void
}

/** O estado dos segmentos: o que o campo em volta lê e o que o `TimeSegments` desenha. */
export interface TimeSegmentsState {
  /** O horário do `value`, ou `null` (vazio, pela metade ou fora do formato). */
  time: TimeParts | null
  /** O `value` normalizado (`HH:mm`, ou `HH:mm:ss` com segundos); `''` sem horário. */
  value: string
  /** Como o horário é escrito para a pessoa: relógio do idioma, segundos e AM/PM. */
  display: DisplayOptions
  /** Nem desabilitado nem somente leitura. */
  editable: boolean
  disabled: boolean
  readOnly: boolean
  /** Horário pela metade: alguns segmentos preenchidos, outros não. */
  partial: boolean
  /** No meio de um número ("1" esperando o "5" de "15"): os avisos esperam a pessoa terminar. */
  typing: boolean
  /** Escreve um horário inteiro de uma vez (lista de horários, texto colado). */
  setTime: (time: TimeParts) => void
  /** Esquece os dígitos à espera de mais um (o foco saiu do campo). */
  resetTyping: () => void
  /** Leva o foco ao primeiro segmento. */
  focusFirst: () => void

  // Daqui para baixo, só para o `TimeSegments`.
  kinds: SegmentKind[]
  view: Draft
  segmentRefs: RefObject<Partial<Record<SegmentKind, HTMLSpanElement | null>>>
  rangeOf: (kind: NumberKind) => [number, number]
  focusSegment: (kind: SegmentKind | undefined) => void
  neighbor: (kind: SegmentKind, direction: 1 | -1) => SegmentKind | undefined
  typeChar: (kind: SegmentKind, char: string) => SegmentKind
  typeText: (kind: SegmentKind, text: string) => void
  spin: (kind: SegmentKind, action: SpinAction) => void
  clearSegment: (kind: SegmentKind, back: boolean) => void
}

/**
 * O que está escrito nos segmentos e como eles respondem ao teclado. Enquanto a pessoa digita, o
 * valor é `''` (como no input nativo) e o que já foi escrito mora num rascunho; se o `value` mudar
 * por fora, o rascunho é refeito a partir dele.
 */
export function useTimeSegments({
  value,
  onChange,
  limits,
  stepFrom = null,
  hourCycle: hourCycleProp,
  disabled = false,
  readOnly = false,
  onDraftChange,
}: TimeSegmentsOptions): TimeSegmentsState {
  const { locale } = useLocale()
  const hourCycle: HourCycle = hourCycleProp ?? hourCycleOf(locale)
  const periods = useMemo(() => dayPeriodInfo(locale), [locale])
  const time = parseTime(value)
  const stepSeconds = limits.step
  // Como no input nativo: os segundos aparecem quando o passo os permite ou o valor os traz.
  const withSeconds = stepSeconds % 60 !== 0 || (time?.second ?? 0) !== 0
  const normalized = time ? formatTime(time, withSeconds) : ''
  const display = { hourCycle, withSeconds, periods }
  const editable = !disabled && !readOnly

  // Rascunho ---------------------------------------------------------------
  const [draft, setDraft] = useState<Draft>(() => draftFromTime(time, hourCycle))
  const draftParts = draft.cycle === hourCycle ? draftTime(draft, withSeconds) : null
  const inSync =
    draft.cycle === hourCycle &&
    (draftParts ? formatTime(draftParts, withSeconds) : '') === normalized
  const view = inSync ? draft : draftFromTime(time, hourCycle)
  const partial = !isEmptyDraft(view, withSeconds) && !draftTime(view, withSeconds)
  const [typing, setTyping] = useState(false)

  const segmentRefs = useRef<Partial<Record<SegmentKind, HTMLSpanElement | null>>>({})
  /** Dígitos já digitados no segmento com foco. */
  const typed = useRef('')
  const resetTyping = () => {
    typed.current = ''
    setTyping(false)
  }

  const kinds = useMemo<SegmentKind[]>(() => {
    const clock: SegmentKind[] = withSeconds ? ['hour', 'minute', 'second'] : ['hour', 'minute']
    if (hourCycle === 24) return clock
    return periods.first ? ['period', ...clock] : [...clock, 'period']
  }, [withSeconds, hourCycle, periods.first])

  const focusSegment = (kind: SegmentKind | undefined) => {
    if (kind) segmentRefs.current[kind]?.focus()
  }
  const neighbor = (kind: SegmentKind, direction: 1 | -1): SegmentKind | undefined =>
    kinds[kinds.indexOf(kind) + direction]

  // O rascunho e o valor mais recentes: um teclado virtual pode mandar vários caracteres de uma
  // vez (texto composto, ditado), e cada um precisa partir do resultado do anterior.
  const latest = useRef({ view, value: normalized })
  latest.current = { view, value: normalized }

  const commit = (next: Draft) => {
    setDraft(next)
    const parts = draftTime(next, withSeconds)
    onDraftChange?.(!parts && !isEmptyDraft(next, withSeconds))
    const nextValue = parts ? formatTime(parts, withSeconds) : ''
    const changed = nextValue !== latest.current.value
    latest.current = { view: next, value: nextValue }
    if (changed) onChange(nextValue)
  }

  const setTime = (next: TimeParts) => {
    resetTyping()
    commit(draftFromTime(next, hourCycle))
  }

  // Segmentos --------------------------------------------------------------
  const rangeOf = (kind: NumberKind): [number, number] =>
    kind === 'hour' ? (hourCycle === 12 ? [1, 12] : [0, 23]) : [0, 59]

  /**
   * De quanto em quanto as setas andam no segmento e a partir de qual valor (o de `stepFrom`). Só
   * segue o passo quando ele divide a volta inteira (15 min em 1 h); senão anda de um em um.
   */
  const stepOf = (kind: NumberKind): { unit: number; offset: number } => {
    const turn = kind === 'hour' ? (hourCycle === 12 ? 43200 : 86400) : kind === 'minute' ? 3600 : 60
    const base = kind === 'hour' ? 3600 : kind === 'minute' ? 60 : 1
    const unit = stepSeconds % base === 0 && turn % stepSeconds === 0 ? stepSeconds / base : 1
    return { unit, offset: (stepFrom?.[kind] ?? 0) % unit }
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
    resetTyping()
    commit(next)
  }

  const clearSegment = (kind: SegmentKind, back: boolean) => {
    const current = latest.current.view
    resetTyping()
    if (current[kind] !== null) commit({ ...current, [kind]: null })
    else if (back) focusSegment(neighbor(kind, -1))
  }

  return {
    time,
    value: normalized,
    display,
    editable,
    disabled,
    readOnly,
    partial,
    typing,
    setTime,
    resetTyping,
    focusFirst: () => focusSegment(kinds[0]),
    kinds,
    view,
    segmentRefs,
    rangeOf,
    focusSegment,
    neighbor,
    typeChar,
    typeText,
    spin,
    clearSegment,
  }
}

export interface TimeSegmentsProps {
  /** O estado devolvido por `useTimeSegments`. */
  segments: TimeSegmentsState
  /** Id de quem nomeia o grupo: o rótulo do campo ou o `aria-labelledby` recebido. */
  labelId?: string
  /** O nome do grupo quando não há `labelId` (o `aria-label` recebido, a "Hora" do DateTimePicker). */
  label?: string
  /** Ids da descrição e do erro: lidos uma vez só, no primeiro segmento. */
  describedBy?: string
  invalid?: boolean
  required?: boolean
  className?: string
  /** Recebe as teclas antes dos segmentos; `preventDefault()` cancela o tratamento deles. */
  onKeyDown?: (event: KeyboardEvent<HTMLSpanElement>) => void
  /** Enter num segmento (num input, envia o formulário). */
  onEnter?: (event: KeyboardEvent<HTMLSpanElement>) => void
  /** Alt + seta para baixo num segmento: abre o que o campo tiver para abrir. */
  onOpen?: () => void
}

/**
 * Os segmentos do horário, cada um um `spinbutton` editável pelo teclado, dentro de um grupo que
 * leva o nome do campo. Quem usa cuida da moldura em volta, do foco ao clicar na área livre e do
 * valor.
 */
export function TimeSegments({
  segments,
  labelId,
  label,
  describedBy,
  invalid,
  required,
  className,
  onKeyDown,
  onEnter,
  onOpen,
}: TimeSegmentsProps) {
  const { t } = useLocale()
  const { kinds, view, display, time, editable, disabled, readOnly, segmentRefs } = segments
  const { periods } = display

  const handleKeyDown = (kind: SegmentKind) => (event: KeyboardEvent<HTMLSpanElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    const { key } = event
    // Atalhos do navegador (copiar, colar, recarregar) seguem o caminho deles.
    if (key === 'Tab' || event.ctrlKey || event.metaKey) return
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      event.preventDefault()
      segments.resetTyping()
      segments.focusSegment(segments.neighbor(kind, key === 'ArrowRight' ? 1 : -1))
      return
    }
    if (key === 'Enter') {
      // Como num input: Enter envia o formulário (e nunca quebra a linha do segmento).
      event.preventDefault()
      onEnter?.(event)
      return
    }
    if (!editable) {
      if (key.length === 1) event.preventDefault()
      return
    }
    if (event.altKey && key === 'ArrowDown') {
      event.preventDefault()
      onOpen?.()
    } else if (SPIN_KEYS[key]) {
      event.preventDefault()
      segments.spin(kind, SPIN_KEYS[key])
    } else if (key === 'Backspace' || key === 'Delete') {
      event.preventDefault()
      segments.clearSegment(kind, key === 'Backspace')
    } else if (key.length === 1) {
      // Qualquer caractere é tratado aqui, nunca inserido pelo navegador no segmento.
      event.preventDefault()
      segments.typeChar(kind, key)
    }
  }

  // Teclados virtuais (celular) não mandam a tecla no keydown: o texto chega por beforeinput.
  // Listeners nativos, porque o React não tem `onBeforeInput` com `inputType`.
  const segmentInput = useRef(segments)
  segmentInput.current = segments
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
  }, [kindsKey, segmentRefs])

  const handlePaste = (event: ClipboardEvent<HTMLSpanElement>) => {
    event.preventDefault()
    if (!editable) return
    const pasted = parseLooseTime(event.clipboardData.getData('text'))
    if (pasted) segments.setTime(pasted)
  }

  const handleCopy = (event: ClipboardEvent<HTMLSpanElement>) => {
    if (!time) return
    event.preventDefault()
    event.clipboardData.setData('text/plain', displayTime(time, display))
  }

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      aria-label={labelId ? undefined : label}
      aria-disabled={disabled || undefined}
      className={cx('or-time-field__segments', className)}
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
        const [low, high] = kind === 'period' ? [0, 1] : segments.rangeOf(kind)
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
              aria-describedby={index === 0 ? describedBy : undefined}
              aria-valuenow={now}
              aria-valuemin={low}
              aria-valuemax={high}
              aria-valuetext={current === null ? t('emptyValue') : text}
              aria-invalid={invalid || undefined}
              aria-required={required || undefined}
              aria-readonly={readOnly || undefined}
              aria-disabled={disabled || undefined}
              onKeyDown={handleKeyDown(kind)}
              onFocus={segments.resetTyping}
              onPaste={handlePaste}
              onCopy={handleCopy}
            >
              {text}
            </span>
          </Fragment>
        )
      })}
    </div>
  )
}
