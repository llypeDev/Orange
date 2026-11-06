import { createRef, useState } from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { BarList, type BarListProps } from './BarList'

const paginas = [
  { label: '/precos', value: 3120 },
  { label: 'Página inicial', value: 12480 },
  { label: '/blog/como-emitir-nota-fiscal', value: 5210 },
  { label: '/contato', value: 1460 },
  { label: '/produtos', value: 8930 },
]

function renderList(props: Partial<BarListProps> = {}) {
  return render(<BarList aria-label="Páginas mais visitadas" data={paginas} {...props} />)
}

const list = () => screen.getByRole('list', { name: 'Páginas mais visitadas' })
const items = () => within(list()).getAllByRole('listitem')
const text = (el: Element) => (el.textContent ?? '').replace(/\s/g, ' ')
const shareOf = (li: HTMLElement) => Number(li.style.getPropertyValue('--_share'))

describe('BarList', () => {
  describe('lista e ordem', () => {
    it('é uma lista de verdade (ul/li) cujo texto traz rótulo e valor', () => {
      renderList()
      expect(list().tagName).toBe('UL')
      expect(items()).toHaveLength(5)
      expect(text(items()[0])).toBe('Página inicial: 12.480')
      // A barra é decorativa: o valor já está no texto.
      expect(items()[0].querySelector('.or-bar-list__bar')).toHaveAttribute('aria-hidden', 'true')
    })

    it('ordena do maior para o menor por padrão', () => {
      renderList()
      expect(items().map((li) => li.querySelector('.or-bar-list__label')!.textContent)).toEqual([
        'Página inicial',
        '/produtos',
        '/blog/como-emitir-nota-fiscal',
        '/precos',
        '/contato',
      ])
    })

    it('sort="asc" inverte e sort="none" mantém a ordem dos dados', () => {
      const { rerender } = renderList({ sort: 'asc' })
      expect(items()[0]).toHaveTextContent('/contato')
      rerender(<BarList aria-label="Páginas mais visitadas" data={paginas} sort="none" />)
      expect(items().map((li) => li.querySelector('.or-bar-list__label')!.textContent)).toEqual(
        paginas.map((p) => p.label),
      )
    })

    it('empates mantêm a ordem de `data`', () => {
      renderList({
        data: [
          { label: 'B', value: 10 },
          { label: 'A', value: 20 },
          { label: 'C', value: 10 },
        ],
      })
      expect(items().map((li) => li.querySelector('.or-bar-list__label')!.textContent)).toEqual([
        'A',
        'B',
        'C',
      ])
    })

    it('barras proporcionais ao maior valor (o maior ocupa a linha toda)', () => {
      renderList({
        data: [
          { label: 'A', value: 200 },
          { label: 'B', value: 50 },
          { label: 'C', value: 0 },
        ],
      })
      expect(items().map(shareOf)).toEqual([1, 0.25, 0])
    })

    it('rótulos podem ser ReactNode', () => {
      renderList({
        data: [
          {
            label: (
              <>
                Tênis de corrida <small>(azul)</small>
              </>
            ),
            value: 412,
          },
        ],
      })
      expect(text(items()[0])).toBe('Tênis de corrida (azul): 412')
    })
  })

  describe('formatação e idioma', () => {
    it('valueFormat com opções do Intl, no idioma do provider', () => {
      const brl = { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 } as const
      const { unmount } = renderList({ valueFormat: brl })
      expect(text(items()[0])).toContain('R$ 12.480')
      unmount()
      render(
        <OrangeProvider locale="en-US" themeTarget="scoped">
          <BarList aria-label="Top pages" data={paginas} valueFormat={brl} limit={2} />
        </OrangeProvider>,
      )
      const top = screen.getByRole('list', { name: 'Top pages' })
      expect(text(within(top).getAllByRole('listitem')[0])).toContain('R$12,480')
      expect(screen.getByRole('button', { name: 'Show all (5)' })).toBeInTheDocument()
    })

    it('valueFormat como função', () => {
      renderList({ valueFormat: (n) => `${n} visitas` })
      expect(text(items()[0])).toContain('12480 visitas')
    })
  })

  describe('links', () => {
    it('linhas com href viram links com rótulo e valor no nome', async () => {
      const user = userEvent.setup()
      renderList({
        data: [
          { label: 'Página inicial', value: 12480, href: '/analytics/inicio' },
          { label: '/contato', value: 1460 },
        ],
      })
      const link = screen.getByRole('link', { name: /^Página inicial\s*:\s*12\.480$/ })
      expect(link).toHaveAttribute('href', '/analytics/inicio')
      expect(link).toHaveClass('or-bar-list__row', 'or-bar-list__row--link')
      // Só a linha com href é link.
      expect(screen.getAllByRole('link')).toHaveLength(1)
      await user.tab()
      expect(link).toHaveFocus()
    })

    it('renderLink integra com o roteador', () => {
      const renderLink = vi.fn(({ href, ...props }) => (
        <a data-router href={`#${href}`} {...props} />
      ))
      renderList({
        data: [{ label: 'Produtos', value: 10, href: '/produtos' }],
        renderLink,
      })
      expect(renderLink).toHaveBeenCalledWith(
        expect.objectContaining({ href: '/produtos', className: expect.any(String) }),
      )
      expect(screen.getByRole('link', { name: /^Produtos\s*:\s*10$/ })).toHaveAttribute(
        'href',
        '#/produtos',
      )
    })
  })

  describe('limite e "Mostrar todos"', () => {
    it('mostra só os primeiros e um botão para ver todos (mouse)', async () => {
      const user = userEvent.setup()
      renderList({ limit: 3 })
      expect(items()).toHaveLength(3)
      const toggle = screen.getByRole('button', { name: 'Mostrar todos (5)' })
      expect(toggle).toHaveAttribute('aria-expanded', 'false')
      expect(toggle).toHaveAttribute('aria-controls', list().id)
      await user.click(toggle)
      expect(items()).toHaveLength(5)
      expect(toggle).toHaveAttribute('aria-expanded', 'true')
      expect(toggle).toHaveAccessibleName('Mostrar menos')
      expect(items()[3]).toHaveClass('or-bar-list__item--extra')
      await user.click(toggle)
      expect(items()).toHaveLength(3)
    })

    it('teclado: Enter e Espaço no botão alternam a lista', async () => {
      const user = userEvent.setup()
      renderList({ limit: 2 })
      await user.tab()
      expect(screen.getByRole('button')).toHaveFocus()
      await user.keyboard('{Enter}')
      expect(items()).toHaveLength(5)
      await user.keyboard(' ')
      expect(items()).toHaveLength(2)
    })

    it('sem botão quando o limite cobre a lista', () => {
      renderList({ limit: 5 })
      expect(items()).toHaveLength(5)
      expect(screen.queryByRole('button')).toBeNull()
    })

    it('defaultExpanded começa aberta (não controlado) e avisa onExpandedChange', async () => {
      const user = userEvent.setup()
      const onExpandedChange = vi.fn()
      renderList({ limit: 2, defaultExpanded: true, onExpandedChange })
      expect(items()).toHaveLength(5)
      await user.click(screen.getByRole('button', { name: 'Mostrar menos' }))
      expect(onExpandedChange).toHaveBeenCalledWith(false)
      expect(items()).toHaveLength(2)
    })

    it('controlado: segue `expanded` e pede a mudança por onExpandedChange', async () => {
      const user = userEvent.setup()
      const onExpandedChange = vi.fn()
      const { rerender } = renderList({ limit: 2, expanded: false, onExpandedChange })
      await user.click(screen.getByRole('button', { name: 'Mostrar todos (5)' }))
      expect(onExpandedChange).toHaveBeenCalledWith(true)
      expect(items()).toHaveLength(2)
      rerender(
        <BarList
          aria-label="Páginas mais visitadas"
          data={paginas}
          limit={2}
          expanded
          onExpandedChange={onExpandedChange}
        />,
      )
      expect(items()).toHaveLength(5)
    })

    it('controlado com estado do pai', async () => {
      const user = userEvent.setup()
      function Painel() {
        const [open, setOpen] = useState(false)
        return (
          <>
            <p>{open ? 'aberta' : 'fechada'}</p>
            <BarList
              aria-label="Páginas mais visitadas"
              data={paginas}
              limit={1}
              expanded={open}
              onExpandedChange={setOpen}
            />
          </>
        )
      }
      render(<Painel />)
      await user.click(screen.getByRole('button', { name: 'Mostrar todos (5)' }))
      expect(screen.getByText('aberta')).toBeInTheDocument()
      expect(items()).toHaveLength(5)
    })
  })

  describe('API', () => {
    it('repassa ref e atributos à raiz; aria-label/aria-labelledby vão para a lista', () => {
      const ref = createRef<HTMLDivElement>()
      render(
        <>
          <h3 id="titulo">Produtos mais vendidos</h3>
          <BarList
            ref={ref}
            id="ranking"
            data-testid="raiz"
            className="extra"
            aria-labelledby="titulo"
            data={paginas}
          />
        </>,
      )
      const root = screen.getByTestId('raiz')
      expect(ref.current).toBe(root)
      expect(root).toHaveAttribute('id', 'ranking')
      expect(root).toHaveClass('or-bar-list', 'or-bar-list--md', 'extra')
      expect(root).not.toHaveAttribute('aria-labelledby')
      expect(screen.getByRole('list', { name: 'Produtos mais vendidos' })).toBeInTheDocument()
    })

    it('size e color', () => {
      renderList({ size: 'lg', color: 'var(--or-color-accent)', style: { maxWidth: 320 } })
      const root = list().parentElement!
      expect(root).toHaveClass('or-bar-list--lg')
      expect(root.style.getPropertyValue('--_color')).toBe('var(--or-color-accent)')
      expect(root.style.maxWidth).toBe('320px')
    })

    it('cor padrão: o primeiro token categórico', () => {
      renderList()
      expect(list().parentElement!.style.getPropertyValue('--_color')).toBe('var(--or-color-viz-1)')
    })

    it('sem dados mostra um aviso', () => {
      renderList({ data: [], limit: 3 })
      expect(screen.queryByRole('list')).toBeNull()
      expect(screen.queryByRole('button')).toBeNull()
      expect(screen.getByText('Sem dados para exibir')).toBeInTheDocument()
    })
  })

  describe('movimento', () => {
    const original = window.matchMedia
    afterEach(() => {
      window.matchMedia = original
    })

    it('aguarda a entrada na tela para crescer as barras, escalonadas', () => {
      renderList()
      expect(list().parentElement).toHaveAttribute('data-motion', 'pending')
      expect(items().map((li) => li.style.getPropertyValue('--_i'))).toEqual([
        '0',
        '1',
        '2',
        '3',
        '4',
      ])
    })

    it('com movimento reduzido tudo fica desenhado', () => {
      window.matchMedia = ((q: string) => ({
        ...original(q),
        matches: q.includes('reduce'),
      })) as typeof window.matchMedia
      renderList()
      expect(list().parentElement).toHaveAttribute('data-motion', 'static')
    })
  })

  it('não possui violações de acessibilidade', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <div>
        <h3 id="ranking-paginas">Páginas mais visitadas</h3>
        <BarList
          aria-labelledby="ranking-paginas"
          limit={3}
          data={paginas.map((p) => ({ ...p, href: `/analytics${p.label}` }))}
        />
        <BarList aria-label="Produtos mais vendidos" size="sm" data={paginas} />
        <BarList aria-label="Sem dados" data={[]} />
      </div>,
    )
    await user.click(screen.getByRole('button', { name: 'Mostrar todos (5)' }))
    await user.tab()
    await expectNoA11yViolations(container)
  })
})
