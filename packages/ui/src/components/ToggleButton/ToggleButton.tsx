import { forwardRef, type MouseEvent } from 'react'
import { useControllableState } from '../../hooks'
import { Icon } from '../../icons'
import { cx, devWarning } from '../../utils'
import { Button, type ButtonProps } from '../Button'
import { rovingItemProps, useActionGroup } from '../ButtonGroup/context'
import { useToggleGroup } from './context'
import './ToggleButton.css'

export type ToggleButtonVariant = 'outline' | 'ghost'

export interface ToggleButtonProps extends Omit<ButtonProps, 'variant' | 'value' | 'onChange'> {
  /** Estilo visual em repouso. Pressionado, o botão ganha fundo, borda e barra laranjas. */
  variant?: ToggleButtonVariant
  /** Estado pressionado (controlado). */
  pressed?: boolean
  /** Estado pressionado inicial (não controlado). */
  defaultPressed?: boolean
  /** Chamado com o novo estado quando o usuário alterna o botão. */
  onPressedChange?: (pressed: boolean) => void
  /** Identificador do botão dentro de um `ToggleButtonGroup`. */
  value?: string
  /**
   * Mostra um indicador antes do rótulo: `+` solto e check pressionado (o
   * espaço é fixo, então a largura não muda). Padrão: `true` para botões com
   * texto e sem `startIcon`.
   */
  showCheck?: boolean
}

/**
 * Botão de alternância (liga/desliga) com `aria-pressed`. O rótulo não muda
 * entre os estados — o estado é comunicado pelo `aria-pressed` e, visualmente,
 * por fundo, borda, barra inferior e indicador (+ → check).
 */
export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(function ToggleButton(
  {
    variant,
    size,
    disabled,
    pressed: pressedProp,
    defaultPressed = false,
    onPressedChange,
    value,
    showCheck,
    iconOnly = false,
    startIcon,
    className,
    children,
    onClick,
    ...rest
  },
  ref,
) {
  const group = useActionGroup()
  const toggleGroup = useToggleGroup()
  devWarning(
    toggleGroup !== null && value === undefined,
    'ToggleButton dentro de ToggleButtonGroup precisa da prop `value`.',
  )
  const inGroup = toggleGroup !== null && value !== undefined

  const [ownPressed, setOwnPressed] = useControllableState({
    value: pressedProp,
    defaultValue: defaultPressed,
    onChange: onPressedChange,
  })
  const pressed = inGroup ? toggleGroup.isPressed(value) : ownPressed

  const groupVariant =
    group?.variant === 'ghost' || group?.variant === 'outline' ? group.variant : undefined
  const withCheck = (showCheck ?? (!iconOnly && !startIcon)) && !iconOnly

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (event.defaultPrevented) return
    if (inGroup) toggleGroup.toggle(value)
    else setOwnPressed(!pressed)
  }

  return (
    <Button
      ref={ref}
      variant={variant ?? groupVariant ?? 'outline'}
      size={size ?? group?.size ?? 'md'}
      disabled={disabled ?? group?.disabled}
      iconOnly={iconOnly}
      startIcon={startIcon}
      aria-pressed={pressed}
      data-state={pressed ? 'on' : 'off'}
      value={value}
      className={cx('or-toggle-button', withCheck && 'or-toggle-button--with-check', className)}
      onClick={handleClick}
      {...rovingItemProps(group)}
      {...rest}
    >
      {withCheck ? (
        <>
          <span className="or-toggle-button__check" aria-hidden="true">
            <Icon name="plus" className="or-toggle-button__check-off" />
            <Icon name="check" strokeWidth={2.25} className="or-toggle-button__check-on" />
          </span>
          {children}
        </>
      ) : (
        children
      )}
    </Button>
  )
})
