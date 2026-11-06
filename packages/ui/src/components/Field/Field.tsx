import { createContext, forwardRef, useContext, useMemo, type HTMLAttributes, type ReactNode } from 'react'
import { useId } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx } from '../../utils'
import './Field.css'

export interface FieldContextValue {
  controlId: string
  labelId: string
  descriptionId?: string
  errorId?: string
  invalid: boolean
  required: boolean
  disabled: boolean
}

const FieldContext = createContext<FieldContextValue | null>(null)

/** Lê o contexto do `Field` mais próximo (ou `null`). */
export function useField(): FieldContextValue | null {
  return useContext(FieldContext)
}

export interface FieldControlProps {
  id?: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  'aria-labelledby'?: string
  required?: boolean
  disabled?: boolean
}

/**
 * Retorna os atributos que ligam um controle (input, select, textarea) ao
 * rótulo, à descrição e à mensagem de erro do `Field` que o envolve.
 * Valores passados em `own` têm precedência.
 */
export function useFieldControlProps(own: FieldControlProps = {}): FieldControlProps {
  const field = useField()
  if (!field) return own
  const describedBy = [own['aria-describedby'], field.descriptionId, field.errorId].filter(Boolean).join(' ')
  return {
    id: own.id ?? field.controlId,
    'aria-describedby': describedBy || undefined,
    'aria-invalid': own['aria-invalid'] ?? (field.invalid || undefined),
    required: own.required ?? (field.required || undefined),
    disabled: own.disabled ?? (field.disabled || undefined),
    ...(own['aria-labelledby'] ? { 'aria-labelledby': own['aria-labelledby'] } : {}),
  }
}

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Rótulo visível do campo. Sempre informe um rótulo — mesmo que oculto. */
  label?: ReactNode
  /** Oculta o rótulo visualmente (continua acessível). */
  hideLabel?: boolean
  /** Texto de ajuda exibido abaixo do rótulo. */
  description?: ReactNode
  /** Mensagem de erro. Quando presente, o campo fica inválido. */
  error?: ReactNode
  /** Força o estado inválido sem exibir mensagem (ex.: erro mostrado em um ErrorSummary). */
  invalid?: boolean
  /** Campo obrigatório: mostra `*` e marca o controle como `required`. */
  required?: boolean
  /** Mostra "(opcional)" ao lado do rótulo. */
  optional?: boolean
  disabled?: boolean
  /** Id do controle. Gerado automaticamente se omitido. */
  controlId?: string
  /** Elemento extra à direita do rótulo (ex.: contador, link). */
  labelAside?: ReactNode
  children: ReactNode
}

/**
 * Estrutura padrão de campos de formulário: rótulo, descrição, controle e
 * erro, com todos os vínculos ARIA (`for`, `aria-describedby`, `aria-invalid`).
 */
export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  {
    label,
    hideLabel = false,
    description,
    error,
    invalid = false,
    required = false,
    optional = false,
    disabled = false,
    controlId: controlIdProp,
    labelAside,
    className,
    children,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const controlId = useId('or-field', controlIdProp)
  const hasError = error !== undefined && error !== null && error !== false && error !== ''
  const isInvalid = hasError || invalid
  const value = useMemo<FieldContextValue>(
    () => ({
      controlId,
      labelId: `${controlId}-label`,
      descriptionId: description ? `${controlId}-description` : undefined,
      errorId: hasError ? `${controlId}-error` : undefined,
      invalid: isInvalid,
      required,
      disabled,
    }),
    [controlId, description, hasError, isInvalid, required, disabled],
  )

  return (
    <FieldContext.Provider value={value}>
      <div
        ref={ref}
        className={cx('or-field', className)}
        data-invalid={isInvalid || undefined}
        data-disabled={disabled || undefined}
        {...rest}
      >
        {label && (
          <div className={cx('or-field__label-row', hideLabel && 'or-visually-hidden')}>
            <label id={value.labelId} htmlFor={controlId} className="or-field__label">
              {label}
              {required && (
                <span className="or-field__required" aria-hidden="true">
                  *
                </span>
              )}
              {optional && !required && <span className="or-field__optional">({t('optional')})</span>}
            </label>
            {labelAside && <span className="or-field__label-aside">{labelAside}</span>}
          </div>
        )}
        {description && (
          <p id={value.descriptionId} className="or-field__description">
            {description}
          </p>
        )}
        {children}
        {hasError && (
          <p id={value.errorId} className="or-field__error">
            <Icon name="alert-circle" size="sm" />
            <span>{error}</span>
          </p>
        )}
      </div>
    </FieldContext.Provider>
  )
})
