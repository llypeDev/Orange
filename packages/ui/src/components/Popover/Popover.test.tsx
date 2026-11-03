import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Button } from '../Button'
import { Modal, ModalBody } from '../Modal/Modal'
import { Popover, type PopoverProps } from './Popover'

function Example(props: Partial<PopoverProps>) {
  return (
    <div>
      <Popover trigger={<Button variant="outline">Filtros</Button>} title="Filtrar pedidos" showCloseButton {...props}>
        <label>
          <input type="checkbox" /> Somente pendentes
        </label>
        <Button size="sm">Aplicar</Button>
      </Popover>
      <Button variant="ghost">Exportar</Button>
    </div>
  )
}

describe('Popover', () => {
  it('liga gatilho e conteúdo com aria-haspopup, aria-expanded e aria-controls', async () => {
    const user = userEvent.setup()
    render(<Example />)
    const trigger = screen.getByRole('button', { name: 'Filtros' })
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).not.toHaveAttribute('aria-controls')

    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Filtrar pedidos' })
    expect(dialog).not.toHaveAttribute('aria-modal')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(trigger).toHaveAttribute('aria-controls', dialog.id)
  })

  it('move o foco para o conteúdo ao abrir', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.click(screen.getByRole('button', { name: 'Filtros' }))
    expect(screen.getByRole('button', { name: 'Fechar' })).toHaveFocus()
  })

  it('sem título, usa o gatilho como nome acessível e foca o painel se não houver focáveis', async () => {
    const user = userEvent.setup()
    render(
      <Popover trigger={<Button>Sobre o plano</Button>}>
        O plano Pro inclui 10 projetos.
      </Popover>,
    )
    await user.click(screen.getByRole('button', { name: 'Sobre o plano' }))
    const dialog = screen.getByRole('dialog', { name: 'Sobre o plano' })
    expect(dialog).toHaveFocus()
  })

  it('Escape fecha e devolve o foco ao gatilho', async () => {
    const user = userEvent.setup()
    render(<Example />)
    const trigger = screen.getByRole('button', { name: 'Filtros' })
    await user.click(trigger)
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('clique fora fecha e devolve o foco ao gatilho quando ele se perderia', async () => {
    const user = userEvent.setup()
    render(<Example />)
    const trigger = screen.getByRole('button', { name: 'Filtros' })
    await user.click(trigger)
    await user.click(document.body)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it('clique no gatilho alterna; clique dentro não fecha', async () => {
    const user = userEvent.setup()
    render(<Example />)
    const trigger = screen.getByRole('button', { name: 'Filtros' })
    await user.click(trigger)
    await user.click(screen.getByText('Somente pendentes'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.click(trigger)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('Tab percorre o conteúdo como se viesse logo após o gatilho', async () => {
    const user = userEvent.setup()
    render(<Example />)
    const trigger = screen.getByRole('button', { name: 'Filtros' })
    await user.click(trigger)
    // Shift+Tab no primeiro item volta ao gatilho sem fechar
    await user.tab({ shift: true })
    expect(trigger).toHaveFocus()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    // Tab no gatilho entra de novo no conteúdo
    await user.tab()
    expect(screen.getByRole('button', { name: 'Fechar' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('checkbox')).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Aplicar' })).toHaveFocus()
    // Tab no último sai do popover para o próximo elemento da página
    await user.tab()
    expect(screen.getByRole('button', { name: 'Exportar' })).toHaveFocus()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('funciona controlado e com children em função', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    function Controlled() {
      const [open, setOpen] = useState(false)
      return (
        <Popover
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next)
            setOpen(next)
          }}
          trigger={<Button>Compartilhar</Button>}
          aria-label="Compartilhar projeto"
        >
          {({ close }) => <Button onClick={close}>Copiar link</Button>}
        </Popover>
      )
    }
    render(<Controlled />)
    await user.click(screen.getByRole('button', { name: 'Compartilhar' }))
    expect(onOpenChange).toHaveBeenLastCalledWith(true)
    expect(screen.getByRole('dialog', { name: 'Compartilhar projeto' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Copiar link' }))
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
    expect(screen.getByRole('button', { name: 'Compartilhar' })).toHaveFocus()
  })

  it('dentro de um Modal, Escape fecha só o popover', async () => {
    const user = userEvent.setup()
    render(
      <Modal title="Editar tarefa" defaultOpen>
        <ModalBody>
          <Popover trigger={<Button>Responsável</Button>} title="Escolher responsável">
            <Button>Ana</Button>
          </Popover>
        </ModalBody>
      </Modal>,
    )
    await user.click(await screen.findByRole('button', { name: 'Responsável' }))
    // clicar dentro do popover (portal fora do Modal) não fecha nada
    await user.click(screen.getByRole('button', { name: 'Ana' }))
    expect(screen.getByRole('dialog', { name: 'Escolher responsável' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ana' })).toHaveFocus()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: 'Escolher responsável' })).not.toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: 'Editar tarefa' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Responsável' })).toHaveFocus()
  })

  it('não possui violações de acessibilidade aberto', async () => {
    const user = userEvent.setup()
    render(<Example arrow />)
    await user.click(screen.getByRole('button', { name: 'Filtros' }))
    await expectNoA11yViolations(document.body)
  })
})
