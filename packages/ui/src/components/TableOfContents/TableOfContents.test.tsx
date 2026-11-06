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

/** Simula layout: `top` de cada título no conteúdo, altura visível e altura total. */
function layout(
  el: HTMLElement,
  {
    offsets,
    height,
    scrollHeight,
  }: { offsets: Record<string, number>; height: number; scrollHeight: number },
) {
  let scrollTop = 0
  Object.defineProperty(el, 'clientHeight', { configurable: true, get: () => height })
  Object.defineProperty(el, 'scrollHeight', { configurable: true, get: () => scrollHeight })
  Object.defineProperty(el, 'scrollTop', {
    configurable: true,
    get: () => scrollTop,
    set: (v: number) => (scrollTop = v),
  })
  el.getBoundingClientRect = () => new DOMRect(0, 0, 400, height)
  for (const [id, offset] of Object.entries(offsets)) {
    document.getElementById(id)!.getBoundingClientRect = () =>
      new DOMRect(0, offset - scrollTop, 400, 20)
  }
  return (top: number) => {
    scrollTop = top
    act(() => {
      el.dispatchEvent(new Event('scroll'))
    })
  }
}

const current = () => screen.queryByRole('link', { current: 'location' })?.textContent ?? null

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

  function Panel({ rootMargin = '0px 0px -70% 0px' }: { rootMargin?: string }) {
    const ref = useRef<HTMLDivElement>(null)
    return (
      <>
        <TableOfContents items={items} root={ref} rootMargin={rootMargin} />
        <div ref={ref} data-testid="painel">
          <Article />
        </div>
      </>
    )
  }

  // Painel de 300px, faixa no topo (0–90px); títulos em 0, 200 e 900; rola até 700.
  const panelLayout = {
    offsets: { instalacao: 0, npm: 200, uso: 900 },
    height: 300,
    scrollHeight: 1000,
  }

  it('destaca com aria-current="location" o primeiro título dentro da faixa', async () => {
    render(<Panel />)
    const scrollTo = layout(screen.getByTestId('painel'), panelLayout)
    scrollTo(0)
    await waitFor(() => expect(current()).toBe('Instalação'))
    scrollTo(150)
    await waitFor(() => expect(current()).toBe('Com npm'))
    expect(screen.getByRole('link', { name: 'Instalação' })).not.toHaveAttribute('aria-current')
  })

  it('entre dois títulos (nenhum na faixa), destaca o último que já passou — também ao subir', async () => {
    render(<Panel />)
    const scrollTo = layout(screen.getByTestId('painel'), panelLayout)
    scrollTo(500)
    await waitFor(() => expect(current()).toBe('Com npm'))
    scrollTo(100)
    await waitFor(() => expect(current()).toBe('Instalação'))
  })

  it('no fim da rolagem destaca o último título à vista, mesmo fora da faixa', async () => {
    render(<Panel />)
    const scrollTo = layout(screen.getByTestId('painel'), panelLayout)
    scrollTo(650)
    await waitFor(() => expect(current()).toBe('Com npm'))
    scrollTo(700) // fim: "Uso" está a 200px do topo, abaixo da faixa
    await waitFor(() => expect(current()).toBe('Uso'))
  })

  it('usa a janela como raiz por padrão e aplica a faixa do rootMargin (px e %)', async () => {
    render(
      <>
        <TableOfContents items={items} />
        <Article />
      </>,
    )
    // Viewport de 900px; faixa padrão '-80px 0px -65% 0px' = 80–315px.
    const page = document.documentElement
    let scrollY = 0
    Object.defineProperty(page, 'clientHeight', { configurable: true, get: () => 900 })
    Object.defineProperty(page, 'scrollHeight', { configurable: true, get: () => 3000 })
    Object.defineProperty(window, 'scrollY', { configurable: true, get: () => scrollY })
    const offsets: Record<string, number> = { instalacao: 100, npm: 1200, uso: 2800 }
    for (const [id, offset] of Object.entries(offsets)) {
      document.getElementById(id)!.getBoundingClientRect = () =>
        new DOMRect(0, offset - scrollY, 400, 20)
    }
    const scrollTo = (y: number) => {
      scrollY = y
      act(() => {
        window.dispatchEvent(new Event('scroll'))
      })
    }
    try {
      scrollTo(0)
      await waitFor(() => expect(current()).toBe('Instalação'))
      scrollTo(1000) // "Com npm" a 200px: dentro da faixa
      await waitFor(() => expect(current()).toBe('Com npm'))
      scrollTo(1950) // "Uso" a 850px: fora da faixa, "Com npm" já passou
      await waitFor(() => expect(current()).toBe('Com npm'))
      scrollTo(2100) // fim da página
      await waitFor(() => expect(current()).toBe('Uso'))
    } finally {
      delete (page as unknown as Record<string, unknown>).clientHeight
      delete (page as unknown as Record<string, unknown>).scrollHeight
      delete (window as unknown as Record<string, unknown>).scrollY
    }
  })

  it('o item clicado continua marcado durante o salto e até a próxima interação', async () => {
    const user = userEvent.setup()
    render(<Panel />)
    const panel = screen.getByTestId('painel')
    const scrollTo = layout(panel, panelLayout)
    scrollTo(0)
    await waitFor(() => expect(current()).toBe('Instalação'))
    await user.click(screen.getByRole('link', { name: 'Com npm' }))
    expect(current()).toBe('Com npm')
    // O salto do clique termina no fim da rolagem, que sozinho marcaria "Uso".
    scrollTo(700)
    await new Promise((resolve) => requestAnimationFrame(resolve))
    expect(current()).toBe('Com npm')
    // Interação da pessoa (roda do mouse) libera a marca; a rolagem seguinte recalcula.
    act(() => {
      panel.dispatchEvent(new WheelEvent('wheel', { bubbles: true }))
    })
    scrollTo(700)
    await waitFor(() => expect(current()).toBe('Uso'))
  })

  it('tem um marcador único e decorativo fora da lista', () => {
    const { container } = render(
      <>
        <TableOfContents items={items} />
        <Article />
      </>,
    )
    const marker = container.querySelector('.or-toc__marker')
    expect(marker).toHaveAttribute('aria-hidden', 'true')
    expect(marker?.closest('ul')).toBeNull()
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
    await userEvent.setup().click(screen.getByRole('link', { name: 'Uso' }))
    expect(current()).toBe('Uso')
    await expectNoA11yViolations(container)
  })
})
