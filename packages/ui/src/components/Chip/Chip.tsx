import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { useControllableState, useId } from '../../hooks'
import { Icon } from '../../icons'
import { composeEventHandlers, cx, devWarning } from '../../utils'
import { VisuallyHidden } from '../VisuallyHidden'
import './Chip.css'

export type ChipSize = 'sm' | 'md'

interface ChipGroupContextValue {
  isSelected: (value: string) => boolean
  toggle: (value: string) => void
  size?: ChipSize
  disabled: boolean
}

const ChipGroupContext = createContext<ChipGroupContextValue | null>(null)

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  /** Valor do chip dentro de um `ChipGroup`. */
  value?: string
  /** Selecionado (controlado, fora de um grupo). */
  selected?: boolean
  /** Selecionado inicialmente (não controlado, fora de um grupo). */
  defaultSelected?: boolean
  /** Chamado quando o chip é alternado (fora de um grupo). */
  onSelectedChange?: (selected: boolean) => void
  /** Ícone antes do rótulo. Quando selecionado, dá lugar ao check. */
  icon?: ReactNode
  /** Contagem exibida após o rótulo (ex.: resultados do filtro). */
  count?: number
  /** Altura: `sm` 28px ou `md` 32px. */
  size?: ChipSize
}

/**
 * Botão de alternância para filtros (`aria-pressed`). Mostra um check
 * quando selecionado. Agrupe com `ChipGroup`.
 */
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  {
    value,
    selected: selectedProp,
    defaultSelected = false,
    onSelectedChange,
    icon,
    count,
    size: sizeProp,
    disabled: disabledProp,
    className,
    children,
    onClick,
    ...rest
  },
  ref,
) {
  const group = useContext(ChipGroupContext)
  devWarning(group !== null && value === undefined, 'Chip dentro de ChipGroup precisa de `value`.')
  const [ownSelected, setOwnSelected] = useControllableState({
    value: selectedProp,
    defaultValue: defaultSelected,
    onChange: onSelectedChange,
  })
  const inGroup = group !== null && value !== undefined
  const selected = inGroup ? group.isSelected(value) : ownSelected
  const disabled = disabledProp ?? group?.disabled ?? false
  const size = sizeProp ?? group?.size ?? 'md'
  // O check só anima depois de uma interação (não "pisca" no carregamento).
  const [touched, setTouched] = useState(false)

  return (
    <button
      ref={ref}
      type="button"
      className={cx('or-chip', `or-chip--${size}`, className)}
      aria-pressed={selected}
      disabled={disabled}
      data-touched={touched || undefined}
      onClick={composeEventHandlers(onClick, () => {
        setTouched(true)
        if (inGroup) group.toggle(value)
        else setOwnSelected(!selected)
      })}
      {...rest}
    >
      {(selected || icon) && (
        <span className={cx('or-chip__icon', selected && 'or-chip__icon--check')} aria-hidden="true">
          {selected ? <Icon name="check" strokeWidth={2.25} /> : icon}
        </span>
      )}
      <span className="or-chip__label">{children}</span>
      {count !== undefined && (
        <>
          <span className="or-chip__count" aria-hidden="true">
            {count}
          </span>
          <VisuallyHidden>{`\u00a0(${count})`}</VisuallyHidden>
        </>
      )}
    </button>
  )
})

interface ChipGroupBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Rótulo do grupo (ex.: "Status"). */
  label?: ReactNode
  /** Esconde o rótulo visualmente (continua acessível). */
  hideLabel?: boolean
  /** Tamanho aplicado a todos os chips. */
  size?: ChipSize
  /** Desabilita todos os chips. */
  disabled?: boolean
}

export interface ChipGroupMultipleProps extends ChipGroupBaseProps {
  /** `multiple` (padrão): vários chips selecionados. */
  selectionMode?: 'multiple'
  value?: string[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
}

export interface ChipGroupSingleProps extends ChipGroupBaseProps {
  /** `single`: no máximo um chip selecionado; clicar no selecionado o desmarca. */
  selectionMode: 'single'
  value?: string | null
  defaultValue?: string | null
  onChange?: (value: string | null) => void
}

export type ChipGroupProps = ChipGroupMultipleProps | ChipGroupSingleProps

function toArray(value: string | string[] | null | undefined): string[] | undefined {
  if (value === undefined) return undefined
  if (value === null) return []
  return Array.isArray(value) ? value : [value]
}

/** Agrupa chips de filtro (`role="group"` rotulado) com seleção única ou múltipla. */
export const ChipGroup = forwardRef<HTMLDivElement, ChipGroupProps>(function ChipGroup(props, ref) {
  const {
    selectionMode = 'multiple',
    value,
    defaultValue,
    onChange,
    label,
    hideLabel = false,
    size,
    disabled = false,
    className,
    children,
    ...rest
  } = props
  const single = selectionMode === 'single'
  const labelId = useId('or-chip-group')
  devWarning(
    !label && !rest['aria-label'] && !rest['aria-labelledby'],
    'ChipGroup precisa de `label` (ou `aria-label`/`aria-labelledby`).',
  )

  const [selected, setSelected] = useControllableState<string[]>({
    value: toArray(value),
    defaultValue: toArray(defaultValue) ?? [],
    onChange: (next) => {
      if (single) (onChange as ((v: string | null) => void) | undefined)?.(next[0] ?? null)
      else (onChange as ((v: string[]) => void) | undefined)?.(next)
    },
  })

  const toggle = useCallback(
    (chipValue: string) => {
      setSelected((prev) => {
        const isOn = prev.includes(chipValue)
        if (single) return isOn ? [] : [chipValue]
        return isOn ? prev.filter((v) => v !== chipValue) : [...prev, chipValue]
      })
    },
    [single, setSelected],
  )

  const context = useMemo<ChipGroupContextValue>(
    () => ({ isSelected: (v) => selected.includes(v), toggle, size, disabled }),
    [selected, toggle, size, disabled],
  )

  return (
    <ChipGroupContext.Provider value={context}>
      <div
        ref={ref}
        role="group"
        aria-labelledby={label ? labelId : undefined}
        className={cx('or-chip-group', className)}
        {...rest}
      >
        {label &&
          (hideLabel ? (
            <VisuallyHidden id={labelId}>{label}</VisuallyHidden>
          ) : (
            <span id={labelId} className="or-chip-group__label">
              {label}
            </span>
          ))}
        {children}
      </div>
    </ChipGroupContext.Provider>
  )
})
