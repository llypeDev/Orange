import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Icon } from '../../icons'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb'

const items = [
  { label: 'Início', href: '/' },
  { label: 'Loja', href: '/loja' },
  { label: 'Eletrônicos', href: '/loja/eletronicos' },
  { label: 'Notebooks', href: '/loja/eletronicos/notebooks' },
  { label: 'Ultrafinos', href: '/loja/eletronicos/notebooks/ultrafinos' },
  { label: 'Orange Book Air 14"' },
]

describe('Breadcrumb', () => {
  it('renderiza nav rotulada com lista ordenada e página atual', () => {
    render(<Breadcrumb items={items.slice(0, 3)} />)
    const nav = screen.getByRole('navigation', { name: 'Trilha de navegação' })
    const list = within(nav).getByRole('list')
    expect(list.tagName).toBe('OL')
    expect(within(list).getAllByRole('listitem')).toHaveLength(3)
    expect(screen.getByRole('link', { name: 'Início' })).toHaveAttribute('href', '/')
    const current = screen.getByText('Eletrônicos').closest('[aria-current]')
    expect(current).toHaveAttribute('aria-current', 'page')
  })

  it('marca o último item como página atual mesmo quando ele tem href', () => {
    render(<Breadcrumb items={items.slice(0, 3)} />)
    const last = screen.getByRole('link', { name: 'Eletrônicos' })
    expect(last).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Loja' })).not.toHaveAttribute('aria-current')
  })

  it('separadores são decorativos', () => {
    const { container } = render(<Breadcrumb items={items.slice(0, 3)} separator={<Icon name="chevron-right" />} />)
    const separators = container.querySelectorAll('.or-breadcrumb__separator')
    expect(separators).toHaveLength(3)
    separators.forEach((s) => expect(s).toHaveAttribute('aria-hidden', 'true'))
  })

  it('aceita BreadcrumbItem como children', () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem href="/">Início</BreadcrumbItem>
        <BreadcrumbItem href="/ajuda">Central de ajuda</BreadcrumbItem>
        <BreadcrumbItem>Trocas e devoluções</BreadcrumbItem>
      </Breadcrumb>,
    )
    expect(screen.getByRole('link', { name: 'Central de ajuda' })).toBeInTheDocument()
    expect(screen.getByText('Trocas e devoluções').closest('[aria-current]')).toHaveAttribute('aria-current', 'page')
  })

  it('recolhe os níveis do meio e expande com o botão "…" (mouse)', async () => {
    const user = userEvent.setup()
    render(<Breadcrumb items={items} maxItems={4} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
    expect(screen.queryByRole('link', { name: 'Loja' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Mostrar caminho completo' }))
    expect(screen.getAllByRole('listitem')).toHaveLength(6)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Loja' })).toHaveFocus()
  })

  it('expande pelo teclado e respeita itemsBeforeCollapse/itemsAfterCollapse', async () => {
    const user = userEvent.setup()
    render(<Breadcrumb items={items} maxItems={4} itemsBeforeCollapse={2} itemsAfterCollapse={1} />)
    const links = screen.getAllByRole('link').map((l) => l.textContent)
    expect(links).toEqual(['Início', 'Loja'])
    await user.tab()
    await user.tab()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Mostrar caminho completo' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('link', { name: 'Eletrônicos' })).toHaveFocus()
  })

  it('usa renderLink para integrar com roteadores', async () => {
    const user = userEvent.setup()
    const navigate = vi.fn()
    render(
      <Breadcrumb
        items={items.slice(0, 3)}
        renderLink={({ href, onClick, ...props }) => (
          <a
            {...props}
            href={href}
            data-router="true"
            onClick={(e) => {
              e.preventDefault()
              onClick?.(e)
              navigate(href)
            }}
          />
        )}
      />,
    )
    const loja = screen.getByRole('link', { name: 'Loja' })
    expect(loja).toHaveAttribute('data-router', 'true')
    expect(loja).toHaveClass('or-breadcrumb__link')
    await user.click(loja)
    expect(navigate).toHaveBeenCalledWith('/loja')
  })

  it('traduz o rótulo da navegação e do botão de expandir', () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <Breadcrumb items={items} maxItems={3} />
      </OrangeProvider>,
    )
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Show full path' })).toBeInTheDocument()
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <Breadcrumb items={items.slice(0, 4)} />
        <Breadcrumb items={items} maxItems={3} aria-label="Trilha da loja" />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
