import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Icon } from '../../icons'
import { expectNoA11yViolations } from '../../test/axe'
import { Button } from '../Button'
import { Tooltip, type TooltipProps } from './Tooltip'

function Example(props: Partial<TooltipProps>) {
  return (
    <Tooltip content="Copia o link público do projeto" delay={0} closeDelay={0} {...props}>
      <Button
        variant="outline"
        iconOnly
        aria-label="Copiar link"
        startIcon={<Icon name="link" />}
      />
    </Tooltip>
  )
}

describe('Tooltip', () => {
  it('liga o gatilho ao tooltip por aria-describedby (mesmo fechado)', () => {
    render(<Example />)
    const trigger = screen.getByRole('button', { name: 'Copiar link' })
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    expect(trigger).toHaveAccessibleDescription('Copia o link público do projeto')
  })

  it('abre no hover após o atraso e fecha ao sair', async () => {
    const user = userEvent.setup()
    render(<Example delay={60} closeDelay={40} />)
    const trigger = screen.getByRole('button', { name: 'Copiar link' })
    await user.hover(trigger)
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toHaveTextContent('Copia o link público do projeto')
    expect(trigger.getAttribute('aria-describedby')).toBe(tooltip.id)

    await user.unhover(trigger)
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument())
  })

  it('continua aberto enquanto o ponteiro está sobre ele (WCAG 1.4.13)', async () => {
    const user = userEvent.setup()
    render(<Example closeDelay={250} />)
    const trigger = screen.getByRole('button', { name: 'Copiar link' })
    await user.hover(trigger)
    const tooltip = await screen.findByRole('tooltip')
    await user.unhover(trigger)
    await user.hover(tooltip)
    await new Promise((resolve) => setTimeout(resolve, 400))
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    await user.unhover(tooltip)
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument())
  })

  it('abre no foco por teclado e fecha no blur', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Example delay={500} />
        <Button>Próximo</Button>
      </>,
    )
    await user.tab()
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    await user.tab()
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('Escape fecha sem mover o foco', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.tab()
    const trigger = screen.getByRole('button', { name: 'Copiar link' })
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('clicar no gatilho esconde o tooltip e preserva o onClick do filho', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Tooltip content="Salvar (Ctrl+S)" delay={0}>
        <Button onClick={onClick}>Salvar</Button>
      </Tooltip>,
    )
    const trigger = screen.getByRole('button', { name: 'Salvar' })
    await user.hover(trigger)
    expect(await screen.findByRole('tooltip')).toBeInTheDocument()
    await user.click(trigger)
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('preserva aria-describedby existente e pode ser controlado ou desligado', () => {
    const { rerender } = render(
      <>
        <span id="dica">Atalho: Ctrl+S</span>
        <Tooltip content="Salvar alterações" open>
          <Button aria-describedby="dica">Salvar</Button>
        </Tooltip>
      </>,
    )
    const trigger = screen.getByRole('button', { name: 'Salvar' })
    expect(trigger).toHaveAccessibleDescription('Atalho: Ctrl+S Salvar alterações')
    expect(screen.getByRole('tooltip')).toBeInTheDocument()

    rerender(
      <Tooltip content="Salvar alterações" disabled>
        <Button>Salvar</Button>
      </Tooltip>,
    )
    expect(screen.getByRole('button', { name: 'Salvar' })).not.toHaveAttribute('aria-describedby')
  })

  it('não possui violações de acessibilidade aberto', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.tab()
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    await expectNoA11yViolations(document.body)
  })
})
