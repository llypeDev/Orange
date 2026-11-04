import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { VisuallyHidden } from './VisuallyHidden'

describe('VisuallyHidden', () => {
  it('mantém o texto acessível com a classe de recorte', () => {
    render(
      <button type="button">
        <span aria-hidden="true">×</span>
        <VisuallyHidden>Fechar</VisuallyHidden>
      </button>,
    )
    expect(screen.getByRole('button', { name: 'Fechar' })).toBeInTheDocument()
    expect(screen.getByText('Fechar')).toHaveClass('or-visually-hidden')
  })

  it('renderiza outro elemento via `as`', () => {
    render(<VisuallyHidden as="h2">Resultados</VisuallyHidden>)
    expect(screen.getByRole('heading', { level: 2, name: 'Resultados' })).toBeInTheDocument()
  })

  it('com focusable usa a classe que revela no foco e recebe foco por Tab', async () => {
    const user = userEvent.setup()
    render(
      <VisuallyHidden as="a" focusable href="#main">
        Pular para o conteúdo
      </VisuallyHidden>,
    )
    const link = screen.getByRole('link', { name: 'Pular para o conteúdo' })
    expect(link).toHaveClass('or-visually-hidden-focusable')
    await user.tab()
    expect(link).toHaveFocus()
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <a href="#post">
        Ler mais<VisuallyHidden> sobre tokens</VisuallyHidden>
      </a>,
    )
    await expectNoA11yViolations(container)
  })
})
