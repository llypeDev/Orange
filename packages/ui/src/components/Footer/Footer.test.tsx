import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Footer, type FooterColumn } from './Footer'

const columns: FooterColumn[] = [
  {
    title: 'Produto',
    links: [
      { label: 'Pedidos', href: '/pedidos' },
      { label: 'Catálogo', href: '/catalogo' },
    ],
  },
  {
    title: 'Ajuda',
    links: [
      { label: 'Central de ajuda', href: '/ajuda' },
      { label: 'Status do serviço', href: 'https://status.exemplo.com', external: true },
    ],
  },
]

describe('Footer', () => {
  it('renderiza um <footer> com o mapa do site em um <nav> nomeado', () => {
    render(<Footer columns={columns} />)
    const footer = screen.getByRole('contentinfo')
    expect(footer.tagName).toBe('FOOTER')
    expect(footer).toHaveClass('or-footer')
    expect(within(footer).getByRole('navigation', { name: 'Mapa do site' })).toBeInTheDocument()
  })

  it('aceita navLabel e headingLevel', () => {
    render(<Footer columns={columns} navLabel="Links da loja" headingLevel={3} />)
    expect(screen.getByRole('navigation', { name: 'Links da loja' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Produto',
      'Ajuda',
    ])
  })

  it('cada coluna é uma lista nomeada pelo seu heading', () => {
    render(<Footer columns={columns} />)
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'Produto',
      'Ajuda',
    ])
    const product = screen.getByRole('list', { name: 'Produto' })
    expect(within(product).getAllByRole('listitem')).toHaveLength(2)
    expect(within(product).getByRole('link', { name: 'Pedidos' })).toHaveAttribute(
      'href',
      '/pedidos',
    )
  })

  it('links internos são <a> simples com seta decorativa', () => {
    render(<Footer columns={columns} />)
    const link = screen.getByRole('link', { name: 'Catálogo' })
    expect(link).toHaveClass('or-footer__link')
    expect(link).not.toHaveAttribute('target')
    expect(link.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('links externos abrem em nova aba, avisam o leitor de tela e mantêm o ↗ com a última palavra', () => {
    render(<Footer columns={columns} />)
    const link = screen.getByRole('link', { name: 'Status do serviço (abre em nova aba)' })
    expect(link).toHaveAttribute('href', 'https://status.exemplo.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(link).toHaveClass('or-footer__link--external')
    const nowrap = link.querySelector('.or-footer__nowrap') as HTMLElement
    expect(nowrap).toHaveTextContent(/^serviço$/)
    expect(nowrap.querySelector('svg.or-footer__external-icon')).toBeInTheDocument()
  })

  it('renderLink é usado só nos links internos', () => {
    const renderLink = vi.fn(({ href, ...props }) => (
      <a data-router="" href={`#${href}`} {...props} />
    ))
    render(<Footer columns={columns} renderLink={renderLink} />)
    expect(renderLink).toHaveBeenCalledTimes(3)
    expect(screen.getByRole('link', { name: 'Pedidos' })).toHaveAttribute('href', '#/pedidos')
    expect(screen.getByRole('link', { name: /Status do serviço/ })).not.toHaveAttribute(
      'data-router',
    )
  })

  it('renderiza marca, descrição e barra inferior', () => {
    render(
      <Footer
        brand={<a href="/">Aurora Commerce</a>}
        description="Gestão de pedidos para lojas independentes."
        columns={columns}
        bottom={<span>© 2026 Aurora Commerce</span>}
      />,
    )
    expect(
      screen.getByRole('link', { name: 'Aurora Commerce' }).closest('.or-footer__logo'),
    ).toBeInTheDocument()
    expect(screen.getByText('Gestão de pedidos para lojas independentes.')).toHaveClass(
      'or-footer__description',
    )
    expect(screen.getByText('© 2026 Aurora Commerce').parentElement).toHaveClass(
      'or-footer__bottom',
    )
  })

  it('sem colunas, não renderiza o <nav>', () => {
    render(<Footer bottom="© 2026 Aurora Commerce" />)
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toHaveTextContent('© 2026 Aurora Commerce')
  })

  it('links são alcançáveis pelo teclado, na ordem das colunas', async () => {
    const user = userEvent.setup()
    render(<Footer columns={columns} />)
    await user.tab()
    expect(screen.getByRole('link', { name: 'Pedidos' })).toHaveFocus()
    await user.tab()
    await user.tab()
    expect(screen.getByRole('link', { name: 'Central de ajuda' })).toHaveFocus()
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <Footer
        brand={<a href="/">Aurora Commerce</a>}
        description="Gestão de pedidos para lojas independentes."
        columns={columns}
        bottom={
          <>
            <span>© 2026 Aurora Commerce</span>
            <a href="/termos">Termos de uso</a>
          </>
        }
      />,
    )
    await expectNoA11yViolations(container)
  })
})
