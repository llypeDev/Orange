import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Icon } from '../../icons'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { SideNav, SideNavGroup, SideNavItem, SideNavSection, type SideNavProps } from './SideNav'

function Example(props: Partial<SideNavProps>) {
  return (
    <SideNav aria-label="Navegação do painel" currentHref="/projetos/checkout" {...props}>
      <SideNavItem href="/" icon={<Icon name="home" />}>
        Início
      </SideNavItem>
      <SideNavItem href="/caixa" icon={<Icon name="inbox" />} badge={12}>
        Caixa de entrada
      </SideNavItem>
      <SideNavGroup label="Projetos" icon={<Icon name="folder" />}>
        <SideNavItem href="/projetos/checkout">Checkout</SideNavItem>
        <SideNavItem href="/projetos/app">App mobile</SideNavItem>
      </SideNavGroup>
      <SideNavGroup label="Relatórios" icon={<Icon name="chart-bar" />}>
        <SideNavItem href="/relatorios/vendas">Vendas</SideNavItem>
      </SideNavGroup>
      <SideNavSection title="Conta">
        <SideNavItem href="/config" icon={<Icon name="sliders" />}>
          Configurações
        </SideNavItem>
        <SideNavItem icon={<Icon name="log-out" />} onClick={() => {}}>
          Sair
        </SideNavItem>
      </SideNavSection>
    </SideNav>
  )
}

describe('SideNav', () => {
  it('renderiza nav rotulada com links, botão de ação e item atual', () => {
    render(<Example />)
    const nav = screen.getByRole('navigation', { name: 'Navegação do painel' })
    expect(within(nav).getByRole('link', { name: 'Início' })).toHaveAttribute('href', '/')
    expect(within(nav).getByRole('link', { name: 'Caixa de entrada 12' })).toBeInTheDocument()
    expect(within(nav).getByRole('link', { name: 'Checkout' })).toHaveAttribute('aria-current', 'page')
    expect(within(nav).getByRole('link', { name: 'Início' })).not.toHaveAttribute('aria-current')
    expect(within(nav).getByRole('button', { name: 'Sair' })).toBeInTheDocument()
    expect(within(nav).getByRole('list', { name: 'Conta' })).toBeInTheDocument()
  })

  it('grupo com o item atual começa aberto; os demais fechados', () => {
    render(<Example />)
    const projetos = screen.getByRole('button', { name: 'Projetos' })
    expect(projetos).toHaveAttribute('aria-expanded', 'true')
    const controlled = document.getElementById(projetos.getAttribute('aria-controls')!)
    expect(controlled).toContainElement(screen.getByRole('link', { name: 'Checkout' }))
    const relatorios = screen.getByRole('button', { name: 'Relatórios' })
    expect(relatorios).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('link', { name: 'Vendas' })).not.toBeInTheDocument()
  })

  it('abre e fecha grupos com mouse e teclado', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <SideNav>
        <SideNavGroup label="Equipe" onOpenChange={onOpenChange}>
          <SideNavItem href="/pessoas">Pessoas</SideNavItem>
        </SideNavGroup>
      </SideNav>,
    )
    const toggle = screen.getByRole('button', { name: 'Equipe' })
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('link', { name: 'Pessoas' })).toBeVisible()
    expect(onOpenChange).toHaveBeenLastCalledWith(true)
    await user.keyboard('{Enter}')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await user.keyboard(' ')
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
  })

  it('modo recolhido mantém os rótulos acessíveis e mostra iniciais sem ícone', () => {
    render(
      <SideNav collapsed>
        <SideNavItem href="/" icon={<Icon name="home" />}>
          Início
        </SideNavItem>
        <SideNavItem href="/faturas">Faturas</SideNavItem>
      </SideNav>,
    )
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('or-side-nav--collapsed')
    expect(screen.getByRole('link', { name: 'Início' })).toBeInTheDocument()
    const faturas = screen.getByRole('link', { name: 'Faturas' })
    expect(faturas.querySelector('.or-side-nav__initial')).toHaveTextContent('F')
  })

  it('no modo recolhido, grupos abrem em painel que fecha com Escape devolvendo o foco', async () => {
    const user = userEvent.setup()
    render(<Example collapsed />)
    const relatorios = screen.getByRole('button', { name: 'Relatórios' })
    expect(relatorios).toHaveAttribute('aria-expanded', 'false')
    await user.click(relatorios)
    expect(relatorios).toHaveAttribute('aria-expanded', 'true')
    await user.tab()
    expect(screen.getByRole('link', { name: 'Vendas' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(relatorios).toHaveAttribute('aria-expanded', 'false')
    expect(relatorios).toHaveFocus()
  })

  it('painel recolhido fecha ao clicar fora', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Example collapsed />
        <button type="button">Fora</button>
      </>,
    )
    await user.click(screen.getByRole('button', { name: 'Relatórios' }))
    expect(screen.getByRole('link', { name: 'Vendas' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Fora' }))
    expect(screen.getByRole('button', { name: 'Relatórios' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('botão de recolher alterna o modo e traduz o rótulo', async () => {
    const user = userEvent.setup()
    const onCollapsedChange = vi.fn()
    render(<Example collapsible onCollapsedChange={onCollapsedChange} />)
    await user.click(screen.getByRole('button', { name: 'Recolher menu lateral' }))
    expect(onCollapsedChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole('navigation')).toHaveClass('or-side-nav--collapsed')
    expect(screen.getByRole('button', { name: 'Expandir menu lateral' })).toBeInTheDocument()
  })

  it('usa renderLink e rótulo padrão traduzido', () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <SideNav
          currentHref="/a"
          renderLink={({ href, ...props }) => <a {...props} href={`#${href}`} data-router="" />}
        >
          <SideNavItem href="/a">Alpha</SideNavItem>
        </SideNav>
      </OrangeProvider>,
    )
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
    const link = screen.getByRole('link', { name: 'Alpha' })
    expect(link).toHaveAttribute('href', '#/a')
    expect(link).toHaveAttribute('data-router')
    expect(link).toHaveAttribute('aria-current', 'page')
  })

  it('item desabilitado não é focável', async () => {
    const user = userEvent.setup()
    render(
      <SideNav>
        <SideNavItem href="/a" disabled>
          Integrações
        </SideNavItem>
        <SideNavItem href="/b">Ajuda</SideNavItem>
      </SideNav>,
    )
    expect(screen.getByRole('link', { name: 'Integrações' })).toHaveAttribute('aria-disabled', 'true')
    await user.tab()
    expect(screen.getByRole('link', { name: 'Ajuda' })).toHaveFocus()
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <Example collapsible header={<strong>Orange</strong>} />
        <Example aria-label="Navegação recolhida" collapsed />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
