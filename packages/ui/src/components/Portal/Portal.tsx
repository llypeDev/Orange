import { type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useMounted } from '../../hooks'

export interface PortalProps {
  children: ReactNode
  /** Elemento de destino. Padrão: `document.body`. */
  container?: Element | null
  /** Renderiza no lugar, sem portal. */
  disabled?: boolean
}

/**
 * Renderiza os filhos em outro ponto do DOM (padrão: `document.body`).
 * Usado por Modal, Drawer, Popover, Tooltip e Toast. Seguro para SSR.
 */
export function Portal({ children, container, disabled = false }: PortalProps) {
  const mounted = useMounted()
  if (disabled) return <>{children}</>
  if (!mounted) return null
  return createPortal(children, container ?? document.body)
}
