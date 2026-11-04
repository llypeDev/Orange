import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Button } from '../Button'
import { Drawer, type DrawerProps } from './Drawer'

function Example(props: Partial<DrawerProps>) {
  return (
    <Drawer
      title="Filtrar pedidos"
      description="Refine a lista por status e período."
      trigger={<Button>Filtros</Button>}
      footer={({ close }) => (
        <>
          <Button variant="outline" onClick={close}>
            Limpar
          </Button>
          <Button onClick={close}>Aplicar filtros</Button>
        </>
      )}
      {...props}
    >
      <label htmlFor="status">Status</label>
      <select id="status">
        <option>Todos</option>
        <option>Pendentes</option>
      </select>
    </Drawer>
  )
}

describe('Drawer', () => {
  it('abre como diálogo modal com título, descrição e posição', async () => {
    const user = userEvent.setup()
    render(<Example placement="left" size="lg" />)
    await user.click(screen.getByRole('button', { name: 'Filtros' }))
    const dialog = screen.getByRole('dialog', { name: 'Filtrar pedidos' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAccessibleDescription('Refine a lista por status e período.')
    expect(dialog).toHaveClass('or-drawer', 'or-drawer--left', 'or-drawer--lg')
  })

  it('foca o primeiro campo, prende o foco e bloqueia o scroll', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.click(screen.getByRole('button', { name: 'Filtros' }))
    expect(screen.getByLabelText('Status')).toHaveFocus()
    expect(document.body.style.overflow).toBe('hidden')

    screen.getByRole('button', { name: 'Aplicar filtros' }).focus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Fechar' })).toHaveFocus()
  })

  it('Escape, fundo e botão fechar fecham e devolvem o foco', async () => {
    const user = userEvent.setup()
    render(<Example />)
    const trigger = screen.getByRole('button', { name: 'Filtros' })

    await user.click(trigger)
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()

    await user.click(trigger)
    await user.click(document.querySelector('.or-dialog__backdrop')!)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(trigger)
    await user.click(screen.getByRole('button', { name: 'Fechar' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('rodapé recebe close e o estado pode ser controlado', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<Example open onOpenChange={onOpenChange} />)
    await user.click(await screen.findByRole('button', { name: 'Aplicar filtros' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('posição inferior', async () => {
    render(<Example placement="bottom" defaultOpen />)
    expect(await screen.findByRole('dialog')).toHaveClass('or-drawer--bottom', 'or-drawer--md')
  })

  it('não possui violações de acessibilidade aberto', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.click(screen.getByRole('button', { name: 'Filtros' }))
    await expectNoA11yViolations(document.body)
  })
})
