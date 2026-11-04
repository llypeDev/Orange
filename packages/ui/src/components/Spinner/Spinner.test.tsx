import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('anuncia o carregamento com role="status" e rótulo padrão', () => {
    render(<Spinner />)
    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Carregando…')
    expect(status).toHaveClass('or-spinner', 'or-spinner--md', 'or-spinner--accent')
  })

  it('usa o rótulo informado', () => {
    render(<Spinner label="Buscando pedidos" />)
    expect(screen.getByRole('status')).toHaveTextContent('Buscando pedidos')
  })

  it('traduz o rótulo padrão conforme o idioma do provider', () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <Spinner />
      </OrangeProvider>,
    )
    expect(screen.getByRole('status')).toHaveTextContent('Loading…')
  })

  it('aplica tamanho e tom', () => {
    render(<Spinner size="lg" tone="current" />)
    expect(screen.getByRole('status')).toHaveClass('or-spinner--lg', 'or-spinner--current')
  })

  it('quando decorativo, fica oculto para tecnologias assistivas', () => {
    const { container } = render(<Spinner decorative />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(container).not.toHaveTextContent('Carregando')
  })

  it('repassa a ref e atributos extras', () => {
    let node: HTMLSpanElement | null = null
    render(
      <Spinner
        ref={(el) => {
          node = el
        }}
        data-testid="spinner"
      />,
    )
    expect(node).toBe(screen.getByTestId('spinner'))
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <Spinner size="sm" />
        <Spinner tone="neutral" label="Enviando" />
        <Spinner size="lg" decorative />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
