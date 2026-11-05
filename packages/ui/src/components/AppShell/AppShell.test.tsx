import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Icon } from '../../icons'
import { expectNoA11yViolations } from '../../test/axe'
import { AppHeader } from '../AppHeader'
import { Footer } from '../Footer'
import { SideNav, SideNavItem } from '../SideNav'
import { AppShell, AppShellNavToggle, useAppShell, type AppShellProps } from './AppShell'

/* -------------------------------------------------------------------------- */
/* matchMedia simulado: `min-width` responde à largura atual e avisa mudanças. */
/* -------------------------------------------------------------------------- */

const originalMatchMedia = window.matchMedia
let restoreViewport: (() => void) | undefined

function mockViewport(initialWidth: number) {
  let width = initialWidth
  const lists: { query: string; listeners: Set<() => void> }[] = []
  const evaluate = (query: string) => {
    const min = /min-width:\s*(\d+)px/.exec(query)
    return min ? width >= Number(min[1]) : false
  }
  window.matchMedia = ((query: string) => {
    const entry = { query, listeners: new Set<() => void>() }
    lists.push(entry)
    return {
      get matches() {
        return evaluate(query)
      },
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: (_type: string, listener: () => void) => entry.listeners.add(listener),
      removeEventListener: (_type: string, listener: () => void) =>
        entry.listeners.delete(listener),
      dispatchEvent: () => false,
    }
  }) as unknown as typeof window.matchMedia
  restoreViewport = () => {
    window.matchMedia = originalMatchMedia
  }
  return {
    resize(next: number) {
      width = next
      act(() => lists.forEach((entry) => entry.listeners.forEach((listener) => listener())))
    },
  }
}

afterEach(() => {
  restoreViewport?.()
  restoreViewport = undefined
})

/* -------------------------------------------------------------------------- */

function OrdersShell({
  sideNavCollapsible = false,
  ...props
}: Partial<AppShellProps> & { sideNavCollapsible?: boolean }) {
  return (
    <AppShell
      header={
        <AppHeader
          brand={
            <>
              <AppShellNavToggle />
              <a href="/">Aurora</a>
            </>
          }
        />
      }
      navLabel="Navegação da loja"
      navigation={
        <SideNav collapsible={sideNavCollapsible} currentHref="/pedidos">
          <SideNavItem href="/" icon={<Icon name="home" />}>
            Início
          </SideNavItem>
          <SideNavItem href="/pedidos" icon={<Icon name="inbox" />}>
            Pedidos
          </SideNavItem>
          <SideNavItem href="/clientes" icon={<Icon name="users" />}>
            Clientes
          </SideNavItem>
        </SideNav>
      }
      aside={<p>3 pedidos aguardando envio</p>}
      asideLabel="Resumo do dia"
      footer={<Footer bottom="© 2026 Aurora Commerce" />}
      {...props}
    >
      <h1>Pedidos</h1>
    </AppShell>
  )
}

describe('AppShell', () => {
  it('renderiza os landmarks com nomes, o main focável e o SkipLink', () => {
    mockViewport(1440)
    const { container } = render(
      <AppShell
        header={<span>Aurora</span>}
        navigation={<a href="/pedidos">Pedidos</a>}
        aside={<p>Resumo</p>}
        asideLabel="Resumo do pedido"
        footer={<span>© 2026 Aurora Commerce</span>}
      >
        <h1>Pedidos</h1>
      </AppShell>,
    )
    expect(screen.getByRole('banner')).toHaveTextContent('Aurora')
    expect(screen.getByRole('navigation', { name: 'Navegação principal' })).toHaveTextContent(
      'Pedidos',
    )
    const main = screen.getByRole('main')
    expect(main).toHaveAttribute('tabindex', '-1')
    expect(main.id).not.toBe('')
    expect(screen.getByRole('complementary', { name: 'Resumo do pedido' })).toHaveTextContent(
      'Resumo',
    )
    expect(screen.getByRole('contentinfo')).toHaveTextContent('© 2026 Aurora Commerce')
    const skip = screen.getByRole('link', { name: 'Pular para o conteúdo principal' })
    expect(skip).toHaveAttribute('href', `#${main.id}`)
    expect(container.firstChild?.firstChild).toBe(skip)
  })

  it('SkipLink leva o foco para o main', async () => {
    mockViewport(1440)
    const user = userEvent.setup()
    render(<OrdersShell />)
    await user.tab()
    const skip = screen.getByRole('link', { name: 'Pular para o conteúdo principal' })
    expect(skip).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('main')).toHaveFocus()
  })

  it('aceita mainId, rótulo do atalho e skipLink={false}', () => {
    const { rerender } = render(
      <AppShell mainId="conteudo" skipLinkLabel="Ir para os pedidos">
        Pedidos
      </AppShell>,
    )
    expect(screen.getByRole('main')).toHaveAttribute('id', 'conteudo')
    expect(screen.getByRole('link', { name: 'Ir para os pedidos' })).toHaveAttribute(
      'href',
      '#conteudo',
    )
    rerender(<AppShell skipLink={false}>Pedidos</AppShell>)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('mainElement="div" não cria um segundo landmark principal', async () => {
    render(
      <main>
        <AppShell mainElement="div" mainId="previa" skipLinkLabel="Ir para a prévia">
          Prévia do painel
        </AppShell>
      </main>,
    )
    expect(screen.getAllByRole('main')).toHaveLength(1)
    const area = screen.getByText('Prévia do painel')
    expect(area.tagName).toBe('DIV')
    expect(area).toHaveAttribute('id', 'previa')
    // O atalho continua apontando para a área principal, que segue focável.
    expect(screen.getByRole('link', { name: 'Ir para a prévia' })).toHaveAttribute('href', '#previa')
    expect(area).toHaveAttribute('tabindex', '-1')
    await expectNoA11yViolations(document.body)
  })

  it('cabeçalho fixo reserva a altura dele na rolagem da página e restaura ao sair', () => {
    mockViewport(1440)
    const height = vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(64)
    try {
      document.documentElement.style.scrollPaddingTop = '8px'
      const { unmount } = render(<AppShell header={<span>Aurora</span>}>Pedidos</AppShell>)
      expect(document.documentElement.style.scrollPaddingTop).toBe('64px')
      unmount()
      expect(document.documentElement.style.scrollPaddingTop).toBe('8px')
      // Sem cabeçalho fixo (ou em modo contido) não mexe na página.
      render(
        <AppShell header={<span>Aurora</span>} stickyHeader={false}>
          Pedidos
        </AppShell>,
      )
      expect(document.documentElement.style.scrollPaddingTop).toBe('8px')
    } finally {
      height.mockRestore()
      document.documentElement.style.scrollPaddingTop = ''
    }
  })

  it('não duplica landmarks de AppHeader, SideNav e Footer', () => {
    mockViewport(1440)
    render(<OrdersShell />)
    expect(screen.getAllByRole('banner')).toHaveLength(1)
    expect(screen.getAllByRole('contentinfo')).toHaveLength(1)
    const navs = screen.getAllByRole('navigation')
    expect(navs).toHaveLength(1)
    expect(navs[0]).toHaveAccessibleName('Navegação da loja')
    expect(navs[0]).toHaveClass('or-side-nav')
  })

  it('a partir do ponto de quebra, recolhe a barra lateral (não controlado)', async () => {
    mockViewport(1440)
    const user = userEvent.setup()
    const onNavCollapsedChange = vi.fn()
    const { container } = render(<OrdersShell onNavCollapsedChange={onNavCollapsedChange} />)
    const root = container.firstChild as HTMLElement
    const toggle = screen.getByRole('button', { name: 'Recolher menu lateral' })
    const sidebar = root.querySelector('.or-app-shell__nav') as HTMLElement
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(toggle).toHaveAttribute('aria-controls', sidebar.id)
    expect(root).not.toHaveAttribute('data-collapsed')

    await user.click(toggle)
    expect(onNavCollapsedChange).toHaveBeenLastCalledWith(true)
    expect(root).toHaveAttribute('data-collapsed')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveAccessibleName('Expandir menu lateral')
    expect(screen.getByRole('navigation')).toHaveClass('or-side-nav--collapsed')

    // Teclado: Enter e Espaço alternam de novo.
    toggle.focus()
    await user.keyboard('{Enter}')
    expect(root).not.toHaveAttribute('data-collapsed')
    await user.keyboard(' ')
    expect(root).toHaveAttribute('data-collapsed')
    expect(onNavCollapsedChange).toHaveBeenCalledTimes(3)
  })

  it('o botão de recolher do SideNav também recolhe o AppShell', async () => {
    mockViewport(1440)
    const user = userEvent.setup()
    const { container } = render(<OrdersShell sideNavCollapsible />)
    const sideNavButton = container.querySelector('.or-side-nav__collapse') as HTMLElement
    await user.click(sideNavButton)
    expect(container.firstChild).toHaveAttribute('data-collapsed')
    expect(
      screen.getByRole('button', { name: 'Expandir menu lateral', expanded: false }),
    ).toHaveClass('or-app-shell__toggle')
  })

  it('navCollapsed controlado segue a prop', async () => {
    mockViewport(1440)
    const user = userEvent.setup()
    const onNavCollapsedChange = vi.fn()
    const { container, rerender } = render(
      <OrdersShell navCollapsed={false} onNavCollapsedChange={onNavCollapsedChange} />,
    )
    await user.click(screen.getByRole('button', { name: 'Recolher menu lateral' }))
    expect(onNavCollapsedChange).toHaveBeenCalledWith(true)
    expect(container.firstChild).not.toHaveAttribute('data-collapsed')
    rerender(<OrdersShell navCollapsed onNavCollapsedChange={onNavCollapsedChange} />)
    expect(container.firstChild).toHaveAttribute('data-collapsed')
    expect(screen.getByRole('button', { name: 'Expandir menu lateral' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('abaixo do ponto de quebra, o botão abre a navegação em um Drawer', async () => {
    mockViewport(390)
    const user = userEvent.setup()
    const { container } = render(<OrdersShell sideNavCollapsible />)
    expect(container.firstChild).toHaveAttribute('data-compact')
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()

    const toggle = screen.getByRole('button', { name: 'Abrir navegação' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveAttribute('aria-haspopup', 'dialog')

    await user.click(toggle)
    const dialog = screen.getByRole('dialog', { name: 'Menu' })
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(toggle).toHaveAttribute('aria-controls', dialog.id)
    const nav = within(dialog).getByRole('navigation', { name: 'Navegação da loja' })
    // No painel a navegação nunca fica recolhida nem mostra o botão de recolher.
    expect(nav).not.toHaveClass('or-side-nav--collapsed')
    expect(
      within(dialog).queryByRole('button', { name: 'Recolher menu lateral' }),
    ).not.toBeInTheDocument()
    expect(within(nav).getByRole('link', { name: 'Pedidos' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('Escape fecha o painel e devolve o foco ao botão', async () => {
    mockViewport(390)
    const user = userEvent.setup()
    const onNavOpenChange = vi.fn()
    render(<OrdersShell onNavOpenChange={onNavOpenChange} />)
    const toggle = screen.getByRole('button', { name: 'Abrir navegação' })
    toggle.focus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('dialog', { name: 'Menu' })).toBeInTheDocument()
    expect(onNavOpenChange).toHaveBeenLastCalledWith(true)

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(onNavOpenChange).toHaveBeenLastCalledWith(false)
    expect(toggle).toHaveFocus()
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('escolher um link fecha o painel', async () => {
    mockViewport(390)
    const user = userEvent.setup()
    render(<OrdersShell />)
    await user.click(screen.getByRole('button', { name: 'Abrir navegação' }))
    const dialog = screen.getByRole('dialog', { name: 'Menu' })
    const link = within(dialog).getByRole('link', { name: 'Clientes' })
    link.addEventListener('click', (event) => event.preventDefault())
    await user.click(link)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('navOpen controlado', async () => {
    mockViewport(390)
    const user = userEvent.setup()
    const onNavOpenChange = vi.fn()
    const { rerender } = render(<OrdersShell navOpen={false} onNavOpenChange={onNavOpenChange} />)
    await user.click(screen.getByRole('button', { name: 'Abrir navegação' }))
    expect(onNavOpenChange).toHaveBeenCalledWith(true)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    rerender(<OrdersShell navOpen onNavOpenChange={onNavOpenChange} />)
    expect(await screen.findByRole('dialog', { name: 'Menu' })).toBeInTheDocument()
  })

  it('navBreakpoint escolhe a largura em que a barra fica fixa', () => {
    mockViewport(900)
    const { container, rerender } = render(<OrdersShell navBreakpoint="md" />)
    expect(container.firstChild).toHaveAttribute('data-breakpoint', 'md')
    expect(container.firstChild).not.toHaveAttribute('data-compact')
    expect(screen.getByRole('navigation', { name: 'Navegação da loja' })).toBeInTheDocument()
    rerender(<OrdersShell navBreakpoint="lg" />)
    expect(container.firstChild).toHaveAttribute('data-compact')
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('ao passar para a tela larga, fecha o painel e mostra a barra lateral', async () => {
    const viewport = mockViewport(390)
    const user = userEvent.setup()
    const onNavOpenChange = vi.fn()
    render(<OrdersShell onNavOpenChange={onNavOpenChange} />)
    await user.click(screen.getByRole('button', { name: 'Abrir navegação' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    viewport.resize(1280)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(onNavOpenChange).toHaveBeenLastCalledWith(false)
    expect(screen.getByRole('navigation', { name: 'Navegação da loja' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Recolher menu lateral' })).toBeInTheDocument()
  })

  it('navigation como função recebe { collapsed, compact }', async () => {
    mockViewport(1440)
    const user = userEvent.setup()
    render(
      <AppShell
        header={<AppShellNavToggle />}
        navigation={({ collapsed, compact }) => (
          <a href="/pedidos">{collapsed ? 'P' : `Pedidos${compact ? ' (painel)' : ''}`}</a>
        )}
      >
        Conteúdo
      </AppShell>,
    )
    expect(screen.getByRole('link', { name: 'Pedidos' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Recolher menu lateral' }))
    expect(screen.getByRole('link', { name: 'P' })).toBeInTheDocument()
  })

  it('useAppShell expõe o estado e as ações da navegação', async () => {
    mockViewport(390)
    const user = userEvent.setup()
    function Status() {
      const { isCompact, navOpen, toggleNav, navCollapsed } = useAppShell()
      return (
        <button type="button" onClick={toggleNav}>
          {`compacto: ${isCompact}, aberto: ${navOpen}, recolhido: ${navCollapsed}`}
        </button>
      )
    }
    render(
      <AppShell navigation={<a href="/pedidos">Pedidos</a>} header={<Status />}>
        Conteúdo
      </AppShell>,
    )
    const button = screen.getByRole('button', {
      name: 'compacto: true, aberto: false, recolhido: false',
    })
    await user.click(button)
    expect(screen.getByRole('dialog', { name: 'Menu' })).toBeInTheDocument()
    expect(
      within(screen.getByRole('dialog')).getByRole('navigation', { name: 'Navegação principal' }),
    ).toBeInTheDocument()
  })

  it('AppShellNavToggle não renderiza sem navegação e exige um AppShell', () => {
    render(<AppShell header={<AppShellNavToggle />}>Conteúdo</AppShell>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<AppShellNavToggle />)).toThrow(/dentro de um <AppShell>/)
    error.mockRestore()
  })

  it('não possui violações de acessibilidade (tela larga)', async () => {
    mockViewport(1440)
    const { container } = render(<OrdersShell />)
    await expectNoA11yViolations(container)
  })

  it('não possui violações de acessibilidade (painel fechado e aberto)', async () => {
    mockViewport(390)
    const user = userEvent.setup()
    const { container } = render(<OrdersShell />)
    await expectNoA11yViolations(container)
    await user.click(screen.getByRole('button', { name: 'Abrir navegação' }))
    await expectNoA11yViolations(document.body)
  })
})
