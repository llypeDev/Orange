import { forwardRef, useMemo, type HTMLAttributes } from 'react'
import { cx, devWarning } from '../../utils'
import type { ButtonSize, ButtonVariant } from '../Button'
import {
  ActionGroupContext,
  applyGroupDefaults,
  useActionGroup,
  type ActionGroupContextValue,
} from './context'
import './ButtonGroup.css'

export type ButtonGroupOrientation = 'horizontal' | 'vertical'

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Cola os botões: sem espaço entre eles e com bordas internas compartilhadas. */
  attached?: boolean
  /** Direção do grupo. Padrão: `horizontal` (ou a da Toolbar que o contém). */
  orientation?: ButtonGroupOrientation
  /** Tamanho aplicado a todos os botões que não definem o próprio `size`. */
  size?: ButtonSize
  /** Variante aplicada a todos os botões que não definem a própria `variant`. */
  variant?: ButtonVariant
  /** Desabilita todos os botões do grupo. */
  disabled?: boolean
}

/**
 * Agrupa botões relacionados (`role="group"`). Informe `aria-label` para que
 * leitores de tela anunciem o propósito do grupo. `size`, `variant` e
 * `disabled` são repassados aos botões filhos que não os definem.
 */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  {
    attached = false,
    orientation: orientationProp,
    size,
    variant,
    disabled,
    role = 'group',
    className,
    children,
    ...rest
  },
  ref,
) {
  const parent = useActionGroup()
  const orientation = orientationProp ?? parent?.orientation ?? 'horizontal'
  devWarning(
    role === 'group' && !parent?.roving && !rest['aria-label'] && !rest['aria-labelledby'],
    'Grupos de botões (`role="group"`) precisam de `aria-label` ou `aria-labelledby` para anunciar o seu propósito.',
  )

  const parentSize = parent?.size
  const parentVariant = parent?.variant
  const parentDisabled = parent?.disabled
  const roving = parent?.roving
  const ctx = useMemo<ActionGroupContextValue>(
    () => ({
      size: size ?? parentSize,
      variant: variant ?? parentVariant,
      disabled: disabled || parentDisabled || undefined,
      orientation,
      roving,
    }),
    [size, variant, disabled, parentSize, parentVariant, parentDisabled, orientation, roving],
  )

  return (
    <ActionGroupContext.Provider value={ctx}>
      <div
        ref={ref}
        role={role}
        className={cx(
          'or-button-group',
          `or-button-group--${orientation}`,
          attached && 'or-button-group--attached',
          className,
        )}
        data-orientation={orientation}
        {...rest}
      >
        {applyGroupDefaults(children, ctx)}
      </div>
    </ActionGroupContext.Provider>
  )
})
