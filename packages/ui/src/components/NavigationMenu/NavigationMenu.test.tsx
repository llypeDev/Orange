import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { NavigationMenu, type NavigationMenuItem, type NavigationMenuProps } from './NavigationMenu'

const items: NavigationMenuItem[] = [
  {
    id: 'produtos',
    label: 'Produtos',
    description: 'Uma plataforma para vender, cobrar e acompanhar resultados.',
    items: [
      {
        label: 'Loja online',
        href: '/produtos/loja',
        description: 'Catálogo, carrinho e checkout.',
        icon: 'tag',
      },
      { label: 'Pagamentos', href: '/produtos/pagamentos', description: 'Pix, cartão e boleto.' },
      { label: 'Analytics', href: '/produtos/analytics' },
    ],
  },
  {
    id: 'solucoes',
    label: 'Soluções',
    items: [
      {
        label: 'Por setor',
        items: [
          { label: 'Varejo', href: '/solucoes/varejo' },
          { label: 'Educação', href: '/solucoes/educacao' },
        ],
      },
      {
        label: 'Por porte',
        items: [
          { label: 'Pequenas empresas', href: '/solucoes/pequenas' },
          { label: 'Grandes empresas', href: '/solucoes/grandes' },
        ],
      },
    ],
  },
  { label: 'Preços', href: '/precos' },
]

function Example(props: Partial<NavigationMenuProps>) {
  return (
    <>
      <NavigationMenu items={items} {...props} />
      <main>
        <p>Conteúdo da página</p>
        <a href="#rodape">Rodapé</a>
      </main>
    </>
  )
}

const button = (name: string) => screen.getByRole('button', { name })
const panelOf = (trigger: HTMLElement) =>
  document.getElementById(trigger.getAttribute('aria-controls')!)!

describe('NavigationMenu', () => {
  it('renderiza nav rotulada com lista, links e botões de painel (aria-expanded/aria-controls)', () => {
    render(<Example currentHref="/precos" />)
    const nav = screen.getByRole('navigation', { name: 'Navegação principal' })
    const list = within(nav).getAllByRole('list')[0]
    expect(within(list).getAllByRole('listitem', { hidden: true }).length).toBeGreaterThanOrEqual(3)
    const produtos = button('Produtos')
    expect(produtos.tagName).toBe('BUTTON')
    expect(produtos).toHaveAttribute('type', 'button')
    expect(produtos).toHaveAttribute('aria-expanded', 'false')
    const panel = panelOf(produtos)
    expect(panel).toHaveAttribute('hidden')
    expect(panel).toHaveTextContent('Loja online')
    // Painel fechado fica fora da árvore de acessibilidade.
    expect(screen.queryByRole('link', { name: 'Loja online' })).toBeNull()
    expect(screen.getByRole('link', { name: 'Preços' })).toHaveAttribute('aria-current', 'page')
    // Não é o padrão menu/menubar.
    expect(screen.queryByRole('menu')).toBeNull()
    expect(screen.queryByRole('menubar')).toBeNull()
  })

  it('abre e fecha com o mouse; só um painel aberto por vez', async () => {
    const user = userEvent.setup()
    const onOpenItemChange = vi.fn()
    render(<Example onOpenItemChange={onOpenItemChange} />)
    await user.click(button('Produtos'))
    expect(button('Produtos')).toHaveAttribute('aria-expanded', 'true')
    expect(panelOf(button('Produtos'))).not.toHaveAttribute('hidden')
    expect(screen.getByRole('link', { name: 'Loja online' })).toBeVisible()
    expect(onOpenItemChange).toHaveBeenLastCalledWith('produtos')

    await user.click(button('Soluções'))
    expect(button('Soluções')).toHaveAttribute('aria-expanded', 'true')
    expect(button('Produtos')).toHaveAttribute('aria-expanded', 'false')
    expect(onOpenItemChange).toHaveBeenLastCalledWith('solucoes')

    await user.click(button('Soluções'))
    expect(button('Soluções')).toHaveAttribute('aria-expanded', 'false')
    expect(onOpenItemChange).toHaveBeenLastCalledWith(null)
  })

  it('Enter e Espaço alternam o painel; Tab entra nos links do painel aberto (teclado)', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.tab()
    expect(button('Produtos')).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(button('Produtos')).toHaveAttribute('aria-expanded', 'true')
    // O foco fica no botão (padrão disclosure).
    expect(button('Produtos')).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('link', { name: 'Loja online' })).toHaveFocus()
    await user.tab({ shift: true })
    await user.keyboard(' ')
    expect(button('Produtos')).toHaveAttribute('aria-expanded', 'false')
    await user.tab()
    expect(button('Soluções')).toHaveFocus()
  })

  it('Esc fecha o painel e devolve o foco ao botão', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.click(button('Produtos'))
    await user.tab()
    await user.tab()
    expect(screen.getByRole('link', { name: 'Pagamentos' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(button('Produtos')).toHaveAttribute('aria-expanded', 'false')
    expect(button('Produtos')).toHaveFocus()
  })

  it('fecha com clique fora, com o foco saindo da navegação ou indo para outro item', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.click(button('Produtos'))
    await user.click(screen.getByText('Conteúdo da página'))
    expect(button('Produtos')).toHaveAttribute('aria-expanded', 'false')

    // Foco sai da navegação (Tab depois do último link do último item).
    await user.click(button('Soluções'))
    await user.keyboard('{End}')
    expect(screen.getByRole('link', { name: 'Preços' })).toHaveFocus()
    expect(button('Soluções')).toHaveAttribute('aria-expanded', 'false')

    await user.click(button('Soluções'))
    for (let i = 0; i < 5; i++) await user.tab()
    expect(screen.getByRole('link', { name: 'Preços' })).toHaveFocus()
    expect(button('Soluções')).toHaveAttribute('aria-expanded', 'false')

    await user.click(button('Produtos'))
    act(() => screen.getByRole('link', { name: 'Rodapé' }).focus())
    expect(button('Produtos')).toHaveAttribute('aria-expanded', 'false')
  })

  it('clique dentro do painel não fecha; escolher um link fecha e devolve o foco ao botão', async () => {
    const user = userEvent.setup()
    render(
      <Example
        renderLink={({ href, ...props }) => (
          <a {...props} href={href} onClick={(event) => event.preventDefault()} />
        )}
      />,
    )
    await user.click(button('Produtos'))
    await user.click(
      screen.getByText('Uma plataforma para vender, cobrar e acompanhar resultados.'),
    )
    expect(button('Produtos')).toHaveAttribute('aria-expanded', 'true')
    await user.click(screen.getByRole('link', { name: 'Pagamentos' }))
    expect(button('Produtos')).toHaveAttribute('aria-expanded', 'false')
    expect(button('Produtos')).toHaveFocus()
  })

  it('setas ←/→ entre itens do topo, ↓ entra no painel aberto, ↑/↓ e Home/End nos links', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.tab()
    await user.keyboard('{ArrowRight}')
    expect(button('Soluções')).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('link', { name: 'Preços' })).toHaveFocus()
    // Sem dar a volta.
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('link', { name: 'Preços' })).toHaveFocus()
    await user.keyboard('{Home}')
    expect(button('Produtos')).toHaveFocus()
    await user.keyboard('{End}')
    expect(screen.getByRole('link', { name: 'Preços' })).toHaveFocus()
    await user.keyboard('{ArrowLeft}{ArrowLeft}')
    expect(button('Produtos')).toHaveFocus()
    // ↓ com o painel fechado vai para o próximo item (APG).
    await user.keyboard('{ArrowDown}')
    expect(button('Soluções')).toHaveFocus()
    await user.keyboard('{ArrowUp}')
    expect(button('Produtos')).toHaveFocus()

    await user.keyboard('{Enter}{ArrowDown}')
    expect(screen.getByRole('link', { name: 'Loja online' })).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('link', { name: 'Pagamentos' })).toHaveFocus()
    await user.keyboard('{End}')
    expect(screen.getByRole('link', { name: 'Analytics' })).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('link', { name: 'Analytics' })).toHaveFocus()
    await user.keyboard('{ArrowUp}')
    expect(screen.getByRole('link', { name: 'Pagamentos' })).toHaveFocus()
    await user.keyboard('{Home}')
    expect(screen.getByRole('link', { name: 'Loja online' })).toHaveFocus()
    expect(button('Produtos')).toHaveAttribute('aria-expanded', 'true')
  })

  it('↓ percorre os links de todos os grupos do painel', async () => {
    const user = userEvent.setup()
    render(<Example defaultOpenItem="solucoes" />)
    act(() => button('Soluções').focus())
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}')
    expect(screen.getByRole('link', { name: 'Pequenas empresas' })).toHaveFocus()
  })

  it('funciona controlado (openItem) e não controlado (defaultOpenItem)', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [open, setOpen] = useState<string | null>('solucoes')
      return (
        <>
          <Example openItem={open} onOpenItemChange={setOpen} />
          <output>{open ?? 'nenhum'}</output>
        </>
      )
    }
    const { unmount } = render(<Controlled />)
    expect(button('Soluções')).toHaveAttribute('aria-expanded', 'true')
    await user.click(button('Produtos'))
    expect(screen.getByText('produtos')).toBeInTheDocument()
    expect(button('Produtos')).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard('{Escape}')
    expect(screen.getByText('nenhum')).toBeInTheDocument()
    unmount()

    // Controlado sem onOpenItemChange: o painel não muda sozinho.
    const { unmount: unmount2 } = render(<Example openItem="produtos" />)
    await user.click(button('Produtos'))
    expect(button('Produtos')).toHaveAttribute('aria-expanded', 'true')
    unmount2()

    render(<Example defaultOpenItem="produtos" />)
    expect(button('Produtos')).toHaveAttribute('aria-expanded', 'true')
  })

  it('usa a posição como id quando o item não tem id', async () => {
    const user = userEvent.setup()
    const onOpenItemChange = vi.fn()
    render(
      <NavigationMenu
        items={[{ label: 'Recursos', items: [{ label: 'Blog', href: '/blog' }] }]}
        onOpenItemChange={onOpenItemChange}
      />,
    )
    await user.click(button('Recursos'))
    expect(onOpenItemChange).toHaveBeenLastCalledWith('0')
  })

  it('descrição vira descrição acessível; grupos rotulam as listas; seção atual no botão', () => {
    render(<Example defaultOpenItem="solucoes" currentHref="/solucoes/varejo" />)
    expect(button('Soluções')).toHaveAttribute('data-active')
    expect(button('Produtos')).not.toHaveAttribute('data-active')
    expect(screen.getByRole('list', { name: 'Por setor' })).toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Por porte' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Varejo' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Educação' })).not.toHaveAttribute('aria-current')
  })

  it('link do painel: nome é o rótulo e a descrição vem por aria-describedby', () => {
    render(<Example defaultOpenItem="produtos" />)
    const link = screen.getByRole('link', { name: 'Loja online' })
    expect(link).toHaveAccessibleDescription('Catálogo, carrinho e checkout.')
    expect(screen.getByRole('link', { name: 'Analytics' })).not.toHaveAttribute('aria-describedby')
  })

  it('usa renderLink, repassa a ref e traduz o rótulo', () => {
    const ref = createRef<HTMLElement>()
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <NavigationMenu
          ref={ref}
          items={items}
          currentHref="/produtos/loja"
          defaultOpenItem="produtos"
          renderLink={({ href, ...props }) => <a {...props} href={`#${href}`} data-router="" />}
          data-testid="menu"
        />
      </OrangeProvider>,
    )
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBe(ref.current)
    expect(ref.current).toHaveAttribute('data-testid', 'menu')
    const link = screen.getByRole('link', { name: 'Loja online' })
    expect(link).toHaveAttribute('href', '#/produtos/loja')
    expect(link).toHaveAttribute('data-router')
    expect(link).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Preços' })).toHaveAttribute('href', '#/precos')
  })

  it('aceita aria-label próprio', () => {
    render(<NavigationMenu items={items} aria-label="Navegação do site" />)
    expect(screen.getByRole('navigation', { name: 'Navegação do site' })).toBeInTheDocument()
  })

  it('painel continua montado durante a animação de saída (usePresence) e fica inerte', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.click(button('Produtos'))
    const panel = panelOf(button('Produtos'))
    expect(panel).toHaveAttribute('data-state', 'open')
    const original = window.getComputedStyle
    const spy = vi.spyOn(window, 'getComputedStyle').mockImplementation((el: Element) => {
      const style = original(el)
      if (el !== panel) return style
      return {
        ...style,
        animationName: 'or-floating-out',
        animationDuration: '0.16s',
        transitionDuration: '0s',
      } as CSSStyleDeclaration
    })
    await user.click(button('Produtos'))
    expect(button('Produtos')).toHaveAttribute('aria-expanded', 'false')
    expect(panel).toHaveAttribute('data-state', 'closed')
    expect(panel).not.toHaveAttribute('hidden')
    expect(panel).toHaveAttribute('inert')
    act(() => {
      panel.dispatchEvent(new Event('animationend', { bubbles: true }))
    })
    expect(panel).toHaveAttribute('hidden')
    spy.mockRestore()
  })

  it('não possui violações de acessibilidade (fechado e com painel aberto)', async () => {
    const { container, unmount } = render(<Example currentHref="/precos" />)
    await expectNoA11yViolations(container)
    unmount()
    const open = render(<Example defaultOpenItem="solucoes" currentHref="/solucoes/varejo" />)
    await expectNoA11yViolations(open.container)
  })
})
