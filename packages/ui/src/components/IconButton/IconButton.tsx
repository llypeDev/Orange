import { forwardRef, type ReactElement } from 'react'
import { Icon, type IconName } from '../../icons'
import { cx } from '../../utils'
import { Button, type ButtonProps } from '../Button'
import { rovingItemProps, useActionGroup } from '../ButtonGroup/context'
import './IconButton.css'

export interface IconButtonProps extends Omit<
  ButtonProps,
  'iconOnly' | 'startIcon' | 'endIcon' | 'children' | 'block' | 'aria-label'
> {
  /** Nome de um ícone do Orange ou um elemento SVG próprio. */
  icon: IconName | ReactElement
  /**
   * Nome acessível do botão (vira `aria-label`). Obrigatório: descreva a ação,
   * não o ícone — "Excluir arquivo", não "Lixeira".
   */
  label: string
}

/**
 * Botão quadrado somente com ícone e nome acessível obrigatório.
 * Atalho para `<Button iconOnly aria-label startIcon={<Icon />} />`, com
 * variante `ghost` por padrão e integração com ButtonGroup e Toolbar.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, variant, size, disabled, className, ...rest },
  ref,
) {
  const group = useActionGroup()
  return (
    <Button
      ref={ref}
      iconOnly
      aria-label={label}
      variant={variant ?? group?.variant ?? 'ghost'}
      size={size ?? group?.size ?? 'md'}
      disabled={disabled ?? group?.disabled}
      startIcon={typeof icon === 'string' ? <Icon name={icon} /> : icon}
      className={cx('or-icon-button', className)}
      {...rovingItemProps(group)}
      {...rest}
    />
  )
})
