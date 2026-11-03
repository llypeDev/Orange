import {
  cloneElement,
  forwardRef,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react'
import { useDisclosure, useId, useMounted } from '../../hooks'
import { composeEventHandlers } from '../../utils'
import { focusElement } from '../Modal/overlay'
import { returnFocusIfLost, useTriggerElement, type FloatingPlacement } from '../Popover/floating'
import { MenuPanel, type MenuCloseReason, type MenuFocusTarget } from './Menu'

export type DropdownPlacement = FloatingPlacement

export interface DropdownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Botão que abre o menu. Recebe `aria-haspopup="menu"`, `aria-expanded`,
   * `aria-controls` e a navegação por teclado.
   */
  trigger: ReactElement
  /** Itens: `DropdownItem`, `DropdownCheckboxItem`, `DropdownRadioGroup`, `DropdownSeparator`, `DropdownLabel`. */
  children: ReactNode
  /** Aberto (controlado). Use com `onOpenChange`. */
  open?: boolean
  /** Aberto inicialmente (não controlado). */
  defaultOpen?: boolean
  /** Chamado quando o menu pede para abrir ou fechar. */
  onOpenChange?: (open: boolean) => void
  /** Posição preferida; inverte sozinha se faltar espaço. */
  placement?: DropdownPlacement
  /** Distância do gatilho, em px. */
  offset?: number
}

/**
 * Menu de ações aberto por um botão (padrão "menu button" do WAI-ARIA):
 * setas navegam, letras buscam, Enter/Espaço ativam, Escape fecha.
 */
export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(function Dropdown(
  { trigger, children, open, defaultOpen, onOpenChange, placement = 'bottom-start', offset = 4, ...rest },
  ref,
) {
  const disclosure = useDisclosure({ open, defaultOpen, onOpenChange })
  const mounted = useMounted()
  const active = disclosure.isOpen && mounted
  const [triggerEl, triggerRef] = useTriggerElement(trigger)
  const triggerProps = trigger.props as HTMLAttributes<HTMLElement>
  const triggerId = useId('or-dropdown-trigger', triggerProps.id)
  const menuId = useId('or-dropdown-menu')
  const focusOnOpen = useRef<MenuFocusTarget>('first')
  const keyboardClick = useRef(false)

  const openMenu = (target: MenuFocusTarget) => {
    focusOnOpen.current = target
    disclosure.open()
  }

  const handleClose = (reason: MenuCloseReason) => {
    disclosure.close()
    if (reason === 'select' || reason === 'escape' || reason === 'tab') focusElement(triggerEl)
    else if (reason === 'outside') returnFocusIfLost(triggerEl)
  }

  const handleClick = (event: ReactMouseEvent<HTMLElement>) => {
    const viaKeyboard = keyboardClick.current || event.detail === 0
    keyboardClick.current = false
    if (active) disclosure.close()
    else openMenu(viaKeyboard ? 'first' : 'menu')
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      openMenu(event.key === 'ArrowDown' ? 'first' : 'last')
    } else if (event.key === 'Enter' || event.key === ' ') {
      keyboardClick.current = true
    }
  }

  const triggerElement = cloneElement(trigger as ReactElement<HTMLAttributes<HTMLElement> & { ref?: unknown }>, {
    ref: triggerRef,
    id: triggerId,
    'aria-haspopup': 'menu',
    'aria-expanded': active,
    'aria-controls': active ? menuId : undefined,
    onClick: composeEventHandlers(triggerProps.onClick, handleClick),
    onKeyDown: composeEventHandlers(triggerProps.onKeyDown, handleKeyDown),
  })

  return (
    <>
      {triggerElement}
      <MenuPanel
        ref={ref}
        id={menuId}
        aria-labelledby={rest['aria-label'] ? undefined : triggerId}
        open={active}
        reference={triggerEl}
        themeOrigin={triggerEl}
        placement={placement}
        offset={offset}
        focusOnOpen={focusOnOpen}
        onClose={handleClose}
        insideElements={() => [triggerEl]}
        {...rest}
      >
        {children}
      </MenuPanel>
    </>
  )
})
