import { act, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Reveal } from './Reveal'

type IOCallback = (entries: Partial<IntersectionObserverEntry>[]) => void

/** IntersectionObserver controlável: `trigger(true)` simula a entrada na viewport. */
function mockIntersectionObserver() {
  const callbacks: IOCallback[] = []
  class MockIO {
    constructor(cb: IOCallback) {
      callbacks.push(cb)
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  }
  vi.stubGlobal('IntersectionObserver', MockIO)
  return {
    trigger(isIntersecting: boolean) {
      act(() => callbacks.forEach((cb) => cb([{ isIntersecting }])))
    },
  }
}

/** Página de 3000px numa janela de 800px, rolada até `scrollY`. */
function page(scrollY = 0) {
  const html = document.documentElement
  vi.spyOn(html, 'scrollHeight', 'get').mockReturnValue(3000)
  vi.spyOn(html, 'clientHeight', 'get').mockReturnValue(800)
  vi.spyOn(window, 'scrollY', 'get').mockReturnValue(scrollY)
}

/** Posiciona o elemento abaixo da dobra (`top` px do topo da janela) para o Reveal esconder até o scroll. */
function belowTheFold(top = 2000) {
  page()
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
    top,
    bottom: top + 200,
    left: 0,
    right: 100,
    width: 100,
    height: 200,
    x: 0,
    y: top,
    toJSON: () => ({}),
  } as DOMRect)
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('Reveal', () => {
  it('conteúdo acima da dobra fica visível sem esperar o scroll', () => {
    mockIntersectionObserver()
    render(<Reveal>Olá</Reveal>)
    expect(screen.getByText('Olá')).toHaveAttribute('data-reveal', 'shown')
  })

  it('abaixo da dobra começa escondido e revela ao entrar na viewport', () => {
    const io = mockIntersectionObserver()
    belowTheFold()
    render(<Reveal>Seção</Reveal>)
    const el = screen.getByText('Seção')
    expect(el).toHaveAttribute('data-reveal', 'hidden')
    expect(el).toHaveClass('or-reveal', 'or-reveal--up')
    io.trigger(true)
    expect(el).toHaveAttribute('data-reveal', 'shown')
  })

  it('no fim da rolagem revela o que ficou nos últimos pixels da página (aquém da margem de -60px)', async () => {
    mockIntersectionObserver() // o observer nunca vê a entrada: o elemento não alcança a faixa
    belowTheFold()
    render(<Reveal>Rodapé</Reveal>)
    const el = screen.getByText('Rodapé')
    expect(el).toHaveAttribute('data-reveal', 'hidden')
    // Rola até o fim (3000 - 800): o elemento está a 40px da base da janela.
    page(2200)
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 760, 100, 20))
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })
    await waitFor(() => expect(el).toHaveAttribute('data-reveal', 'shown'))
  })

  it('marca data-reveal-settled quando a entrada termina (filhos voltam às próprias transições)', async () => {
    const io = mockIntersectionObserver()
    belowTheFold()
    render(
      <Reveal stagger data-testid="grupo">
        <a href="#a">a</a>
        <a href="#b">b</a>
      </Reveal>,
    )
    const group = screen.getByTestId('grupo')
    expect(group).not.toHaveAttribute('data-reveal-settled')
    io.trigger(true)
    expect(group).toHaveAttribute('data-reveal', 'shown')
    expect(group).not.toHaveAttribute('data-reveal-settled')
    await act(async () => {
      await new Promise((r) => setTimeout(r, 120))
    })
    expect(group).toHaveAttribute('data-reveal-settled')
  })

  it('conteúdo já visível na carga nasce assentado', () => {
    mockIntersectionObserver()
    render(<Reveal>Topo</Reveal>)
    expect(screen.getByText('Topo')).toHaveAttribute('data-reveal-settled')
  })

  it('o conteúdo escondido continua na árvore de acessibilidade', () => {
    mockIntersectionObserver()
    belowTheFold()
    render(
      <Reveal as="section" aria-label="Recursos">
        <h2>Recursos</h2>
      </Reveal>,
    )
    expect(screen.getByRole('heading', { name: 'Recursos' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Recursos' })).not.toHaveAttribute('aria-hidden')
  })

  it('stagger usa o grupo escalonado e delay/index viram variáveis CSS', () => {
    mockIntersectionObserver()
    render(
      <Reveal stagger delay={120} index={2} data-testid="grupo">
        <span>a</span>
        <span>b</span>
      </Reveal>,
    )
    const group = screen.getByTestId('grupo')
    expect(group).toHaveClass('or-reveal-group')
    expect(group.style.getPropertyValue('--or-reveal-delay')).toBe('120ms')
    expect(group.style.getPropertyValue('--or-reveal-index')).toBe('2')
  })

  it('com movimento reduzido nunca esconde', () => {
    mockIntersectionObserver()
    belowTheFold()
    const mm = window.matchMedia
    window.matchMedia = ((q: string) => ({ ...mm(q), matches: q.includes('reduce') })) as typeof window.matchMedia
    render(<Reveal>Sem movimento</Reveal>)
    expect(screen.getByText('Sem movimento')).toHaveAttribute('data-reveal', 'shown')
    window.matchMedia = mm
  })

  it('não possui violações de acessibilidade', async () => {
    mockIntersectionObserver()
    const { container } = render(
      <Reveal as="ul" stagger>
        <li>Tokens</li>
        <li>Componentes</li>
      </Reveal>,
    )
    await expectNoA11yViolations(container)
  })
})

describe('Reveal appear', () => {
  it('com appear anima mesmo já visível: começa escondido e revela nos próximos frames', async () => {
    mockIntersectionObserver()
    const raf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      setTimeout(() => cb(0), 0)
      return 1
    })
    render(<Reveal appear>Hero</Reveal>)
    const el = screen.getByText('Hero')
    expect(el).toHaveAttribute('data-reveal', 'hidden')
    await act(async () => {
      await new Promise((r) => setTimeout(r, 10))
    })
    expect(el).toHaveAttribute('data-reveal', 'shown')
    raf.mockRestore()
  })
})
