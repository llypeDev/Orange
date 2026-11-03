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
import {
  defaultOptionFilter,
  firstEnabledIndex,
  lastEnabledIndex,
  ListboxOptionItem,
  nextEnabledIndex,
  useAnnouncer,
  useListboxPopup,
  useScrollActiveIntoView,
} from '../Combobox/shared'
import { Field, useField, useFieldControlProps } from '../Field'
import { Portal } from '../Portal'
import './MultiSelect.css'

export type MultiSelectSize = 'sm' | 'md' | 'lg'

export interface MultiSelectOption {
  /** Valor da opção (único). */
  value: string
  /** Texto exibido na lista e no chip. */
  label: string
  /** Texto secundário exibido abaixo do rótulo. */
  description?: string
  disabled?: boolean
}

export interface MultiSelectProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'size' | 'children'> {
  options: MultiSelectOption[]
  /** Valores selecionados (controlado). */
  value?: string[]
  /** Valores iniciais (não controlado). */
  defaultValue?: string[]
  /** Chamado a cada seleção ou remoção. */
  onChange?: (value: string[], options: MultiSelectOption[]) => void
  /** Chamado a cada alteração do texto de busca — use para busca assíncrona. */
  onInputChange?: (inputValue: string) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Limite de itens selecionados. Ao atingir, as demais opções ficam indisponíveis. */
  maxSelected?: number
  /**
   * Função de filtro. Padrão: o rótulo contém o texto, ignorando acentos e caixa.
   * Passe `false` quando as opções já vierem filtradas.
   */
  filter?: ((option: MultiSelectOption, query: string) => boolean) | false
  /** Mostra "Carregando…" na lista. */
  loading?: boolean
  /** Mensagem quando nenhuma opção corresponde à busca. */
  emptyMessage?: ReactNode
  /** Mostra o botão "Limpar tudo" quando há seleção. Padrão: `true`. */
  clearable?: boolean
  label?: ReactNode
  hideLabel?: boolean
  description?: ReactNode
  error?: ReactNode
  /** Marca o campo como inválido sem exibir mensagem. */
  invalid?: boolean
  /** Altura mínima do controle: `sm` 32px, `md` 40px, `lg` 48px. */
  size?: MultiSelectSize
  /** Classe aplicada ao contêiner externo. */
  className?: string
}

type ControlProps = Omit<MultiSelectProps, 'label' | 'hideLabel' | 'description' | 'error' | 'className'> & {
  inputRef: React.Ref<HTMLInputElement>
  hasLabel: boolean
}

const EMPTY: string[] = []

function MultiSelectControl({
  inputRef,
  hasLabel,
  options,
  value: valueProp,
  defaultValue = EMPTY,
  onChange,
  onInputChange,
  open: openProp,
  defaultOpen,
  onOpenChange,
  maxSelected,
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
  const interactive = !isDisabled && !readOnly
  const listboxId = useId('or-multi-select-listbox')
  const inputEl = useRef<HTMLInputElement>(null)
  const frameEl = useRef<HTMLDivElement>(null)
  const popupEl = useRef<HTMLDivElement>(null)
  const chipButtons = useRef<(HTMLButtonElement | null)[]>([])
  const pendingFocus = useRef<number | 'input' | null>(null)
  const { announce, region } = useAnnouncer()

  const [values, setValues] = useControllableState<string[]>({ value: valueProp, defaultValue })
  const { isOpen, setOpen } = useDisclosure({ open: openProp, defaultOpen, onOpenChange })
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)

  // Cache de opções já vistas: chips continuam com rótulo mesmo se a busca assíncrona trocar `options`.
  const known = useRef(new Map<string, MultiSelectOption>())
  for (const option of options) known.current.set(option.value, option)
  const optionFor = (v: string): MultiSelectOption => known.current.get(v) ?? { value: v, label: v }
  const selectedOptions = values.map(optionFor)

  const limitReached = maxSelected !== undefined && values.length >= maxSelected

  const filtered = useMemo(() => {
    if (filter === false || !query.trim()) return options
    const fn = filter ?? defaultOptionFilter
    return options.filter((o) => fn(o, query))
  }, [options, query, filter])
  const visible = loading ? [] : filtered
  const isUnavailable = (o: MultiSelectOption) => Boolean(o.disabled) || (limitReached && !values.includes(o.value))
  const navigable = visible.map((o) => ({ disabled: isUnavailable(o) }))

  const optionId = (option: MultiSelectOption) => `${listboxId}-${options.indexOf(option)}`
  const activeOption = isOpen && activeIndex >= 0 ? visible[activeIndex] : undefined
  const activeId = activeOption ? optionId(activeOption) : undefined
  useScrollActiveIntoView(activeId)

  const { refs, floatingStyles, theme } = useListboxPopup(isOpen)
  useClickOutside([frameEl, popupEl], () => setOpen(false), isOpen)

  useEffect(() => {
    if (!isOpen || loading) return
    const count = visible.length
    announce(count === 0 ? t('noResults') : count === 1 ? t('resultsCountOne') : t('resultsCount', { count }), 400)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, loading, visible.length, query])

  // Foco após remover um chip: próximo chip, anterior ou o campo de texto.
  useEffect(() => {
    const target = pendingFocus.current
    if (target === null) return
    pendingFocus.current = null
    if (target === 'input') inputEl.current?.focus()
    else (chipButtons.current[target] ?? chipButtons.current[target - 1] ?? inputEl.current)?.focus()
  }, [values])

  const emit = (next: string[]) => {
    setValues(next)
    onChange?.(next, next.map(optionFor))
  }

  const setText = (text: string) => {
    setQuery(text)
    onInputChange?.(text)
  }

  const toggle = (option: MultiSelectOption) => {
    if (!interactive || option.disabled) return
    const selected = values.includes(option.value)
    if (!selected && limitReached) {
      announce(t('maxItemsReached', { max: maxSelected! }))
      return
    }
    const next = selected ? values.filter((v) => v !== option.value) : [...values, option.value]
    emit(next)
    announce(t(selected ? 'itemRemoved' : 'itemAdded', { label: option.label }))
    if (query) {
      // Depois de escolher, a busca é limpa e a opção continua ativa na lista completa.
      setText('')
      setActiveIndex(options.indexOf(option))
    }
  }

  const remove = (v: string, focusAfter: number | 'input' | null) => {
    if (!interactive) return
    pendingFocus.current = focusAfter
    emit(values.filter((x) => x !== v))
    announce(t('itemRemoved', { label: optionFor(v).label }))
  }

  const clearAll = () => {
    if (!interactive) return
    pendingFocus.current = 'input'
    emit([])
    setText('')
    announce(t('itemRemoved', { label: selectedOptions.map((o) => o.label).join(', ') }))
  }

  const openList = (focus: 'first' | 'last' | 'none') => {
    if (!interactive) return
    const all = options.map((o) => ({ disabled: isUnavailable(o) }))
    setActiveIndex(loading || query ? -1 : focus === 'first' ? firstEnabledIndex(all) : focus === 'last' ? lastEnabledIndex(all) : -1)
    setOpen(true)
  }

  const closeList = () => {
    setOpen(false)
    setActiveIndex(-1)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || !interactive) return
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!isOpen) openList(event.altKey ? 'none' : 'first')
        else if (!event.altKey) setActiveIndex((i) => nextEnabledIndex(navigable, i, 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        if (!isOpen) openList(event.altKey ? 'none' : 'last')
        else if (event.altKey) closeList()
        else setActiveIndex((i) => nextEnabledIndex(navigable, i < 0 ? navigable.length : i, -1))
        break
      case 'Home':
      case 'End':
        if (!isOpen || activeIndex < 0) break
        event.preventDefault()
        setActiveIndex(event.key === 'Home' ? firstEnabledIndex(navigable) : lastEnabledIndex(navigable))
        break
      case 'ArrowLeft':
      case 'ArrowRight':
        if (activeIndex >= 0) setActiveIndex(-1)
        break
      case 'Enter':
        if (!isOpen) break
        event.preventDefault()
        if (activeOption) toggle(activeOption)
        break
      case 'Escape':
        if (isOpen) {
          event.preventDefault()
          event.stopPropagation()
          closeList()
        } else if (query) {
          event.preventDefault()
          event.stopPropagation()
          setText('')
        }
        break
      case 'Backspace':
        if (!query && values.length > 0 && event.currentTarget.selectionStart === 0) {
          event.preventDefault()
          remove(values[values.length - 1], 'input')
        }
        break
      case 'Tab':
        if (isOpen) closeList()
        break
    }
  }

  const labelledBy = hasLabel && field ? field.labelId : undefined
  const hasValues = values.length > 0

  return (
    <div
      ref={mergeRefs(frameEl, refs.setReference)}
      className={cx('or-control-frame', `or-control-frame--${size}`, 'or-multi-select')}
      data-invalid={controlProps['aria-invalid'] || undefined}
      data-disabled={isDisabled || undefined}
      data-open={isOpen || undefined}
      onMouseDown={(event) => {
        // Clique na área vazia do campo foca o texto.
        if (event.target === event.currentTarget || (event.target as HTMLElement).classList.contains('or-multi-select__values')) {
          event.preventDefault()
          inputEl.current?.focus()
          if (!isOpen) openList('none')
        }
      }}
    >
      <div className="or-multi-select__values">
        {hasValues && (
          <ul role="list" className="or-multi-select__chips" aria-label={t('selectedItems')}>
            {selectedOptions.map((option, index) => (
              <li key={option.value} className="or-multi-select__chip">
                <span className="or-multi-select__chip-label">{option.label}</span>
                {interactive && (
                  <button
                    ref={(el) => {
                      chipButtons.current[index] = el
                    }}
                    type="button"
                    className="or-multi-select__chip-remove"
                    aria-label={t('removeItem', { label: option.label })}
                    onClick={() => remove(option.value, values.length > 1 ? index : 'input')}
                  >
                    <Icon name="close" size={12} strokeWidth={2} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
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
          className="or-control-frame__input or-multi-select__input"
          value={query}
          placeholder={hasValues ? undefined : placeholder}
          readOnly={readOnly}
          onChange={(event) => {
            const text = event.target.value
            setText(text)
            if (!isOpen) setOpen(true)
            if (text.trim()) {
              const fn = filter === false ? () => true : (filter ?? defaultOptionFilter)
              const matches = options.filter((o) => fn(o, text)).map((o) => ({ disabled: isUnavailable(o) }))
              setActiveIndex(loading ? -1 : firstEnabledIndex(matches))
            } else setActiveIndex(-1)
          }}
          onKeyDown={handleKeyDown}
          onClick={() => {
            if (!isOpen) openList('none')
          }}
          onBlur={(event) => {
            onBlur?.(event)
            if (popupEl.current?.contains(event.relatedTarget as Node)) return
            closeList()
          }}
          {...rest}
          {...controlProps}
          required={controlProps.required && !hasValues}
        />
      </div>
      {name && values.map((v) => <input key={v} type="hidden" name={name} value={v} disabled={isDisabled} />)}
      {loading && <span className="or-multi-select__spinner" aria-hidden="true" />}
      {clearable && interactive && hasValues && (
        <button type="button" className="or-multi-select__clear" aria-label={t('clearAll')} onClick={clearAll}>
          <Icon name="close" size="sm" />
        </button>
      )}
      <button
        type="button"
        tabIndex={-1}
        className="or-control-frame__button or-multi-select__toggle"
        aria-label={t('showOptions')}
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        disabled={!interactive}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => {
          if (isOpen) closeList()
          else openList('first')
          inputEl.current?.focus()
        }}
      >
        <Icon name="chevron-down" size="sm" className="or-multi-select__chevron" />
      </button>
      {region}
      {isOpen && (
        <Portal>
          <div
            ref={mergeRefs(popupEl, refs.setFloating)}
            className="or-combobox-popup"
            style={floatingStyles}
            data-theme={theme}
            onMouseDown={(event) => event.preventDefault()}
          >
            {limitReached && (
              <div className="or-combobox-popup__message or-combobox-popup__message--warning">
                <Icon name="info" size="sm" />
                {t('maxItemsReached', { max: maxSelected! })}
              </div>
            )}
            {loading ? (
              <div className="or-combobox-popup__message">
                <span className="or-combobox-popup__spinner" aria-hidden="true" />
                {t('loading')}
              </div>
            ) : visible.length === 0 ? (
              <div className="or-combobox-popup__message">{emptyMessage ?? t('noResults')}</div>
            ) : null}
            <ul
              id={listboxId}
              role="listbox"
              aria-multiselectable="true"
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
                  multiple
                  active={index === activeIndex}
                  selected={values.includes(option.value)}
                  disabled={isUnavailable(option)}
                  onHover={() => setActiveIndex(index)}
                  onSelect={() => toggle(option)}
                />
              ))}
            </ul>
          </div>
        </Portal>
      )}
    </div>
  )
}

/**
 * Seleção de várias opções com busca: a lista fica aberta enquanto se escolhe
 * e os itens escolhidos aparecem como chips removíveis.
 */
export const MultiSelect = forwardRef<HTMLInputElement, MultiSelectProps>(function MultiSelect(
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
      className={cx('or-multi-select-field', className)}
    >
      <MultiSelectControl inputRef={ref} hasLabel={Boolean(label)} required={required} disabled={disabled} {...rest} />
    </Field>
  )
})
