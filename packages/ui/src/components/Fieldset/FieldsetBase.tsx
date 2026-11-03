import { forwardRef, type FieldsetHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react'
import { useId } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx } from '../../utils'
import { VisuallyHidden } from '../VisuallyHidden'
import './Fieldset.css'

/**
 * Base interna de `<fieldset>` usada por Fieldset (aparência `section`) e por
 * CheckboxGroup/RadioGroup (aparência `group`, legenda com estilo de rótulo).
 * Não é exportada pela biblioteca.
 */
export interface FieldsetBaseProps extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'title'> {
  appearance: 'section' | 'group'
  legend?: ReactNode
  hideLegend?: boolean
  description?: ReactNode
  error?: ReactNode
  required?: boolean
  optional?: boolean
  /** Anuncia "obrigatório" na legenda (para grupos sem `required` nativo, como checkboxes). */
  announceRequired?: boolean
  /** Props do contêiner que envolve os filhos. */
  contentProps?: HTMLAttributes<HTMLDivElement> & Record<`data-${string}`, string | undefined>
  children?: ReactNode
}

export function hasContent(node: ReactNode) {
  return node !== undefined && node !== null && node !== false && node !== ''
}

export const FieldsetBase = forwardRef<HTMLFieldSetElement, FieldsetBaseProps>(function FieldsetBase(
  {
    appearance,
    legend,
    hideLegend = false,
    description,
    error,
    required = false,
    optional = false,
    announceRequired = false,
    contentProps,
    className,
    children,
    'aria-describedby': ariaDescribedBy,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const baseId = useId('or-fieldset')
  const hasDescription = hasContent(description)
  const hasError = hasContent(error)
  const descriptionId = hasDescription ? `${baseId}-description` : undefined
  const errorId = hasError ? `${baseId}-error` : undefined
  const describedBy = [ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <fieldset
      ref={ref}
      className={cx('or-fieldset', `or-fieldset--${appearance}`, className)}
      aria-describedby={describedBy}
      data-invalid={hasError || undefined}
      {...rest}
    >
      {hasContent(legend) && (
        <legend className={cx('or-fieldset__legend', hideLegend && 'or-visually-hidden')}>
          {legend}
          {required && (
            <span className="or-fieldset__required" aria-hidden="true">
              *
            </span>
          )}
          {required && announceRequired && <VisuallyHidden> ({t('required')})</VisuallyHidden>}
          {optional && !required && <span className="or-fieldset__optional">({t('optional')})</span>}
        </legend>
      )}
      {hasDescription && (
        <p id={descriptionId} className="or-fieldset__description">
          {description}
        </p>
      )}
      <div {...contentProps} className={cx('or-fieldset__content', contentProps?.className)}>
        {children}
      </div>
      {hasError && (
        <p id={errorId} className="or-fieldset__error">
          <Icon name="alert-circle" size="sm" />
          <span>{error}</span>
        </p>
      )}
    </fieldset>
  )
})
