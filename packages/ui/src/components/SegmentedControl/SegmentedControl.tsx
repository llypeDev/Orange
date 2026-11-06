import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { useControllableState, useId, useIsomorphicLayoutEffect } from '../../hooks'
import { Icon, type IconName } from '../../icons'
import { cx, deprecate, devWarning, mergeRefs } from '../../utils'
import { VisuallyHidden } from '../VisuallyHidden'
import './SegmentedControl.css'

export type SegmentedControlSize = 'sm' | 'md' | 'lg'

export interface SegmentedControlOption {
  /** Valor enviado em `onChange` e no formulário. */
  value: string
  /** Rótulo da opção. Também é o nome acessível quando `iconOnly`. */
  label: string
  /** Ícone antes do rótulo. */
  icon?: IconName
  /** Desabilita somente esta opção. */
  disabled?: boolean
}

export interface SegmentedControlProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue' | 'children'
> {
  /** Rótulo do grupo (obrigatório). Use `hideLabel` para escondê-lo visualmente. */
  label: ReactNode
  /** Esconde o rótulo visualmente, mantendo-o para leitores de tela. */
  hideLabel?: boolean
  /** Texto de ajuda abaixo do rótulo. */
  description?: ReactNode
  /** De 2 a 5 opções mutuamente exclusivas. */
  options: SegmentedControlOption[]
  /** Valor selecionado (controlado). */
  value?: string
  /** Valor inicial (não controlado). Padrão: a primeira opção habilitada. */
  defaultValue?: string
  onChange?: (value: string) => void
  /** Altura: `sm` 32px, `md` 40px, `lg` 48px. */
  size?: SegmentedControlSize
  /** Ocupa toda a largura disponível; as opções dividem o espaço igualmente. */
  block?: boolean
  /** @deprecated Use `block` (o mesmo nome do `Button`). Sai na v1.0. */
  fullWidth?: boolean
  /** Mostra apenas os ícones; os rótulos continuam disponíveis para leitores de tela. */
  iconOnly?: boolean
  /** Desabilita o grupo inteiro. */
  disabled?: boolean
  /** Atributo `name` dos radios (gerado automaticamente se omitido). */
  name?: string
}

interface IndicatorRect {
  x: number
  width: number
}

/**
 * Escolha exclusiva entre 2 a 5 opções, sempre visíveis. É um grupo de radios
 * nativos (`role="radiogroup"`): Tab entra no grupo pela opção selecionada e
 * as setas mudam a seleção.
 */
export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  function SegmentedControl(
    {
      label,
      hideLabel = false,
      description,
      options,
      value: valueProp,
      defaultValue,
      onChange,
      size = 'md',
      block: blockProp,
      fullWidth,
      iconOnly = false,
      disabled = false,
      name: nameProp,
      id: idProp,
      className,
      style,
      ...rest
    },
    ref,
  ) {
    if (fullWidth !== undefined) {
      deprecate(
        'SegmentedControl: `fullWidth` está depreciado e sai na v1.0. Use `block`.',
        'segmented-control.fullWidth',
      )
    }
    const block = blockProp ?? fullWidth ?? false
    const id = useId('or-segmented', idProp)
    const name = nameProp ?? id
    const labelId = `${id}-label`
    const descriptionId = description ? `${id}-description` : undefined

    devWarning(
      options.length < 2 || options.length > 5,
      'SegmentedControl funciona melhor com 2 a 5 opções. Para mais opções, use Select ou RadioGroup.',
    )
    devWarning(
      iconOnly && options.some((option) => !option.icon),
      'SegmentedControl com `iconOnly` precisa de `icon` em todas as opções.',
    )

    const [value, setValue] = useControllableState<string | undefined>({
      value: valueProp,
      defaultValue: defaultValue ?? options.find((option) => !option.disabled)?.value,
      onChange: onChange as ((value: string | undefined) => void) | undefined,
    })

    const trackRef = useRef<HTMLDivElement>(null)
    const [indicator, setIndicator] = useState<IndicatorRect | null>(null)
    // A transição só é ligada depois da primeira medição, para o indicador não
    // "deslizar" a partir da borda esquerda ao montar.
    const [animate, setAnimate] = useState(false)

    const measure = useCallback(() => {
      const track = trackRef.current
      if (!track) return
      const selected = track.querySelector<HTMLElement>('[data-checked]')
      setIndicator((prev) => {
        if (!selected) return null
        const next = { x: selected.offsetLeft, width: selected.offsetWidth }
        return prev && prev.x === next.x && prev.width === next.width ? prev : next
      })
    }, [])

    useIsomorphicLayoutEffect(measure, [measure, value, options, size, iconOnly, block])

    useEffect(() => {
      const track = trackRef.current
      if (!track || typeof ResizeObserver === 'undefined') return
      const observer = new ResizeObserver(() => measure())
      observer.observe(track)
      return () => observer.disconnect()
    }, [measure])

    useEffect(() => {
      if (!indicator || animate) return
      const frame = requestAnimationFrame(() => setAnimate(true))
      return () => cancelAnimationFrame(frame)
    }, [indicator, animate])

    return (
      <div
        className={cx(
          'or-segmented-control',
          `or-segmented-control--${size}`,
          block && 'or-segmented-control--full-width',
          iconOnly && 'or-segmented-control--icon-only',
          disabled && 'or-segmented-control--disabled',
          className,
        )}
        style={style}
      >
        <span
          id={labelId}
          className={cx('or-segmented-control__label', hideLabel && 'or-visually-hidden')}
        >
          {label}
        </span>
        {description && (
          <p id={descriptionId} className="or-segmented-control__description">
            {description}
          </p>
        )}
        <div
          ref={mergeRefs(ref, trackRef)}
          id={idProp}
          role="radiogroup"
          aria-labelledby={labelId}
          aria-describedby={descriptionId}
          aria-disabled={disabled || undefined}
          className="or-segmented-control__track"
          data-ready={indicator ? '' : undefined}
          data-animate={animate ? '' : undefined}
          {...rest}
        >
          <span
            className="or-segmented-control__indicator"
            aria-hidden="true"
            style={
              indicator
                ? { width: indicator.width, transform: `translateX(${indicator.x}px)` }
                : { opacity: 0 }
            }
          />
          {options.map((option) => {
            const checked = option.value === value
            const optionDisabled = disabled || option.disabled
            return (
              <label
                key={option.value}
                className="or-segmented-control__option"
                data-checked={checked ? '' : undefined}
                data-disabled={optionDisabled ? '' : undefined}
                title={iconOnly ? option.label : undefined}
              >
                <input
                  type="radio"
                  className="or-segmented-control__input or-visually-hidden"
                  name={name}
                  value={option.value}
                  checked={checked}
                  disabled={optionDisabled}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    if (event.target.checked) setValue(option.value)
                  }}
                />
                <span className="or-segmented-control__content">
                  {option.icon && (
                    <Icon name={option.icon} className="or-segmented-control__icon" />
                  )}
                  {iconOnly ? (
                    <VisuallyHidden>{option.label}</VisuallyHidden>
                  ) : (
                    <span className="or-segmented-control__text">{option.label}</span>
                  )}
                </span>
              </label>
            )
          })}
        </div>
      </div>
    )
  },
)
