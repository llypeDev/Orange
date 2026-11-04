import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Icon } from '../../icons'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Button } from '../Button'
import { AppHeader, type AppHeaderProps } from './AppHeader'

const items = [
  { label: 'Painel', href: '/painel' },
  { label: 'Projetos', href: '/projetos' },
  { label: 'Relatórios', href: '/relatorios' },
]

function Example(props: Partial<AppHeaderProps>) {
  return (
    <AppHeader
      brand={<a href="/">Orange</a>}
      items={items}
      currentHref="/projetos"
      actions={<Button iconOnly variant="ghost" aria-label="Buscar" startIcon={<Icon name="search" />} />}
      {...props}
    />
  )
}

describe('AppHeader', () => {
  it('renderiza header (banner) com marca, navegação rotulada, item atual e ações', () => {
    render(<Example />)
    const header = screen.getByRole('banner')
    expect(within(header).getByRole('link', { name: 'Orange' })).toBeInTheDocument()
    const nav = within(header).getByRole('navigation', { name: 'Navegação principal' })
    expect(within(nav).getAllByRole('link')).toHaveLength(3)
    expect(within(nav).getByRole('link', { name: 'Projetos' })).toHaveAttribute('aria-current', 'page')
    expect(within(nav).getByRole('link', { name: 'Painel' })).not.toHaveAttribute('aria-current')
    expect(within(header).getByRole('button', { name: 'Buscar' })).toBeInTheDocument()
  })

  it('botão de menu controla o painel com aria-expanded/aria-controls (mouse)', async () => {
    const user = userEvent.setup()
    const onMenuOpenChange = vi.fn()
    render(<Example onMenuOpenChange={onMenuOpenChange} />)
    const menu = screen.getByRole('button', { name: 'Menu' })
    const nav = screen.getByRole('navigation')
    expect(menu).toHaveAttribute('aria-controls', nav.id)
    expect(menu).toHaveAttribute('aria-expanded', 'false')
    await user.click(menu)
    expect(menu).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('banner')).toHaveAttribute('data-menu-open')
    expect(onMenuOpenChange).toHaveBeenLastCalledWith(true)
    await user.click(menu)
    expect(menu).toHaveAttribute('aria-expanded', 'false')
  })

  it('Escape fecha o menu e devolve o foco ao botão (teclado)', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.tab()
    const menu = screen.getByRole('button', { name: 'Menu' })
    expect(menu).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(menu).toHaveAttribute('aria-expanded', 'true')
    await user.tab()
    await user.tab()
    expect(screen.getByRole('link', { name: 'Painel' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(menu).toHaveAttribute('aria-expanded', 'false')
    expect(menu).toHaveFocus()
  })

  it('fecha ao clicar em um link ou fora do cabeçalho', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Example defaultMenuOpen renderLink={({ href, ...p }) => <a {...p} href={href} onClick={(e) => e.preventDefault()} />} />
        <main>
          <p>Conteúdo</p>
        </main>
      </>,
    )
    const menu = screen.getByRole('button', { name: 'Menu' })
    expect(menu).toHaveAttribute('aria-expanded', 'true')
    await user.click(screen.getByRole('link', { name: 'Relatórios' }))
    expect(menu).toHaveAttribute('aria-expanded', 'false')
    await user.click(menu)
    await user.click(screen.getByText('Conteúdo'))
    expect(menu).toHaveAttribute('aria-expanded', 'false')
  })

  it('funciona controlado e aplica sticky e ponto de quebra', () => {
    render(<Example menuOpen sticky collapseBelow="lg" />)
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('or-app-header--sticky')
    expect(header).toHaveAttribute('data-collapse', 'lg')
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('painel do menu continua montado durante a animação de saída (usePresence)', async () => {
    const user = userEvent.setup()
    render(<Example />)
    const header = screen.getByRole('banner')
    const nav = screen.getByRole('navigation')
    const menu = screen.getByRole('button', { name: 'Menu' })
    await user.click(menu)
    expect(header).toHaveAttribute('data-menu-present')
    expect(nav).toHaveAttribute('data-state', 'open')
    // Simula a animação de saída aplicada pelo CSS em telas estreitas.
    const original = window.getComputedStyle
    const spy = vi.spyOn(window, 'getComputedStyle').mockImplementation((el: Element) => {
      const style = original(el)
      if (el !== nav) return style
      return { ...style, animationName: 'or-app-header-panel-out', animationDuration: '0.16s', transitionDuration: '0s' } as CSSStyleDeclaration
    })
    await user.click(menu)
    expect(menu).toHaveAttribute('aria-expanded', 'false')
    expect(nav).toHaveAttribute('data-state', 'closed')
    expect(header).toHaveAttribute('data-menu-present')
    act(() => {
      nav.dispatchEvent(new Event('animationend', { bubbles: true }))
    })
    expect(header).not.toHaveAttribute('data-menu-present')
    spy.mockRestore()
  })

  describe('hideOnScroll', () => {
    const scrollTo = async (y: number) => {
      Object.defineProperty(window, 'scrollY', { value: y, configurable: true, writable: true })
      await act(async () => {
        window.dispatchEvent(new Event('scroll'))
        await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
      })
    }

    it('esconde ao rolar para baixo e mostra ao rolar para cima', async () => {
      Object.defineProperty(window, 'scrollY', { value: 0, configurable: true, writable: true })
      render(<Example hideOnScroll />)
      const header = screen.getByRole('banner')
      expect(header).toHaveClass('or-app-header--sticky', 'or-app-header--hide-on-scroll')
      expect(header).not.toHaveAttribute('data-scroll-hidden')
      await scrollTo(400)
      expect(header).toHaveAttribute('data-scroll-hidden')
      await scrollTo(300)
      expect(header).not.toHaveAttribute('data-scroll-hidden')
    })

    it('nunca esconde com foco dentro do cabeçalho ou com o menu aberto', async () => {
      const user = userEvent.setup()
      Object.defineProperty(window, 'scrollY', { value: 0, configurable: true, writable: true })
      render(<Example hideOnScroll />)
      const header = screen.getByRole('banner')
      await user.tab()
      await scrollTo(500)
      expect(header).not.toHaveAttribute('data-scroll-hidden')
      await user.click(screen.getByRole('button', { name: 'Menu' }))
      act(() => (document.activeElement as HTMLElement).blur())
      await scrollTo(900)
      expect(header).not.toHaveAttribute('data-scroll-hidden')
      await user.click(screen.getByRole('button', { name: 'Menu' }))
      expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false')
      act(() => (document.activeElement as HTMLElement).blur())
      await scrollTo(1300)
      expect(header).toHaveAttribute('data-scroll-hidden')
    })
  })

  it('sem itens não mostra navegação nem botão de menu', () => {
    render(<AppHeader brand={<a href="/">Orange</a>} />)
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('usa renderLink e traduz os rótulos', () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <AppHeader items={items} currentHref="/painel" renderLink={({ href, ...p }) => <a {...p} href={`#${href}`} />} />
      </OrangeProvider>,
    )
    expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Painel' })).toHaveAttribute('href', '#/painel')
    expect(screen.getByRole('link', { name: 'Painel' })).toHaveAttribute('aria-current', 'page')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(<Example menuFooter={<Button block>Entrar</Button>} defaultMenuOpen />)
    await expectNoA11yViolations(container)
  })
})
