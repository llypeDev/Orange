import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { clamp } from '../../utils'

export interface VirtualRowsOptions {
  enabled: boolean
  /** Total de linhas (depois do filtro e da ordenação). */
  count: number
  /** Contêiner que rola (o da tabela, com `maxHeight`). */
  containerRef: { current: HTMLElement | null }
  /** `<tbody>`: de onde se mede o início das linhas e a altura real de uma delas. */
  bodyRef: { current: HTMLElement | null }
  /** Altura estimada da linha (px), usada até a primeira medição. */
  estimate: number
  /** Linhas a mais renderizadas acima e abaixo da área visível. */
  overscan: number
  /** Altura da área visível enquanto não há layout (servidor, primeira renderização). */
  fallbackViewport: number
}

export interface VirtualRows {
  /** Primeira linha renderizada (índice em `rows`). */
  start: number
  /** Uma depois da última linha renderizada. */
  end: number
  /** Altura de cada linha (px): medida na primeira linha renderizada. */
  rowHeight: number
}

/**
 * Janela de linhas à vista de uma tabela rolável: só elas vão para o DOM; o resto vira
 * espaçadores com a altura das linhas que faltam. Pressupõe linhas de mesma altura — a medida da
 * primeira linha renderizada vale para todas. Recalcula ao rolar e quando o contêiner muda de
 * tamanho.
 */
export function useVirtualRows({
  enabled,
  count,
  containerRef,
  bodyRef,
  estimate,
  overscan,
  fallbackViewport,
}: VirtualRowsOptions): VirtualRows {
  const [state, setState] = useState<VirtualRows>(() => ({
    start: 0,
    end: Math.min(count, Math.ceil(fallbackViewport / estimate) + overscan),
    rowHeight: estimate,
  }))

  useEffect(() => {
    if (!enabled) return
    const container = containerRef.current
    const body = bodyRef.current
    if (!container || !body) return
    let frame = 0

    const measure = () => {
      frame = 0
      const row = body.querySelector<HTMLElement>(':scope > .or-table__row')
      const rowHeight = (row && row.getBoundingClientRect().height) || estimate
      const viewport = container.clientHeight || fallbackViewport
      // Início do <tbody> dentro do conteúdo rolável (a legenda e o cabeçalho vêm antes dele).
      const bodyTop =
        body.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop
      const top = container.scrollTop - bodyTop
      const start = clamp(Math.floor(top / rowHeight) - overscan, 0, count)
      const end = clamp(Math.ceil((top + viewport) / rowHeight) + overscan, start, count)
      setState((prev) =>
        prev.start === start && prev.end === end && prev.rowHeight === rowHeight
          ? prev
          : { start, end, rowHeight },
      )
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    // Ao rolar, a janela nova precisa estar no DOM antes de o quadro ser pintado: o evento de
    // rolagem chega um por quadro, logo antes da pintura, e sem flushSync o React só renderizaria
    // depois dela — numa rolagem rápida (barra, Page Down) a área ficaria um quadro em branco.
    const onScroll = () => flushSync(measure)

    measure()
    container.addEventListener('scroll', onScroll, { passive: true })
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule)
    observer?.observe(container)
    return () => {
      container.removeEventListener('scroll', onScroll)
      observer?.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [enabled, count, estimate, overscan, fallbackViewport, containerRef, bodyRef])

  if (!enabled) return { start: 0, end: count, rowHeight: estimate }
  // `count` pode ter encolhido (filtro) antes de o efeito medir de novo.
  const start = Math.min(state.start, count)
  return { start, end: clamp(state.end, start, count), rowHeight: state.rowHeight }
}
