import { forwardRef, type MouseEvent, type ReactNode } from 'react'
import { useClipboard } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx } from '../../utils'
import { Button, type ButtonProps } from '../Button'
import { rovingItemProps, useActionGroup } from '../ButtonGroup/context'
import { VisuallyHidden } from '../VisuallyHidden'
import './CopyButton.css'

export interface CopyButtonProps extends Omit<
  ButtonProps,
  'value' | 'onCopy' | 'iconOnly' | 'startIcon' | 'endIcon' | 'loading' | 'loadingText'
> {
  /** Texto copiado para a área de transferência. */
  value: string
  /**
   * Rótulo visível. Sem `children`, o botão mostra só o ícone e usa
   * `t('copyToClipboard')` como nome acessível.
   */
  children?: ReactNode
  /** Texto exibido e anunciado após copiar. Padrão: `t('copied')` ("Copiado!"). */
  copiedLabel?: string
  /** Tempo (ms) em que o estado "copiado" permanece visível. */
  timeout?: number
  /** Chamado com o valor depois de copiar com sucesso. */
  onCopy?: (value: string) => void
}

/**
 * Copia `value` para a área de transferência. O ícone vira um check e a
 * confirmação é anunciada em uma região `aria-live="polite"`.
 */
export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(function CopyButton(
  {
    value,
    children,
    copiedLabel,
    timeout = 2000,
    onCopy,
    onClick,
    variant,
    size,
    disabled,
    className,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const group = useActionGroup()
  const { copy, copied } = useClipboard(timeout)
  const iconOnly = children === undefined || children === null || children === false
  const doneLabel = copiedLabel ?? t('copied')

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (event.defaultPrevented) return
    const ok = await copy(value)
    if (ok) onCopy?.(value)
  }

  const icon = (
    <span className="or-copy-button__icons">
      <Icon name="copy" className="or-copy-button__icon or-copy-button__icon--copy" />
      <Icon
        name="check"
        strokeWidth={2.25}
        className="or-copy-button__icon or-copy-button__icon--check"
      />
    </span>
  )

  return (
    <>
      <Button
        ref={ref}
        variant={variant ?? group?.variant ?? (iconOnly ? 'ghost' : 'outline')}
        size={size ?? group?.size ?? 'md'}
        disabled={disabled ?? group?.disabled}
        iconOnly={iconOnly}
        aria-label={iconOnly ? t('copyToClipboard') : undefined}
        startIcon={icon}
        className={cx('or-copy-button', className)}
        data-copied={copied ? '' : undefined}
        onClick={handleClick}
        {...rovingItemProps(group)}
        {...rest}
      >
        {iconOnly ? undefined : (
          <span className="or-copy-button__labels">
            <span className="or-copy-button__text" aria-hidden={copied || undefined}>
              {children}
            </span>
            <span className="or-copy-button__text" aria-hidden={!copied || undefined}>
              {doneLabel}
            </span>
          </span>
        )}
      </Button>
      <VisuallyHidden role="status" aria-live="polite" aria-atomic="true">
        {copied ? doneLabel : ''}
      </VisuallyHidden>
    </>
  )
})
