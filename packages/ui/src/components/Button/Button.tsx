import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { useLocale } from '../../providers'
import { cx, devWarning } from '../../utils'
import { VisuallyHidden } from '../VisuallyHidden'
import './Button.css'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Estilo visual. `primary` é a ação principal; use apenas um por contexto. */
  variant?: ButtonVariant
  /** Altura do botão: `sm` 32px, `md` 40px, `lg` 48px. */
  size?: ButtonSize
  /** Ocupa toda a largura disponível. */
  block?: boolean
  /** Mostra um indicador de carregamento e bloqueia novos cliques. */
  loading?: boolean
  /** Texto anunciado a leitores de tela durante o carregamento. */
  loadingText?: string
  /** Ícone antes do rótulo. */
  startIcon?: ReactNode
  /** Ícone depois do rótulo (desliza levemente no hover). */
  endIcon?: ReactNode
  /**
   * Botão somente com ícone (quadrado). Exige `aria-label` para ser
   * compreendido por leitores de tela.
   */
  iconOnly?: boolean
}

/** Gera as classes do botão — útil para estilizar links como botões. */
export function buttonClassName({
  variant = 'primary',
  size = 'md',
  block = false,
  iconOnly = false,
}: Pick<ButtonProps, 'variant' | 'size' | 'block' | 'iconOnly'> = {}) {
  return cx(
    'or-button',
    `or-button--${variant}`,
    `or-button--${size}`,
    block && 'or-button--block',
    iconOnly && 'or-button--icon-only',
  )
}

/**
 * Botões disparam ações: salvar, enviar, excluir, abrir um diálogo.
 * Para navegar entre páginas, use `Link`.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    block = false,
    loading = false,
    loadingText,
    startIcon,
    endIcon,
    iconOnly = false,
    type = 'button',
    disabled,
    className,
    children,
    onClick,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  devWarning(
    iconOnly && !rest['aria-label'] && !rest['aria-labelledby'],
    'Button com `iconOnly` precisa de `aria-label` ou `aria-labelledby`.',
  )
  return (
    <button
      ref={ref}
      type={type}
      className={cx(buttonClassName({ variant, size, block, iconOnly }), loading && 'or-button--loading', className)}
      disabled={disabled}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={(event) => {
        if (loading) {
          event.preventDefault()
          return
        }
        onClick?.(event)
      }}
      {...rest}
    >
      {loading && (
        <>
          <span className="or-button__spinner" aria-hidden="true" />
          <VisuallyHidden role="status">{loadingText ?? t('loading')}</VisuallyHidden>
        </>
      )}
      {startIcon && (
        <span className="or-button__icon or-button__icon--start" aria-hidden="true">
          {startIcon}
        </span>
      )}
      {children !== undefined && children !== null && <span className="or-button__label">{children}</span>}
      {endIcon && (
        <span className="or-button__icon or-button__icon--end" aria-hidden="true">
          {endIcon}
        </span>
      )}
    </button>
  )
})
