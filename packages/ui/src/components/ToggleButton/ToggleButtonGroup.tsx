import { forwardRef, useCallback, useMemo, type HTMLAttributes } from 'react'
import { useControllableState } from '../../hooks'
import { cx, deprecate } from '../../utils'
import type { ButtonSize } from '../Button'
import { ButtonGroup, type ButtonGroupOrientation } from '../ButtonGroup/ButtonGroup'
import { ToggleGroupContext, type ToggleGroupContextValue } from './context'
import type { ToggleButtonVariant } from './ToggleButton'

interface ToggleButtonGroupBaseProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  /** Cola os botões, com bordas internas compartilhadas. */
  attached?: boolean
  orientation?: ButtonGroupOrientation
  /** Tamanho repassado aos ToggleButtons. */
  size?: ButtonSize
  /** Variante repassada aos ToggleButtons. */
  variant?: ToggleButtonVariant
  /** Desabilita todos os botões. */
  disabled?: boolean
}

export interface ToggleButtonGroupSingleProps extends ToggleButtonGroupBaseProps {
  /** `single` (padrão): no máximo um botão pressionado (clicar no pressionado o solta). */
  selectionMode?: 'single'
  /** @deprecated Use `selectionMode` (o mesmo nome de `Listbox` e `TreeView`). Sai na v1.0. */
  type?: 'single'
  /** Valor pressionado (controlado). `null` quando nenhum. */
  value?: string | null
  /** Valor inicial (não controlado). */
  defaultValue?: string | null
  onChange?: (value: string | null) => void
}

export interface ToggleButtonGroupMultipleProps extends ToggleButtonGroupBaseProps {
  /** `multiple`: qualquer combinação de botões pressionados. */
  selectionMode: 'multiple'
  /** @deprecated Use `selectionMode` (o mesmo nome de `Listbox` e `TreeView`). Sai na v1.0. */
  type?: 'multiple'
  /** Valores pressionados (controlado). */
  value?: string[]
  /** Valores iniciais (não controlado). */
  defaultValue?: string[]
  onChange?: (value: string[]) => void
}

/** Forma antiga, com `type="multiple"` no lugar de `selectionMode`. Sai na v1.0. */
interface ToggleButtonGroupLegacyMultipleProps extends Omit<
  ToggleButtonGroupMultipleProps,
  'selectionMode' | 'type'
> {
  /** @deprecated Use `selectionMode="multiple"`. Sai na v1.0. */
  type: 'multiple'
  selectionMode?: 'multiple'
}

export type ToggleButtonGroupProps =
  | ToggleButtonGroupSingleProps
  | ToggleButtonGroupMultipleProps
  | ToggleButtonGroupLegacyMultipleProps

type GroupValue = string | null | string[]

/**
 * Agrupa ToggleButtons relacionados (`role="group"`) e controla quais estão
 * pressionados. Cada botão continua sendo um `aria-pressed` independente.
 * Para uma escolha exclusiva e obrigatória, prefira o SegmentedControl.
 */
export const ToggleButtonGroup = forwardRef<HTMLDivElement, ToggleButtonGroupProps>(
  function ToggleButtonGroup(props, ref) {
    const {
      selectionMode,
      type,
      value: valueProp,
      defaultValue,
      onChange,
      attached = false,
      orientation,
      size,
      variant,
      disabled,
      className,
      children,
      ...rest
    } = props
    if (type !== undefined) {
      deprecate(
        'ToggleButtonGroup: `type` está depreciado e sai na v1.0. Use `selectionMode`.',
        'toggle-button-group.type',
      )
    }
    const mode = selectionMode ?? type ?? 'single'
    const multiple = mode === 'multiple'

    const [value, setValue] = useControllableState<GroupValue>({
      value: valueProp,
      defaultValue: defaultValue ?? (multiple ? [] : null),
      onChange: onChange as ((value: GroupValue) => void) | undefined,
    })

    const isPressed = useCallback(
      (item: string) => (Array.isArray(value) ? value.includes(item) : value === item),
      [value],
    )

    const toggle = useCallback(
      (item: string) => {
        setValue((prev) => {
          if (multiple) {
            const list = Array.isArray(prev) ? prev : []
            return list.includes(item) ? list.filter((v) => v !== item) : [...list, item]
          }
          return prev === item ? null : item
        })
      },
      [multiple, setValue],
    )

    const ctx = useMemo<ToggleGroupContextValue>(() => ({ isPressed, toggle }), [isPressed, toggle])

    return (
      <ToggleGroupContext.Provider value={ctx}>
        <ButtonGroup
          ref={ref}
          attached={attached}
          orientation={orientation}
          size={size}
          variant={variant}
          disabled={disabled}
          className={cx('or-toggle-button-group', className)}
          data-type={mode}
          {...rest}
        >
          {children}
        </ButtonGroup>
      </ToggleGroupContext.Provider>
    )
  },
)
