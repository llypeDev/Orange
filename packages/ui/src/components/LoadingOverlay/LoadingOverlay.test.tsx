import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { LoadingOverlay } from './LoadingOverlay'

function Report({ open, message }: { open: boolean; message?: string }) {
  return (
    <LoadingOverlay open={open} message={message} data-testid="overlay">
      <h2>Vendas por região</h2>
      <button type="button">Exportar CSV</button>
    </LoadingOverlay>
  )
}

const content = () => screen.getByRole('heading', { hidden: true }).parentElement!

describe('LoadingOverlay', () => {
  it('oculto: conteúdo interativo, sem aria-busy e região de status vazia', () => {
    render(<Report open={false} />)
    expect(screen.getByTestId('overlay')).toHaveAttribute('data-state', 'hidden')
    expect(content()).not.toHaveAttribute('inert')
    expect(content()).not.toHaveAttribute('aria-busy')
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    expect(screen.getByRole('button', { name: 'Exportar CSV' })).toBeInTheDocument()
  })

  it('visível: conteúdo inert + aria-busy e mensagem padrão anunciada', () => {
    const { container } = render(<Report open />)
    expect(screen.getByTestId('overlay')).toHaveAttribute('data-state', 'visible')
    expect(content()).toHaveAttribute('inert')
    expect(content()).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('status')).toHaveTextContent('Carregando…')
    const spinner = container.querySelector('.or-spinner')!
    expect(spinner).toHaveAttribute('aria-hidden', 'true')
  })

  it('a região de status fica fora do conteúdo ocupado', () => {
    render(<Report open message="Atualizando relatório…" />)
    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Atualizando relatório…')
    expect(content().contains(status)).toBe(false)
  })

  it('a mensagem muda quando o carregamento começa (região sempre montada)', () => {
    const { rerender } = render(<Report open={false} message="Aplicando filtros…" />)
    const status = screen.getByRole('status')
    rerender(<Report open message="Aplicando filtros…" />)
    expect(screen.getByRole('status')).toBe(status)
    expect(status).toHaveTextContent('Aplicando filtros…')
    rerender(<Report open={false} message="Aplicando filtros…" />)
    expect(status).toBeEmptyDOMElement()
    expect(content()).not.toHaveAttribute('inert')
  })

  it('estaciona o foco no painel e o devolve ao terminar', async () => {
    const user = userEvent.setup()
    const { rerender, container } = render(<Report open={false} />)
    await user.tab()
    const button = screen.getByRole('button', { name: 'Exportar CSV' })
    expect(button).toHaveFocus()
    rerender(<Report open />)
    expect(container.querySelector('.or-loading-overlay__panel')).toHaveFocus()
    rerender(<Report open={false} />)
    expect(button).toHaveFocus()
  })

  it('não mexe no foco quando ele está fora do conteúdo', () => {
    const { rerender } = render(
      <>
        <button type="button">Fora</button>
        <Report open={false} />
      </>,
    )
    const outside = screen.getByRole('button', { name: 'Fora' })
    outside.focus()
    rerender(
      <>
        <button type="button">Fora</button>
        <Report open />
      </>,
    )
    expect(outside).toHaveFocus()
  })

  it('na saída, spinner e mensagem ficam no painel até o fade terminar; o conteúdo é liberado na hora', () => {
    const real = window.getComputedStyle.bind(window)
    vi.spyOn(window, 'getComputedStyle').mockImplementation((el, pseudo) => {
      const style = real(el, pseudo)
      if (!(el as Element).matches?.('.or-loading-overlay__backdrop')) return style
      return Object.assign(Object.create(style), {
        animationName: 'none',
        animationDuration: '0s',
        transitionDuration: '0.16s',
      }) as CSSStyleDeclaration
    })
    const { container, rerender } = render(<Report open message="Salvando…" />)
    rerender(<Report open={false} message="Salvando…" />)
    expect(screen.getByTestId('overlay')).toHaveAttribute('data-state', 'hidden')
    expect(content()).not.toHaveAttribute('inert')
    expect(screen.getByRole('status')).toHaveTextContent('Salvando…')
    expect(container.querySelector('.or-spinner')).toBeInTheDocument()
    fireEvent.transitionEnd(container.querySelector('.or-loading-overlay__backdrop')!)
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    expect(container.querySelector('.or-spinner')).not.toBeInTheDocument()
  })

  it('traduz a mensagem padrão', () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <LoadingOverlay open>
          <p>Content</p>
        </LoadingOverlay>
      </OrangeProvider>,
    )
    expect(screen.getByRole('status')).toHaveTextContent('Loading…')
  })

  it('visible (depreciado) ainda abre a sobreposição e avisa no console', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(
      <LoadingOverlay visible data-testid="overlay">
        <p>Conteúdo</p>
      </LoadingOverlay>,
    )
    expect(screen.getByTestId('overlay')).toHaveAttribute('data-state', 'visible')
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('`visible` está depreciado'))
    warn.mockRestore()
  })

  it('não possui violações de acessibilidade', async () => {
    const { container, rerender } = render(<Report open={false} />)
    await expectNoA11yViolations(container)
    rerender(<Report open message="Atualizando relatório…" />)
    await expectNoA11yViolations(container)
  })
})
