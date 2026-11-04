import {
  forwardRef,
  useCallback,
  useRef,
  type ChangeEvent,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react'
import { useIsomorphicLayoutEffect } from '../../hooks'
import { Icon } from '../../icons'
import { cx, mergeRefs } from '../../utils'
import { Field, useFieldControlProps } from '../Field'
import './Select.css'

export type SelectSize = 'sm' | 'md' | 'lg'

export interface SelectOption {
  /** Valor enviado no formulário. */
  value: string
  /** Texto exibido. */
  label: string
  disabled?: boolean
}

export interface SelectOptionGroup {
  /** Título do grupo (`<optgroup label>`). */
  label: string
  options: SelectOption[]
  disabled?: boolean
}

export interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'size' | 'multiple'
> {
  /** Rótulo visível do campo. */
  label?: ReactNode
  /** Oculta o rótulo visualmente (continua acessível). */
  hideLabel?: boolean
  /** Texto de ajuda exibido abaixo do rótulo. */
  description?: ReactNode
  /** Mensagem de erro. Quando presente, o campo fica inválido. */
  error?: ReactNode
  /** Marca o campo como inválido sem exibir mensagem. */
  invalid?: boolean
  /** Opções (ou grupos de opções). Alternativa a passar `<option>`/`<optgroup>` como children. */
  options?: Array<SelectOption | SelectOptionGroup>
  /**
   * Texto exibido enquanto nada foi escolhido (opção de valor vazio). Se o campo for
   * `required`, a opção fica desabilitada e não pode ser escolhida de volta.
   */
  placeholder?: string
  /** Altura do controle: `sm` 32px, `md` 40px, `lg` 48px. */
  size?: SelectSize
  /** Classe aplicada ao contêiner externo. */
  className?: string
}

function isGroup(item: SelectOption | SelectOptionGroup): item is SelectOptionGroup {
  return Array.isArray((item as SelectOptionGroup).options)
}

interface SelectControlProps extends Omit<
  SelectProps,
  'label' | 'hideLabel' | 'description' | 'error' | 'className'
> {
  selectRef: React.Ref<HTMLSelectElement>
}

function SelectControl({
  selectRef,
  options,
  placeholder,
  size = 'md',
  invalid,
  required,
  disabled,
  id,
  children,
  value,
  defaultValue,
  onChange,
  ...rest
}: SelectControlProps) {
  const innerRef = useRef<HTMLSelectElement>(null)
  const controlProps = useFieldControlProps({
    id,
    required,
    disabled,
    'aria-invalid': invalid || undefined,
    'aria-describedby': rest['aria-describedby'],
  })

  // Marca o estado "placeholder visível" direto no DOM para estilizar o texto
  // em tom secundário, inclusive no modo não controlado.
  const syncPlaceholder = useCallback(() => {
    const el = innerRef.current
    if (!el) return
    el.toggleAttribute('data-placeholder-shown', placeholder !== undefined && el.value === '')
  }, [placeholder])
  useIsomorphicLayoutEffect(syncPlaceholder)

  const resolvedDefault =
    value === undefined && defaultValue === undefined && placeholder !== undefined
      ? ''
      : defaultValue

  return (
    <div
      className={cx('or-select', `or-select--${size}`)}
      data-disabled={controlProps.disabled || undefined}
    >
      <select
        ref={mergeRefs(innerRef, selectRef)}
        className={cx('or-control', `or-control--${size}`, 'or-select__control')}
        value={value}
        defaultValue={resolvedDefault}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => {
          onChange?.(event)
          syncPlaceholder()
        }}
        {...rest}
        {...controlProps}
      >
        {placeholder !== undefined && (
          <option
            value=""
            disabled={Boolean(controlProps.required)}
            className="or-select__placeholder"
          >
            {placeholder}
          </option>
        )}
        {options?.map((item) =>
          isGroup(item) ? (
            <optgroup key={`group-${item.label}`} label={item.label} disabled={item.disabled}>
              {item.options.map((option) => (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </option>
              ))}
            </optgroup>
          ) : (
            <option key={item.value} value={item.value} disabled={item.disabled}>
              {item.label}
            </option>
          ),
        )}
        {children}
      </select>
      <span className="or-select__chevron" aria-hidden="true">
        <Icon name="chevron-down" size={size === 'lg' ? 'md' : 'sm'} />
      </span>
    </div>
  )
}

/**
 * Lista suspensa baseada no `<select>` nativo: teclado, leitores de tela e
 * foco vêm prontos. Onde o navegador suporta o select customizável
 * (`appearance: base-select`), a lista aberta também ganha o visual do Orange;
 * nos demais, abre o seletor do sistema. Use para escolher uma opção entre
 * poucas (até ~15). Para listas longas com busca, use `Combobox`.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hideLabel, description, error, required, disabled, id, className, ...rest },
  ref,
) {
  return (
    <Field
      label={label}
      hideLabel={hideLabel}
      description={description}
      error={error}
      required={required}
      disabled={disabled}
      controlId={id}
      className={cx('or-select-field', className)}
    >
      <SelectControl selectRef={ref} required={required} disabled={disabled} {...rest} />
    </Field>
  )
})
