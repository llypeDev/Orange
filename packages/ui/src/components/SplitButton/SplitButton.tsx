import {
  autoUpdate,
  flip,
  offset,
  shift,
  size as sizeMiddleware,
  useFloating,
} from '@floating-ui/react-dom'
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
import { useClickOutside, useControllableState, useId, usePresence } from '../../hooks'
import { Icon, type IconName } from '../../icons'
import { useLocale } from '../../providers'
import { cx, devWarning, mergeRefs } from '../../utils'
import { Button, type ButtonProps } from '../Button'
import { rovingItemProps, useActionGroup } from '../ButtonGroup/context'
import { Portal } from '../Portal'
import './SplitButton.css'

export type SplitButtonVariant = 'primary' | 'secondary' | 'outline'

export interface SplitButtonAction {
  /** Rótulo do item do menu (também usado na busca por letra inicial). */
  label: string
  /** Chamado quando o item é escolhido. O menu fecha e o foco volta para a seta. */
  onSelect: () => void
  /** Ícone antes do rótulo. */
  icon?: IconName
  /** Item visível e focável, mas que não pode ser acionado. */
  disabled?: boolean
}

export interface SplitButtonProps extends Omit<
  ButtonProps,
  'variant' | 'iconOnly' | 'endIcon' | 'block'
> {
  /** Estilo visual das duas partes. */
  variant?: SplitButtonVariant
  /** Ações alternativas exibidas no menu da seta. */
  actions: SplitButtonAction[]
  /** Nome acessível do botão de seta. Padrão: `t('moreActions')` ("Mais ações"). */
  menuLabel?: string
  /** Menu aberto (controlado). */
  open?: boolean
  /** Menu aberto inicialmente (não controlado). */
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Alinhamento do menu em relação ao botão. */
  placement?: 'bottom-start' | 'bottom-end'
}

const isPrintableKey = (key: string) => key.length === 1 && key !== ' '

/**
 * Ação principal com um botão de seta que abre um menu de ações relacionadas
 * (padrão "menu button" do WAI-ARIA). `ref` e os atributos extras vão para o
 * botão principal; `className` e `style`, para o contêiner.
 */
export const SplitButton = forwardRef<HTMLButtonElement, SplitButtonProps>(function SplitButton(
  {
    variant,
    size,
    disabled,
    actions,
    menuLabel,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    placement = 'bottom-end',
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const group = useActionGroup()
  const id = useId('or-split-button')
  const triggerId = `${id}-trigger`
  const menuId = `${id}-menu`

  devWarning(actions.length === 0, 'SplitButton precisa de ao menos uma ação em `actions`.')

  const groupVariant =
    group?.variant === 'primary' || group?.variant === 'secondary' || group?.variant === 'outline'
      ? group.variant
      : undefined
  const resolvedVariant = variant ?? groupVariant ?? 'primary'
  const resolvedSize = size ?? group?.size ?? 'md'
  const isDisabled = disabled ?? group?.disabled ?? false

  const [isOpen, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })
  const [activeIndex, setActiveIndex] = useState(0)

  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  // O menu continua montado durante a animação de saída (data-state="closed").
  const { present, state, nodeRef: menuRef } = usePresence<HTMLDivElement>(isOpen)

  const {
    refs,
    floatingStyles,
    isPositioned,
    placement: resolvedPlacement,
  } = useFloating({
    open: present,
    placement,
    transform: false,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(4),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
      sizeMiddleware({
        apply({ rects, elements }) {
          elements.floating.style.minWidth = `${Math.max(rects.reference.width, 192)}px`
        },
      }),
    ],
  })

  const openMenu = (index: number) => {
    setActiveIndex(index)
    setOpen(true)
  }

  const closeMenu = (restoreFocus: boolean) => {
    setOpen(false)
    if (restoreFocus) triggerRef.current?.focus()
  }

  // Move o foco para o item ativo sempre que o menu abre ou o item muda.
  useEffect(() => {
    if (!isOpen) return
    itemRefs.current[activeIndex]?.focus({ preventScroll: true })
  }, [isOpen, activeIndex])

  useClickOutside([rootRef, menuRef], () => setOpen(false), isOpen)

  const last = actions.length - 1

  const onTriggerClick = () => {
    if (isOpen) closeMenu(false)
    else openMenu(0)
  }

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      openMenu(0)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      openMenu(last)
    }
  }

  const selectItem = (action: SplitButtonAction) => {
    if (action.disabled) return
    closeMenu(true)
    action.onSelect()
  }

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        setActiveIndex((i) => (i >= last ? 0 : i + 1))
        break
      case 'ArrowUp':
        setActiveIndex((i) => (i <= 0 ? last : i - 1))
        break
      case 'Home':
      case 'PageUp':
        setActiveIndex(0)
        break
      case 'End':
      case 'PageDown':
        setActiveIndex(last)
        break
      case 'Escape':
        event.stopPropagation()
        closeMenu(true)
        break
      case 'Tab':
        // Fecha e devolve o foco à seta; o Tab nativo segue a partir dela.
        closeMenu(true)
        return
      default:
        if (isPrintableKey(event.key) && !event.ctrlKey && !event.metaKey && !event.altKey) {
          const char = event.key.toLocaleLowerCase()
          const order = actions.map((_, i) => (activeIndex + 1 + i) % actions.length)
          const match = order.find((i) =>
            actions[i].label.trim().toLocaleLowerCase().startsWith(char),
          )
          if (match !== undefined) setActiveIndex(match)
          break
        }
        return
    }
    event.preventDefault()
  }

  const onMenuBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null
    if (!next) return
    if (menuRef.current?.contains(next) || rootRef.current?.contains(next)) return
    setOpen(false)
  }

  return (
    <div
      ref={mergeRefs(rootRef, refs.setReference)}
      className={cx(
        'or-split-button',
        `or-split-button--${resolvedVariant}`,
        `or-split-button--${resolvedSize}`,
        className,
      )}
      style={style}
      data-state={isOpen ? 'open' : 'closed'}
    >
      <Button
        ref={ref}
        variant={resolvedVariant}
        size={resolvedSize}
        disabled={isDisabled}
        className="or-split-button__main"
        {...rovingItemProps(group)}
        {...rest}
      >
        {children}
      </Button>
      <Button
        ref={triggerRef}
        id={triggerId}
        variant={resolvedVariant}
        size={resolvedSize}
        disabled={isDisabled || actions.length === 0}
        iconOnly
        aria-label={menuLabel ?? t('moreActions')}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        startIcon={<Icon name="chevron-down" />}
        className="or-split-button__trigger"
        onClick={onTriggerClick}
        onKeyDown={onTriggerKeyDown}
        {...rovingItemProps(group)}
      />
      <Portal>
        {present && (
          <div
            ref={mergeRefs(menuRef, refs.setFloating)}
            id={menuId}
            role="menu"
            tabIndex={-1}
            aria-labelledby={triggerId}
            className="or-split-button__menu"
            // A entrada só começa depois do posicionamento (sem "piscar" no canto).
            data-state={isPositioned ? state : undefined}
            data-side={resolvedPlacement.split('-')[0]}
            inert={state === 'closed' || undefined}
            style={{ ...floatingStyles, opacity: isPositioned ? undefined : 0 }}
            onKeyDown={onMenuKeyDown}
            onBlur={onMenuBlur}
          >
            {actions.map((action, index) => (
              <button
                key={`${index}-${action.label}`}
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
                type="button"
                role="menuitem"
                tabIndex={-1}
                aria-disabled={action.disabled || undefined}
                className="or-split-button__item"
                onClick={() => selectItem(action)}
                onMouseMove={(event: MouseEvent<HTMLButtonElement>) => {
                  // O item sob o ponteiro recebe o foco, como em menus nativos.
                  if (activeIndex !== index) setActiveIndex(index)
                  else if (document.activeElement !== event.currentTarget) {
                    event.currentTarget.focus({ preventScroll: true })
                  }
                }}
              >
                {action.icon && (
                  <Icon name={action.icon} size="sm" className="or-split-button__item-icon" />
                )}
                <span className="or-split-button__item-label">{action.label}</span>
              </button>
            ))}
          </div>
        )}
      </Portal>
    </div>
  )
})
