import { act, render, renderHook, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useCountUp, useInView, usePresence, useScrollDirection } from './index'

function Presence({ open }: { open: boolean }) {
  const { present, state, nodeRef } = usePresence<HTMLDivElement>(open)
  return present ? (
    <div ref={nodeRef} data-state={state} data-testid="panel">
      painel
    </div>
  ) : null
}

describe('usePresence', () => {
  it('monta ao abrir e expõe data-state', () => {
    const { rerender } = render(<Presence open={false} />)
    expect(screen.queryByTestId('panel')).toBeNull()
    rerender(<Presence open />)
    expect(screen.getByTestId('panel')).toHaveAttribute('data-state', 'open')
  })

  it('sem animação de saída (jsdom) desmonta imediatamente ao fechar', () => {
    const { rerender } = render(<Presence open />)
    rerender(<Presence open={false} />)
    expect(screen.queryByTestId('panel')).toBeNull()
  })

  it('com animação de saída mantém montado até animationend', () => {
    const spy = vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      animationName: 'or-pop-out',
      animationDuration: '0.16s',
      transitionDuration: '0s',
    } as CSSStyleDeclaration)
    const { rerender } = render(<Presence open />)
    rerender(<Presence open={false} />)
    const panel = screen.getByTestId('panel')
    expect(panel).toHaveAttribute('data-state', 'closed')
    act(() => {
      panel.dispatchEvent(new Event('animationend', { bubbles: true }))
    })
    expect(screen.queryByTestId('panel')).toBeNull()
    spy.mockRestore()
  })
})

describe('useCountUp', () => {
  it('desabilitado retorna o valor final', () => {
    const { result } = renderHook(() => useCountUp(84, { enabled: false }))
    expect(result.current).toBe(84)
  })

  it('com movimento reduzido retorna o valor final', () => {
    const mm = window.matchMedia
    window.matchMedia = ((q: string) => ({ ...mm(q), matches: q.includes('reduce') })) as typeof window.matchMedia
    const { result } = renderHook(() => useCountUp(42))
    expect(result.current).toBe(42)
    window.matchMedia = mm
  })
})

describe('useInView', () => {
  it('sem IntersectionObserver considera visível', () => {
    const original = window.IntersectionObserver
    // @ts-expect-error — simula ambiente sem suporte
    delete window.IntersectionObserver
    function Probe() {
      const [ref, inView] = useInView<HTMLDivElement>()
      return <div ref={ref}>{inView ? 'visível' : 'oculto'}</div>
    }
    render(<Probe />)
    expect(screen.getByText('visível')).toBeInTheDocument()
    window.IntersectionObserver = original
  })
})

describe('useScrollDirection', () => {
  it('detecta rolagem para baixo depois do limite', async () => {
    const raf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0)
      return 0
    })
    const { result } = renderHook(() => useScrollDirection({ threshold: 100 }))
    expect(result.current.direction).toBe('up')
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 400, configurable: true })
      window.dispatchEvent(new Event('scroll'))
    })
    expect(result.current).toEqual({ direction: 'down', pastThreshold: true })
    raf.mockRestore()
  })
})
