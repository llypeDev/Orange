import { act, render, screen, waitFor } from '@testing-library/react'
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

  describe('rolagem do menu (mais ações do que cabem)', () => {
    const many: SplitButtonAction[] = [
      { label: 'Salvar como rascunho', onSelect: () => {} },
      { label: 'Agendar publicação', onSelect: () => {} },
      { label: 'Enviar para revisão', onSelect: () => {} },
      { label: 'Duplicar', onSelect: () => {} },
      { label: 'Publicar em todos os canais', onSelect: () => {} },
    ]
    // Geometria simulada: o menu (borda de 1px) mostra 120px; itens de 36px depois de 4px
    // de respiro — o último (148–184) termina 64px abaixo da área visível.
    const VIEW = 120
    function mockMenuLayout() {
      const isMenu = (el: Element) => el.getAttribute('role') === 'menu'
      vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(function (
        this: HTMLElement,
      ) {
        return isMenu(this) ? VIEW : 0
      })
      vi.spyOn(HTMLElement.prototype, 'clientTop', 'get').mockImplementation(function (
        this: HTMLElement,
      ) {
        return isMenu(this) ? 1 : 0
      })
      vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
        this: HTMLElement,
      ) {
        const rect = (top: number, height: number) =>
          ({ top, bottom: top + height, left: 0, right: 200, width: 200, height }) as DOMRect
        const menu = this.closest<HTMLElement>('[role="menu"]')
        if (!menu) return rect(0, 0)
        if (this === menu) return rect(100, VIEW + 2)
        const index = Array.from(menu.querySelectorAll('[role="menuitem"]')).indexOf(this)
        return index < 0 ? rect(0, 0) : rect(101 + 4 + index * 36 - menu.scrollTop, 36)
      })
    }

    it('limita a altura ao espaço disponível na tela', async () => {
      const user = userEvent.setup()
      render(<SplitButton actions={many}>Publicar</SplitButton>)
      await user.click(screen.getByRole('button', { name: 'Mais ações' }))
      const menu = screen.getByRole('menu')
      await waitFor(() =>
        expect(menu.style.getPropertyValue('--or-floating-available-height')).toMatch(/^\d+px$/),
      )
    })

    it('End, PageDown, Home, a volta das setas e a busca por letra rolam até o item focado', async () => {
      const user = userEvent.setup()
      render(<SplitButton actions={many}>Publicar</SplitButton>)
      const trigger = screen.getByRole('button', { name: 'Mais ações' })
      trigger.focus()
      await user.keyboard('{ArrowDown}')
      const menu = screen.getByRole('menu')
      const items = screen.getAllByRole('menuitem')
      await waitFor(() => expect(items[0]).toHaveFocus())
      mockMenuLayout()
      await user.keyboard('{End}')
      expect(items[4]).toHaveFocus()
      expect(menu.scrollTop).toBe(64)
      await user.keyboard('{Home}')
      expect(menu.scrollTop).toBe(0)
      await user.keyboard('{ArrowUp}')
      expect(items[4]).toHaveFocus()
      expect(menu.scrollTop).toBe(64)
      await user.keyboard('{ArrowDown}')
      expect(items[0]).toHaveFocus()
      expect(menu.scrollTop).toBe(0)
      await user.keyboard('{PageDown}')
      expect(menu.scrollTop).toBe(64)
      await user.keyboard('{PageUp}')
      expect(menu.scrollTop).toBe(0)
      // "Duplicar" (112–148) passa 28px da área visível.
      await user.keyboard('d')
      expect(items[3]).toHaveFocus()
      expect(menu.scrollTop).toBe(28)
    })

    it('o mouse só foca: não rola o menu sob o cursor', async () => {
      const user = userEvent.setup()
      render(<SplitButton actions={many}>Publicar</SplitButton>)
      await user.click(screen.getByRole('button', { name: 'Mais ações' }))
      const menu = screen.getByRole('menu')
      const items = screen.getAllByRole('menuitem')
      await waitFor(() => expect(items[0]).toHaveFocus())
      mockMenuLayout()
      await user.pointer({ target: items[3] })
      expect(items[3]).toHaveFocus()
      expect(menu.scrollTop).toBe(0)
    })

    it('↑ na seta abre no último item e o revela quando o menu ganha a altura final', async () => {
      // A altura final só existe depois do posicionamento: o item focado é revelado
      // quando o menu muda de tamanho.
      const observers: { targets: Element[]; callback: (entries: unknown[]) => void }[] = []
      vi.stubGlobal(
        'ResizeObserver',
        class {
          targets: Element[] = []
          constructor(callback: (entries: unknown[]) => void) {
            observers.push({ targets: this.targets, callback })
          }
          observe(target: Element) {
            this.targets.push(target)
          }
          unobserve() {}
          disconnect() {}
        },
      )
      try {
        const user = userEvent.setup()
        render(<SplitButton actions={many}>Publicar</SplitButton>)
        screen.getByRole('button', { name: 'Mais ações' }).focus()
        await user.keyboard('{ArrowUp}')
        const menu = screen.getByRole('menu')
        await waitFor(() => expect(screen.getAllByRole('menuitem')[4]).toHaveFocus())
        expect(menu.scrollTop).toBe(0)
        // O posicionamento limita a altura: o menu passa a rolar.
        mockMenuLayout()
        act(() => observers.filter((o) => o.targets.includes(menu)).forEach((o) => o.callback([])))
        expect(menu.scrollTop).toBe(64)
      } finally {
        vi.unstubAllGlobals()
      }
    })
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

  it('o menu leva o tema da área em escopo de onde foi aberto', async () => {
    const user = userEvent.setup()
    render(
      <OrangeProvider theme="light" themeTarget="scoped">
        <SplitButton actions={[{ label: 'Duplicar', onSelect: () => {} }]}>Salvar</SplitButton>
      </OrangeProvider>,
    )
    await user.click(screen.getByRole('button', { name: 'Mais ações' }))
    const menu = await screen.findByRole('menu')
    // O portal vai para o <body>, fora da área com data-theme: o tema vem no próprio menu.
    expect(menu.closest('.or-theme-scope')).toBeNull()
    expect(menu).toHaveAttribute('data-theme', 'light')
  })

  it('anima a saída: o menu fica montado e inerte até animationend', async () => {
    const original = window.getComputedStyle
    const spy = vi.spyOn(window, 'getComputedStyle').mockImplementation((el, pseudo) => {
      if (el instanceof HTMLElement && el.classList.contains('or-split-button__menu')) {
        return {
          ...original(el, pseudo),
          animationName: 'or-split-button-menu-out',
          animationDuration: '0.16s',
          transitionDuration: '0s',
        } as CSSStyleDeclaration
      }
      return original(el, pseudo)
    })
    const { user, trigger } = setup()
    await user.click(trigger)
    const menu = screen.getByRole('menu')
    await waitFor(() => expect(menu).toHaveAttribute('data-state', 'open'))
    await user.keyboard('{Escape}')
    // Fechando: continua no DOM, marcado como closed e inerte; o foco já voltou.
    expect(menu).toBeInTheDocument()
    expect(menu).toHaveAttribute('data-state', 'closed')
    expect(menu).toHaveAttribute('inert')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveFocus()
    act(() => {
      menu.dispatchEvent(new Event('animationend', { bubbles: true }))
    })
    expect(menu).not.toBeInTheDocument()
    spy.mockRestore()
  })

  it('reabrir durante a saída volta ao estado aberto', async () => {
    const original = window.getComputedStyle
    const spy = vi.spyOn(window, 'getComputedStyle').mockImplementation((el, pseudo) => {
      if (el instanceof HTMLElement && el.classList.contains('or-split-button__menu')) {
        return {
          ...original(el, pseudo),
          animationName: 'or-split-button-menu-out',
          animationDuration: '0.16s',
          transitionDuration: '0s',
        } as CSSStyleDeclaration
      }
      return original(el, pseudo)
    })
    const { user, trigger } = setup()
    await user.click(trigger)
    await user.click(trigger)
    const menu = screen.getByRole('menu', { hidden: true })
    expect(menu).toHaveAttribute('data-state', 'closed')
    await user.click(trigger)
    expect(screen.getByRole('menu')).toHaveAttribute('data-state', 'open')
    expect(screen.getByRole('menu')).not.toHaveAttribute('inert')
    spy.mockRestore()
  })

  it('não possui violações de acessibilidade (fechado e aberto)', async () => {
    const { user, trigger } = setup()
    await expectNoA11yViolations(document.body)
    await user.click(trigger)
    await expectNoA11yViolations(document.body)
  })
})
