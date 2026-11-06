import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react'
import {
  useClickOutside,
  useControllableState,
  useDisclosure,
  useId,
  useIsomorphicLayoutEffect,
} from '../../hooks'
import { Icon, iconPaths, type IconName, type IconSize } from '../../icons'
import { useLocale } from '../../providers'
import { cx, devWarning, mergeRefs } from '../../utils'
import {
  Freeze,
  firstEnabledIndex,
  lastEnabledIndex,
  nextEnabledIndex,
  normalizeText,
  useAnnouncer,
  useListboxPopup,
} from '../Combobox/shared'
import { Field, useField, useFieldControlProps } from '../Field'
import { Portal } from '../Portal'
import { useErrorShake } from '../TextField/useErrorShake'
import '../TextField/FormMotion.css'
import './Picker.css'

export type PickerSize = 'sm' | 'md' | 'lg'

/** Uma opção do `Picker`. */
export interface PickerOption {
  /** Valor da opção (único). É o que vai para `onChange` e para o formulário. */
  value: string
  /** Rótulo exibido na lista e no gatilho. Também é usado na busca por digitação. */
  label: string
  /** Texto secundário abaixo do rótulo, ligado à opção por `aria-describedby`. */
  description?: ReactNode
  /** Ícone decorativo antes do rótulo: nome de um ícone do Orange ou um elemento. */
  icon?: IconName | ReactNode
  /** Aparece na lista, mas é pulada pelo teclado e não pode ser escolhida. */
  disabled?: boolean
}

/** Grupo de opções do `Picker`, com um título. */
export interface PickerGroup {
  /** Título do grupo, que nomeia o `role="group"`. */
  label: string
  options: PickerOption[]
}

export interface PickerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue' | 'defaultChecked' | 'children'
> {
  /** Opções (ou grupos de opções), na ordem em que aparecem na lista. */
  options: Array<PickerOption | PickerGroup>
  /** Valor escolhido (controlado). `null` = nenhum. */
  value?: string | null
  /** Valor inicial (não controlado). */
  defaultValue?: string | null
  /** Chamado com o novo valor quando a pessoa escolhe uma opção. */
  onChange?: (value: string | null) => void
  /** Lista aberta (controlado). */
  open?: boolean
  /** Lista aberta inicialmente (não controlado). */
  defaultOpen?: boolean
  /** Chamado quando a lista pede para abrir ou fechar. */
  onOpenChange?: (open: boolean) => void
  /** Texto exibido no gatilho enquanto nada foi escolhido. Padrão: "Selecione…". */
  placeholder?: string
  /** Envia o valor em um `<input type="hidden">` (para `Form` e formulários nativos). */
  name?: string
  /** Rótulo visível do campo. Sem rótulo, informe `aria-label` ou `aria-labelledby`. */
  label?: ReactNode
  /** Oculta o rótulo visualmente (continua acessível). */
  hideLabel?: boolean
  /** Texto de ajuda exibido abaixo do rótulo. */
  description?: ReactNode
  /** Mensagem de erro. Quando presente, o campo fica inválido. */
  error?: ReactNode
  /** Marca o campo como inválido sem exibir mensagem. */
  invalid?: boolean
  /** Mostra `*` no rótulo e expõe `aria-required`. A validação fica com o formulário. */
  required?: boolean
  /** Mostra "(opcional)" ao lado do rótulo. */
  optional?: boolean
  /** Desabilita o campo: sai da ordem de Tab e não envia o valor. */
  disabled?: boolean
  /** Altura do controle: `sm` 32px, `md` 40px, `lg` 48px. */
  size?: PickerSize
  /** Classe aplicada ao contêiner externo. */
  className?: string
}

/* -------------------------------------------------------------------------- */
/* Helpers internos                                                            */
/* -------------------------------------------------------------------------- */

interface PickerItem {
  option: PickerOption
  /** Posição na lista achatada (ordem do DOM, grupos incluídos). */
  index: number
  id: string
  disabled: boolean
}

type PickerSection =
  | { kind: 'option'; item: PickerItem }
  | { kind: 'group'; id: string; label: string; items: PickerItem[] }

/** PageUp/PageDown andam 10 opções, como no exemplo do APG. */
const PAGE_SIZE = 10
const TYPEAHEAD_TIMEOUT = 500

function isGroup(entry: PickerOption | PickerGroup): entry is PickerGroup {
  return Array.isArray((entry as PickerGroup).options)
}

function hasContent(node: ReactNode) {
  return node !== undefined && node !== null && node !== false && node !== ''
}

function renderIcon(icon: IconName | ReactNode, size: IconSize) {
  return typeof icon === 'string' && icon in iconPaths ? (
    <Icon name={icon as IconName} size={size} />
  ) : (
    icon
  )
}

/** Opção habilitada a até 10 posições de `from`; sem uma, a mais próxima no caminho. */
function pageIndex(items: PickerItem[], from: number, step: 1 | -1): number {
  const last = items.length - 1
  const target = Math.min(last, Math.max(0, from + step * PAGE_SIZE))
  for (let i = target; i >= 0 && i <= last; i += step) if (!items[i].disabled) return i
  for (let i = target - step; i !== from && i >= 0 && i <= last; i -= step) {
    if (!items[i].disabled) return i
  }
  return from
}

/**
 * Rola só a lista (nunca a página) até a opção. Na primeira opção de um
 * grupo, mostra também o título do grupo.
 */
function revealOption(list: HTMLElement | null, id: string | undefined) {
  if (!list || !id) return
  const option = list.ownerDocument.getElementById(id)
  if (!option || !list.contains(option)) return
  const group = option.parentElement?.closest<HTMLElement>('[role="group"]')
  const head = group && group.querySelector('[role="option"]') === option ? group : option
  const top = head.getBoundingClientRect().top
  const bottom = option.getBoundingClientRect().bottom
  const box = list.getBoundingClientRect()
  if (top < box.top) list.scrollTop -= box.top - top
  else if (bottom > box.bottom) list.scrollTop += bottom - box.bottom
}

/* -------------------------------------------------------------------------- */
/* Controle                                                                    */
/* -------------------------------------------------------------------------- */

type ControlProps = Omit<
  PickerProps,
  'label' | 'hideLabel' | 'description' | 'error' | 'optional' | 'className'
> & {
  triggerRef: Ref<HTMLDivElement>
  hasLabel: boolean
}

function PickerControl({
  triggerRef,
  hasLabel,
  options,
  value: valueProp,
  defaultValue = null,
  onChange,
  open: openProp,
  defaultOpen,
  onOpenChange,
  placeholder,
  name,
  invalid,
  required,
  disabled,
  size = 'md',
  id,
  tabIndex,
  onKeyDown,
  onClick,
  onBlur,
  onAnimationEnd,
  'aria-describedby': ariaDescribedBy,
  'aria-labelledby': ariaLabelledBy,
  ...rest
}: ControlProps) {
  const { t } = useLocale()
  const field = useField()
  const controlProps = useFieldControlProps({
    id,
    required,
    disabled,
    'aria-invalid': invalid || undefined,
    'aria-describedby': ariaDescribedBy,
  })
  const isDisabled = Boolean(controlProps.disabled)
  const isInvalid = controlProps['aria-invalid'] === true
  const labelledBy = ariaLabelledBy ?? (hasLabel && field ? field.labelId : undefined)

  devWarning(
    !labelledBy && !rest['aria-label'],
    'Picker sem `label` precisa de `aria-label` ou `aria-labelledby`.',
  )

  const listboxId = useId('or-picker-listbox')
  const triggerEl = useRef<HTMLDivElement>(null)
  const popupEl = useRef<HTMLDivElement>(null)
  const listEl = useRef<HTMLDivElement>(null)
  const hiddenEl = useRef<HTMLInputElement>(null)
  const { announce, region } = useAnnouncer()
  const { shakeClassName, onAnimationEnd: onShakeEnd } = useErrorShake(isInvalid)

  const [value, setValue] = useControllableState<string | null>({
    value: valueProp,
    defaultValue,
    onChange,
  })
  const { isOpen, setOpen } = useDisclosure({ open: openProp, defaultOpen, onOpenChange })
  const expanded = isOpen && !isDisabled
  const [activeIndex, setActiveIndex] = useState(-1)

  const { items, sections } = useMemo(() => {
    const flat: PickerItem[] = []
    const toItem = (option: PickerOption): PickerItem => {
      const item = {
        option,
        index: flat.length,
        id: `${listboxId}-option-${flat.length}`,
        disabled: Boolean(option.disabled),
      }
      flat.push(item)
      return item
    }
    const list = options.map<PickerSection>((entry, index) =>
      isGroup(entry)
        ? {
            kind: 'group',
            id: `${listboxId}-group-${index}`,
            label: entry.label,
            items: entry.options.map(toItem),
          }
        : { kind: 'option', item: toItem(entry) },
    )
    return { items: flat, sections: list }
  }, [options, listboxId])

  const usable = (index: number) => index >= 0 && index < items.length && !items[index].disabled
  const selectedIndex = value === null ? -1 : items.findIndex((item) => item.option.value === value)
  const selected = selectedIndex >= 0 ? items[selectedIndex] : undefined
  // APG: ao abrir, a opção ativa é a escolhida (ou, sem escolha, a primeira habilitada).
  const startIndex = usable(selectedIndex) ? selectedIndex : firstEnabledIndex(items)
  const active = expanded ? (usable(activeIndex) ? activeIndex : startIndex) : -1
  const activeId = active >= 0 ? items[active].id : undefined

  /* Busca por digitação ------------------------------------------------------ */

  const typeahead = useRef<{ buffer: string; timer?: ReturnType<typeof setTimeout> }>({
    buffer: '',
  })

  const resetTypeahead = () => {
    clearTimeout(typeahead.current.timer)
    typeahead.current.buffer = ''
  }

  useEffect(() => {
    const state = typeahead.current
    return () => clearTimeout(state.timer)
  }, [])

  /**
   * Letras em sequência (até 500ms entre elas) buscam a opção habilitada que
   * começa com o texto, ignorando acentos e caixa. Uma letra começa na opção
   * seguinte; várias refinam a partir da atual; a mesma letra repetida
   * percorre as opções que começam com ela.
   */
  const findMatch = (char: string, from: number) => {
    const state = typeahead.current
    clearTimeout(state.timer)
    state.buffer += normalizeText(char)
    state.timer = setTimeout(() => {
      state.buffer = ''
    }, TYPEAHEAD_TIMEOUT)
    const query = state.buffer
    const cycling = query.length > 1 && Array.from(query).every((c) => c === query[0])
    const search = cycling ? query[0] : query
    const begin = search.length === 1 ? from + 1 : Math.max(from, 0)
    for (let i = 0; i < items.length; i++) {
      const candidate = (begin + i) % items.length
      const item = items[candidate]
      if (!item.disabled && normalizeText(item.option.label).startsWith(search)) return candidate
    }
    return -1
  }

  /* Abrir, fechar, escolher ------------------------------------------------- */

  /** Abre a lista; `index` define a opção ativa (padrão: a escolhida ou a primeira). */
  const openList = (index = -1) => {
    resetTypeahead()
    setActiveIndex(index)
    setOpen(true)
  }

  const closeList = () => {
    resetTypeahead()
    setActiveIndex(-1)
    setOpen(false)
  }

  const commit = (index: number) => {
    if (usable(index)) setValue(items[index].option.value)
  }

  // Fechada por fora (prop `open`): a próxima abertura volta a partir da opção escolhida.
  useEffect(() => {
    if (!expanded) setActiveIndex(-1)
  }, [expanded])

  useClickOutside([triggerEl, popupEl], () => closeList(), expanded)

  // Clicar no rótulo do Field foca o gatilho, como num controle nativo.
  useEffect(() => {
    const trigger = triggerEl.current
    if (!hasLabel || !field || !trigger || isDisabled) return
    const labelEl = trigger.ownerDocument.getElementById(field.labelId)
    if (!labelEl) return
    const focusTrigger = () => trigger.focus()
    labelEl.addEventListener('click', focusTrigger)
    return () => labelEl.removeEventListener('click', focusTrigger)
  }, [hasLabel, field, isDisabled])

  // O reset do formulário volta ao `defaultValue` (não controlado), como num <select>.
  const controlled = valueProp !== undefined
  const resetValue = useRef(defaultValue)
  resetValue.current = defaultValue
  useEffect(() => {
    const form = hiddenEl.current?.form
    if (!form || controlled) return
    let timer: ReturnType<typeof setTimeout> | undefined
    const handleReset = (event: Event) => {
      // Depois do despacho, para respeitar um preventDefault() de outro ouvinte.
      timer = setTimeout(() => {
        if (!event.defaultPrevented) setValue(resetValue.current)
      })
    }
    form.addEventListener('reset', handleReset)
    return () => {
      form.removeEventListener('reset', handleReset)
      clearTimeout(timer)
    }
  }, [name, controlled, setValue])

  /* Rolagem da opção ativa -------------------------------------------------- */

  // O mouse só destaca: não rola a lista sob o cursor.
  const pointerMoved = useRef(false)
  useIsomorphicLayoutEffect(() => {
    if (pointerMoved.current) {
      pointerMoved.current = false
      return
    }
    revealOption(listEl.current, activeId)
  }, [activeId])

  // Ao abrir, a altura final do popup só existe depois do posicionamento: revela no quadro seguinte.
  const activeIdRef = useRef(activeId)
  activeIdRef.current = activeId
  const expandedRef = useRef(expanded)
  expandedRef.current = expanded
  useEffect(() => {
    if (!expanded) return
    const frame = requestAnimationFrame(() => revealOption(listEl.current, activeIdRef.current))
    return () => cancelAnimationFrame(frame)
  }, [expanded])
  // Com movimento reduzido, a transição global de 0.01ms atrasa max-height/top em mais um
  // quadro e o quadro seguinte ainda é cedo demais: revela também sempre que a lista muda de
  // tamanho. Ref estável — reconectar a cada render faria o observer disparar ao passar o mouse.
  const listRef = useMemo(() => {
    let observer: ResizeObserver | null = null
    return mergeRefs<HTMLDivElement>(listEl, (list) => {
      observer?.disconnect()
      observer = null
      if (!list || typeof ResizeObserver === 'undefined') return
      observer = new ResizeObserver(() => {
        if (expandedRef.current) revealOption(list, activeIdRef.current)
      })
      observer.observe(list)
    })
  }, [])

  /* Eventos do gatilho ------------------------------------------------------ */

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || isDisabled) return
    const { key, altKey, ctrlKey, metaKey } = event

    // Busca por digitação, aberta ou fechada. Espaço no meio da busca faz parte dela.
    if (key.length === 1 && !altKey && !ctrlKey && !metaKey) {
      if (key !== ' ' || typeahead.current.buffer) {
        event.preventDefault()
        const match = findMatch(key, expanded ? active : selectedIndex)
        if (match < 0) return
        if (expanded) {
          setActiveIndex(match)
        } else if (match !== selectedIndex) {
          // Fechada, escolhe direto (como o <select> nativo) e anuncia a escolha.
          commit(match)
          announce(items[match].option.label)
        }
        return
      }
    }

    if (!expanded) {
      if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === ' ') {
        event.preventDefault()
        openList(key === 'ArrowUp' && !usable(selectedIndex) ? lastEnabledIndex(items) : -1)
      } else if (key === 'Home' || key === 'End') {
        event.preventDefault()
        openList(key === 'Home' ? firstEnabledIndex(items) : lastEnabledIndex(items))
      }
      return
    }

    const move = (index: number) => {
      if (index >= 0) setActiveIndex(index)
    }
    switch (key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!altKey) move(nextEnabledIndex(items, active, 1, false))
        break
      case 'ArrowUp':
        event.preventDefault()
        if (altKey) {
          commit(active)
          closeList()
        } else {
          move(nextEnabledIndex(items, active, -1, false))
        }
        break
      case 'Home':
      case 'End':
        event.preventDefault()
        move(key === 'Home' ? firstEnabledIndex(items) : lastEnabledIndex(items))
        break
      case 'PageDown':
      case 'PageUp':
        event.preventDefault()
        move(pageIndex(items, active, key === 'PageDown' ? 1 : -1))
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        commit(active)
        closeList()
        break
      case 'Escape':
        event.preventDefault()
        event.stopPropagation()
        closeList()
        break
      case 'Tab':
        // APG: Tab escolhe a opção ativa, fecha e segue para o próximo campo (sem preventDefault).
        commit(active)
        closeList()
        break
    }
  }

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || isDisabled) return
    if (expanded) closeList()
    else openList()
  }

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    onBlur?.(event)
    if (expanded && !popupEl.current?.contains(event.relatedTarget as Node | null)) closeList()
    else resetTypeahead()
  }

  const selectFromPointer = (index: number) => {
    commit(index)
    closeList()
    triggerEl.current?.focus({ preventScroll: true })
  }

  /* Renderização -------------------------------------------------------------- */

  const { refs, floatingStyles, theme, present, state, nodeRef, side } = useListboxPopup(expanded)
  const iconSize: IconSize = size === 'lg' ? 'md' : 'sm'
  const hasOptions = items.length > 0

  const renderOption = (item: PickerItem) => (
    <PickerOptionRow
      key={item.id}
      item={item}
      active={item.index === active}
      selected={item.index === selectedIndex}
      onHover={() => {
        pointerMoved.current = true
        setActiveIndex(item.index)
      }}
      onSelect={() => selectFromPointer(item.index)}
    />
  )

  return (
    <>
      {/* aria-activedescendant só existe com a lista aberta, e o gatilho aberto sempre tem tabIndex. */}
      {/* eslint-disable-next-line jsx-a11y/aria-activedescendant-has-tabindex */}
      <div
        {...rest}
        ref={mergeRefs(triggerRef, triggerEl, refs.setReference)}
        id={controlProps.id}
        role="combobox"
        tabIndex={tabIndex ?? (isDisabled ? undefined : 0)}
        aria-haspopup="listbox"
        aria-expanded={expanded}
        aria-controls={expanded && hasOptions ? listboxId : undefined}
        aria-activedescendant={activeId}
        aria-labelledby={labelledBy}
        aria-describedby={controlProps['aria-describedby']}
        aria-invalid={isInvalid || undefined}
        aria-required={controlProps.required || undefined}
        aria-disabled={isDisabled || undefined}
        className={cx(
          'or-control-frame',
          `or-control-frame--${size}`,
          'or-picker',
          `or-picker--${size}`,
          shakeClassName,
        )}
        data-invalid={isInvalid || undefined}
        data-disabled={isDisabled || undefined}
        data-open={expanded || undefined}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        onBlur={handleBlur}
        onAnimationEnd={(event) => {
          onAnimationEnd?.(event)
          onShakeEnd(event)
        }}
      >
        <span className="or-picker__value" data-placeholder={selected ? undefined : ''}>
          {selected && hasContent(selected.option.icon) && (
            <span className="or-picker__icon" aria-hidden="true">
              {renderIcon(selected.option.icon, iconSize)}
            </span>
          )}
          <span className="or-picker__label">
            {selected ? selected.option.label : (placeholder ?? t('pickerPlaceholder'))}
          </span>
        </span>
        <span className="or-picker__chevron" aria-hidden="true">
          <Icon name="chevron-down" size={iconSize} />
        </span>
      </div>
      {name && (
        <input ref={hiddenEl} type="hidden" name={name} value={value ?? ''} disabled={isDisabled} />
      )}
      {region}
      {present && (
        <Portal>
          {/* O mousedown só impede que o clique na lista tire o foco do gatilho (o teclado age nele). */}
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div
            ref={mergeRefs(popupEl, refs.setFloating, nodeRef)}
            className="or-picker__popup"
            style={floatingStyles}
            data-theme={theme}
            data-state={state}
            data-side={side}
            onMouseDown={(event) => event.preventDefault()}
          >
            <Freeze frozen={!expanded}>
              {hasOptions ? (
                <div
                  ref={listRef}
                  id={listboxId}
                  role="listbox"
                  aria-labelledby={labelledBy}
                  aria-label={labelledBy ? undefined : rest['aria-label']}
                  className="or-picker__listbox"
                >
                  {sections.map((section) =>
                    section.kind === 'group' ? (
                      <div
                        key={section.id}
                        role="group"
                        aria-labelledby={section.id}
                        className="or-picker__group"
                      >
                        <div id={section.id} className="or-picker__group-label">
                          {section.label}
                        </div>
                        {section.items.map(renderOption)}
                      </div>
                    ) : (
                      renderOption(section.item)
                    ),
                  )}
                </div>
              ) : (
                <div className="or-picker__empty">{t('pickerEmpty')}</div>
              )}
            </Freeze>
          </div>
        </Portal>
      )}
    </>
  )
}

interface PickerOptionRowProps {
  item: PickerItem
  active: boolean
  selected: boolean
  onHover: () => void
  onSelect: () => void
}

function PickerOptionRow({ item, active, selected, onHover, onSelect }: PickerOptionRowProps) {
  const { option, id, disabled } = item
  const hasDescription = hasContent(option.description)
  return (
    // Padrão APG com aria-activedescendant: o foco fica no gatilho e as opções nunca o recebem.
    // O teclado age no gatilho; o clique é o atalho do mouse.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus
    <div
      id={id}
      role="option"
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      // Nome vem do rótulo (ícone e descrição são aria-hidden); a descrição chega por aria-describedby.
      aria-describedby={hasDescription ? `${id}-description` : undefined}
      data-active={active || undefined}
      className="or-picker__option"
      onMouseMove={() => {
        if (!active && !disabled) onHover()
      }}
      onClick={() => {
        if (!disabled) onSelect()
      }}
    >
      {hasContent(option.icon) && (
        <span className="or-picker__option-icon" aria-hidden="true">
          {renderIcon(option.icon, 'sm')}
        </span>
      )}
      <span className="or-picker__option-text">
        <span className="or-picker__option-label">{option.label}</span>
        {hasDescription && (
          <span
            id={`${id}-description`}
            className="or-picker__option-description"
            aria-hidden="true"
          >
            {option.description}
          </span>
        )}
      </span>
      <Icon name="check" size="sm" strokeWidth={2.25} className="or-picker__option-check" />
    </div>
  )
}

/**
 * Lista suspensa personalizada, só de seleção (padrão "Select-Only Combobox"
 * do WAI-ARIA APG): um gatilho com a aparência dos campos abre uma lista com
 * opções que podem ter ícone, descrição, estar desabilitadas e agrupadas.
 * Use quando o `Select` nativo não basta (ícones, descrições); para listas
 * longas com busca, use `Combobox`.
 */
export const Picker = forwardRef<HTMLDivElement, PickerProps>(function Picker(
  { label, hideLabel, description, error, required, optional, disabled, id, className, ...rest },
  ref,
) {
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
      className={cx('or-picker-field', className)}
    >
      <PickerControl
        {...rest}
        triggerRef={ref}
        hasLabel={hasContent(label)}
        required={required}
        disabled={disabled}
      />
    </Field>
  )
})
