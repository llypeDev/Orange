import { forwardRef, useMemo, type FieldsetHTMLAttributes, type ReactNode } from 'react'
import { useControllableState } from '../../hooks'
import { cx } from '../../utils'
import { FieldsetBase, hasContent } from '../Fieldset/FieldsetBase'
import { Checkbox } from './Checkbox'
import { CheckboxGroupContext, type CheckboxGroupContextValue } from './CheckboxGroupContext'

export interface CheckboxGroupOption {
  value: string
  label: ReactNode
  description?: ReactNode
  disabled?: boolean
}

export interface CheckboxGroupProps
  extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'defaultValue' | 'onChange' | 'title'> {
  /** Pergunta ou título do grupo, renderizado como `<legend>`. */
  label: ReactNode
  /** Oculta a legenda visualmente (continua acessível). */
  hideLabel?: boolean
  /** Texto de ajuda do grupo, ligado por `aria-describedby`. */
  description?: ReactNode
  /** Mensagem de erro do grupo. */
  error?: ReactNode
  /** Mostra `*` e anuncia "obrigatório" na legenda. A validação fica com o formulário. */
  required?: boolean
  /** Mostra "(opcional)" ao lado da legenda. */
  optional?: boolean
  /** Desabilita nativamente todas as opções. */
  disabled?: boolean
  /** `name` aplicado a todas as caixas (envio de formulário). */
  name?: string
  /** Valores marcados (controlado). */
  value?: string[]
  /** Valores marcados inicialmente (não controlado). */
  defaultValue?: string[]
  /** Chamado com a lista de valores marcados. */
  onChange?: (value: string[]) => void
  /** Opções geradas automaticamente. Alternativa a passar `<Checkbox>` como filhos. */
  options?: CheckboxGroupOption[]
  /** Disposição das opções. Padrão: `vertical`. */
  orientation?: 'vertical' | 'horizontal'
  children?: ReactNode
}

/**
 * Grupo de caixas de seleção para escolhas múltiplas, com `<fieldset>` e
 * `<legend>` nativos. Recebe `options` ou `<Checkbox value="…">` como filhos.
 */
export const CheckboxGroup = forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(function CheckboxGroup(
  {
    label,
    hideLabel,
    description,
    error,
    required,
    optional,
    disabled = false,
    name,
    value: valueProp,
    defaultValue = [],
    onChange,
    options,
    orientation = 'vertical',
    className,
    children,
    ...rest
  },
  ref,
) {
  const [value, setValue] = useControllableState<string[]>({ value: valueProp, defaultValue, onChange })
  const invalid = hasContent(error)

  const context = useMemo<CheckboxGroupContextValue>(
    () => ({
      name,
      value,
      disabled,
      invalid,
      toggle: (item, checked) =>
        setValue((prev) => (checked ? (prev.includes(item) ? prev : [...prev, item]) : prev.filter((v) => v !== item))),
    }),
    [name, value, disabled, invalid, setValue],
  )

  return (
    <CheckboxGroupContext.Provider value={context}>
      <FieldsetBase
        ref={ref}
        appearance="group"
        legend={label}
        hideLegend={hideLabel}
        description={description}
        error={error}
        required={required}
        optional={optional}
        announceRequired
        disabled={disabled}
        className={cx('or-checkbox-group', className)}
        contentProps={{ 'data-orientation': orientation }}
        {...rest}
      >
        {options?.map((option) => (
          <Checkbox
            key={option.value}
            value={option.value}
            label={option.label}
            description={option.description}
            disabled={option.disabled}
          />
        ))}
        {children}
      </FieldsetBase>
    </CheckboxGroupContext.Provider>
  )
})
