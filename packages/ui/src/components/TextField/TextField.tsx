import { forwardRef, useState, type ChangeEvent, type InputHTMLAttributes, type ReactNode } from 'react'
import { useId } from '../../hooks'
import { cx, devWarning } from '../../utils'
import { Field } from '../Field'
import { CharacterCount } from './CharacterCount'
import { InputControl, type ControlSize } from './InputControl'

export type TextFieldType = 'text' | 'email' | 'url' | 'tel' | 'search'
export type TextFieldSize = ControlSize

/** Props de rótulo, ajuda e validação comuns aos campos de texto. */
export interface TextFieldBaseProps {
  /** Rótulo visível do campo. Sempre informe um rótulo — use `hideLabel` para ocultá-lo. */
  label?: ReactNode
  /** Oculta o rótulo visualmente (continua acessível). */
  hideLabel?: boolean
  /** Texto de ajuda exibido abaixo do rótulo e ligado por `aria-describedby`. */
  description?: ReactNode
  /** Mensagem de erro. Quando presente, o campo fica inválido. */
  error?: ReactNode
  /** Força o estado inválido sem exibir mensagem (ex.: erro mostrado em um ErrorSummary). */
  invalid?: boolean
  /** Campo obrigatório: mostra `*` no rótulo e aplica `required`. */
  required?: boolean
  /** Mostra "(opcional)" ao lado do rótulo. */
  optional?: boolean
  /** Elemento à direita do rótulo (ex.: link "Esqueceu a senha?"). */
  labelAside?: ReactNode
  /** Altura do controle: `sm` 32px, `md` 40px, `lg` 48px. */
  size?: TextFieldSize
  /** Chamado com o novo texto a cada alteração (atalho para `onChange`). */
  onValueChange?: (value: string) => void
}

export interface TextFieldProps
  extends TextFieldBaseProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'type'> {
  /** Tipo do campo. Para senhas use `PasswordField`; para números, `NumberField`. */
  type?: TextFieldType
  /** Ícone decorativo no início do campo. */
  startIcon?: ReactNode
  /** Ícone decorativo no fim do campo. */
  endIcon?: ReactNode
  /** Texto fixo antes do valor (ex.: `https://`, `R$`). É lido junto com a descrição. */
  prefix?: ReactNode
  /** Texto fixo depois do valor (ex.: `kg`, `.com.br`). É lido junto com a descrição. */
  suffix?: ReactNode
  /** Mostra o contador "x de y caracteres". Requer `maxLength`. */
  showCount?: boolean
}

/**
 * Campo de texto de uma linha com rótulo, ajuda, erro, ícones, prefixo/sufixo
 * e contador de caracteres. A `ref` e as props nativas vão para o `<input>`;
 * `className` e `style` vão para o contêiner do campo.
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    label,
    hideLabel,
    description,
    error,
    invalid,
    required,
    optional,
    labelAside,
    disabled,
    id,
    className,
    style,
    size = 'md',
    type = 'text',
    showCount = false,
    maxLength,
    value,
    defaultValue,
    onChange,
    onValueChange,
    ...rest
  },
  ref,
) {
  const countId = useId('or-text-field-count')
  const [uncontrolledLength, setUncontrolledLength] = useState(() => String(defaultValue ?? '').length)
  const length = value !== undefined ? String(value ?? '').length : uncontrolledLength
  const withCount = showCount && typeof maxLength === 'number'
  devWarning(showCount && maxLength === undefined, 'TextField com `showCount` precisa de `maxLength`.')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUncontrolledLength(event.target.value.length)
    onChange?.(event)
    onValueChange?.(event.target.value)
  }

  return (
    <Field
      label={label}
      hideLabel={hideLabel}
      description={description}
      error={error}
      required={required}
      optional={optional}
      disabled={disabled}
      controlId={id}
      labelAside={labelAside}
      className={cx('or-text-field', className)}
      style={style}
    >
      <InputControl
        ref={ref}
        type={type}
        size={size}
        invalid={invalid}
        value={value}
        defaultValue={defaultValue}
        maxLength={maxLength}
        onChange={handleChange}
        describedBy={withCount ? countId : undefined}
        after={withCount ? <CharacterCount id={countId} count={length} max={maxLength} /> : null}
        {...rest}
      />
    </Field>
  )
})
