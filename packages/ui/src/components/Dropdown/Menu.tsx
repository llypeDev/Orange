/*
 * Núcleo interno dos menus (Dropdown e ContextMenu): painel `role="menu"`
 * posicionado, navegação por setas/Home/End, typeahead e as partes
 * (DropdownItem, DropdownCheckboxItem, DropdownRadioGroup…).
 */
import type { ReferenceType, Strategy } from '@floating-ui/react-dom'
import {
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
  type SyntheticEvent,
} from 'react'
import { useControllableState, useId, useIsomorphicLayoutEffect, usePresence } from '../../hooks'
import { Icon, type IconName } from '../../icons'
import { composeEventHandlers, cx, mergeRefs } from '../../utils'
import { focusElement, getThemeScope, useLayer } from '../Modal/overlay'
import { useFloatingPanel, type FloatingPlacement } from '../Popover/floating'
import { Portal } from '../Portal'
import './Dropdown.css'

/* -------------------------------------------------------------------------- */
/* Contexto                                                                   */
/* -------------------------------------------------------------------------- */

/** Motivo do fechamento: decide para onde o foco vai. */
export type MenuCloseReason = 'select' | 'escape' | 'tab' | 'outside' | 'focus-outside'

interface MenuContextValue {
  /** Fecha o menu depois de escolher um item (o foco volta ao gatilho/origem). */
  close: () => void
  /** Foca o próprio menu (nenhum item destacado). */
  focusMenu: () => void
}

const MenuContext = createContext<MenuContextValue | null>(null)

export type MenuFocusTarget = 'first' | 'last' | 'menu'

const ITEM_SELECTOR = '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]'

function getItems(menu: HTMLElement | null): HTMLElement[] {
  return menu ? Array.from(menu.querySelectorAll<HTMLElement>(ITEM_SELECTOR)) : []
}

function getTextValue(item: HTMLElement) {
  return (item.dataset.textValue ?? item.textContent ?? '').trim().toLowerCase()
}

/**
 * Rola só o menu (nunca a página) até o item. No primeiro item, volta ao topo;
 * logo depois de um título (`DropdownLabel` ou o título de um grupo), mostra
 * o título também. *
 * Os deslocamentos arredondam para longe de zero: o WebKit rola em pixels inteiros, e uma
 * rolagem fracionária deixava o item cortado por menos de 1px.
 */
function revealItem(menu: HTMLElement, item: HTMLElement) {
  if (getItems(menu)[0] === item) {
    menu.scrollTop = 0
    return
  }
  const previous = item.previousElementSibling
  const head = previous?.classList.contains('or-menu__group-label') ? previous : item
  const top = menu.getBoundingClientRect().top + menu.clientTop
  const bottom = top + menu.clientHeight
  const headTop = head.getBoundingClientRect().top
  const itemBottom = item.getBoundingClientRect().bottom
  if (headTop < top) menu.scrollTop -= Math.ceil(top - headTop)
  else if (itemBottom > bottom) menu.scrollTop += Math.ceil(itemBottom - bottom)
}

/* -------------------------------------------------------------------------- */
/* Painel                                                                     */
/* -------------------------------------------------------------------------- */

export interface MenuPanelProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean
  reference: ReferenceType | null
  /** Elemento cujo `[data-theme]` o menu herda. */
  themeOrigin: Element | null
  placement: FloatingPlacement
  offset: number
  strategy?: Strategy
  /** Para onde o foco vai ao abrir. */
  focusOnOpen: MutableRefObject<MenuFocusTarget>
  /** Pedido de fechamento. */
  onClose: (reason: MenuCloseReason) => void
  /** Elemento(s) considerados "dentro" (o gatilho). */
  insideElements?: () => (Element | null | undefined)[]
}

export const MenuPanel = forwardRef<HTMLDivElement, MenuPanelProps>(function MenuPanel(
  {
    open,
    reference,
    themeOrigin,
    placement,
    offset,
    strategy,
    focusOnOpen,
    onClose,
    insideElements,
    className,
    style,
    onKeyDown,
    children,
    ...rest
  },
  ref,
) {
  const [menuEl, setMenuEl] = useState<HTMLDivElement | null>(null)
  const typeahead = useRef({ buffer: '', timer: 0 })
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  // O menu continua montado (inerte) durante a animação de saída.
  const { present, state, nodeRef } = usePresence<HTMLDivElement>(open)

  const floating = useFloatingPanel({
    open: present,
    reference,
    floating: menuEl,
    placement,
    offset,
    strategy,
  })

  const { setNode, layerProps } = useLayer(open, {
    onEscape: () => closeRef.current('escape'),
    onPointerDownOutside: () => closeRef.current('outside'),
    onFocusOutside: () => closeRef.current('focus-outside'),
    insideElements,
  })

  useIsomorphicLayoutEffect(() => {
    if (!open || !menuEl) return
    const items = getItems(menuEl)
    const target = focusOnOpen.current
    focusElement(
      target === 'first'
        ? (items[0] ?? menuEl)
        : target === 'last'
          ? (items[items.length - 1] ?? menuEl)
          : menuEl,
    )
  }, [open, menuEl])

  // A altura final do menu só existe depois do posicionamento (com movimento
  // reduzido, um quadro depois): sempre que o menu muda de tamanho, revela o
  // item focado (ex.: o último, aberto com ↑ no gatilho).
  useEffect(() => {
    if (!menuEl || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => {
      const item = menuEl.ownerDocument.activeElement
      if (item instanceof HTMLElement && item !== menuEl && menuEl.contains(item))
        revealItem(menuEl, item)
    })
    observer.observe(menuEl)
    return () => observer.disconnect()
  }, [menuEl])

  const context = useMemo<MenuContextValue>(
    () => ({ close: () => closeRef.current('select'), focusMenu: () => focusElement(menuEl) }),
    [menuEl],
  )

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || !menuEl) return
    const items = getItems(menuEl)
    if (items.length === 0) return
    const index = items.indexOf(document.activeElement as HTMLElement)
    // Foca sem rolar a página e rola só o menu até o item.
    const focusItem = (item: HTMLElement) => {
      focusElement(item)
      revealItem(menuEl, item)
    }
    const focusAt = (i: number) => {
      event.preventDefault()
      focusItem(items[(i + items.length) % items.length])
    }
    switch (event.key) {
      case 'ArrowDown':
        return focusAt(index < 0 ? 0 : index + 1)
      case 'ArrowUp':
        return focusAt(index < 0 ? items.length - 1 : index - 1)
      case 'Home':
      case 'PageUp':
        return focusAt(0)
      case 'End':
      case 'PageDown':
        return focusAt(items.length - 1)
      case 'Tab':
        // Fecha e devolve o foco ao gatilho; o Tab segue dali para o próximo elemento.
        closeRef.current('tab')
        return
    }
    // Typeahead: letras focam o próximo item que começa com elas.
    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return
    if (event.key === ' ' && !typeahead.current.buffer) return
    event.preventDefault()
    const state = typeahead.current
    window.clearTimeout(state.timer)
    state.buffer += event.key.toLowerCase()
    state.timer = window.setTimeout(() => (state.buffer = ''), 500)
    const repeated = state.buffer.split('').every((char) => char === state.buffer[0])
    const search = repeated ? state.buffer[0] : state.buffer
    const start = index < 0 ? 0 : repeated ? index + 1 : index
    const ordered = [...items.slice(start), ...items.slice(0, start)]
    const match = ordered.find((item) => getTextValue(item).startsWith(search))
    if (match) focusItem(match)
  }

  const menuRef = useMemo(
    () => mergeRefs<HTMLDivElement>(setMenuEl, setNode, nodeRef, ref),
    [setNode, nodeRef, ref],
  )

  return (
    <Portal>
      {present && (
        <MenuContext.Provider value={context}>
          <div
            ref={menuRef}
            role="menu"
            aria-orientation="vertical"
            tabIndex={-1}
            data-state={state}
            inert={state === 'closed' || undefined}
            data-side={floating.side}
            data-theme={getThemeScope(themeOrigin)}
            className={cx('or-floating', 'or-menu', className)}
            style={{ ...floating.floatingStyles, ...style }}
            onKeyDown={handleKeyDown}
            onContextMenu={(event) => event.preventDefault()}
            {...rest}
            {...layerProps}
          >
            {children}
          </div>
        </MenuContext.Provider>
      )}
    </Portal>
  )
})

/* -------------------------------------------------------------------------- */
/* Itens                                                                      */
/* -------------------------------------------------------------------------- */

type ItemEvent = SyntheticEvent<HTMLDivElement>

interface BaseItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect' | 'role'> {
  role: 'menuitem' | 'menuitemcheckbox' | 'menuitemradio'
  disabled?: boolean
  closeOnSelect: boolean
  textValue?: string
  onActivate: (event: ItemEvent) => void
}

const MenuItemBase = forwardRef<HTMLDivElement, BaseItemProps>(function MenuItemBase(
  {
    role,
    disabled,
    closeOnSelect,
    textValue,
    onActivate,
    className,
    onClick,
    onKeyDown,
    onKeyUp,
    onPointerMove,
    onPointerLeave,
    ...rest
  },
  ref,
) {
  const context = useContext(MenuContext)
  const spacePressed = useRef(false)

  const activate = (event: ItemEvent) => {
    if (disabled) return
    // Fecha e devolve o foco antes de executar a ação (que pode abrir um diálogo).
    if (closeOnSelect) context?.close()
    onActivate(event)
  }

  return (
    <div
      ref={ref}
      role={role}
      tabIndex={-1}
      aria-disabled={disabled || undefined}
      data-text-value={textValue}
      className={cx('or-menu__item', className)}
      onClick={composeEventHandlers(onClick, activate)}
      onKeyDown={composeEventHandlers(onKeyDown, (event: ReactKeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          activate(event)
        } else if (event.key === ' ') {
          // Espaço ativa no keyup, para o keyup não "clicar" no gatilho que recebe o foco.
          event.preventDefault()
          spacePressed.current = true
        }
      })}
      onKeyUp={composeEventHandlers(onKeyUp, (event: ReactKeyboardEvent<HTMLDivElement>) => {
        if (event.key === ' ' && spacePressed.current) {
          spacePressed.current = false
          event.preventDefault()
          activate(event)
        }
      })}
      onPointerMove={composeEventHandlers(
        onPointerMove,
        (event: ReactPointerEvent<HTMLDivElement>) => {
          if (event.pointerType === 'touch') return
          if (document.activeElement !== event.currentTarget) focusElement(event.currentTarget)
        },
      )}
      onPointerLeave={composeEventHandlers(
        onPointerLeave,
        (event: ReactPointerEvent<HTMLDivElement>) => {
          if (event.pointerType === 'touch') return
          if (document.activeElement === event.currentTarget) context?.focusMenu()
        },
      )}
      {...rest}
    />
  )
})

/** `true` depois que `value` muda pela primeira vez (não anima o estado inicial ao abrir). */
function useChangedSinceMount(value: unknown) {
  const [initial] = useState(value)
  const [changed, setChanged] = useState(false)
  if (!changed && value !== initial) setChanged(true)
  return changed
}

function renderIcon(icon: IconName | ReactElement | undefined) {
  if (!icon) return null
  return (
    <span className="or-menu__icon" aria-hidden="true">
      {isValidElement(icon) ? icon : <Icon name={icon as IconName} size="sm" />}
    </span>
  )
}

export interface DropdownItemProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onSelect' | 'role'
> {
  /** Ícone à esquerda: nome da biblioteca do Orange ou um elemento. */
  icon?: IconName | ReactElement
  /** Atalho de teclado exibido à direita (apenas visual — implemente o atalho à parte). */
  shortcut?: string
  /** `danger` para ações destrutivas. */
  tone?: 'neutral' | 'danger'
  /** Visível e focável, mas não pode ser ativado. */
  disabled?: boolean
  /** Executado ao ativar o item (clique, Enter ou Espaço). */
  onSelect?: (event: SyntheticEvent<HTMLDivElement>) => void
  /** Fecha o menu ao ativar. Padrão: `true`. */
  closeOnSelect?: boolean
  /** Texto usado pelo typeahead quando o conteúdo não é texto simples. */
  textValue?: string
}

/** Item de ação do menu (`role="menuitem"`). */
export const DropdownItem = forwardRef<HTMLDivElement, DropdownItemProps>(function DropdownItem(
  {
    icon,
    shortcut,
    tone = 'neutral',
    disabled,
    onSelect,
    closeOnSelect = true,
    textValue,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <MenuItemBase
      ref={ref}
      role="menuitem"
      disabled={disabled}
      closeOnSelect={closeOnSelect}
      textValue={textValue}
      onActivate={(event) => onSelect?.(event)}
      className={cx(tone === 'danger' && 'or-menu__item--danger', className)}
      {...rest}
    >
      {renderIcon(icon)}
      <span className="or-menu__text">{children}</span>
      {shortcut && (
        <span className="or-menu__shortcut" aria-hidden="true">
          {shortcut}
        </span>
      )}
    </MenuItemBase>
  )
})

export interface DropdownCheckboxItemProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onSelect' | 'role'
> {
  /** Marcado (controlado). */
  checked?: boolean
  /** Marcado inicialmente (não controlado). */
  defaultChecked?: boolean
  /** Chamado com o novo estado. */
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  /** Atalho exibido à direita (apenas visual). */
  shortcut?: string
  /** Fecha o menu ao alternar. Padrão: `false` (permite marcar vários). */
  closeOnSelect?: boolean
  textValue?: string
}

/** Opção liga/desliga do menu (`role="menuitemcheckbox"`). */
export const DropdownCheckboxItem = forwardRef<HTMLDivElement, DropdownCheckboxItemProps>(
  function DropdownCheckboxItem(
    {
      checked,
      defaultChecked = false,
      onCheckedChange,
      disabled,
      shortcut,
      closeOnSelect = false,
      textValue,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const [isChecked, setChecked] = useControllableState({
      value: checked,
      defaultValue: defaultChecked,
      onChange: onCheckedChange,
    })
    const animate = useChangedSinceMount(isChecked)
    return (
      <MenuItemBase
        ref={ref}
        role="menuitemcheckbox"
        aria-checked={isChecked}
        disabled={disabled}
        closeOnSelect={closeOnSelect}
        textValue={textValue}
        onActivate={() => setChecked((v) => !v)}
        className={cx('or-menu__item--checkable', className)}
        {...rest}
      >
        <span className="or-menu__indicator" data-animate={animate || undefined} aria-hidden="true">
          {isChecked && <Icon name="check" size="sm" strokeWidth={2.25} />}
        </span>
        <span className="or-menu__text">{children}</span>
        {shortcut && (
          <span className="or-menu__shortcut" aria-hidden="true">
            {shortcut}
          </span>
        )}
      </MenuItemBase>
    )
  },
)

interface RadioGroupContextValue {
  value: string | undefined
  setValue: (value: string) => void
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

export interface DropdownRadioGroupProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  /** Valor selecionado (controlado). */
  value?: string
  /** Valor selecionado inicialmente (não controlado). */
  defaultValue?: string
  /** Chamado com o novo valor. */
  onChange?: (value: string) => void
  /** Rótulo visível do grupo (ex.: "Ordenar por"). Também nomeia o grupo. */
  label?: ReactNode
}

/** Grupo de opções exclusivas (`role="group"` com `menuitemradio`). */
export const DropdownRadioGroup = forwardRef<HTMLDivElement, DropdownRadioGroupProps>(
  function DropdownRadioGroup(
    { value, defaultValue, onChange, label, className, children, ...rest },
    ref,
  ) {
    const [current, setCurrent] = useControllableState<string | undefined>({
      value,
      defaultValue,
      onChange: onChange as ((value: string | undefined) => void) | undefined,
    })
    const labelId = useId('or-menu-group')
    const context = useMemo<RadioGroupContextValue>(
      () => ({ value: current, setValue: setCurrent }),
      [current, setCurrent],
    )
    return (
      <RadioGroupContext.Provider value={context}>
        <div
          ref={ref}
          role="group"
          aria-labelledby={label && !rest['aria-label'] ? labelId : undefined}
          className={cx('or-menu__group', className)}
          {...rest}
        >
          {label && (
            <div id={labelId} role="presentation" className="or-menu__group-label">
              {label}
            </div>
          )}
          {children}
        </div>
      </RadioGroupContext.Provider>
    )
  },
)

export interface DropdownRadioItemProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onSelect' | 'role'
> {
  /** Valor desta opção dentro do `DropdownRadioGroup`. */
  value: string
  disabled?: boolean
  /** Fecha o menu ao escolher. Padrão: `true`. */
  closeOnSelect?: boolean
  textValue?: string
}

/** Opção exclusiva dentro de `DropdownRadioGroup` (`role="menuitemradio"`). */
export const DropdownRadioItem = forwardRef<HTMLDivElement, DropdownRadioItemProps>(
  function DropdownRadioItem(
    { value, disabled, closeOnSelect = true, textValue, className, children, ...rest },
    ref,
  ) {
    const group = useContext(RadioGroupContext)
    const checked = group?.value === value
    const animate = useChangedSinceMount(checked)
    return (
      <MenuItemBase
        ref={ref}
        role="menuitemradio"
        aria-checked={checked}
        disabled={disabled}
        closeOnSelect={closeOnSelect}
        textValue={textValue}
        onActivate={() => group?.setValue(value)}
        className={cx('or-menu__item--checkable', className)}
        {...rest}
      >
        <span
          className="or-menu__indicator or-menu__indicator--radio"
          data-animate={animate || undefined}
          aria-hidden="true"
        >
          {checked && <span className="or-menu__dot" />}
        </span>
        <span className="or-menu__text">{children}</span>
      </MenuItemBase>
    )
  },
)

export type DropdownSeparatorProps = HTMLAttributes<HTMLDivElement>

/** Linha divisória entre grupos de itens (`role="separator"`). */
export const DropdownSeparator = forwardRef<HTMLDivElement, DropdownSeparatorProps>(
  function DropdownSeparator({ className, ...rest }, ref) {
    return (
      <div ref={ref} role="separator" className={cx('or-menu__separator', className)} {...rest} />
    )
  },
)

export type DropdownLabelProps = HTMLAttributes<HTMLDivElement>

/** Título não interativo de uma seção do menu. */
export const DropdownLabel = forwardRef<HTMLDivElement, DropdownLabelProps>(function DropdownLabel(
  { className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="presentation"
      className={cx('or-menu__group-label', className)}
      {...rest}
    />
  )
})
