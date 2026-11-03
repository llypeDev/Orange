/*
 * Posicionamento interno das sobreposições ancoradas (Popover, Tooltip,
 * Toggletip, HoverCard, Dropdown, ContextMenu). Não é exportado pela biblioteca.
 */
import {
  arrow as arrowMiddleware,
  autoUpdate,
  flip,
  offset as offsetMiddleware,
  shift,
  size,
  useFloating,
  type Placement,
  type ReferenceType,
  type Strategy,
} from '@floating-ui/react-dom'
import { useMemo, useRef, useState, type CSSProperties, type ReactElement, type Ref } from 'react'
import { mergeRefs } from '../../utils'
import { getElementRef } from '../Modal/overlay'
import './floating.css'

export type FloatingPlacement = Placement
export type FloatingSide = 'top' | 'right' | 'bottom' | 'left'

export interface UseFloatingPanelOptions {
  open: boolean
  reference: ReferenceType | null
  floating: HTMLElement | null
  placement?: Placement
  /** Distância entre o gatilho e o painel, em px. */
  offset?: number
  /** Calcula a posição da seta. */
  arrow?: boolean
  strategy?: Strategy
}

/**
 * Posiciona `floating` junto de `reference` com flip/shift e expõe, como
 * variáveis CSS no painel, o espaço disponível e a largura da referência.
 */
export function useFloatingPanel({
  open,
  reference,
  floating,
  placement = 'bottom',
  offset = 8,
  arrow = false,
  strategy = 'absolute',
}: UseFloatingPanelOptions) {
  const arrowRef = useRef<HTMLSpanElement | null>(null)
  const result = useFloating({
    open,
    placement,
    strategy,
    transform: false,
    elements: { reference, floating: open ? floating : null },
    whileElementsMounted: autoUpdate,
    middleware: [
      offsetMiddleware(offset),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
      size({
        padding: 8,
        apply({ availableHeight, availableWidth, rects, elements }) {
          const style = elements.floating.style
          style.setProperty(
            '--or-floating-available-height',
            `${Math.max(0, Math.floor(availableHeight))}px`,
          )
          style.setProperty(
            '--or-floating-available-width',
            `${Math.max(0, Math.floor(availableWidth))}px`,
          )
          style.setProperty(
            '--or-floating-reference-width',
            `${Math.round(rects.reference.width)}px`,
          )
        },
      }),
      ...(arrow ? [arrowMiddleware({ element: arrowRef, padding: 6 })] : []),
    ],
  })

  const side = result.placement.split('-')[0] as FloatingSide
  const arrowData = result.middlewareData.arrow
  const arrowStyle: CSSProperties = {
    left: arrowData?.x != null ? `${arrowData.x}px` : undefined,
    top: arrowData?.y != null ? `${arrowData.y}px` : undefined,
  }
  return { ...result, side, arrowRef, arrowStyle }
}

/** Guarda o elemento DOM do gatilho em estado e devolve uma ref combinada com a do filho. */
export function useTriggerElement<T extends HTMLElement = HTMLElement>(child: ReactElement) {
  const [element, setElement] = useState<T | null>(null)
  const childRef = getElementRef(child)
  const ref = useMemo(() => mergeRefs<T>(childRef as Ref<T>, setElement), [childRef])
  return [element, ref] as const
}

/**
 * Depois de um clique fora, devolve o foco ao gatilho se ele tiver se perdido
 * (foi para o `body`). Roda após o `mousedown`, que é quem move o foco.
 */
export function returnFocusIfLost(target: HTMLElement | null | undefined) {
  window.setTimeout(() => {
    const current = document.activeElement
    if ((!current || current === document.body) && target?.isConnected)
      target.focus({ preventScroll: true })
  }, 0)
}

/** Junta ids de `aria-describedby`/`aria-labelledby` sem duplicar. */
export function joinIds(...ids: (string | undefined | null | false)[]) {
  const unique = Array.from(new Set(ids.filter(Boolean).join(' ').split(/\s+/).filter(Boolean)))
  return unique.length ? unique.join(' ') : undefined
}
