import { forwardRef, useMemo, useRef, type InputHTMLAttributes, type MouseEvent, type ReactNode } from 'react'
import { useId } from '../../hooks'
import { cx, mergeRefs } from '../../utils'
import { useFieldControlProps } from '../Field'
import './TextField.css'

/** Tamanho dos controles de texto: `sm` 32px, `md` 40px, `lg` 48px. */
export type ControlSize = 'sm' | 'md' | 'lg'

/**
 * Props internas do controle com moldura (`.or-control-frame`) compartilhado
 * por TextField, PasswordField e NumberField. Não é exportado pela biblioteca.
 */
export interface InputControlProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  size?: ControlSize
  /** Força o estado inválido mesmo sem mensagem de erro. */
  invalid?: boolean
  startIcon?: ReactNode
  endIcon?: ReactNode
  /** Texto fixo antes do valor (ex.: `https://`, `R$`). */
  prefix?: ReactNode
  /** Texto fixo depois do valor (ex.: `kg`, `.com.br`). */
  suffix?: ReactNode
  /** Elementos interativos no início da moldura (botões internos). */
  leading?: ReactNode
  /** Elementos interativos no fim da moldura (botões internos). */
  trailing?: ReactNode
  /** Ids extras para `aria-describedby` (contador, requisitos…). */
  describedBy?: string
  /** Conteúdo renderizado logo abaixo da moldura. */
  after?: ReactNode
  frameClassName?: string
}

export const InputControl = forwardRef<HTMLInputElement, InputControlProps>(function InputControl(
  {
    size = 'md',
    invalid,
    startIcon,
    endIcon,
    prefix,
    suffix,
    leading,
    trailing,
    describedBy,
    after,
    frameClassName,
    className,
    id,
    required,
    disabled,
    readOnly,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    ...rest
  },
  ref,
) {
  const innerRef = useRef<HTMLInputElement>(null)
  const ref2 = useMemo(() => mergeRefs(ref, innerRef), [ref])
  const affixId = useId('or-affix')
  const hasPrefix = prefix !== undefined && prefix !== null && prefix !== false
  const hasSuffix = suffix !== undefined && suffix !== null && suffix !== false
  const prefixId = hasPrefix ? `${affixId}-prefix` : undefined
  const suffixId = hasSuffix ? `${affixId}-suffix` : undefined

  const controlProps = useFieldControlProps({
    id,
    'aria-describedby': [ariaDescribedBy, prefixId, suffixId, describedBy].filter(Boolean).join(' ') || undefined,
    'aria-invalid': invalid || ariaInvalid === true || ariaInvalid === 'true' ? true : undefined,
    required,
    disabled,
  })
  const isInvalid = controlProps['aria-invalid'] === true
  const isDisabled = Boolean(controlProps.disabled)

  // Clicar em qualquer parte da moldura (ícone, prefixo) foca o campo.
  const handleFrameMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    const input = innerRef.current
    if (!input || isDisabled || target === input || target.closest('button, a, input, select, textarea')) return
    event.preventDefault()
    input.focus()
  }

  return (
    <>
      {/* O mousedown só amplia a área de clique do input (que já é focável por teclado). */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className={cx('or-control-frame', `or-control-frame--${size}`, 'or-input-frame', frameClassName)}
        data-invalid={isInvalid || undefined}
        data-disabled={isDisabled || undefined}
        data-readonly={readOnly || undefined}
        onMouseDown={handleFrameMouseDown}
      >
        {leading}
        {hasPrefix && (
          <span id={prefixId} className="or-input-frame__affix or-input-frame__affix--prefix">
            {prefix}
          </span>
        )}
        {startIcon && (
          <span className="or-control-frame__addon or-control-frame__addon--start" aria-hidden="true">
            {startIcon}
          </span>
        )}
        <input
          ref={ref2}
          className={cx('or-control-frame__input', className)}
          readOnly={readOnly}
          {...controlProps}
          {...rest}
        />
        {endIcon && (
          <span className="or-control-frame__addon or-control-frame__addon--end" aria-hidden="true">
            {endIcon}
          </span>
        )}
        {hasSuffix && (
          <span id={suffixId} className="or-input-frame__affix or-input-frame__affix--suffix">
            {suffix}
          </span>
        )}
        {trailing}
      </div>
      {after}
    </>
  )
})
