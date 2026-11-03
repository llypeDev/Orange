import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Icon } from '../../icons'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { BottomNavigation, type BottomNavigationItem } from './BottomNavigation'

const items: BottomNavigationItem[] = [
  { value: 'inicio', label: 'Início', icon: <Icon name="home" />, href: '/inicio' },
  { value: 'buscar', label: 'Buscar', icon: <Icon name="search" />, href: '/buscar' },
  { value: 'pedidos', label: 'Pedidos', icon: <Icon name="inbox" />, href: '/pedidos', badge: 3, badgeLabel: '3 em andamento' },
  { value: 'conta', label: 'Conta', icon: <Icon name="user" />, href: '/conta', badge: true },
]

describe('BottomNavigation', () => {
  it('renderiza nav rotulada com links e o destino atual', () => {
    render(<BottomNavigation items={items} defaultValue="inicio" />)
    const nav = screen.getByRole('navigation', { name: 'Navegação principal' })
    const links = within(nav).getAllByRole('link')
    expect(links).toHaveLength(4)
    expect(screen.getByRole('link', { name: 'Início' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Buscar' })).not.toHaveAttribute('aria-current')
  })

  it('ícones e badges visuais são decorativos; o badge é anunciado por texto', () => {
    render(<BottomNavigation items={items} defaultValue="inicio" />)
    const pedidos = screen.getByRole('link', { name: 'Pedidos (3 em andamento)' })
    expect(pedidos.querySelector('.or-bottom-nav__icon')).toHaveAttribute('aria-hidden', 'true')
    expect(pedidos.querySelector('.or-bottom-nav__badge')).toHaveTextContent('3')
    expect(screen.getByRole('link', { name: 'Conta' }).querySelector('.or-bottom-nav__badge--dot')).toBeInTheDocument()
  })

  it('troca o destino com mouse e teclado (não controlado)', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const noNav = items.map(({ href: _href, ...item }) => item)
    render(<BottomNavigation items={noNav} defaultValue="inicio" onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Buscar' }))
    expect(onChange).toHaveBeenCalledWith('buscar')
    expect(screen.getByRole('button', { name: 'Buscar' })).toHaveAttribute('aria-current', 'page')
    await user.tab()
    expect(screen.getByRole('button', { name: /Pedidos/ })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('button', { name: /Pedidos/ })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Buscar' })).not.toHaveAttribute('aria-current')
  })

  it('funciona controlado', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [value, setValue] = useState('conta')
      return <BottomNavigation items={items.map(({ href: _h, ...i }) => i)} value={value} onChange={setValue} />
    }
    render(<Controlled />)
    expect(screen.getByRole('button', { name: 'Conta' })).toHaveAttribute('aria-current', 'page')
    await user.click(screen.getByRole('button', { name: 'Início' }))
    expect(screen.getByRole('button', { name: 'Início' })).toHaveAttribute('aria-current', 'page')
  })

  it('usa renderLink para integrar com roteadores', async () => {
    const user = userEvent.setup()
    const navigate = vi.fn()
    render(
      <BottomNavigation
        items={items}
        defaultValue="inicio"
        renderLink={({ href, onClick, ...props }) => (
          <a
            {...props}
            href={href}
            onClick={(e) => {
              e.preventDefault()
              navigate(href)
              onClick?.(e)
            }}
          />
        )}
      />,
    )
    await user.click(screen.getByRole('link', { name: /Pedidos/ }))
    expect(navigate).toHaveBeenCalledWith('/pedidos')
    expect(screen.getByRole('link', { name: /Pedidos/ })).toHaveAttribute('aria-current', 'page')
  })

  it('aplica fixed e traduz o rótulo padrão', () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <BottomNavigation items={items} fixed />
      </OrangeProvider>,
    )
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toHaveClass('or-bottom-nav--fixed')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <BottomNavigation items={items} defaultValue="pedidos" />
        <BottomNavigation
          aria-label="Atalhos do app"
          items={items.slice(0, 3).map(({ href: _h, ...i }) => i)}
          defaultValue="buscar"
        />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
