import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { IconButton } from './IconButton'

describe('IconButton', () => {
  it('usa label como nome acessível e renderiza o ícone decorativo', () => {
    const { container } = render(<IconButton icon="search" label="Buscar" />)
    const button = screen.getByRole('button', { name: 'Buscar' })
    expect(button).toHaveAttribute('aria-label', 'Buscar')
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveClass(
      'or-icon-button',
      'or-button--icon-only',
      'or-button--ghost',
      'or-button--md',
    )
    const svg = container.querySelector('svg[data-icon="search"]')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('aceita variantes, tamanhos e um elemento SVG próprio', () => {
    render(
      <IconButton
        icon={<svg data-testid="custom" viewBox="0 0 24 24" />}
        label="Abrir menu"
        variant="outline"
        size="sm"
      />,
    )
    expect(screen.getByRole('button', { name: 'Abrir menu' })).toHaveClass(
      'or-button--outline',
      'or-button--sm',
    )
    expect(screen.getByTestId('custom')).toBeInTheDocument()
  })

  it('dispara onClick com mouse e teclado', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<IconButton icon="trash" label="Excluir arquivo" variant="danger" onClick={onClick} />)
    const button = screen.getByRole('button', { name: 'Excluir arquivo' })
    await user.click(button)
    button.focus()
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    expect(onClick).toHaveBeenCalledTimes(3)
  })

  it('repassa ref e atributos nativos', () => {
    let node: HTMLButtonElement | null = null
    render(
      <IconButton
        ref={(el) => {
          node = el
        }}
        icon="edit"
        label="Editar título"
        aria-describedby="dica"
        disabled
      />,
    )
    const button = screen.getByRole('button', { name: 'Editar título' })
    expect(node).toBe(button)
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-describedby', 'dica')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <IconButton icon="search" label="Buscar" />
        <IconButton icon="edit" label="Editar" variant="outline" />
        <IconButton icon="plus" label="Novo projeto" variant="primary" size="lg" />
        <IconButton icon="trash" label="Excluir" variant="danger" size="sm" />
        <IconButton icon="close" label="Fechar" loading />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
