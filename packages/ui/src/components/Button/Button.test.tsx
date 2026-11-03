import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Icon } from '../../icons'
import { expectNoA11yViolations } from '../../test/axe'
import { Button } from './Button'

describe('Button', () => {
  it('renderiza um <button type="button"> com o rótulo', () => {
    render(<Button>Salvar</Button>)
    const button = screen.getByRole('button', { name: 'Salvar' })
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveClass('or-button', 'or-button--primary', 'or-button--md')
  })

  it('aplica variante e tamanho', () => {
    render(
      <Button variant="outline" size="lg">
        Cancelar
      </Button>,
    )
    expect(screen.getByRole('button')).toHaveClass('or-button--outline', 'or-button--lg')
  })

  it('dispara onClick com mouse e teclado', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Enviar</Button>)
    await user.click(screen.getByRole('button'))
    screen.getByRole('button').focus()
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    expect(onClick).toHaveBeenCalledTimes(3)
  })

  it('não dispara onClick quando desabilitado', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Enviar
      </Button>,
    )
    await user.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('em loading mantém o foco, anuncia o status e ignora cliques', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button loading loadingText="Salvando" onClick={onClick}>
        Salvar
      </Button>,
    )
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByRole('status')).toHaveTextContent('Salvando')
    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('botão somente ícone usa aria-label como nome acessível', () => {
    render(<Button iconOnly aria-label="Fechar" startIcon={<Icon name="close" />} />)
    expect(screen.getByRole('button', { name: 'Fechar' })).toHaveClass('or-button--icon-only')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <Button>Primário</Button>
        <Button variant="secondary">Secundário</Button>
        <Button variant="outline" endIcon={<Icon name="arrow-right" />}>
          Contorno
        </Button>
        <Button variant="ghost">Fantasma</Button>
        <Button variant="danger">Excluir</Button>
        <Button iconOnly aria-label="Buscar" startIcon={<Icon name="search" />} />
        <Button loading>Carregando</Button>
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
