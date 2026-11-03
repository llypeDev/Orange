import { forwardRef, useCallback, useMemo, type HTMLAttributes } from 'react'
import { useControllableState } from '../../hooks'
import { cx } from '../../utils'
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
  /** `single`: no máximo um botão pressionado (clicar no pressionado o solta). */
  type: 'single'
  /** Valor pressionado (controlado). `null` quando nenhum. */
  value?: string | null
  /** Valor inicial (não controlado). */
  defaultValue?: string | null
  onChange?: (value: string | null) => void
}

export interface ToggleButtonGroupMultipleProps extends ToggleButtonGroupBaseProps {
  /** `multiple`: qualquer combinação de botões pressionados. */
  type: 'multiple'
  /** Valores pressionados (controlado). */
  value?: string[]
  /** Valores iniciais (não controlado). */
  defaultValue?: string[]
  onChange?: (value: string[]) => void
}

export type ToggleButtonGroupProps = ToggleButtonGroupSingleProps | ToggleButtonGroupMultipleProps

type GroupValue = string | null | string[]

/**
 * Agrupa ToggleButtons relacionados (`role="group"`) e controla quais estão
 * pressionados. Cada botão continua sendo um `aria-pressed` independente.
 * Para uma escolha exclusiva e obrigatória, prefira o SegmentedControl.
 */
export const ToggleButtonGroup = forwardRef<HTMLDivElement, ToggleButtonGroupProps>(
  function ToggleButtonGroup(props, ref) {
    const {
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
    const multiple = type === 'multiple'

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
          data-type={type}
          {...rest}
        >
          {children}
        </ButtonGroup>
      </ToggleGroupContext.Provider>
    )
  },
)
