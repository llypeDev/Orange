import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { DropdownItem, DropdownSeparator } from '../Dropdown/Menu'
import { ContextMenu, type ContextMenuProps } from './ContextMenu'

function Example({
  onSelect = () => {},
  ...props
}: Partial<ContextMenuProps> & { onSelect?: (id: string) => void }) {
  return (
    <ContextMenu
      content={
        <>
          <DropdownItem icon="external-link" onSelect={() => onSelect('open')}>
            Abrir
          </DropdownItem>
          <DropdownItem icon="edit" onSelect={() => onSelect('rename')}>
            Renomear
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem icon="trash" tone="danger" onSelect={() => onSelect('delete')}>
            Excluir
          </DropdownItem>
        </>
      }
      {...props}
    >
      <div role="region" aria-label="Arquivo" tabIndex={0} data-testid="area">
        relatorio-trimestral.pdf
      </div>
    </ContextMenu>
  )
}

describe('ContextMenu', () => {
  it('abre com o botão direito no ponto do clique, com papel e nome de menu', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.pointer({ keys: '[MouseRight]', target: screen.getByTestId('area') })
    const menu = screen.getByRole('menu', { name: 'Menu de contexto' })
    expect(screen.getAllByRole('menuitem')).toHaveLength(3)
    expect(menu).toHaveFocus()
  })

  it('impede o menu nativo do navegador', () => {
    render(<Example />)
    const event = fireEvent.contextMenu(screen.getByTestId('area'), { clientX: 40, clientY: 20 })
    expect(event).toBe(false)
  })

  it('Shift+F10 e a tecla Menu abrem focando o primeiro item', async () => {
    const user = userEvent.setup()
    render(<Example />)
    const area = screen.getByTestId('area')
    area.focus()
    await user.keyboard('{Shift>}{F10}{/Shift}')
    expect(screen.getByRole('menuitem', { name: 'Abrir' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(area).toHaveFocus()

    await user.keyboard('{ContextMenu}')
    expect(screen.getByRole('menuitem', { name: 'Abrir' })).toHaveFocus()
  })

  it('navega e ativa como o Dropdown, devolvendo o foco à área', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<Example onSelect={onSelect} />)
    const area = screen.getByTestId('area')
    area.focus()
    await user.keyboard('{Shift>}{F10}{/Shift}')
    await user.keyboard('{ArrowDown}{Enter}')
    expect(onSelect).toHaveBeenCalledWith('rename')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(area).toHaveFocus()

    await user.keyboard('{Shift>}{F10}{/Shift}')
    await user.keyboard('{End}')
    expect(screen.getByRole('menuitem', { name: 'Excluir' })).toHaveFocus()
  })

  it('clique fora fecha; desabilitado não abre', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<Example />)
    await user.pointer({ keys: '[MouseRight]', target: screen.getByTestId('area') })
    await user.click(document.body)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    unmount()

    render(<Example disabled />)
    const event = fireEvent.contextMenu(screen.getByTestId('area'))
    expect(event).toBe(true)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('traduz o nome do menu', async () => {
    const user = userEvent.setup()
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <Example />
      </OrangeProvider>,
    )
    await user.pointer({ keys: '[MouseRight]', target: screen.getByTestId('area') })
    expect(screen.getByRole('menu', { name: 'Context menu' })).toBeInTheDocument()
  })

  it('não possui violações de acessibilidade aberto', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.pointer({ keys: '[MouseRight]', target: screen.getByTestId('area') })
    await expectNoA11yViolations(document.body)
  })
})
