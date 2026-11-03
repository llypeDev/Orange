import type { VirtualElement } from '@floating-ui/react-dom'
import {
  cloneElement,
  forwardRef,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react'
import { useDisclosure, useMounted } from '../../hooks'
import { useLocale } from '../../providers'
import { composeEventHandlers, cx } from '../../utils'
import { MenuPanel, type MenuCloseReason, type MenuFocusTarget } from '../Dropdown/Menu'
import { focusElement } from '../Modal/overlay'
import { returnFocusIfLost, useTriggerElement } from '../Popover/floating'
import './ContextMenu.css'

export interface ContextMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'content'> {
  /**
   * Área que abre o menu com o botão direito (ou Shift+F10 / tecla Menu quando
   * ela ou algo dentro dela está focado). Um único elemento.
   */
  children: ReactElement
  /** Itens do menu — as mesmas partes do Dropdown (`DropdownItem`, `DropdownSeparator`…). */
  content: ReactNode
  /** Aberto (controlado). */
  open?: boolean
  /** Chamado quando o menu abre ou fecha. */
  onOpenChange?: (open: boolean) => void
  /** Desliga o menu de contexto (o menu nativo do navegador volta a aparecer). */
  disabled?: boolean
}

interface Point {
  /** Posição relativa à área, para acompanhar o scroll. */
  dx: number
  dy: number
}

/**
 * Menu aberto com o botão direito sobre uma área, posicionado no ponteiro.
 * Pelo teclado, abre com Shift+F10 ou a tecla Menu. Mesma semântica e
 * navegação do Dropdown.
 */
export const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>(function ContextMenu(
  { children, content, open, onOpenChange, disabled = false, className, ...rest },
  ref,
) {
  const { t } = useLocale()
  const disclosure = useDisclosure({ open, onOpenChange })
  const mounted = useMounted()
  const active = disclosure.isOpen && mounted && !disabled
  const [areaEl, areaRef] = useTriggerElement(children)
  const [point, setPoint] = useState<Point>({ dx: 0, dy: 0 })
  const focusOnOpen = useRef<MenuFocusTarget>('menu')
  const restoreRef = useRef<HTMLElement | null>(null)

  const reference = useMemo<VirtualElement | null>(() => {
    if (!areaEl) return null
    return {
      contextElement: areaEl,
      getBoundingClientRect: () => {
        const rect = areaEl.getBoundingClientRect()
        const x = rect.left + point.dx
        const y = rect.top + point.dy
        return { x, y, left: x, top: y, right: x, bottom: y, width: 0, height: 0 }
      },
    }
  }, [areaEl, point])

  const openAt = (clientX: number, clientY: number, target: MenuFocusTarget) => {
    if (!areaEl) return
    const rect = areaEl.getBoundingClientRect()
    const current = document.activeElement
    restoreRef.current = current instanceof HTMLElement && current !== document.body ? current : null
    setPoint({ dx: clientX - rect.left, dy: clientY - rect.top })
    focusOnOpen.current = target
    disclosure.open()
  }

  const returnTarget = () => {
    const saved = restoreRef.current
    if (saved?.isConnected) return saved
    return areaEl && areaEl.tabIndex >= 0 ? areaEl : null
  }

  const handleClose = (reason: MenuCloseReason) => {
    disclosure.close()
    if (reason === 'select' || reason === 'escape' || reason === 'tab') focusElement(returnTarget())
    else if (reason === 'outside') returnFocusIfLost(returnTarget())
  }

  const childProps = children.props as HTMLAttributes<HTMLElement>
  const area = cloneElement(children as ReactElement<HTMLAttributes<HTMLElement> & { ref?: unknown }>, {
    ref: areaRef,
    onContextMenu: composeEventHandlers(childProps.onContextMenu, (event: ReactMouseEvent<HTMLElement>) => {
      if (disabled) return
      event.preventDefault()
      openAt(event.clientX, event.clientY, 'menu')
    }),
    onKeyDown: composeEventHandlers(childProps.onKeyDown, (event: ReactKeyboardEvent<HTMLElement>) => {
      if (disabled) return
      if ((event.key === 'F10' && event.shiftKey) || event.key === 'ContextMenu') {
        event.preventDefault()
        const rect = (event.target as HTMLElement).getBoundingClientRect()
        openAt(rect.left + Math.min(rect.width / 2, 24), rect.top + Math.min(rect.height / 2, 24), 'first')
      }
    }),
  })

  return (
    <>
      {area}
      <MenuPanel
        ref={ref}
        aria-label={rest['aria-labelledby'] ? undefined : t('contextMenu')}
        open={active}
        reference={reference}
        themeOrigin={areaEl}
        placement="bottom-start"
        offset={2}
        focusOnOpen={focusOnOpen}
        onClose={handleClose}
        className={cx('or-context-menu', className)}
        {...rest}
      >
        {content}
      </MenuPanel>
    </>
  )
})
