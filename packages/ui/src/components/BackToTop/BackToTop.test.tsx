import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { BackToTop } from './BackToTop'

function scrollWindowTo(y: number) {
  act(() => {
    Object.defineProperty(window, 'scrollY', { value: y, configurable: true, writable: true })
    window.dispatchEvent(new Event('scroll'))
  })
}

describe('BackToTop', () => {
  let scrollTo: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true, writable: true })
  })

  afterEach(() => {
    scrollTo.mockRestore()
  })

  it('fica escondido até a página rolar além do threshold', () => {
    render(<BackToTop threshold={300} />)
    const button = screen.getByRole('button', { name: 'Voltar ao topo', hidden: true })
    expect(button).not.toHaveAttribute('data-visible')
    scrollWindowTo(299)
    expect(button).not.toHaveAttribute('data-visible')
    scrollWindowTo(301)
    expect(button).toHaveAttribute('data-visible')
    scrollWindowTo(10)
    expect(button).not.toHaveAttribute('data-visible')
  })

  it('rola suavemente ao topo e move o foco para o <main>', async () => {
    const user = userEvent.setup()
    render(
      <>
        <main>
          <h1>Relatório</h1>
        </main>
        <BackToTop />
      </>,
    )
    scrollWindowTo(1200)
    await user.click(screen.getByRole('button', { name: 'Voltar ao topo' }))
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    expect(screen.getByRole('main')).toHaveFocus()
    expect(screen.getByRole('main')).toHaveAttribute('tabindex', '-1')
  })

  it('usa rolagem instantânea quando o usuário prefere movimento reduzido', async () => {
    const user = userEvent.setup()
    const original = window.matchMedia
    window.matchMedia = ((query: string) => ({
      ...original(query),
      matches: query.includes('prefers-reduced-motion'),
    })) as typeof window.matchMedia
    render(<BackToTop />)
    scrollWindowTo(900)
    await user.click(screen.getByRole('button', { name: 'Voltar ao topo' }))
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' })
    window.matchMedia = original
  })

  it('aceita focusTarget como seletor e funciona pelo teclado', async () => {
    const user = userEvent.setup()
    render(
      <>
        <h1 id="titulo">Pedidos</h1>
        <BackToTop focusTarget="#titulo" />
      </>,
    )
    scrollWindowTo(800)
    screen.getByRole('button', { name: 'Voltar ao topo' }).focus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('heading', { name: 'Pedidos' })).toHaveFocus()
  })

  it('observa um contêiner rolável e o rola até o início', async () => {
    const user = userEvent.setup()
    function Panel() {
      const ref = useRef<HTMLDivElement>(null)
      return (
        <div ref={ref} data-testid="panel" style={{ overflow: 'auto' }}>
          <p>Conteúdo longo</p>
          <BackToTop scrollContainer={ref} position="sticky" showLabel threshold={100} />
        </div>
      )
    }
    render(<Panel />)
    const panel = screen.getByTestId('panel')
    const panelScrollTo = vi.fn()
    panel.scrollTo = panelScrollTo as unknown as typeof panel.scrollTo
    act(() => {
      panel.scrollTop = 500
      fireEvent.scroll(panel)
    })
    const button = screen.getByRole('button', { name: 'Voltar ao topo' })
    expect(button).toHaveAttribute('data-visible')
    expect(button).toHaveClass('or-back-to-top--sticky', 'or-back-to-top--labeled')
    await user.click(button)
    expect(panelScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    expect(panel).toHaveFocus()
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <BackToTop />
        <BackToTop showLabel position="sticky" />
      </div>,
    )
    scrollWindowTo(1000)
    await expectNoA11yViolations(container)
  })
})
