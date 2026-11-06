import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Button } from '../Button'
import { IconButton } from '../IconButton/IconButton'
import { ToggleButton } from '../ToggleButton/ToggleButton'
import { ToggleButtonGroup } from '../ToggleButton/ToggleButtonGroup'
import { Toolbar, ToolbarGroup, ToolbarSeparator } from './Toolbar'

function Editor({ orientation }: { orientation?: 'horizontal' | 'vertical' }) {
  return (
    <>
      <button type="button">Antes</button>
      <Toolbar aria-label="Formatação de texto" orientation={orientation}>
        <ToolbarGroup aria-label="Histórico">
          <IconButton icon="undo" label="Desfazer" />
          <IconButton icon="redo" label="Refazer" disabled />
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToggleButtonGroup selectionMode="multiple" aria-label="Estilo">
          <ToggleButton value="bold">Negrito</ToggleButton>
          <ToggleButton value="italic">Itálico</ToggleButton>
        </ToggleButtonGroup>
        <ToolbarSeparator />
        <Button>Inserir link</Button>
      </Toolbar>
      <button type="button">Depois</button>
    </>
  )
}

describe('Toolbar', () => {
  it('renderiza role="toolbar" com nome, orientação e separadores', () => {
    render(<Editor />)
    const toolbar = screen.getByRole('toolbar', { name: 'Formatação de texto' })
    expect(toolbar).toHaveAttribute('aria-orientation', 'horizontal')
    const separators = screen.getAllByRole('separator')
    expect(separators).toHaveLength(2)
    expect(separators[0]).toHaveAttribute('aria-orientation', 'vertical')
    expect(screen.getByRole('group', { name: 'Histórico' })).toBeInTheDocument()
  })

  it('marca os itens e deixa apenas um tabulável', () => {
    render(<Editor />)
    const undo = screen.getByRole('button', { name: 'Desfazer' })
    const bold = screen.getByRole('button', { name: 'Negrito' })
    const link = screen.getByRole('button', { name: 'Inserir link' })
    for (const item of [undo, bold, link]) expect(item).toHaveAttribute('data-roving-item')
    expect(undo).toHaveAttribute('tabindex', '0')
    expect(bold).toHaveAttribute('tabindex', '-1')
    expect(link).toHaveAttribute('tabindex', '-1')
    // Button filho direto recebe a variante ghost da barra.
    expect(link).toHaveClass('or-button--ghost')
  })

  it('a barra ocupa uma única parada de Tab', async () => {
    const user = userEvent.setup()
    render(<Editor />)
    await user.tab()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Desfazer' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Depois' })).toHaveFocus()
  })

  it('←/→ movem o foco (pulando desabilitados, com volta) e Home/End vão às pontas', async () => {
    const user = userEvent.setup()
    render(<Editor />)
    const undo = screen.getByRole('button', { name: 'Desfazer' })
    const bold = screen.getByRole('button', { name: 'Negrito' })
    const italic = screen.getByRole('button', { name: 'Itálico' })
    const link = screen.getByRole('button', { name: 'Inserir link' })
    undo.focus()
    await user.keyboard('{ArrowRight}')
    expect(bold).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(italic).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(link).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(undo).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(link).toHaveFocus()
    await user.keyboard('{Home}')
    expect(undo).toHaveFocus()
    await user.keyboard('{End}')
    expect(link).toHaveFocus()
    // ↓ não faz nada na barra horizontal.
    await user.keyboard('{ArrowDown}')
    expect(link).toHaveFocus()
  })

  it('lembra o último item focado ao sair e voltar com Tab', async () => {
    const user = userEvent.setup()
    render(<Editor />)
    screen.getByRole('button', { name: 'Desfazer' }).focus()
    await user.keyboard('{ArrowRight}')
    await user.tab()
    expect(screen.getByRole('button', { name: 'Depois' })).toHaveFocus()
    await user.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Negrito' })).toHaveFocus()
    expect(screen.getByRole('button', { name: 'Negrito' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('button', { name: 'Desfazer' })).toHaveAttribute('tabindex', '-1')
  })

  it('clicar num item o torna a parada de Tab; Espaço alterna ToggleButtons', async () => {
    const user = userEvent.setup()
    render(<Editor />)
    const italic = screen.getByRole('button', { name: 'Itálico' })
    await user.click(italic)
    expect(italic).toHaveAttribute('tabindex', '0')
    expect(italic).toHaveAttribute('aria-pressed', 'true')
    await user.keyboard(' ')
    expect(italic).toHaveAttribute('aria-pressed', 'false')
  })

  it('vertical usa ↑/↓', async () => {
    const user = userEvent.setup()
    render(<Editor orientation="vertical" />)
    expect(screen.getByRole('toolbar')).toHaveAttribute('aria-orientation', 'vertical')
    expect(screen.getAllByRole('separator')[0]).toHaveAttribute('aria-orientation', 'horizontal')
    screen.getByRole('button', { name: 'Desfazer' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('button', { name: 'Desfazer' })).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('button', { name: 'Negrito' })).toHaveFocus()
    await user.keyboard('{ArrowUp}')
    expect(screen.getByRole('button', { name: 'Desfazer' })).toHaveFocus()
  })

  it('reatribui a parada de Tab quando o item ativo é desabilitado', async () => {
    const user = userEvent.setup()
    function Dynamic() {
      const [locked, setLocked] = useState(false)
      return (
        <>
          <Toolbar aria-label="Ações">
            <IconButton icon="undo" label="Desfazer" disabled={locked} />
            <IconButton icon="redo" label="Refazer" />
          </Toolbar>
          <button type="button" onClick={() => setLocked(true)}>
            Bloquear
          </button>
        </>
      )
    }
    render(<Dynamic />)
    expect(screen.getByRole('button', { name: 'Desfazer' })).toHaveAttribute('tabindex', '0')
    await user.click(screen.getByRole('button', { name: 'Bloquear' }))
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Refazer' })).toHaveAttribute('tabindex', '0'),
    )
  })

  it('não rouba as setas de campos de texto', async () => {
    const user = userEvent.setup()
    render(
      <Toolbar aria-label="Busca">
        <input aria-label="Filtrar" data-roving-item="" defaultValue="abc" />
        <IconButton icon="search" label="Buscar" />
      </Toolbar>,
    )
    const input = screen.getByRole('textbox', { name: 'Filtrar' })
    input.focus()
    await user.keyboard('{ArrowRight}')
    expect(input).toHaveFocus()
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(<Editor />)
    await expectNoA11yViolations(container)
  })
})
