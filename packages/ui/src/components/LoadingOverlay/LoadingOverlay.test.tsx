import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { LoadingOverlay } from './LoadingOverlay'

function Report({ visible, message }: { visible: boolean; message?: string }) {
  return (
    <LoadingOverlay visible={visible} message={message} data-testid="overlay">
      <h2>Vendas por região</h2>
      <button type="button">Exportar CSV</button>
    </LoadingOverlay>
  )
}

const content = () => screen.getByRole('heading', { hidden: true }).parentElement!

describe('LoadingOverlay', () => {
  it('oculto: conteúdo interativo, sem aria-busy e região de status vazia', () => {
    render(<Report visible={false} />)
    expect(screen.getByTestId('overlay')).toHaveAttribute('data-state', 'hidden')
    expect(content()).not.toHaveAttribute('inert')
    expect(content()).not.toHaveAttribute('aria-busy')
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    expect(screen.getByRole('button', { name: 'Exportar CSV' })).toBeInTheDocument()
  })

  it('visível: conteúdo inert + aria-busy e mensagem padrão anunciada', () => {
    const { container } = render(<Report visible />)
    expect(screen.getByTestId('overlay')).toHaveAttribute('data-state', 'visible')
    expect(content()).toHaveAttribute('inert')
    expect(content()).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('status')).toHaveTextContent('Carregando…')
    const spinner = container.querySelector('.or-spinner')!
    expect(spinner).toHaveAttribute('aria-hidden', 'true')
  })

  it('a região de status fica fora do conteúdo ocupado', () => {
    render(<Report visible message="Atualizando relatório…" />)
    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Atualizando relatório…')
    expect(content().contains(status)).toBe(false)
  })

  it('a mensagem muda quando o carregamento começa (região sempre montada)', () => {
    const { rerender } = render(<Report visible={false} message="Aplicando filtros…" />)
    const status = screen.getByRole('status')
    rerender(<Report visible message="Aplicando filtros…" />)
    expect(screen.getByRole('status')).toBe(status)
    expect(status).toHaveTextContent('Aplicando filtros…')
    rerender(<Report visible={false} message="Aplicando filtros…" />)
    expect(status).toBeEmptyDOMElement()
    expect(content()).not.toHaveAttribute('inert')
  })

  it('estaciona o foco no painel e o devolve ao terminar', async () => {
    const user = userEvent.setup()
    const { rerender, container } = render(<Report visible={false} />)
    await user.tab()
    const button = screen.getByRole('button', { name: 'Exportar CSV' })
    expect(button).toHaveFocus()
    rerender(<Report visible />)
    expect(container.querySelector('.or-loading-overlay__panel')).toHaveFocus()
    rerender(<Report visible={false} />)
    expect(button).toHaveFocus()
  })

  it('não mexe no foco quando ele está fora do conteúdo', () => {
    const { rerender } = render(
      <>
        <button type="button">Fora</button>
        <Report visible={false} />
      </>,
    )
    const outside = screen.getByRole('button', { name: 'Fora' })
    outside.focus()
    rerender(
      <>
        <button type="button">Fora</button>
        <Report visible />
      </>,
    )
    expect(outside).toHaveFocus()
  })

  it('traduz a mensagem padrão', () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <LoadingOverlay visible>
          <p>Content</p>
        </LoadingOverlay>
      </OrangeProvider>,
    )
    expect(screen.getByRole('status')).toHaveTextContent('Loading…')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container, rerender } = render(<Report visible={false} />)
    await expectNoA11yViolations(container)
    rerender(<Report visible message="Atualizando relatório…" />)
    await expectNoA11yViolations(container)
  })
})
