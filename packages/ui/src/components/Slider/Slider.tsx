import {
  forwardRef,
  Fragment,
  useRef,
  useState,
  type CSSProperties,
  type InputHTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import { useControllableState, useId } from '../../hooks'
import { useLocale } from '../../providers'
import { clamp, cx, mergeRefs } from '../../utils'
import { Field, useField, useFieldControlProps } from '../Field'
import { VisuallyHidden } from '../VisuallyHidden'
import './Slider.css'

export type SliderSize = 'sm' | 'md' | 'lg'

export interface SliderMark {
  value: number
  /** Rótulo exibido abaixo do trilho. Sem rótulo, mostra apenas a marca. */
  label?: ReactNode
}

interface SliderBaseProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange' | 'size' | 'type' | 'min' | 'max' | 'step'
> {
  /** Rótulo visível do campo. */
  label?: ReactNode
  hideLabel?: boolean
  /** Texto de ajuda exibido abaixo do rótulo. */
  description?: ReactNode
  error?: ReactNode
  /** Valor mínimo. Padrão: 0. */
  min?: number
  /** Valor máximo. Padrão: 100. */
  max?: number
  /** Incremento. Padrão: 1. */
  step?: number
  /**
   * Marcas no trilho. `true` = uma por passo; números = marcas sem rótulo;
   * objetos `{ value, label }` = marcas com rótulo (clicáveis com o mouse).
   */
  marks?: boolean | Array<number | SliderMark>
  /** Formata o valor para a saída visível e para `aria-valuetext` (ex.: moeda, %). */
  formatValue?: (value: number) => string
  /** Mostra o valor atual ao lado do rótulo (`<output>`). Padrão: `true`. */
  showValue?: boolean
  /** Tamanho do polegar e do trilho. */
  size?: SliderSize
  /** Marca o campo como inválido sem exibir mensagem. */
  invalid?: boolean
  /** Classe aplicada ao contêiner externo. */
  className?: string
}

export interface SliderSingleProps extends SliderBaseProps {
  range?: false
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  /** Chamado quando o usuário solta o polegar ou a tecla (valor "confirmado"). */
  onChangeEnd?: (value: number) => void
}

export interface SliderRangeProps extends SliderBaseProps {
  /** Dois polegares: mínimo e máximo. */
  range: true
  value?: [number, number]
  defaultValue?: [number, number]
  onChange?: (value: [number, number]) => void
  onChangeEnd?: (value: [number, number]) => void
  /** Distância mínima entre os polegares. Padrão: 0. */
  minDistance?: number
  /** Nomes acessíveis dos polegares. Padrão: "mínimo" e "máximo". */
  thumbLabels?: [string, string]
}

export type SliderProps = SliderSingleProps | SliderRangeProps

function decimals(step: number) {
  const s = String(step)
  return s.includes('.') ? s.split('.')[1].length : 0
}

function snap(value: number, min: number, max: number, step: number) {
  const snapped = Math.round((value - min) / step) * step + min
  return clamp(Number(snapped.toFixed(decimals(step))), min, max)
}

const toArray = (v: number | [number, number] | undefined) =>
  v === undefined ? undefined : Array.isArray(v) ? [v[0], v[1]] : [v]

interface ControlProps {
  inputRef: React.Ref<HTMLInputElement>
  hasLabel: boolean
  values: number[]
  isRange: boolean
  min: number
  max: number
  step: number
  marks?: SliderBaseProps['marks']
  formatValue?: (value: number) => string
  size: SliderSize
  thumbLabels: [string, string]
  onValueChange: (index: number, value: number) => void
  onCommit: () => void
  invalid?: boolean
  disabled?: boolean
  required?: boolean
  rest: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange' | 'size' | 'type' | 'min' | 'max' | 'step'
  >
}

function SliderControl({
  inputRef,
  hasLabel,
  values,
  isRange,
  min,
  max,
  step,
  marks,
  formatValue,
  size,
  thumbLabels,
  onValueChange,
  onCommit,
  invalid,
  disabled,
  required,
  rest,
}: ControlProps) {
  const field = useField()
  const controlProps = useFieldControlProps({
    required,
    disabled,
    'aria-invalid': invalid || undefined,
    'aria-describedby': rest['aria-describedby'],
  })
  const isDisabled = Boolean(controlProps.disabled)
  const baseId = controlProps.id ?? rest.id
  const thumbLabelId = useId('or-slider-thumb')
  const railRef = useRef<HTMLDivElement>(null)
  const inputs = useRef<(HTMLInputElement | null)[]>([])
  const [lastActive, setLastActive] = useState(0)
  // Saltos (clique no trilho/marca, teclado) animam o preenchimento e o polegar; o arraste não.
  const [animate, setAnimate] = useState(false)

  const pct = (v: number) => (max === min ? 0 : ((v - min) / (max - min)) * 100)
  const start = isRange ? pct(values[0]) : 0
  const end = isRange ? pct(values[1]) : pct(values[0])

  // Com os polegares sobrepostos, o de cima é o que consegue se mover para dentro do trilho.
  const topIndex =
    isRange && values[0] === values[1] ? (values[0] > (min + max) / 2 ? 0 : 1) : lastActive

  const markList: SliderMark[] =
    marks === true
      ? (max - min) / step <= 100
        ? Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => ({
            value: min + i * step,
          }))
        : []
      : Array.isArray(marks)
        ? marks
            .map((m) => (typeof m === 'number' ? { value: m } : m))
            .filter((m) => m.value >= min && m.value <= max)
        : []
  const labeledMarks = markList.filter((m) => m.label !== undefined && m.label !== null)

  const nearestIndex = (v: number) => {
    if (!isRange) return 0
    if (v <= values[0]) return 0
    if (v >= values[1]) return 1
    return Math.abs(v - values[0]) <= Math.abs(values[1] - v) ? 0 : 1
  }

  const valueAt = (clientX: number) => {
    const rect = railRef.current!.getBoundingClientRect()
    const ratio = rect.width ? clamp((clientX - rect.left) / rect.width, 0, 1) : 0
    return snap(min + ratio * (max - min), min, max, step)
  }

  // No modo intervalo, os inputs ignoram o ponteiro fora dos polegares: o trilho trata o clique e o arraste.
  const handleRailPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (isDisabled || event.button !== 0 || !isRange) return
    event.preventDefault()
    const v = valueAt(event.clientX)
    const index = nearestIndex(v)
    setAnimate(true)
    setLastActive(index)
    onValueChange(index, v)
    inputs.current[index]?.focus()
    const target = event.currentTarget
    target.setPointerCapture?.(event.pointerId)
    const move = (e: PointerEvent) => {
      setAnimate(false)
      onValueChange(index, valueAt(e.clientX))
    }
    const up = () => {
      target.removeEventListener('pointermove', move)
      target.removeEventListener('pointerup', up)
      target.removeEventListener('pointercancel', up)
      onCommit()
    }
    target.addEventListener('pointermove', move)
    target.addEventListener('pointerup', up)
    target.addEventListener('pointercancel', up)
  }

  const style = {
    '--_start': `${start}%`,
    '--_end': `${end}%`,
    // Preenchimento por transform (anima sem mexer em left/width): posição e tamanho em fração.
    '--_fill-start': start / 100,
    '--_fill-size': (end - start) / 100,
  } as CSSProperties
  const labelId = hasLabel && field ? field.labelId : undefined
  const { 'aria-label': ariaLabel, ...inputRest } = rest

  return (
    <div
      className={cx(
        'or-slider',
        `or-slider--${size}`,
        isRange && 'or-slider--range',
        labeledMarks.length > 0 && 'or-slider--labeled',
      )}
      data-disabled={isDisabled || undefined}
      data-invalid={controlProps['aria-invalid'] || undefined}
      data-animate={animate || undefined}
      style={style}
      role={isRange ? 'group' : undefined}
      aria-labelledby={isRange ? labelId : undefined}
      aria-label={isRange && !labelId ? ariaLabel : undefined}
    >
      <div className="or-slider__control">
        <div ref={railRef} className="or-slider__rail" onPointerDown={handleRailPointerDown}>
          <div className="or-slider__track" />
          {!isRange && <div className="or-slider__cap" />}
          <div className="or-slider__fill" />
          {markList.map((mark) => {
            const p = pct(mark.value)
            return (
              <span
                key={mark.value}
                className="or-slider__tick"
                data-active={(p >= start && p <= end) || undefined}
                style={{ left: `${p}%` }}
                aria-hidden="true"
              />
            )
          })}
        </div>
        {values.map((v, index) => {
          const thumbId = index === 0 ? baseId : `${baseId}-max`
          return (
            <Fragment key={index}>
            <input
              ref={mergeRefs(index === 0 ? inputRef : undefined, (el: HTMLInputElement | null) => {
                inputs.current[index] = el
              })}
              type="range"
              className="or-slider__input"
              min={min}
              max={max}
              step={step}
              value={v}
              data-top={(isRange && topIndex === index) || undefined}
              aria-valuetext={formatValue ? formatValue(v) : undefined}
              aria-labelledby={
                isRange && labelId ? `${labelId} ${thumbLabelId}-${index}` : undefined
              }
              aria-label={
                isRange && !labelId
                  ? `${ariaLabel ?? ''} ${thumbLabels[index]}`.trim()
                  : !isRange
                    ? ariaLabel
                    : undefined
              }
              onChange={(event) => {
                setLastActive(index)
                onValueChange(index, Number(event.target.value))
              }}
              onPointerDown={() => setAnimate(true)}
              onPointerMove={(event) => {
                if (event.buttons & 1) setAnimate(false)
              }}
              onKeyDown={() => setAnimate(true)}
              onPointerUp={onCommit}
              onKeyUp={(event) => {
                if (
                  [
                    'ArrowLeft',
                    'ArrowRight',
                    'ArrowUp',
                    'ArrowDown',
                    'Home',
                    'End',
                    'PageUp',
                    'PageDown',
                  ].includes(event.key)
                )
                  onCommit()
              }}
              {...inputRest}
              {...controlProps}
              id={thumbId}
            />
            {/* Polegar visual: o nativo fica transparente (continua sendo o alvo do ponteiro). */}
            <span
              className="or-slider__thumb-pos"
              data-top={(isRange && topIndex === index) || undefined}
              style={{ '--_p': `${pct(v)}%` } as CSSProperties}
              aria-hidden="true"
            >
              <span className="or-slider__thumb" />
            </span>
            </Fragment>
          )
        })}
        {isRange &&
          thumbLabels.map((text, index) => (
            <VisuallyHidden key={index} id={`${thumbLabelId}-${index}`}>
              {text}
            </VisuallyHidden>
          ))}
      </div>
      {labeledMarks.length > 0 && (
        <div className="or-slider__marks" aria-hidden="true">
          {labeledMarks.map((mark) => {
            const p = pct(mark.value)
            return (
              // Atalho só para mouse (aria-hidden): pelo teclado, as setas fazem o mesmo.
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
              <span
                key={mark.value}
                className="or-slider__mark-label"
                data-edge={p <= 0 ? 'start' : p >= 100 ? 'end' : undefined}
                style={{ left: `${p}%` }}
                onClick={() => {
                  if (isDisabled) return
                  const index = nearestIndex(mark.value)
                  setAnimate(true)
                  onValueChange(index, mark.value)
                  onCommit()
                  inputs.current[index]?.focus()
                }}
              >
                {mark.label}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}

/**
 * Controle deslizante baseado no `<input type="range">` nativo — teclado,
 * leitores de tela e toque funcionam como o navegador manda. No modo `range`,
 * dois polegares definem um intervalo.
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(props, ref) {
  const {
    label,
    hideLabel,
    description,
    error,
    min = 0,
    max = 100,
    step = 1,
    marks,
    formatValue,
    showValue = true,
    size = 'md',
    className,
    range,
    value,
    defaultValue,
    onChange,
    onChangeEnd,
    disabled,
    required,
    invalid,
    id,
    ...restAll
  } = props as SliderBaseProps & {
    range?: boolean
    value?: number | [number, number]
    defaultValue?: number | [number, number]
    onChange?: (value: never) => void
    onChangeEnd?: (value: never) => void
    minDistance?: number
    thumbLabels?: [string, string]
  }
  const { minDistance = 0, thumbLabels: thumbLabelsProp, ...rest } = restAll
  const { t } = useLocale()
  const isRange = range === true
  const thumbLabels: [string, string] = thumbLabelsProp ?? [t('minimum'), t('maximum')]

  const [values, setValues] = useControllableState<number[]>({
    value: toArray(value),
    defaultValue: toArray(defaultValue) ?? (isRange ? [min, max] : [min]),
  })
  const valuesRef = useRef(values)
  valuesRef.current = values

  const emit = (next: number[]) => (isRange ? ([next[0], next[1]] as [number, number]) : next[0])

  const handleValueChange = (index: number, raw: number) => {
    const current = valuesRef.current
    let v = snap(raw, min, max, step)
    if (isRange) {
      v =
        index === 0 ? Math.min(v, current[1] - minDistance) : Math.max(v, current[0] + minDistance)
    }
    if (v === current[index]) return
    const next = [...current]
    next[index] = v
    valuesRef.current = next
    setValues(next)
    ;(onChange as ((value: number | [number, number]) => void) | undefined)?.(emit(next))
  }

  const handleCommit = () => {
    ;(onChangeEnd as ((value: number | [number, number]) => void) | undefined)?.(
      emit(valuesRef.current),
    )
  }

  const format = (v: number) => (formatValue ? formatValue(v) : String(v))
  const outputText = isRange ? `${format(values[0])} – ${format(values[1])}` : format(values[0])
  const fieldId = useId('or-slider', id)

  return (
    <Field
      label={label}
      hideLabel={hideLabel}
      description={description}
      error={error}
      required={required}
      disabled={disabled}
      controlId={fieldId}
      className={cx('or-slider-field', className)}
      labelAside={
        showValue && label ? (
          <output
            className="or-slider__output"
            htmlFor={isRange ? `${fieldId} ${fieldId}-max` : fieldId}
            aria-live="off"
          >
            {outputText}
          </output>
        ) : undefined
      }
    >
      <SliderControl
        inputRef={ref}
        hasLabel={Boolean(label)}
        values={values}
        isRange={isRange}
        min={min}
        max={max}
        step={step}
        marks={marks}
        formatValue={formatValue}
        size={size}
        thumbLabels={thumbLabels}
        onValueChange={handleValueChange}
        onCommit={handleCommit}
        invalid={invalid}
        disabled={disabled}
        required={required}
        rest={rest}
      />
    </Field>
  )
})
