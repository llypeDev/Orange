import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { SplitButton, type SplitButtonAction } from './SplitButton'

function setup(overrides: Partial<Record<'draft' | 'schedule' | 'template', () => void>> = {}) {
  const onClick = vi.fn()
  const actions: SplitButtonAction[] = [
    { label: 'Salvar como rascunho', icon: 'file', onSelect: overrides.draft ?? vi.fn() },
    { label: 'Agendar publicação', icon: 'calendar', onSelect: overrides.schedule ?? vi.fn() },
    {
      label: 'Salvar como modelo',
      icon: 'copy',
      onSelect: overrides.template ?? vi.fn(),
      disabled: true,
    },
  ]
  const user = userEvent.setup()
  render(
    <>
      <SplitButton actions={actions} onClick={onClick}>
        Publicar
      </SplitButton>
      <button type="button">Fora</button>
    </>,
  )
  const main = screen.getByRole('button', { name: 'Publicar' })
  const trigger = screen.getByRole('button', { name: 'Mais ações' })
  return { user, onClick, actions, main, trigger }
}

describe('SplitButton', () => {
  it('renderiza a ação principal e a seta de menu', () => {
    const { main, trigger } = setup()
    expect(main).toHaveClass('or-button--primary', 'or-split-button__main')
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('o botão principal dispara onClick sem abrir o menu', async () => {
    const { user, main, onClick } = setup()
    await user.click(main)
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('a seta abre o menu e foca o primeiro item', async () => {
    const { user, trigger } = setup()
    await user.click(trigger)
    const menu = screen.getByRole('menu', { name: 'Mais ações' })
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(trigger).toHaveAttribute('aria-controls', menu.id)
    const items = screen.getAllByRole('menuitem')
    expect(items).toHaveLength(3)
    await waitFor(() => expect(items[0]).toHaveFocus())
    expect(items[2]).toHaveAttribute('aria-disabled', 'true')
  })

  it('navega com ↑/↓/Home/End (com volta) e seleciona com Enter', async () => {
    const draft = vi.fn()
    const schedule = vi.fn()
    const { user, trigger } = setup({ draft, schedule })
    trigger.focus()
    await user.keyboard('{ArrowDown}')
    const items = screen.getAllByRole('menuitem')
    await waitFor(() => expect(items[0]).toHaveFocus())
    await user.keyboard('{ArrowDown}')
    expect(items[1]).toHaveFocus()
    await user.keyboard('{End}')
    expect(items[2]).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(items[0]).toHaveFocus()
    await user.keyboard('{ArrowUp}')
    expect(items[2]).toHaveFocus()
    await user.keyboard('{Home}')
    expect(items[0]).toHaveFocus()
    await user.keyboard('{ArrowDown}{Enter}')
    expect(schedule).toHaveBeenCalledTimes(1)
    expect(draft).not.toHaveBeenCalled()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('ArrowUp na seta abre o menu no último item; Espaço seleciona', async () => {
    const draft = vi.fn()
    const { user, trigger } = setup({ draft })
    trigger.focus()
    await user.keyboard('{ArrowUp}')
    const items = screen.getAllByRole('menuitem')
    await waitFor(() => expect(items[2]).toHaveFocus())
    await user.keyboard('{Home}')
    await user.keyboard(' ')
    expect(draft).toHaveBeenCalledTimes(1)
  })

  it('itens desabilitados recebem foco mas não são acionados', async () => {
    const template = vi.fn()
    const { user, trigger } = setup({ template })
    await user.click(trigger)
    await user.keyboard('{End}{Enter}')
    expect(template).not.toHaveBeenCalled()
    expect(screen.getByRole('menu')).toBeInTheDocument()
    await user.click(screen.getByRole('menuitem', { name: 'Salvar como modelo' }))
    expect(template).not.toHaveBeenCalled()
  })

  it('Escape fecha e devolve o foco para a seta', async () => {
    const { user, trigger } = setup()
    await user.click(trigger)
    await waitFor(() => expect(screen.getAllByRole('menuitem')[0]).toHaveFocus())
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('clique fora fecha o menu', async () => {
    const { user, trigger } = setup()
    await user.click(trigger)
    expect(screen.getByRole('menu')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Fora' }))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('clicar na seta com o menu aberto fecha o menu', async () => {
    const { user, trigger } = setup()
    await user.click(trigger)
    await user.click(trigger)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('Tab fecha o menu e segue a ordem a partir da seta', async () => {
    const { user, trigger } = setup()
    await user.click(trigger)
    await waitFor(() => expect(screen.getAllByRole('menuitem')[0]).toHaveFocus())
    await user.tab()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Fora' })).toHaveFocus()
  })

  it('busca por letra inicial move o foco', async () => {
    const { user, trigger } = setup()
    await user.click(trigger)
    await waitFor(() => expect(screen.getAllByRole('menuitem')[0]).toHaveFocus())
    await user.keyboard('a')
    expect(screen.getByRole('menuitem', { name: 'Agendar publicação' })).toHaveFocus()
    await user.keyboard('s')
    expect(screen.getByRole('menuitem', { name: 'Salvar como modelo' })).toHaveFocus()
  })

  it('suporta estado controlado, variante outline e rótulo traduzido', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <SplitButton
          variant="outline"
          size="sm"
          open={false}
          onOpenChange={onOpenChange}
          actions={[{ label: 'Duplicate', onSelect: () => {} }]}
        >
          Save
        </SplitButton>
      </OrangeProvider>,
    )
    const trigger = screen.getByRole('button', { name: 'More actions' })
    expect(trigger).toHaveClass('or-button--outline', 'or-button--sm')
    await user.click(trigger)
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('disabled desabilita as duas partes', () => {
    render(
      <SplitButton disabled actions={[{ label: 'Duplicar', onSelect: () => {} }]}>
        Salvar
      </SplitButton>,
    )
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Mais ações' })).toBeDisabled()
  })

  it('não possui violações de acessibilidade (fechado e aberto)', async () => {
    const { user, trigger } = setup()
    await expectNoA11yViolations(document.body)
    await user.click(trigger)
    await expectNoA11yViolations(document.body)
  })
})
