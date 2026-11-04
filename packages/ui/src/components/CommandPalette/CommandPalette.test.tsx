import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Button } from '../Button'
import { CommandPalette, type CommandGroup, type CommandPaletteProps } from './CommandPalette'

function makeGroups(onRun: (id: string) => void = () => {}): CommandGroup[] {
  return [
    {
      label: 'Navegação',
      items: [
        {
          id: 'inicio',
          label: 'Ir para o início',
          icon: 'home',
          shortcut: 'G I',
          onSelect: () => onRun('inicio'),
        },
        {
          id: 'config',
          label: 'Abrir configurações',
          description: 'Preferências da conta e notificações',
          icon: 'sliders',
          onSelect: () => onRun('config'),
        },
      ],
    },
    {
      label: 'Ações',
      items: [
        {
          id: 'projeto',
          label: 'Criar projeto',
          icon: 'plus',
          shortcut: ['⌘', 'N'],
          onSelect: () => onRun('projeto'),
        },
        {
          id: 'arquivar',
          label: 'Arquivar projeto',
          disabled: true,
          onSelect: () => onRun('arquivar'),
        },
        {
          id: 'convidar',
          label: 'Convidar pessoas',
          keywords: ['equipe', 'membros'],
          onSelect: () => onRun('convidar'),
        },
      ],
    },
  ]
}

function Example({
  onRun,
  ...props
}: Partial<CommandPaletteProps> & { onRun?: (id: string) => void }) {
  return (
    <CommandPalette groups={makeGroups(onRun)} trigger={<Button>Comandos</Button>} {...props} />
  )
}

describe('CommandPalette', () => {
  it('abre como diálogo modal com combobox focado e listbox agrupada', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.click(screen.getByRole('button', { name: 'Comandos' }))
    const dialog = screen.getByRole('dialog', { name: 'Paleta de comandos' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    const input = screen.getByRole('combobox', { name: 'Buscar comandos' })
    expect(input).toHaveFocus()
    const listbox = screen.getByRole('listbox')
    expect(input).toHaveAttribute('aria-controls', listbox.id)
    expect(input).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('group', { name: 'Navegação' })).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(5)
    const first = screen.getByRole('option', { name: 'Ir para o início' })
    expect(input).toHaveAttribute('aria-activedescendant', first.id)
    expect(first).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('option', { name: 'Abrir configurações' })).toHaveAccessibleDescription(
      'Preferências da conta e notificações',
    )
  })

  it('↑/↓ movem o item ativo (circulando e pulando desabilitados)', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.click(screen.getByRole('button', { name: 'Comandos' }))
    const input = screen.getByRole('combobox')
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}')
    expect(input).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Convidar pessoas' }).id,
    )
    await user.keyboard('{ArrowDown}')
    expect(input).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Ir para o início' }).id,
    )
    await user.keyboard('{ArrowUp}')
    expect(input).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Convidar pessoas' }).id,
    )
  })

  it('filtra sem acentos, por descrição e por palavras-chave, anunciando o total', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.click(screen.getByRole('button', { name: 'Comandos' }))
    await user.keyboard('configuracoes')
    expect(screen.getAllByRole('option')).toHaveLength(1)
    expect(screen.getByRole('option', { name: 'Abrir configurações' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('1 resultado disponível')

    await user.clear(screen.getByRole('combobox'))
    await user.keyboard('membros')
    expect(screen.getByRole('option', { name: 'Convidar pessoas' })).toBeInTheDocument()

    await user.clear(screen.getByRole('combobox'))
    await user.keyboard('projeto')
    expect(screen.getAllByRole('option')).toHaveLength(2)
    expect(screen.getByRole('status')).toHaveTextContent('2 resultados disponíveis')
    expect(screen.queryByRole('group', { name: 'Navegação' })).not.toBeInTheDocument()
  })

  it('motion: destaque deslizante é decorativo e fica fora da listbox', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.click(screen.getByRole('button', { name: 'Comandos' }))
    const highlight = document.querySelector('.or-command-palette__highlight')!
    expect(highlight).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByRole('listbox')).not.toContainElement(highlight as HTMLElement)
    expect(highlight).toHaveAttribute('data-visible')
    await user.keyboard('xyzw')
    expect(highlight).not.toHaveAttribute('data-visible')
  })

  it('mostra estado vazio sem resultados', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.click(screen.getByRole('button', { name: 'Comandos' }))
    await user.keyboard('xyzw')
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    expect(screen.getByText('Nenhum resultado encontrado', { selector: 'p' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Nenhum resultado encontrado')
    expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-activedescendant')
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false')
  })

  it('Enter executa o comando ativo, fecha e devolve o foco', async () => {
    const user = userEvent.setup()
    const onRun = vi.fn()
    const onSelect = vi.fn()
    render(<Example onRun={onRun} onSelect={onSelect} />)
    const trigger = screen.getByRole('button', { name: 'Comandos' })
    await user.click(trigger)
    await user.keyboard('criar{Enter}')
    expect(onRun).toHaveBeenCalledWith('projeto')
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'projeto' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('clique executa; item desabilitado não executa', async () => {
    const user = userEvent.setup()
    const onRun = vi.fn()
    render(<Example onRun={onRun} />)
    await user.click(screen.getByRole('button', { name: 'Comandos' }))
    await user.click(screen.getByRole('option', { name: 'Arquivar projeto' }))
    expect(onRun).not.toHaveBeenCalled()
    await user.click(screen.getByRole('option', { name: 'Abrir configurações' }))
    expect(onRun).toHaveBeenCalledWith('config')
  })

  it('Escape fecha; reabrir limpa a busca', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.click(screen.getByRole('button', { name: 'Comandos' }))
    await user.keyboard('criar')
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Comandos' }))
    expect(screen.getByRole('combobox')).toHaveValue('')
  })

  it('atalho global abre e fecha a paleta', async () => {
    const user = userEvent.setup()
    render(<Example hotkey="mod+k" />)
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'k', metaKey: true })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    // sem o modificador, nada acontece
    await user.keyboard('k')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('não possui violações de acessibilidade aberto', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.click(screen.getByRole('button', { name: 'Comandos' }))
    await expectNoA11yViolations(document.body)
  })
})
