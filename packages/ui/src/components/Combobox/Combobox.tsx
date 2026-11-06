import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { useClickOutside, useControllableState, useDisclosure, useId } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx, mergeRefs } from '../../utils'
import { Field, useField, useFieldControlProps } from '../Field'
import { Portal } from '../Portal'
import { useInlinePresence } from './motion'
import {
  defaultOptionFilter,
  Freeze,
  firstEnabledIndex,
  lastEnabledIndex,
  ListboxOptionItem,
  nextEnabledIndex,
  normalizeText,
  useAnnouncer,
  useListboxPopup,
  useScrollActiveIntoView,
} from './shared'
import './Combobox.css'

export type ComboboxSize = 'sm' | 'md' | 'lg'

export interface ComboboxOption {
  /** Valor da opção (único). */
  value: string
  /** Texto exibido e usado na busca. */
  label: string
  /** Texto secundário exibido abaixo do rótulo (também entra na busca). */
  description?: string
  disabled?: boolean
}

export interface ComboboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange' | 'size' | 'children'
> {
  /** Opções disponíveis. */
  options: ComboboxOption[]
  /** Valor selecionado (controlado). `null` = nenhum. */
  value?: string | null
  /** Valor inicial (não controlado). */
  defaultValue?: string | null
  /** Chamado quando o usuário escolhe ou limpa uma opção. */
  onChange?: (value: string | null, option: ComboboxOption | null) => void
  /** Chamado a cada alteração do texto digitado — use para busca assíncrona. */
  onInputChange?: (inputValue: string) => void
  /** Estado aberto da lista (controlado). */
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /**
   * Função de filtro. Padrão: o rótulo contém o texto, ignorando acentos e caixa.
   * Passe `false` quando as opções já vierem filtradas (busca no servidor).
   */
  filter?: ((option: ComboboxOption, query: string) => boolean) | false
  /** Mostra "Carregando…" na lista (busca assíncrona em andamento). */
  loading?: boolean
  /** Mensagem quando nenhuma opção corresponde. Padrão: "Nenhum resultado encontrado". */
  emptyMessage?: ReactNode
  /** Mostra o botão de limpar quando há valor. Padrão: `true`. */
  clearable?: boolean
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
  /** Altura do controle: `sm` 32px, `md` 40px, `lg` 48px. */
  size?: ComboboxSize
  /** Classe aplicada ao contêiner externo. */
  className?: string
}

type ControlProps = Omit<
  ComboboxProps,
  'label' | 'hideLabel' | 'description' | 'error' | 'className'
> & {
  inputRef: React.Ref<HTMLInputElement>
  hasLabel: boolean
}

function ComboboxControl({
  inputRef,
  hasLabel,
  options,
  value: valueProp,
  defaultValue = null,
  onChange,
  onInputChange,
  open: openProp,
  defaultOpen,
  onOpenChange,
  filter,
  loading = false,
  emptyMessage,
  clearable = true,
  invalid,
  size = 'md',
  required,
  disabled,
  readOnly,
  name,
  placeholder,
  onKeyDown,
  onBlur,
  onClick,
  ...rest
}: ControlProps) {
  const { t } = useLocale()
  const field = useField()
  const controlProps = useFieldControlProps({
    required,
    disabled,
    'aria-invalid': invalid || undefined,
    'aria-describedby': rest['aria-describedby'],
  })
  const isDisabled = Boolean(controlProps.disabled)
  const listboxId = useId('or-combobox-listbox')
  const inputEl = useRef<HTMLInputElement>(null)
  const frameEl = useRef<HTMLDivElement>(null)
  const popupEl = useRef<HTMLDivElement>(null)
  const { announce, region } = useAnnouncer()

  const [value, setValue] = useControllableState<string | null>({ value: valueProp, defaultValue })
  const { isOpen, setOpen } = useDisclosure({ open: openProp, defaultOpen, onOpenChange })
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)

  // Guarda a última opção escolhida: com busca assíncrona, ela pode sumir de `options`.
  const lastSelected = useRef<ComboboxOption | null>(null)
  const selectedOption =
    options.find((o) => o.value === value) ??
    (lastSelected.current?.value === value ? lastSelected.current : null)
  if (selectedOption) lastSelected.current = selectedOption
  const selectedLabel = selectedOption?.label ?? ''

  const [inputText, setInputText] = useState(selectedLabel)
  const typing = useRef(false)
  // Sincroniza o texto quando o valor muda por fora (ex.: reset do formulário).
  useEffect(() => {
    if (!typing.current) setInputText(selectedLabel)
  }, [value, selectedLabel])

  const filtered = useMemo(() => {
    if (filter === false || !query.trim()) return options
    const fn = filter ?? defaultOptionFilter
    return options.filter((o) => fn(o, query))
  }, [options, query, filter])
  const visible = loading ? [] : filtered

  const optionId = (option: ComboboxOption) => `${listboxId}-${options.indexOf(option)}`
  const activeOption = isOpen && activeIndex >= 0 ? visible[activeIndex] : undefined
  const activeId = activeOption ? optionId(activeOption) : undefined
  const listRef = useScrollActiveIntoView(activeId)

  const { refs, floatingStyles, theme, present, state, nodeRef, side } = useListboxPopup(isOpen)
  useClickOutside([frameEl, popupEl], () => setOpen(false), isOpen)

  // Anuncia a quantidade de resultados quando a lista muda (com atraso para não interromper a digitação).
  useEffect(() => {
    if (!isOpen || loading) return
    const count = visible.length
    announce(
      count === 0
        ? t('noResults')
        : count === 1
          ? t('resultsCountOne')
          : t('resultsCount', { count }),
      400,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, loading, visible.length, query])

  // Ao terminar uma busca assíncrona, destaca o primeiro resultado do texto digitado.
  useEffect(() => {
    if (!loading && isOpen && query.trim() && activeIndex < 0)
      setActiveIndex(firstEnabledIndex(visible))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  const interactive = !isDisabled && !readOnly

  const openList = (focus: 'selected' | 'first' | 'last' | 'none') => {
    if (!interactive) return
    setQuery('')
    let index = -1
    if (focus === 'selected') {
      index = selectedOption ? options.indexOf(selectedOption) : -1
      if (index < 0 || options[index]?.disabled) index = firstEnabledIndex(options)
    } else if (focus === 'first') index = firstEnabledIndex(options)
    else if (focus === 'last') index = lastEnabledIndex(options)
    setActiveIndex(loading ? -1 : index)
    setOpen(true)
  }

  const closeList = () => {
    setOpen(false)
    setActiveIndex(-1)
  }

  const commit = (option: ComboboxOption | null) => {
    typing.current = false
    if (option) lastSelected.current = option
    const next = option?.value ?? null
    if (next !== value) {
      setValue(next)
      onChange?.(next, option)
    }
    setInputText(option?.label ?? '')
    setQuery('')
  }

  const selectOption = (option: ComboboxOption) => {
    if (option.disabled) return
    commit(option)
    closeList()
  }

  const clear = () => {
    commit(null)
    onInputChange?.('')
    inputEl.current?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || !interactive) return
    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault()
        if (!isOpen) {
          openList(event.altKey ? 'none' : 'selected')
        } else if (!event.altKey) {
          setActiveIndex((i) => nextEnabledIndex(visible, i, 1))
        }
        break
      }
      case 'ArrowUp': {
        event.preventDefault()
        if (!isOpen) {
          openList(event.altKey ? 'none' : 'last')
        } else if (event.altKey) {
          closeList()
        } else {
          setActiveIndex((i) => nextEnabledIndex(visible, i < 0 ? visible.length : i, -1))
        }
        break
      }
      case 'Home':
      case 'End': {
        // Com uma opção ativa, Home/End navegam na lista; sem ela, movem o cursor no texto.
        if (!isOpen || activeIndex < 0) break
        event.preventDefault()
        setActiveIndex(
          event.key === 'Home' ? firstEnabledIndex(visible) : lastEnabledIndex(visible),
        )
        break
      }
      case 'ArrowLeft':
      case 'ArrowRight': {
        // Devolve o foco visual para o campo de texto.
        if (activeIndex >= 0) setActiveIndex(-1)
        break
      }
      case 'Enter': {
        if (!isOpen) {
          // Texto apagado + Enter (ex.: envio do formulário) também limpa o valor.
          if (!inputText.trim() && value !== null) commit(null)
          break
        }
        event.preventDefault()
        if (activeOption) selectOption(activeOption)
        else closeList()
        break
      }
      case 'Escape': {
        if (isOpen) {
          event.preventDefault()
          event.stopPropagation()
          closeList()
        } else if (inputText || value !== null) {
          event.preventDefault()
          event.stopPropagation()
          clear()
        }
        break
      }
      case 'Tab': {
        if (isOpen) closeList()
        break
      }
    }
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(event)
    closeList()
    typing.current = false
    const text = inputText.trim()
    if (!text) {
      if (value !== null) commit(null)
      else setInputText('')
      setQuery('')
      return
    }
    if (text === selectedLabel) {
      setQuery('')
      return
    }
    // Texto idêntico a uma opção (ignorando acentos/caixa) é aceito; caso contrário, volta ao valor anterior.
    const exact = options.find((o) => !o.disabled && normalizeText(o.label) === normalizeText(text))
    if (exact) commit(exact)
    else {
      setInputText(selectedLabel)
      setQuery('')
    }
  }

  const showClear = clearable && interactive && (inputText !== '' || value !== null)
  const clearPresence = useInlinePresence<HTMLButtonElement>(showClear)
  const labelledBy = hasLabel && field ? field.labelId : undefined

  return (
    <div
      ref={mergeRefs(frameEl, refs.setReference)}
      className={cx('or-control-frame', `or-control-frame--${size}`, 'or-combobox')}
      data-invalid={controlProps['aria-invalid'] || undefined}
      aria-disabled={isDisabled || undefined}
      data-disabled={isDisabled || undefined}
      data-open={isOpen || undefined}
    >
      <input
        ref={mergeRefs(inputEl, inputRef)}
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-activedescendant={activeId}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        className="or-control-frame__input or-combobox__input"
        value={inputText}
        placeholder={placeholder}
        readOnly={readOnly}
        onChange={(event) => {
          const text = event.target.value
          typing.current = true
          setInputText(text)
          setQuery(text)
          onInputChange?.(text)
          if (!isOpen) setOpen(true)
          // Destaca automaticamente a primeira opção que corresponde ao texto.
          if (text.trim()) {
            const fn = filter === false ? () => true : (filter ?? defaultOptionFilter)
            const matches = options.filter((o) => fn(o, text))
            setActiveIndex(loading ? -1 : firstEnabledIndex(matches))
          } else setActiveIndex(-1)
        }}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onClick={(event) => {
          onClick?.(event)
          if (!isOpen) openList('none')
        }}
        {...rest}
        {...controlProps}
      />
      {name && <input type="hidden" name={name} value={value ?? ''} disabled={isDisabled} />}
      {loading && <span className="or-combobox__spinner" aria-hidden="true" />}
      {clearPresence.present && (
        <button
          ref={clearPresence.nodeRef}
          type="button"
          tabIndex={-1}
          className="or-combobox__clear"
          aria-label={t('clear')}
          aria-hidden={clearPresence.closing || undefined}
          data-state={clearPresence.dataState}
          onMouseDown={(event) => event.preventDefault()}
          onClick={clear}
        >
          <Icon name="close" size="sm" />
        </button>
      )}
      <button
        type="button"
        tabIndex={-1}
        className="or-control-frame__button or-combobox__toggle"
        aria-label={t('showOptions')}
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        disabled={isDisabled || readOnly}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => {
          if (isOpen) closeList()
          else openList('selected')
          inputEl.current?.focus()
        }}
      >
        <Icon name="chevron-down" size="sm" className="or-combobox__chevron" />
      </button>
      {region}
      {present && (
        <Portal>
          {/* O mousedown só impede que o clique na lista tire o foco do campo (o teclado age no campo). */}
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div
            ref={mergeRefs(popupEl, refs.setFloating, nodeRef)}
            className="or-combobox-popup"
            style={floatingStyles}
            data-theme={theme}
            data-state={state}
            data-side={side}
            onMouseDown={(event) => event.preventDefault()}
          >
            <Freeze frozen={!isOpen}>
              {loading ? (
                <div className="or-combobox-popup__message">
                  <span className="or-combobox-popup__spinner" aria-hidden="true" />
                  {t('loading')}
                </div>
              ) : visible.length === 0 ? (
                <div className="or-combobox-popup__message">{emptyMessage ?? t('noResults')}</div>
              ) : null}
              <ul
                ref={listRef}
                id={listboxId}
                role="listbox"
                className="or-combobox-listbox"
                aria-labelledby={labelledBy}
                aria-label={labelledBy ? undefined : rest['aria-label']}
                aria-busy={loading || undefined}
              >
                {visible.map((option, index) => (
                  <ListboxOptionItem
                    key={option.value}
                    id={optionId(option)}
                    option={option}
                    query={query}
                    active={index === activeIndex}
                    selected={option.value === value}
                    disabled={option.disabled}
                    onHover={() => setActiveIndex(index)}
                    onSelect={() => selectOption(option)}
                  />
                ))}
              </ul>
            </Freeze>
          </div>
        </Portal>
      )}
    </div>
  )
}

/**
 * Campo de texto com lista de sugestões filtrada enquanto se digita (padrão
 * WAI-ARIA "combobox com listbox"). Use para escolher uma opção em listas
 * longas; para poucas opções, prefira `Select`.
 */
export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
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
      className={cx('or-combobox-field', className)}
    >
      <ComboboxControl
        inputRef={ref}
        hasLabel={Boolean(label)}
        required={required}
        disabled={disabled}
        {...rest}
      />
    </Field>
  )
})
