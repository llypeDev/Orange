import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type FormHTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx, mergeRefs } from '../../utils'
import { useInlinePresence } from '../Combobox/motion'
import { Field, useFieldControlProps } from '../Field'
import './Search.css'

export type SearchSize = 'sm' | 'md' | 'lg'

export interface SearchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange' | 'size' | 'type'
> {
  /** Rótulo do campo (obrigatório — fica oculto por padrão, mas é lido por leitores de tela). */
  label: ReactNode
  /** Oculta o rótulo visualmente. Padrão: `true`. */
  hideLabel?: boolean
  /** Texto de ajuda exibido abaixo do rótulo. */
  description?: ReactNode
  /** Texto buscado (controlado). */
  value?: string
  /** Texto inicial (não controlado). */
  defaultValue?: string
  /**
   * Chamado quando o texto muda. Com `debounce`, só é chamado após a pausa na
   * digitação (limpar e enviar disparam na hora).
   */
  onChange?: (value: string) => void
  /** Chamado ao pressionar Enter ou enviar o formulário. */
  onSearch?: (value: string) => void
  /** Chamado quando o campo é limpo (botão ou Escape). */
  onClear?: () => void
  /** Atraso em ms para chamar `onChange` (busca enquanto digita). */
  debounce?: number
  /** Mostra um indicador de carregamento no lugar da lupa. */
  loading?: boolean
  /** Altura do controle: `sm` 32px, `md` 40px, `lg` 48px. */
  size?: SearchSize
  /** Atributos extras do `<form role="search">`. */
  formProps?: Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'role'>
  /** Classe aplicada ao `<form>`. */
  className?: string
}

type ControlProps = Omit<
  SearchProps,
  | 'label'
  | 'hideLabel'
  | 'description'
  | 'formProps'
  | 'className'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'onSearch'
  | 'onClear'
  | 'debounce'
> & {
  inputRef: React.Ref<HTMLInputElement>
  text: string
  onTextChange: (text: string) => void
  onClearClick: () => void
}

function SearchControl({
  inputRef,
  text,
  onTextChange,
  onClearClick,
  loading,
  size = 'md',
  disabled,
  readOnly,
  placeholder,
  onKeyDown,
  ...rest
}: ControlProps) {
  const { t } = useLocale()
  const controlProps = useFieldControlProps({
    disabled,
    'aria-describedby': rest['aria-describedby'],
  })
  const isDisabled = Boolean(controlProps.disabled)
  const clearPresence = useInlinePresence<HTMLButtonElement>(Boolean(text) && !isDisabled && !readOnly)
  return (
    <div
      className={cx('or-control-frame', `or-control-frame--${size}`, 'or-search__frame')}
      data-disabled={isDisabled || undefined}
    >
      {/* Lupa e indicador de carregamento ficam empilhados e trocam com fade + escala. */}
      <span
        className="or-control-frame__addon or-control-frame__addon--start or-search__icon"
        data-loading={loading || undefined}
        aria-hidden="true"
      >
        <Icon name="search" size={size === 'lg' ? 'md' : 'sm'} className="or-search__glyph" />
        <span className="or-search__spinner" />
      </span>
      <input
        ref={inputRef}
        type="search"
        className="or-control-frame__input or-search__input"
        value={text}
        placeholder={placeholder ?? t('searchPlaceholder')}
        autoComplete="off"
        enterKeyHint="search"
        readOnly={readOnly}
        onChange={(event) => onTextChange(event.target.value)}
        onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
          onKeyDown?.(event)
          if (event.defaultPrevented) return
          // Escape limpa o campo; com o campo vazio, deixa o evento seguir (ex.: fechar um modal).
          if (event.key === 'Escape' && text && !readOnly) {
            event.preventDefault()
            event.stopPropagation()
            onClearClick()
          }
        }}
        {...rest}
        {...controlProps}
      />
      {clearPresence.present && (
        <button
          ref={clearPresence.nodeRef}
          type="button"
          className="or-control-frame__button or-search__clear"
          aria-label={t('clear')}
          aria-hidden={clearPresence.closing || undefined}
          tabIndex={clearPresence.closing ? -1 : undefined}
          data-state={clearPresence.dataState}
          onClick={onClearClick}
        >
          <Icon name="close" size="sm" />
        </button>
      )}
    </div>
  )
}

/**
 * Campo de busca: `<form role="search">` com input `type="search"`, lupa,
 * botão de limpar e envio por Enter. Opcionalmente chama `onChange` com
 * atraso (`debounce`) para buscar enquanto o usuário digita.
 */
export const Search = forwardRef<HTMLInputElement, SearchProps>(function Search(
  {
    label,
    hideLabel = true,
    description,
    value,
    defaultValue = '',
    onChange,
    onSearch,
    onClear,
    debounce,
    disabled,
    id,
    formProps,
    className,
    ...rest
  },
  ref,
) {
  const inputEl = useRef<HTMLInputElement>(null)
  const [text, setText] = useState(value ?? defaultValue)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  // Valor controlado vindo de fora sobrescreve o texto local.
  const lastEmitted = useRef(value)
  useEffect(() => {
    if (value !== undefined && value !== lastEmitted.current) {
      lastEmitted.current = value
      setText(value)
    }
  }, [value])
  useEffect(() => () => clearTimeout(timer.current), [])

  const emit = (next: string, immediate = false) => {
    clearTimeout(timer.current)
    const run = () => {
      lastEmitted.current = next
      onChangeRef.current?.(next)
    }
    if (debounce && debounce > 0 && !immediate) timer.current = setTimeout(run, debounce)
    else run()
  }

  const handleTextChange = (next: string) => {
    setText(next)
    emit(next)
  }

  const handleClear = () => {
    setText('')
    emit('', true)
    onClear?.()
    inputEl.current?.focus()
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (disabled) return
    // Envia na hora o que estiver pendente no debounce.
    if (debounce) emit(text, true)
    onSearch?.(text)
  }

  return (
    <form
      {...formProps}
      role="search"
      noValidate
      className={cx('or-search', className)}
      aria-label={formProps?.['aria-label'] ?? (typeof label === 'string' ? label : undefined)}
      onSubmit={handleSubmit}
    >
      <Field
        label={label}
        hideLabel={hideLabel}
        description={description}
        disabled={disabled}
        controlId={id}
      >
        <SearchControl
          inputRef={mergeRefs(inputEl, ref)}
          text={text}
          onTextChange={handleTextChange}
          onClearClick={handleClear}
          disabled={disabled}
          {...rest}
        />
      </Field>
    </form>
  )
})
