import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Button } from '../Button'
import { Modal, ModalBody } from '../Modal/Modal'
import { Dropdown, type DropdownProps } from './Dropdown'
import {
  DropdownCheckboxItem,
  DropdownItem,
  DropdownLabel,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownSeparator,
} from './Menu'

function Example({
  onSelect = () => {},
  ...props
}: Partial<DropdownProps> & { onSelect?: (id: string) => void }) {
  return (
    <>
      <Dropdown trigger={<Button variant="outline">Ações</Button>} {...props}>
        <DropdownLabel>Projeto</DropdownLabel>
        <DropdownItem icon="edit" shortcut="⌘E" onSelect={() => onSelect('rename')}>
          Renomear
        </DropdownItem>
        <DropdownItem icon="copy" onSelect={() => onSelect('duplicate')}>
          Duplicar
        </DropdownItem>
        <DropdownItem icon="download" disabled onSelect={() => onSelect('export')}>
          Exportar
        </DropdownItem>
        <DropdownItem icon="folder" onSelect={() => onSelect('move')}>
          Mover para…
        </DropdownItem>
        <DropdownSeparator />
        <DropdownItem icon="trash" tone="danger" onSelect={() => onSelect('delete')}>
          Excluir
        </DropdownItem>
      </Dropdown>
      <Button variant="ghost">Depois</Button>
    </>
  )
}

const items = () => screen.getAllByRole('menuitem')

describe('Dropdown', () => {
  it('gatilho segue o padrão menu button', async () => {
    const user = userEvent.setup()
    render(<Example />)
    const trigger = screen.getByRole('button', { name: 'Ações' })
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await user.click(trigger)
    const menu = screen.getByRole('menu', { name: 'Ações' })
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(trigger).toHaveAttribute('aria-controls', menu.id)
    expect(items()).toHaveLength(5)
    expect(screen.getByRole('menuitem', { name: 'Exportar' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
    // aberto com o mouse, o foco vai para o menu (nenhum item destacado)
    expect(menu).toHaveFocus()
  })

  it('Enter, Espaço e ↓ no gatilho abrem focando o primeiro item; ↑ foca o último', async () => {
    const user = userEvent.setup()
    render(<Example />)
    const trigger = screen.getByRole('button', { name: 'Ações' })

    trigger.focus()
    await user.keyboard('{Enter}')
    expect(items()[0]).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(trigger).toHaveFocus()

    await user.keyboard(' ')
    expect(items()[0]).toHaveFocus()
    await user.keyboard('{Escape}')

    await user.keyboard('{ArrowDown}')
    expect(items()[0]).toHaveFocus()
    await user.keyboard('{Escape}')

    await user.keyboard('{ArrowUp}')
    expect(screen.getByRole('menuitem', { name: 'Excluir' })).toHaveFocus()
  })

  it('setas circulam, Home/End vão às pontas e itens desabilitados são focáveis', async () => {
    const user = userEvent.setup()
    render(<Example />)
    screen.getByRole('button', { name: 'Ações' }).focus()
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{ArrowDown}{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: 'Exportar' })).toHaveFocus()
    await user.keyboard('{End}')
    expect(screen.getByRole('menuitem', { name: 'Excluir' })).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: 'Renomear' })).toHaveFocus()
    await user.keyboard('{ArrowUp}')
    expect(screen.getByRole('menuitem', { name: 'Excluir' })).toHaveFocus()
    await user.keyboard('{Home}')
    expect(screen.getByRole('menuitem', { name: 'Renomear' })).toHaveFocus()
  })

  it('typeahead foca o item pela letra inicial', async () => {
    const user = userEvent.setup()
    render(<Example />)
    screen.getByRole('button', { name: 'Ações' }).focus()
    await user.keyboard('{ArrowDown}')
    await user.keyboard('mo')
    expect(screen.getByRole('menuitem', { name: 'Mover para…' })).toHaveFocus()
    await new Promise((resolve) => setTimeout(resolve, 550))
    // a mesma letra repetida circula entre os itens que começam com ela
    await user.keyboard('e')
    expect(screen.getByRole('menuitem', { name: 'Excluir' })).toHaveFocus()
    await user.keyboard('e')
    expect(screen.getByRole('menuitem', { name: 'Exportar' })).toHaveFocus()
  })

  it('Enter e Espaço ativam o item, fecham o menu e devolvem o foco', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<Example onSelect={onSelect} />)
    const trigger = screen.getByRole('button', { name: 'Ações' })
    trigger.focus()
    await user.keyboard('{ArrowDown}{Enter}')
    expect(onSelect).toHaveBeenLastCalledWith('rename')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()

    await user.keyboard('{ArrowDown}{ArrowDown}')
    await user.keyboard(' ')
    expect(onSelect).toHaveBeenLastCalledWith('duplicate')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('clique ativa; item desabilitado não ativa nem fecha', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<Example onSelect={onSelect} />)
    await user.click(screen.getByRole('button', { name: 'Ações' }))
    await user.click(screen.getByRole('menuitem', { name: 'Exportar' }))
    expect(onSelect).not.toHaveBeenCalled()
    expect(screen.getByRole('menu')).toBeInTheDocument()
    await user.click(screen.getByRole('menuitem', { name: 'Excluir' }))
    expect(onSelect).toHaveBeenCalledWith('delete')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('passar o mouse foca o item', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.click(screen.getByRole('button', { name: 'Ações' }))
    await user.hover(screen.getByRole('menuitem', { name: 'Duplicar' }))
    expect(screen.getByRole('menuitem', { name: 'Duplicar' })).toHaveFocus()
  })

  it('Tab fecha o menu e segue para o próximo elemento', async () => {
    const user = userEvent.setup()
    render(<Example />)
    screen.getByRole('button', { name: 'Ações' }).focus()
    await user.keyboard('{ArrowDown}')
    await user.tab()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Depois' })).toHaveFocus()
  })

  it('clique fora fecha', async () => {
    const user = userEvent.setup()
    render(<Example />)
    const trigger = screen.getByRole('button', { name: 'Ações' })
    await user.click(trigger)
    await user.click(document.body)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it('checkbox e radio mantêm estado e semântica', async () => {
    const user = userEvent.setup()
    const onSort = vi.fn()
    function Options() {
      const [sort, setSort] = useState('recent')
      return (
        <Dropdown trigger={<Button>Exibir</Button>}>
          <DropdownCheckboxItem defaultChecked>Mostrar concluídas</DropdownCheckboxItem>
          <DropdownCheckboxItem>Mostrar arquivadas</DropdownCheckboxItem>
          <DropdownSeparator />
          <DropdownRadioGroup
            label="Ordenar por"
            value={sort}
            onChange={(value) => {
              onSort(value)
              setSort(value)
            }}
          >
            <DropdownRadioItem value="recent">Mais recentes</DropdownRadioItem>
            <DropdownRadioItem value="name">Nome</DropdownRadioItem>
          </DropdownRadioGroup>
        </Dropdown>
      )
    }
    render(<Options />)
    await user.click(screen.getByRole('button', { name: 'Exibir' }))
    const archived = screen.getByRole('menuitemcheckbox', { name: 'Mostrar arquivadas' })
    expect(screen.getByRole('menuitemcheckbox', { name: 'Mostrar concluídas' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    expect(archived).toHaveAttribute('aria-checked', 'false')

    await user.click(archived)
    expect(archived).toHaveAttribute('aria-checked', 'true')
    // checkbox não fecha o menu
    expect(screen.getByRole('menu')).toBeInTheDocument()

    expect(screen.getByRole('group', { name: 'Ordenar por' })).toBeInTheDocument()
    expect(screen.getByRole('menuitemradio', { name: 'Mais recentes' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    await user.click(screen.getByRole('menuitemradio', { name: 'Nome' }))
    expect(onSort).toHaveBeenCalledWith('name')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Exibir' }))
    expect(screen.getByRole('menuitemradio', { name: 'Nome' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
  })

  it('DropdownRadioGroup: onValueChange (depreciado) ainda é chamado e avisa no console', async () => {
    const user = userEvent.setup()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const onValueChange = vi.fn()
    render(
      <Dropdown trigger={<Button>Ordenar</Button>}>
        <DropdownRadioGroup label="Ordenar por" defaultValue="recent" onValueChange={onValueChange}>
          <DropdownRadioItem value="recent">Mais recentes</DropdownRadioItem>
          <DropdownRadioItem value="name">Nome</DropdownRadioItem>
        </DropdownRadioGroup>
      </Dropdown>,
    )
    await user.click(screen.getByRole('button', { name: 'Ordenar' }))
    await user.click(screen.getByRole('menuitemradio', { name: 'Nome' }))
    expect(onValueChange).toHaveBeenCalledWith('name')
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('`onValueChange` está depreciado'))
    warn.mockRestore()
  })

  it('motion: menu expõe data-state e o check só anima quando o estado muda', async () => {
    const user = userEvent.setup()
    render(
      <Dropdown trigger={<Button>Exibir</Button>}>
        <DropdownCheckboxItem defaultChecked>Mostrar concluídas</DropdownCheckboxItem>
        <DropdownCheckboxItem>Mostrar arquivadas</DropdownCheckboxItem>
      </Dropdown>,
    )
    await user.click(screen.getByRole('button', { name: 'Exibir' }))
    expect(screen.getByRole('menu')).toHaveAttribute('data-state', 'open')
    const indicator = (name: string) =>
      screen.getByRole('menuitemcheckbox', { name }).querySelector('.or-menu__indicator')!
    // estado inicial não "pula" ao abrir
    expect(indicator('Mostrar concluídas')).not.toHaveAttribute('data-animate')
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Mostrar arquivadas' }))
    expect(indicator('Mostrar arquivadas')).toHaveAttribute('data-animate')
    expect(indicator('Mostrar concluídas')).not.toHaveAttribute('data-animate')
  })

  it('dentro de um Modal, fica acima dele e Escape fecha só o menu', async () => {
    const user = userEvent.setup()
    render(
      <Modal title="Membros" defaultOpen>
        <ModalBody>
          <Dropdown trigger={<Button>Permissão</Button>}>
            <DropdownItem>Pode editar</DropdownItem>
            <DropdownItem>Pode ver</DropdownItem>
          </Dropdown>
        </ModalBody>
      </Modal>,
    )
    const trigger = await screen.findByRole('button', { name: 'Permissão' })
    await user.click(trigger)
    expect(screen.getByRole('menu')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: 'Membros' })).toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('funciona controlado', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<Example open={false} onOpenChange={onOpenChange} />)
    await user.click(screen.getByRole('button', { name: 'Ações' }))
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('não possui violações de acessibilidade aberto', async () => {
    const user = userEvent.setup()
    render(
      <Dropdown trigger={<Button>Exibir</Button>}>
        <DropdownLabel>Visualização</DropdownLabel>
        <DropdownItem icon="edit" shortcut="⌘E">
          Renomear
        </DropdownItem>
        <DropdownItem disabled>Exportar</DropdownItem>
        <DropdownSeparator />
        <DropdownCheckboxItem defaultChecked>Mostrar concluídas</DropdownCheckboxItem>
        <DropdownRadioGroup label="Ordenar por" defaultValue="name">
          <DropdownRadioItem value="name">Nome</DropdownRadioItem>
          <DropdownRadioItem value="date">Data</DropdownRadioItem>
        </DropdownRadioGroup>
        <DropdownItem tone="danger">Excluir</DropdownItem>
      </Dropdown>,
    )
    await user.click(screen.getByRole('button', { name: 'Exibir' }))
    await expectNoA11yViolations(document.body)
  })
})
