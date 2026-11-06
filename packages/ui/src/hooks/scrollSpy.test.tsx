import { act, render, screen, waitFor } from '@testing-library/react'
import { useRef, useState } from 'react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useScrollSpy, type UseScrollSpyOptions } from './index'

const ids = ['instalacao', 'npm', 'uso']

/** Painel rolável com três títulos; mostra a seção ativa e um botão que marca "npm". */
function Panel({ rootMargin = '0px 0px -70% 0px' }: Pick<UseScrollSpyOptions, 'rootMargin'>) {
  const ref = useRef<HTMLDivElement>(null)
  const { activeId, setActiveId } = useScrollSpy(ids, { root: ref, rootMargin })
  return (
    <>
      <output data-testid="ativa">{activeId ?? '—'}</output>
      <button type="button" onClick={() => setActiveId('npm')}>
        ir para npm
      </button>
      <div ref={ref} data-testid="painel">
        {ids.map((id) => (
          <h2 key={id} id={id}>
            {id}
          </h2>
        ))}
      </div>
    </>
  )
}

/** Simula layout do painel: `top` de cada título no conteúdo, altura visível e altura total. */
function layoutPanel(offsets: Record<string, number>, height = 300, scrollHeight = 1000) {
  const panel = screen.getByTestId('painel')
  let scrollTop = 0
  vi.spyOn(panel, 'clientHeight', 'get').mockReturnValue(height)
  vi.spyOn(panel, 'scrollHeight', 'get').mockReturnValue(scrollHeight)
  vi.spyOn(panel, 'scrollTop', 'get').mockImplementation(() => scrollTop)
  panel.getBoundingClientRect = () => new DOMRect(0, 0, 400, height)
  for (const [id, offset] of Object.entries(offsets)) {
    document.getElementById(id)!.getBoundingClientRect = () =>
      new DOMRect(0, offset - scrollTop, 400, 20)
  }
  return (top: number) => {
    scrollTop = top
    act(() => {
      panel.dispatchEvent(new Event('scroll'))
    })
  }
}

const active = () => screen.getByTestId('ativa').textContent

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('useScrollSpy', () => {
  // Painel de 300px, faixa no topo (0–90px); títulos em 0, 200 e 900; rola até 700.
  const offsets = { instalacao: 0, npm: 200, uso: 900 }

  it('na faixa vence o primeiro título; entre dois, o que já passou; no fim, o último à vista', async () => {
    render(<Panel />)
    const scrollTo = layoutPanel(offsets)
    scrollTo(0)
    await waitFor(() => expect(active()).toBe('instalacao'))
    scrollTo(150) // "npm" a 50px: dentro da faixa
    await waitFor(() => expect(active()).toBe('npm'))
    scrollTo(500) // nenhum na faixa: "npm" já passou
    await waitFor(() => expect(active()).toBe('npm'))
    scrollTo(100) // subindo: "instalacao" já passou, "npm" está abaixo da faixa
    await waitFor(() => expect(active()).toBe('instalacao'))
    scrollTo(700) // fim: "uso" a 200px, fora da faixa
    await waitFor(() => expect(active()).toBe('uso'))
  })

  it('sem root usa a janela e aplica a faixa padrão (-80px 0px -65% 0px)', async () => {
    function Page() {
      const { activeId } = useScrollSpy(ids)
      return (
        <>
          <output data-testid="ativa">{activeId ?? '—'}</output>
          {ids.map((id) => (
            <h2 key={id} id={id}>
              {id}
            </h2>
          ))}
        </>
      )
    }
    render(<Page />)
    // Janela de 900px: faixa de 80 a 315px. Página de 3000px.
    const html = document.documentElement
    let scrollY = 0
    vi.spyOn(html, 'clientHeight', 'get').mockReturnValue(900)
    vi.spyOn(html, 'scrollHeight', 'get').mockReturnValue(3000)
    vi.spyOn(window, 'scrollY', 'get').mockImplementation(() => scrollY)
    const pageOffsets: Record<string, number> = { instalacao: 100, npm: 1200, uso: 2800 }
    for (const [id, offset] of Object.entries(pageOffsets)) {
      document.getElementById(id)!.getBoundingClientRect = () =>
        new DOMRect(0, offset - scrollY, 400, 20)
    }
    const scrollTo = (y: number) => {
      scrollY = y
      act(() => {
        window.dispatchEvent(new Event('scroll'))
      })
    }
    scrollTo(0)
    await waitFor(() => expect(active()).toBe('instalacao'))
    scrollTo(1000) // "npm" a 200px
    await waitFor(() => expect(active()).toBe('npm'))
    scrollTo(2100) // fim da página
    await waitFor(() => expect(active()).toBe('uso'))
  })

  it('setActiveId marca na hora e mantém a marca durante o salto, até a próxima interação', async () => {
    render(<Panel />)
    const scrollTo = layoutPanel(offsets)
    scrollTo(0)
    await waitFor(() => expect(active()).toBe('instalacao'))
    act(() => {
      screen.getByRole('button', { name: 'ir para npm' }).click()
    })
    expect(active()).toBe('npm')
    // O salto termina no fim da rolagem, que sozinho marcaria "uso".
    scrollTo(700)
    await new Promise((resolve) => requestAnimationFrame(resolve))
    expect(active()).toBe('npm')
    act(() => {
      window.dispatchEvent(new WheelEvent('wheel'))
    })
    scrollTo(700)
    await waitFor(() => expect(active()).toBe('uso'))
  })

  it('um array novo com os mesmos ids não reinicia a observação', () => {
    const observers: unknown[] = []
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor() {
          observers.push(this)
        }
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() {
          return []
        }
      },
    )
    function Rerender() {
      const [, setTick] = useState(0)
      // Array novo a cada render, como `items.map((item) => item.id)`.
      useScrollSpy(ids.map((id) => id))
      return (
        <>
          <button type="button" onClick={() => setTick((n) => n + 1)}>
            render
          </button>
          {ids.map((id) => (
            <h2 key={id} id={id}>
              {id}
            </h2>
          ))}
        </>
      )
    }
    render(<Rerender />)
    expect(observers).toHaveLength(1)
    act(() => screen.getByRole('button', { name: 'render' }).click())
    act(() => screen.getByRole('button', { name: 'render' }).click())
    expect(observers).toHaveLength(1)
  })

  it('é seguro no servidor: renderiza sem seção ativa', () => {
    function Ssr() {
      const { activeId } = useScrollSpy(ids)
      return <output>{activeId ?? 'nenhuma'}</output>
    }
    expect(renderToString(<Ssr />)).toContain('nenhuma')
  })
})
