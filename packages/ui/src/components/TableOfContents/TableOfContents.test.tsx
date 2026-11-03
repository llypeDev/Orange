import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { TableOfContents } from './TableOfContents'

type IOCallback = (entries: Partial<IntersectionObserverEntry>[]) => void

let observers: { callback: IOCallback; targets: Element[]; options?: IntersectionObserverInit }[] = []
const OriginalIO = window.IntersectionObserver

class MockIntersectionObserver {
  record: (typeof observers)[number]
  constructor(callback: IOCallback, options?: IntersectionObserverInit) {
    this.record = { callback, targets: [], options }
    observers.push(this.record)
  }
  observe(el: Element) {
    this.record.targets.push(el)
  }
  unobserve() {}
  disconnect() {
    observers = observers.filter((o) => o !== this.record)
  }
  takeRecords() {
    return []
  }
}

function intersect(id: string, isIntersecting: boolean) {
  const target = document.getElementById(id)!
  act(() => {
    observers.forEach((o) => {
      if (o.targets.includes(target)) o.callback([{ target, isIntersecting }])
    })
  })
}

const items = [
  { id: 'instalacao', label: 'Instalação', level: 2 },
  { id: 'npm', label: 'Com npm', level: 3 },
  { id: 'uso', label: 'Uso', level: 2 },
]

function Article() {
  return (
    <article>
      <h2 id="instalacao">Instalação</h2>
      <h3 id="npm">Com npm</h3>
      <h2 id="uso">Uso</h2>
    </article>
  )
}

describe('TableOfContents', () => {
  beforeEach(() => {
    observers = []
    ;(window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = MockIntersectionObserver
  })
  afterEach(() => {
    ;(window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = OriginalIO
  })

  it('renderiza nav rotulada pelo título com links de âncora e níveis', () => {
    render(
      <>
        <TableOfContents items={items} />
        <Article />
      </>,
    )
    const nav = screen.getByRole('navigation', { name: 'Nesta página' })
    const links = within(nav).getAllByRole('link')
    expect(links.map((l) => l.getAttribute('href'))).toEqual(['#instalacao', '#npm', '#uso'])
    const depths = within(nav)
      .getAllByRole('listitem')
      .map((li) => li.getAttribute('data-depth'))
    expect(depths).toEqual(['0', '1', '0'])
  })

  it('destaca com aria-current="location" a primeira seção visível', () => {
    render(
      <>
        <TableOfContents items={items} />
        <Article />
      </>,
    )
    intersect('npm', true)
    expect(screen.getByRole('link', { name: 'Com npm' })).toHaveAttribute('aria-current', 'location')
    intersect('instalacao', true)
    expect(screen.getByRole('link', { name: 'Instalação' })).toHaveAttribute('aria-current', 'location')
    expect(screen.getByRole('link', { name: 'Com npm' })).not.toHaveAttribute('aria-current')
    intersect('instalacao', false)
    intersect('npm', false)
    // Nenhuma visível: mantém a última destacada.
    expect(screen.getByRole('link', { name: 'Com npm' })).toHaveAttribute('aria-current', 'location')
    intersect('uso', true)
    expect(screen.getByRole('link', { name: 'Uso' })).toHaveAttribute('aria-current', 'location')
  })

  it('passa rootMargin ao IntersectionObserver', () => {
    render(
      <>
        <TableOfContents items={items} rootMargin="-64px 0px -50% 0px" />
        <Article />
      </>,
    )
    expect(observers[0].options?.rootMargin).toBe('-64px 0px -50% 0px')
  })

  it('clique (mouse ou teclado) marca o item e chama onItemClick', async () => {
    const user = userEvent.setup()
    const onItemClick = vi.fn((_id: string, e: React.MouseEvent) => e.preventDefault())
    render(
      <>
        <TableOfContents items={items} onItemClick={onItemClick} />
        <Article />
      </>,
    )
    await user.click(screen.getByRole('link', { name: 'Uso' }))
    expect(onItemClick).toHaveBeenCalledWith('uso', expect.anything())
    await user.tab()
    await user.tab({ shift: true })
    await user.tab({ shift: true })
    expect(screen.getByRole('link', { name: 'Com npm' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(onItemClick).toHaveBeenLastCalledWith('npm', expect.anything())
  })

  it('coleta títulos automaticamente de um contêiner e gera ids ausentes', async () => {
    function Page() {
      const ref = useRef<HTMLDivElement>(null)
      return (
        <>
          <TableOfContents container={ref} title="Neste guia" />
          <div ref={ref}>
            <h2>Visão geral</h2>
            <h3 id="requisitos">Requisitos</h3>
            <h2>Configuração avançada</h2>
            <h2>Configuração avançada</h2>
          </div>
        </>
      )
    }
    render(<Page />)
    const nav = await screen.findByRole('navigation', { name: 'Neste guia' })
    await waitFor(() => expect(within(nav).getAllByRole('link')).toHaveLength(4))
    const hrefs = within(nav)
      .getAllByRole('link')
      .map((l) => l.getAttribute('href'))
    expect(hrefs).toEqual(['#visao-geral', '#requisitos', '#configuracao-avancada', '#configuracao-avancada-2'])
    expect(screen.getByRole('heading', { name: 'Visão geral' })).toHaveAttribute('id', 'visao-geral')
  })

  it('sem título visível usa aria-label traduzido', () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <TableOfContents items={items} title={null} />
      </OrangeProvider>,
    )
    expect(screen.getByRole('navigation', { name: 'On this page' })).toBeInTheDocument()
  })

  it('não renderiza nada sem itens', () => {
    const { container } = render(<TableOfContents items={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <TableOfContents items={items} />
        <Article />
      </div>,
    )
    intersect('uso', true)
    await expectNoA11yViolations(container)
  })
})
