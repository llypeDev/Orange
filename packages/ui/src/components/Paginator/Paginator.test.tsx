import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Paginator } from './Paginator'

/** Lê a sequência visível: números, "…" e marca a atual com []. */
function sequence() {
  const list = screen.getByRole('navigation').querySelector('.or-paginator__list')!
  return Array.from(list.querySelectorAll('.or-paginator__button--page, .or-paginator__ellipsis')).map((el) =>
    {
      const text = el.querySelector('[aria-hidden="true"]')?.textContent ?? el.textContent
      return el.getAttribute('aria-current') ? `[${text}]` : text
    },
  )
}

describe('Paginator', () => {
  it('renderiza nav rotulada, anterior/próximo e páginas com rótulos', () => {
    render(<Paginator totalPages={5} defaultPage={2} />)
    const nav = screen.getByRole('navigation', { name: 'Paginação' })
    expect(within(nav).getByRole('button', { name: 'Página anterior' })).toBeEnabled()
    expect(within(nav).getByRole('button', { name: 'Próxima página' })).toBeEnabled()
    const current = within(nav).getByRole('button', { name: 'Página 2' })
    expect(current).toHaveAttribute('aria-current', 'page')
    expect(within(nav).getByRole('button', { name: 'Página 1' })).not.toHaveAttribute('aria-current')
  })

  it('calcula reticências com siblingCount e boundaryCount', () => {
    const { rerender } = render(<Paginator totalPages={12} page={1} />)
    expect(sequence()).toEqual(['[1]', '2', '3', '4', '5', '…', '12'])
    rerender(<Paginator totalPages={12} page={6} />)
    expect(sequence()).toEqual(['1', '…', '5', '[6]', '7', '…', '12'])
    rerender(<Paginator totalPages={12} page={12} />)
    expect(sequence()).toEqual(['1', '…', '8', '9', '10', '11', '[12]'])
    rerender(<Paginator totalPages={20} page={10} siblingCount={2} boundaryCount={2} />)
    expect(sequence()).toEqual(['1', '2', '…', '8', '9', '[10]', '11', '12', '…', '19', '20'])
    rerender(<Paginator totalPages={3} page={2} />)
    expect(sequence()).toEqual(['1', '[2]', '3'])
  })

  it('reticências são decorativas', () => {
    render(<Paginator totalPages={30} defaultPage={15} />)
    screen
      .getByRole('navigation')
      .querySelectorAll('.or-paginator__ellipsis')
      .forEach((el) => expect(el).toHaveAttribute('aria-hidden', 'true'))
  })

  it('navega com mouse e chama onPageChange; desabilita nas extremidades', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Paginator totalPages={3} onPageChange={onPageChange} showFirstLast />)
    expect(screen.getByRole('button', { name: 'Página anterior' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Primeira página' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Próxima página' }))
    expect(onPageChange).toHaveBeenLastCalledWith(2)
    await user.click(screen.getByRole('button', { name: 'Última página' }))
    expect(onPageChange).toHaveBeenLastCalledWith(3)
    expect(screen.getByRole('button', { name: 'Próxima página' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Página 1' }))
    expect(onPageChange).toHaveBeenLastCalledWith(1)
  })

  it('pelo teclado: Enter ativa e o foco vai para a página atual quando "Próxima" é desabilitado', async () => {
    const user = userEvent.setup()
    render(<Paginator totalPages={2} />)
    await user.tab() // anterior está desabilitado → foco na página 1
    expect(screen.getByRole('button', { name: 'Página 1' })).toHaveFocus()
    await user.tab()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Próxima página' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('button', { name: 'Página 2' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Página 2' })).toHaveFocus()
  })

  it('variante compacta mostra "Página X de Y"', async () => {
    const user = userEvent.setup()
    render(<Paginator variant="compact" totalPages={12} defaultPage={3} />)
    expect(screen.getByText('Página 3 de 12')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Página 4' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Próxima página' }))
    expect(screen.getByText('Página 4 de 12')).toBeInTheDocument()
  })

  it('mostra o intervalo de itens e troca itens por página mantendo o primeiro item visível', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [page, setPage] = useState(3)
      const [pageSize, setPageSize] = useState(20)
      return (
        <Paginator
          totalItems={240}
          page={page}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[10, 20, 50]}
        />
      )
    }
    render(<Controlled />)
    expect(screen.getByText('41–60 de 240')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Página 12' })).toBeInTheDocument()
    await user.selectOptions(screen.getByRole('combobox', { name: 'Itens por página' }), '50')
    expect(screen.getByText('1–50 de 240')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Página 1' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Página 5' })).toBeInTheDocument()
    await user.selectOptions(screen.getByRole('combobox', { name: 'Itens por página' }), '10')
    expect(screen.getByText('1–10 de 240')).toBeInTheDocument()
  })

  it('o último intervalo não passa do total', () => {
    render(<Paginator totalItems={95} defaultPageSize={20} defaultPage={5} />)
    expect(screen.getByText('81–95 de 95')).toBeInTheDocument()
  })

  it('com getPageHref as páginas viram links e renderLink integra com roteadores', async () => {
    const user = userEvent.setup()
    const navigate = vi.fn()
    render(
      <Paginator
        totalPages={4}
        defaultPage={1}
        getPageHref={(p) => `/produtos?pagina=${p}`}
        renderLink={({ href, onClick, ...props }) => (
          <a
            {...props}
            href={href}
            onClick={(e) => {
              e.preventDefault()
              onClick?.(e)
              navigate(href)
            }}
          />
        )}
      />,
    )
    const prev = screen.getByRole('link', { name: 'Página anterior' })
    expect(prev).toHaveAttribute('aria-disabled', 'true')
    expect(prev).not.toHaveAttribute('href')
    expect(screen.getByRole('link', { name: 'Página 2' })).toHaveAttribute('href', '/produtos?pagina=2')
    await user.click(screen.getByRole('link', { name: 'Próxima página' }))
    expect(navigate).toHaveBeenCalledWith('/produtos?pagina=2')
    expect(screen.getByRole('link', { name: 'Página 2' })).toHaveAttribute('aria-current', 'page')
  })

  it('traduz textos internos', () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <Paginator totalItems={240} pageSizeOptions={[20, 50]} variant="compact" />
      </OrangeProvider>,
    )
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument()
    expect(screen.getByText('Page 1 of 12')).toBeInTheDocument()
    expect(screen.getByText('1–20 of 240')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Items per page' })).toBeInTheDocument()
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <Paginator totalPages={20} defaultPage={8} showFirstLast />
        <Paginator
          aria-label="Paginação de pedidos"
          variant="compact"
          totalItems={240}
          pageSizeOptions={[20, 50, 100]}
        />
        <Paginator aria-label="Paginação de produtos" totalPages={5} getPageHref={(p) => `?p=${p}`} />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
