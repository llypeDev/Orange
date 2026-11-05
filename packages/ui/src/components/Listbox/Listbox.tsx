import {
  createContext,
  forwardRef,
  useContext,
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
import { useControllableState, useId, useIsomorphicLayoutEffect } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx, devWarning, mergeRefs } from '../../utils'
import { Field, useField, useFieldControlProps } from '../Field'
import { useErrorShake } from '../TextField/useErrorShake'
import { VisuallyHidden } from '../VisuallyHidden'
import '../TextField/FormMotion.css'
import './Listbox.css'

export type ListboxSelectionMode = 'single' | 'multiple'
export type ListboxOrientation = 'vertical' | 'horizontal'

/** Opção da prop `options` (alternativa a `<ListboxOption>`). */
export interface ListboxItem {
  /** Valor da opção (único na lista). É o que vai para `onChange` e para o formulário. */
  value: string
  /** Rótulo visível (nome acessível da opção). */
  label: ReactNode
  /** Texto secundário abaixo do rótulo, ligado por `aria-describedby`. */
  description?: ReactNode
  /** Focável, mas não pode ser selecionada. */
  disabled?: boolean
  /** Ícone decorativo antes do rótulo. */
  icon?: ReactNode
}

/** Grupo da prop `options` (alternativa a `<ListboxGroup>`). */
export interface ListboxItemGroup {
  /** Título do grupo. */
  label: ReactNode
  options: ListboxItem[]
}

interface ListboxBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  /** Rótulo visível do campo. Sem rótulo, informe `aria-label` ou `aria-labelledby`. */
  label?: ReactNode
  /** Oculta o rótulo visualmente (continua acessível). */
  hideLabel?: boolean
  /** Texto de ajuda abaixo do rótulo, ligado por `aria-describedby`. */
  description?: ReactNode
  /** Mensagem de erro. Quando presente, a lista fica inválida (borda vermelha + tremor). */
  error?: ReactNode
  /** Marca a lista como inválida sem exibir mensagem. */
  invalid?: boolean
  /** Mostra `*` no rótulo e expõe `aria-required`. A validação fica com o formulário. */
  required?: boolean
  /** Mostra "(opcional)" ao lado do rótulo. */
  optional?: boolean
  /** Desabilita a lista inteira: sai da ordem de Tab e não envia valores. */
  disabled?: boolean
  /** Envia um `<input type="hidden">` por valor selecionado (para `Form` e formulários nativos). */
  name?: string
  /** Disposição das opções. `horizontal` troca ↑/↓ por ←/→. Padrão: `vertical`. */
  orientation?: ListboxOrientation
  /** Altura máxima (número em px ou valor CSS). A lista rola por dentro e mantém a opção ativa visível. */
  maxHeight?: number | string
  /**
   * Só no modo `single`: mover o foco com as setas, Home/End ou a digitação
   * também seleciona a opção. Padrão: `false`.
   */
  selectionFollowsFocus?: boolean
  /** Opções geradas a partir de dados. Alternativa a passar `<ListboxOption>` como filhos. */
  options?: Array<ListboxItem | ListboxItemGroup>
  /** `<ListboxOption>` e `<ListboxGroup>`. */
  children?: ReactNode
}

export interface ListboxSingleProps extends ListboxBaseProps {
  /** `single` (padrão): uma opção por vez. `multiple`: várias, com `aria-multiselectable`. */
  selectionMode?: 'single'
  /** Valor selecionado (controlado). `null` = nada selecionado. */
  value?: string | null
  /** Valor inicial (não controlado). */
  defaultValue?: string | null
  /** Chamado com o novo valor selecionado. */
  onChange?: (value: string | null) => void
}

export interface ListboxMultipleProps extends ListboxBaseProps {
  selectionMode: 'multiple'
  /** Valores selecionados (controlado), na ordem das opções. */
  value?: string[]
  /** Valores iniciais (não controlado). */
  defaultValue?: string[]
  /** Chamado com a nova lista de valores, na ordem das opções. */
  onChange?: (value: string[]) => void
}

export type ListboxProps = ListboxSingleProps | ListboxMultipleProps

export interface ListboxOptionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'id'> {
  /** Valor da opção (único na lista). */
  value: string
  /** Rótulo visível (nome acessível da opção). */
  children: ReactNode
  /** Texto secundário abaixo do rótulo, ligado por `aria-describedby`. */
  description?: ReactNode
  /** A opção continua focável (o leitor de tela a anuncia), mas não pode ser selecionada. */
  disabled?: boolean
  /** Ícone decorativo antes do rótulo. */
  icon?: ReactNode
}

export interface ListboxGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Título do grupo, que nomeia o `role="group"`. */
  label: ReactNode
  /** As `<ListboxOption>` do grupo. */
  children?: ReactNode
}

/* -------------------------------------------------------------------------- */
/* Contexto e helpers internos                                                 */
/* -------------------------------------------------------------------------- */

interface ListboxContextValue {
  baseId: string
  multiple: boolean
  selected: ReadonlySet<string>
  activeValue: string | null
}

const ListboxContext = createContext<ListboxContextValue | null>(null)

const EMPTY: string[] = []
const TYPEAHEAD_TIMEOUT = 500

/** Id de DOM estável de uma opção (usado por `aria-activedescendant`), a partir do valor. */
function optionDomId(baseId: string, value: string) {
  // Mantém letras, dígitos e hífens; o resto vira _<código>_ (injetivo, sem espaços).
  const safe = Array.from(value, (char) => (/[A-Za-z0-9-]/.test(char) ? char : `_${char.codePointAt(0)!.toString(36)}_`))
  return `${baseId}-option-${safe.join('')}`
}

/** Remove acentos e caixa para a busca por digitação ("são" casa com "Sao"). */
function normalizeText(text: string) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

function hasContent(node: ReactNode) {
  return node !== undefined && node !== null && node !== false && node !== ''
}

function isGroup(item: ListboxItem | ListboxItemGroup): item is ListboxItemGroup {
  return Array.isArray((item as ListboxItemGroup).options)
}

function sameValues(a: readonly string[], b: readonly string[]) {
  return a.length === b.length && a.every((v, i) => v === b[i])
}

interface OptionNode {
  value: string
  disabled: boolean
  text: string
  el: HTMLElement
}

/* -------------------------------------------------------------------------- */
/* Listbox                                                                     */
/* -------------------------------------------------------------------------- */

type ControlProps = Omit<ListboxBaseProps, 'label' | 'hideLabel' | 'description' | 'error' | 'optional' | 'className'> & {
  listboxRef: Ref<HTMLDivElement>
  hasLabel: boolean
  selectionMode?: ListboxSelectionMode
  value?: string | string[] | null
  defaultValue?: string | string[] | null
  onChange?: (value: string | string[] | null) => void
}

function ListboxControl({
  listboxRef,
  hasLabel,
  selectionMode = 'single',
  value: valueProp,
  defaultValue,
  onChange,
  selectionFollowsFocus = false,
  orientation = 'vertical',
  maxHeight,
  invalid,
  required,
  disabled,
  name,
  options,
  children,
  style,
  tabIndex,
  onKeyDown,
  onFocus,
  onBlur,
  onMouseDown,
  onMouseUp,
  onClick,
  onAnimationEnd,
  'aria-describedby': ariaDescribedBy,
  'aria-labelledby': ariaLabelledBy,
  ...rest
}: ControlProps) {
  const { t } = useLocale()
  const field = useField()
  const controlProps = useFieldControlProps({
    required,
    disabled,
    'aria-invalid': invalid || undefined,
    'aria-describedby': ariaDescribedBy,
  })
  const baseId = useId('or-listbox', controlProps.id)
  const multiple = selectionMode === 'multiple'
  const horizontal = orientation === 'horizontal'
  const isDisabled = Boolean(controlProps.disabled)
  const isInvalid = controlProps['aria-invalid'] === true
  const labelledBy = ariaLabelledBy ?? (hasLabel && field ? field.labelId : undefined)

  devWarning(
    !labelledBy && !rest['aria-label'],
    'Listbox sem `label` precisa de `aria-label` ou `aria-labelledby`.',
  )

  const [raw, setRaw] = useControllableState<string | string[] | null>({
    value: valueProp,
    defaultValue: defaultValue !== undefined ? defaultValue : multiple ? EMPTY : null,
    onChange,
  })
  const selectedValues = useMemo<string[]>(
    () => (Array.isArray(raw) ? raw : raw === null || raw === undefined ? EMPTY : [raw]),
    [raw],
  )
  const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues])

  const listboxEl = useRef<HTMLDivElement>(null)
  const mergedRef = useMemo(() => mergeRefs(listboxRef, listboxEl), [listboxRef])

  // Opção ativa ("foco virtual" via aria-activedescendant). Só existe enquanto a lista tem foco.
  const [activeValue, setActiveState] = useState<string | null>(null)
  const activeRef = useRef<string | null>(null)
  // Última opção marcada sem Shift (âncora de Shift+Espaço / Shift+clique).
  const anchorRef = useRef<string | null>(null)
  // Extensão em andamento (Shift+setas, Shift+Espaço…): âncora + seleção de quando ela começou.
  const rangeRef = useRef<{ anchor: string; base: string[] } | null>(null)
  // Foco vindo de um clique: a opção clicada vira a ativa, sem rolar a lista sob o cursor.
  const pointerRef = useRef<{ value: string | null } | null>(null)
  const typeahead = useRef<{ buffer: string; timer?: ReturnType<typeof setTimeout> }>({ buffer: '' })

  const [announcement, setAnnouncement] = useState('')
  const { shakeClassName, onAnimationEnd: onShakeEnd } = useErrorShake(isInvalid)

  /** Opções na ordem do DOM (inclui as de grupos), lidas na hora do evento. */
  const getItems = (): OptionNode[] => {
    const root = listboxEl.current
    if (!root) return []
    return Array.from(root.querySelectorAll<HTMLElement>('[role="option"]'))
      .filter((el) => el.closest('[role="listbox"]') === root)
      .map((el) => ({
        value: el.dataset.value ?? '',
        disabled: el.getAttribute('aria-disabled') === 'true',
        text: (el.querySelector('.or-listbox-option__label')?.textContent ?? el.textContent ?? '').trim(),
        el,
      }))
  }

  const scrollToOption = (el: HTMLElement) => {
    // Primeira opção de um grupo: mostra também o título do grupo.
    const group = el.parentElement?.closest<HTMLElement>('[role="group"]')
    if (group && group.querySelector('[role="option"]') === el) {
      group.querySelector<HTMLElement>('.or-listbox-group__label')?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
    }
    el.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
  }

  const setActive = (item: OptionNode | null, scroll: boolean) => {
    activeRef.current = item?.value ?? null
    setActiveState(item?.value ?? null)
    if (item && scroll) scrollToOption(item.el)
  }

  const announceCount = (count: number) => {
    const text =
      count === 0
        ? t('listboxSelectedNone')
        : count === 1
          ? t('listboxSelectedCountOne')
          : t('listboxSelectedCount', { count })
    // Mensagem repetida: um espaço invisível força o leitor de tela a reanunciar.
    setAnnouncement((prev) => (prev === text ? `${text}\u00a0` : text))
  }

  /** Ordena pela posição das opções; valores sem opção (ex.: vindos de `value`) ficam no fim. */
  const inOptionOrder = (values: Iterable<string>, items: OptionNode[]) => {
    const set = new Set(values)
    const ordered = items.filter((item) => set.has(item.value)).map((item) => item.value)
    const known = new Set(ordered)
    return [...ordered, ...[...set].filter((v) => !known.has(v))]
  }

  const commit = (next: string[], announce = false) => {
    if (announce) announceCount(next.length)
    if (sameValues(next, selectedValues)) return
    setRaw(multiple ? next : (next[0] ?? null))
  }

  const toggle = (item: OptionNode, items: OptionNode[]) => {
    const next = selectedSet.has(item.value)
      ? selectedValues.filter((v) => v !== item.value)
      : inOptionOrder([...selectedValues, item.value], items)
    anchorRef.current = item.value
    rangeRef.current = null
    commit(next)
  }

  const selectOne = (item: OptionNode) => {
    anchorRef.current = item.value
    commit([item.value])
  }

  /**
   * Estende a seleção até `target` a partir da âncora: a seleção de quando a
   * extensão começou + as opções habilitadas entre a âncora e o alvo. Voltar
   * em direção à âncora encolhe a faixa. `from` define a âncora de uma
   * extensão nova: a opção focada (Shift+setas, Ctrl+Shift+Home/End) ou a
   * última marcada (Shift+Espaço, Shift+clique).
   */
  const extendTo = (items: OptionNode[], target: number, from: 'focus' | 'anchor', announce = false) => {
    let range = rangeRef.current
    if (!range || !items.some((item) => item.value === range!.anchor)) {
      const anchor =
        (from === 'anchor' ? anchorRef.current : null) ?? activeRef.current ?? items[target].value
      range = { anchor, base: selectedValues }
      rangeRef.current = range
      anchorRef.current = anchor
    }
    let start = items.findIndex((item) => item.value === range!.anchor)
    if (start < 0) start = target
    const [lo, hi] = start <= target ? [start, target] : [target, start]
    const between = items
      .slice(lo, hi + 1)
      .filter((item) => !item.disabled)
      .map((item) => item.value)
    commit(inOptionOrder([...range.base, ...between], items), announce)
  }

  const toggleAll = (items: OptionNode[]) => {
    const enabled = items.filter((item) => !item.disabled).map((item) => item.value)
    const allSelected = enabled.length > 0 && enabled.every((v) => selectedSet.has(v))
    const next = allSelected
      ? selectedValues.filter((v) => !enabled.includes(v))
      : inOptionOrder([...selectedValues, ...enabled], items)
    rangeRef.current = null
    commit(next, true)
  }

  const moveTo = (items: OptionNode[], index: number) => {
    const item = items[index]
    if (!item) return
    setActive(item, true)
    if (!multiple && selectionFollowsFocus && !item.disabled) selectOne(item)
  }

  const runTypeahead = (char: string, items: OptionNode[], index: number) => {
    const state = typeahead.current
    clearTimeout(state.timer)
    state.buffer += normalizeText(char)
    state.timer = setTimeout(() => {
      state.buffer = ''
    }, TYPEAHEAD_TIMEOUT)
    const query = state.buffer
    // A mesma letra repetida percorre as opções que começam com ela.
    const cycling = query.length > 1 && Array.from(query).every((c) => c === query[0])
    const search = cycling ? query[0] : query
    // Uma letra começa na próxima opção; várias letras refinam a partir da atual.
    const begin = search.length === 1 ? index + 1 : Math.max(index, 0)
    for (let i = 0; i < items.length; i++) {
      const candidate = (begin + i) % items.length
      if (normalizeText(items[candidate].text).startsWith(search)) {
        rangeRef.current = null
        moveTo(items, candidate)
        return
      }
    }
  }

  const resetTypeahead = () => {
    clearTimeout(typeahead.current.timer)
    typeahead.current.buffer = ''
  }

  useEffect(() => {
    const state = typeahead.current
    return () => clearTimeout(state.timer)
  }, [])

  // A opção ativa sumiu (lista mudou): limpa a referência para não apontar para um id inexistente.
  useIsomorphicLayoutEffect(() => {
    if (activeValue !== null && !getItems().some((item) => item.value === activeValue)) {
      activeRef.current = null
      setActiveState(null)
    }
  })

  // Clicar no rótulo do Field foca a lista, como num controle nativo.
  useEffect(() => {
    const listbox = listboxEl.current
    if (!hasLabel || !field || !listbox || isDisabled) return
    const labelEl = listbox.ownerDocument.getElementById(field.labelId)
    if (!labelEl) return
    const focusList = () => listbox.focus()
    labelEl.addEventListener('click', focusList)
    return () => labelEl.removeEventListener('click', focusList)
  }, [hasLabel, field, isDisabled])

  /* Foco --------------------------------------------------------------------- */

  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    onFocus?.(event)
    if (event.target !== event.currentTarget || isDisabled) return
    const items = getItems()
    const pointer = pointerRef.current
    pointerRef.current = null
    const current = items.find((item) => item.value === activeRef.current)
    // APG: a ativa é a (primeira) selecionada ou, sem seleção, a primeira opção.
    const fallback = current ?? items.find((item) => selectedSet.has(item.value)) ?? items[0] ?? null
    if (pointer) {
      setActive(items.find((item) => item.value === pointer.value) ?? fallback, false)
      return
    }
    setActive(fallback, true)
  }

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    onBlur?.(event)
    if (event.target !== event.currentTarget) return
    setActive(null, false)
    rangeRef.current = null
    pointerRef.current = null
    resetTypeahead()
  }

  /* Teclado ------------------------------------------------------------------ */

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || isDisabled || event.target !== event.currentTarget) return
    const items = getItems()
    if (items.length === 0) return
    const index = items.findIndex((item) => item.value === activeRef.current)
    const last = items.length - 1
    const mod = event.ctrlKey || event.metaKey
    const { key, shiftKey: shift, altKey: alt } = event
    const prevKey = horizontal ? 'ArrowLeft' : 'ArrowUp'
    const nextKey = horizontal ? 'ArrowRight' : 'ArrowDown'

    if ((key === nextKey || key === prevKey) && !alt) {
      const step = key === nextKey ? 1 : -1
      const target = index < 0 ? (step === 1 ? 0 : last) : Math.min(last, Math.max(0, index + step))
      if (multiple && shift) extendTo(items, target, 'focus')
      else rangeRef.current = null
      moveTo(items, target)
    } else if ((key === 'Home' || key === 'End') && !alt) {
      const target = key === 'Home' ? 0 : last
      if (multiple && shift && mod) extendTo(items, target, 'focus', true)
      else rangeRef.current = null
      moveTo(items, target)
    } else if (key === ' ' && typeahead.current.buffer && !mod && !alt) {
      // Espaço no meio da digitação faz parte da busca ("pão de queijo").
      runTypeahead(' ', items, index)
    } else if ((key === ' ' || key === 'Enter') && !mod && !alt) {
      const item = items[index]
      if (item) {
        if (multiple && shift && key === ' ') extendTo(items, index, 'anchor', true)
        else if (item.disabled) {
          // APG: opções desabilitadas são focáveis, mas não selecionáveis.
        } else if (multiple) toggle(item, items)
        else selectOne(item)
      }
    } else if (multiple && mod && !shift && !alt && key.toLowerCase() === 'a') {
      toggleAll(items)
    } else if (key.length === 1 && key !== ' ' && !mod && !alt) {
      runTypeahead(key, items, index)
    } else {
      return
    }
    event.preventDefault()
  }

  /* Ponteiro ----------------------------------------------------------------- */

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    onMouseDown?.(event)
    if (isDisabled) return
    const option = (event.target as Element).closest<HTMLElement>('[role="option"]')
    pointerRef.current = { value: option?.dataset.value ?? null }
  }

  const handleMouseUp = (event: MouseEvent<HTMLDivElement>) => {
    onMouseUp?.(event)
    pointerRef.current = null
  }

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    onClick?.(event)
    pointerRef.current = null
    const listbox = listboxEl.current
    if (event.defaultPrevented || isDisabled || !listbox) return
    const option = (event.target as Element).closest<HTMLElement>('[role="option"]')
    const items = getItems()
    const index = items.findIndex((item) => item.el === option)
    if (index < 0) return
    const item = items[index]
    if (listbox.ownerDocument.activeElement !== listbox) {
      pointerRef.current = { value: item.value }
      listbox.focus({ preventScroll: true })
      pointerRef.current = null
    }
    if (!item.disabled) {
      if (multiple && event.shiftKey) extendTo(items, index, 'anchor', true)
      else if (multiple) toggle(item, items)
      else selectOne(item)
    }
    setActive(item, false)
  }

  /* Renderização --------------------------------------------------------------- */

  const context = useMemo<ListboxContextValue>(
    () => ({ baseId, multiple, selected: selectedSet, activeValue }),
    [baseId, multiple, selectedSet, activeValue],
  )
  const activeId = activeValue !== null && !isDisabled ? optionDomId(baseId, activeValue) : undefined

  return (
    <ListboxContext.Provider value={context}>
      {/* aria-activedescendant só existe com a lista habilitada, quando o tabIndex é 0. */}
      {/* eslint-disable-next-line jsx-a11y/aria-activedescendant-has-tabindex */}
      <div
        {...rest}
        ref={mergedRef}
        id={baseId}
        role="listbox"
        tabIndex={tabIndex ?? (isDisabled ? undefined : 0)}
        aria-labelledby={labelledBy}
        aria-describedby={controlProps['aria-describedby']}
        aria-invalid={isInvalid || undefined}
        aria-required={controlProps.required || undefined}
        aria-disabled={isDisabled || undefined}
        aria-multiselectable={multiple}
        aria-orientation={orientation}
        aria-activedescendant={activeId}
        className={cx('or-listbox', `or-listbox--${orientation}`, multiple && 'or-listbox--multiple', shakeClassName)}
        style={maxHeight !== undefined ? { ...style, maxHeight } : style}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        onAnimationEnd={(event) => {
          onAnimationEnd?.(event)
          onShakeEnd(event)
        }}
      >
        {options?.map((item, index) =>
          isGroup(item) ? (
            <ListboxGroup key={`group-${index}`} label={item.label}>
              {item.options.map(renderItem)}
            </ListboxGroup>
          ) : (
            renderItem(item)
          ),
        )}
        {children}
      </div>
      {name &&
        (selectedValues.length > 0 ? (
          selectedValues.map((v) => <input key={v} type="hidden" name={name} value={v} disabled={isDisabled} />)
        ) : (
          // Nada selecionado: nada é enviado (como caixas desmarcadas), mas o `Form` ainda
          // encontra o campo pelo `name` para focar a lista a partir do resumo de erros.
          <input type="hidden" name={name} value="" disabled />
        ))}
      {multiple && (
        <VisuallyHidden role="status" aria-live="polite" aria-atomic="true">
          {announcement}
        </VisuallyHidden>
      )}
    </ListboxContext.Provider>
  )
}

function renderItem(item: ListboxItem) {
  return (
    <ListboxOption
      key={item.value}
      value={item.value}
      description={item.description}
      disabled={item.disabled}
      icon={item.icon}
    >
      {item.label}
    </ListboxOption>
  )
}

/**
 * Lista de opções sempre visível (padrão Listbox do WAI-ARIA APG): painéis de
 * filtro, escolha de plano, listas mestre. Seleção única ou múltipla, teclado
 * completo (setas, Home/End, digitação, faixas com Shift) e integração com
 * `Form` via `name`. Para escolher em uma lista suspensa, use `Select`,
 * `Combobox` ou `MultiSelect`.
 */
export const Listbox = forwardRef<HTMLDivElement, ListboxProps>(function Listbox(
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
      className={cx('or-listbox-field', className)}
    >
      <ListboxControl
        {...(rest as Omit<ControlProps, 'listboxRef' | 'hasLabel'>)}
        listboxRef={ref}
        hasLabel={hasContent(label)}
        required={required}
        disabled={disabled}
      />
    </Field>
  )
})

/* -------------------------------------------------------------------------- */
/* ListboxOption                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Uma opção do `Listbox`. A seleção é exposta com `aria-selected` e indicada
 * por um check (seleção única) ou uma caixa marcada (seleção múltipla).
 */
export const ListboxOption = forwardRef<HTMLDivElement, ListboxOptionProps>(function ListboxOption(
  { value, children, description, disabled = false, icon, className, ...rest },
  ref,
) {
  const context = useContext(ListboxContext)
  if (!context) throw new Error('[Orange] ListboxOption precisa estar dentro de <Listbox>.')
  const id = optionDomId(context.baseId, value)
  const selected = context.selected.has(value)
  const hasDescription = hasContent(description)

  return (
    <div
      {...rest}
      ref={ref}
      id={id}
      role="option"
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      // Nome vem do conteúdo (só o rótulo: ícones e descrição são aria-hidden);
      // a descrição chega por aria-describedby.
      aria-describedby={hasDescription ? `${id}-description` : undefined}
      data-value={value}
      data-active={context.activeValue === value || undefined}
      className={cx('or-listbox-option', className)}
    >
      {context.multiple && (
        <span className="or-listbox-option__box" aria-hidden="true">
          <Icon name="check" size={12} strokeWidth={2.5} />
        </span>
      )}
      {icon && (
        <span className="or-listbox-option__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="or-listbox-option__text">
        <span id={`${id}-label`} className="or-listbox-option__label">
          {children}
        </span>
        {hasDescription && (
          // aria-hidden tira a descrição do nome calculado pelo conteúdo; ela
          // continua sendo lida como descrição (aria-describedby lê conteúdo oculto).
          <span id={`${id}-description`} className="or-listbox-option__description" aria-hidden="true">
            {description}
          </span>
        )}
      </span>
      {!context.multiple && <Icon name="check" size="sm" strokeWidth={2.25} className="or-listbox-option__check" />}
    </div>
  )
})

/* -------------------------------------------------------------------------- */
/* ListboxGroup                                                                */
/* -------------------------------------------------------------------------- */

/** Agrupa opções sob um título (`role="group"` nomeado por `aria-labelledby`). */
export const ListboxGroup = forwardRef<HTMLDivElement, ListboxGroupProps>(function ListboxGroup(
  { label, className, children, ...rest },
  ref,
) {
  const labelId = useId('or-listbox-group')
  return (
    <div ref={ref} role="group" aria-labelledby={labelId} className={cx('or-listbox-group', className)} {...rest}>
      <div id={labelId} className="or-listbox-group__label">
        {label}
      </div>
      {children}
    </div>
  )
})
