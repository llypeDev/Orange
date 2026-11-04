import { forwardRef, useMemo, type FieldsetHTMLAttributes, type ReactNode } from 'react'
import { useControllableState, useId } from '../../hooks'
import { cx } from '../../utils'
import { FieldsetBase } from '../Fieldset/FieldsetBase'
import { Radio } from './Radio'
import { RadioGroupContext, type RadioGroupContextValue } from './RadioGroupContext'
import './RadioGroup.css'

export interface RadioGroupOption {
  value: string
  label: ReactNode
  description?: ReactNode
  disabled?: boolean
}

export type RadioGroupVariant = 'default' | 'card'

export interface RadioGroupProps
  extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'defaultValue' | 'onChange' | 'title'> {
  /** Pergunta ou título do grupo, renderizado como `<legend>`. */
  label: ReactNode
  /** Oculta a legenda visualmente (continua acessível). */
  hideLabel?: boolean
  /** Texto de ajuda do grupo, ligado por `aria-describedby`. */
  description?: ReactNode
  /** Mensagem de erro do grupo. */
  error?: ReactNode
  /** Exige uma escolha: aplica `required` nativo a todas as opções. */
  required?: boolean
  /** Mostra "(opcional)" ao lado da legenda. */
  optional?: boolean
  /** Desabilita nativamente todas as opções. */
  disabled?: boolean
  /** `name` compartilhado pelas opções. Gerado automaticamente se omitido. */
  name?: string
  /** Valor selecionado (controlado). `null` = nenhum. */
  value?: string | null
  /** Valor selecionado inicialmente (não controlado). */
  defaultValue?: string | null
  /** Chamado com o valor da opção escolhida. */
  onChange?: (value: string) => void
  /** Opções geradas automaticamente. Alternativa a passar `<Radio>` como filhos. */
  options?: RadioGroupOption[]
  /** Disposição das opções. Padrão: `vertical`. */
  orientation?: 'vertical' | 'horizontal'
  /** `card` mostra cada opção em um cartão com borda (laranja quando selecionado). */
  variant?: RadioGroupVariant
  children?: ReactNode
}

/**
 * Grupo de botões de opção para uma escolha única entre poucas alternativas,
 * com `<fieldset>`/`<legend>` e radios nativos — Tab entra no grupo e as setas
 * mudam a seleção.
 */
export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(function RadioGroup(
  {
    label,
    hideLabel,
    description,
    error,
    required = false,
    optional,
    disabled = false,
    name: nameProp,
    value: valueProp,
    defaultValue = null,
    onChange,
    options,
    orientation = 'vertical',
    variant = 'default',
    className,
    children,
    ...rest
  },
  ref,
) {
  const name = useId('or-radio-group', nameProp)
  const [value, setValue] = useControllableState<string | null>({
    value: valueProp,
    defaultValue,
    onChange: onChange as ((value: string | null) => void) | undefined,
  })

  const context = useMemo<RadioGroupContextValue>(
    () => ({ name, value, disabled, required, variant, select: (next) => setValue(next) }),
    [name, value, disabled, required, variant, setValue],
  )

  return (
    <RadioGroupContext.Provider value={context}>
      <FieldsetBase
        ref={ref}
        appearance="group"
        legend={label}
        hideLegend={hideLabel}
        description={description}
        error={error}
        required={required}
        optional={optional}
        disabled={disabled}
        className={cx('or-radio-group', `or-radio-group--${variant}`, className)}
        contentProps={{ 'data-orientation': orientation, className: 'or-radio-group__options' }}
        {...rest}
      >
        {options?.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            label={option.label}
            description={option.description}
            disabled={option.disabled}
          />
        ))}
        {children}
      </FieldsetBase>
    </RadioGroupContext.Provider>
  )
})
