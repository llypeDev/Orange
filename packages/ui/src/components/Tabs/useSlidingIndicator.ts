import { useCallback, useEffect, useState, type CSSProperties, type RefObject } from 'react'
import { useIsomorphicLayoutEffect } from '../../hooks'

/**
 * Uso interno do grupo de navegação (Tabs, TableOfContents) — não é exportado
 * pela biblioteca.
 *
 * Mede o item ativo (`selector`) dentro de `containerRef` e devolve o estilo
 * de um indicador ÚNICO que desliza entre os itens. Só anima `transform`: o
 * indicador tem 1px no eixo de movimento e é escalado até o tamanho do item.
 * O contêiner precisa ser o `offsetParent` dos itens (`position: relative`).
 *
 * `ready` só fica verdadeiro um quadro depois do primeiro posicionamento, para
 * o indicador não "voar" da origem ao montar (a transição liga depois).
 */
export function useSlidingIndicator(
  containerRef: RefObject<HTMLElement | null>,
  selector: string,
  axis: 'x' | 'y',
  /** Qualquer valor que mude quando o item ativo muda (ex.: o `value`). */
  activeKey: unknown,
): { style: CSSProperties | undefined; visible: boolean; ready: boolean } {
  const [rect, setRect] = useState<{ offset: number; size: number } | null>(null)
  const [ready, setReady] = useState(false)

  const measure = useCallback(() => {
    const container = containerRef.current
    const active = container?.querySelector<HTMLElement>(selector)
    if (!container || !active) {
      setRect(null)
      return
    }
    const next =
      axis === 'x'
        ? { offset: active.offsetLeft, size: active.offsetWidth }
        : { offset: active.offsetTop, size: active.offsetHeight }
    setRect((prev) => (prev && prev.offset === next.offset && prev.size === next.size ? prev : next))
  }, [containerRef, selector, axis])

  useIsomorphicLayoutEffect(() => {
    measure()
  }, [measure, activeKey])

  // Remede quando o contêiner ou os itens mudam de tamanho (fontes, resize, painel revelado).
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => measure()) : null
    if (observer) {
      observer.observe(container)
      Array.from(container.children).forEach((child) => observer.observe(child))
    }
    window.addEventListener('resize', measure)
    let cancelled = false
    document.fonts?.ready.then(() => {
      if (!cancelled) measure()
    })
    return () => {
      cancelled = true
      observer?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [containerRef, measure])

  useEffect(() => {
    if (!rect || ready) return
    const raf = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(raf)
  }, [rect, ready])

  const style: CSSProperties | undefined = rect
    ? {
        transform:
          axis === 'x'
            ? `translateX(${rect.offset}px) scaleX(${rect.size})`
            : `translateY(${rect.offset}px) scaleY(${rect.size})`,
      }
    : undefined

  return { style, visible: rect !== null && rect.size > 0, ready }
}
