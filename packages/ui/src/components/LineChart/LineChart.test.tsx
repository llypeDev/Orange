import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { LineChart, type LineChartProps } from './LineChart'

// jsdom não implementa PointerEvent: um MouseEvent com pointerId/pointerType basta.
const hadPointerEvent = 'PointerEvent' in window
beforeAll(() => {
  if (hadPointerEvent) return
  class PointerEventPolyfill extends MouseEvent {
    pointerId: number
    pointerType: string
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init)
      this.pointerId = init.pointerId ?? 1
      this.pointerType = init.pointerType ?? 'mouse'
    }
  }
  ;(window as unknown as { PointerEvent: unknown }).PointerEvent = PointerEventPolyfill
})
afterAll(() => {
  if (!hadPointerEvent) delete (window as unknown as { PointerEvent?: unknown }).PointerEvent
})

const brl = { style: 'currency', currency: 'BRL' } as const

const series = [
  { key: 'site', label: 'Site' },
  { key: 'app', label: 'App' },
]

const data = [
  { label: 'jan', values: { site: 152.4, app: 131.9 } },
  { label: 'fev', values: { site: 158.1, app: 136.2 } },
  { label: 'mar', values: { site: 149.7, app: null } },
  { label: 'abr', values: { site: 163.2, app: 146.5 } },
  { label: 'mai', values: { site: 171.0, app: 152.8 } },
]

function renderChart(props: Partial<LineChartProps> = {}) {
  return render(
    <LineChart
      title="Ticket médio por canal"
      description="R$ por pedido · 2026"
      categoryLabel="Mês"
      valueFormat={brl}
      series={series}
      data={data}
      {...props}
    />,
  )
}

const plot = () => screen.getByRole('img', { name: /^Gráfico de linhas: Ticket médio por canal/ })
const lines = (container: HTMLElement, key: string) =>
  Array.from(container.querySelectorAll(`[data-series="${key}"] .or-line-chart__line`))
const markers = (container: HTMLElement, key: string) =>
  Array.from(container.querySelectorAll(`[data-series="${key}"] .or-line-chart__marker`))
const markerX = (marker: Element) => Number(marker.getAttribute('d')!.match(/^M([\d.]+)/)![1])

describe('LineChart', () => {
  describe('figura e resumo', () => {
    it('renderiza <figure> com título e o SVG como imagem com resumo automático', () => {
      renderChart()
      const figure = screen.getByRole('figure', { name: 'Ticket médio por canal' })
      expect(figure.querySelector('figcaption')).toHaveTextContent('R$ por pedido · 2026')
      const name = plot().getAttribute('aria-label')!.replace(/\s/g, ' ')
      expect(name).toContain('De jan a mai.')
      expect(name).toContain('Séries: Site e App.')
      expect(name).toContain('Maior valor: mai · Site: R$ 171,00.')
      expect(name).toContain('Menor valor: jan · App: R$ 131,90.')
    })

    it('aceita um resumo próprio', () => {
      renderChart({ summary: 'O app encosta no site em maio.' })
      expect(plot()).toHaveAttribute(
        'aria-label',
        'Gráfico de linhas: Ticket médio por canal. O app encosta no site em maio.',
      )
    })
  })

  it('tabela de dados com as mesmas séries, inclusive lacunas', async () => {
    const user = userEvent.setup()
    renderChart()
    const table = screen.getByRole('table', { name: 'Dados: Ticket médio por canal' })
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((th) => th.textContent),
    ).toEqual(['Mês', 'Site', 'App'])
    const mar = within(table).getAllByRole('row')[3]
    expect(mar).toHaveTextContent('R$ 149,70')
    expect(mar).toHaveTextContent('sem dados')
    await user.click(screen.getByRole('button', { name: 'Ver dados' }))
    expect(screen.getByRole('button', { name: 'Ocultar dados' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  describe('séries: cor, traço e marcador', () => {
    it('legenda com traço e forma de cada série; cada linha tem traço e marcador próprios', () => {
      const { container } = renderChart()
      const items = within(screen.getByRole('list', { name: 'Legenda' })).getAllByRole('listitem')
      expect(items.map((li) => li.textContent)).toEqual(['Site', 'App'])
      const [siteKey, appKey] = items.map((li) => li.querySelector('line')!)
      expect(siteKey).not.toHaveAttribute('stroke-dasharray')
      expect(appKey).toHaveAttribute('stroke-dasharray', '6 5')
      const [siteMark, appMark] = items.map((li) => li.querySelector('path')!.getAttribute('d'))
      expect(siteMark).not.toBe(appMark)

      expect(lines(container, 'site')[0]).not.toHaveAttribute('stroke-dasharray')
      expect(lines(container, 'app')[0]).toHaveAttribute('stroke-dasharray', '6 5')
      expect(markers(container, 'site')[0].getAttribute('d')).toContain('a4.5') // círculo
      expect(markers(container, 'app')[0].getAttribute('d')).toContain('h8.1') // quadrado
      expect(container.querySelector('[data-series="app"]')!.getAttribute('style')).toContain(
        'var(--or-color-viz-2)',
      )
    })

    it('uma série não tem legenda', () => {
      renderChart({ series: [series[0]] })
      expect(screen.queryByRole('list', { name: 'Legenda' })).toBeNull()
    })
  })

  describe('lacunas (null)', () => {
    it('interrompem a linha em trechos separados', () => {
      const { container } = renderChart({
        data: [
          { label: 'jan', values: { site: 10, app: 5 } },
          { label: 'fev', values: { site: 12, app: 6 } },
          { label: 'mar', values: { site: null, app: 7 } },
          { label: 'abr', values: { site: 14, app: 8 } },
          { label: 'mai', values: { site: 15, app: 9 } },
        ],
      })
      const site = lines(container, 'site')
      expect(site).toHaveLength(2)
      site.forEach((path) => expect(path.getAttribute('d')!.match(/M/g)).toHaveLength(1))
      expect(lines(container, 'app')).toHaveLength(1)
      // Nenhum marcador onde não há dado.
      expect(markers(container, 'site')).toHaveLength(4)
    })

    it('um ponto isolado continua visível como marcador', () => {
      const { container } = renderChart({ series: [series[1]] })
      // app: jan, fev | (mar null) | abr, mai → dois trechos, sem ponto isolado
      expect(lines(container, 'app')).toHaveLength(2)
      const isolated = renderChart({
        series: [series[1]],
        data: [
          { label: 'a', values: { app: 1 } },
          { label: 'b', values: { app: null } },
          { label: 'c', values: { app: 3 } },
          { label: 'd', values: { app: 4 } },
        ],
      })
      expect(lines(isolated.container, 'app')).toHaveLength(1)
      expect(markers(isolated.container, 'app')).toHaveLength(3)
    })
  })

  describe('exploração por teclado e ponteiro', () => {
    it('← → percorrem o eixo X, ↑ ↓ trocam a série, com anúncio e cruz vertical', async () => {
      const user = userEvent.setup()
      const { container } = renderChart()
      await user.tab()
      expect(plot()).toHaveFocus()
      const status = screen.getByRole('status')

      await user.keyboard('{ArrowRight}')
      expect(status).toHaveTextContent('jan · Site: R$ 152,40')
      const crosshair = container.querySelector<SVGLineElement>('.or-line-chart__crosshair')!
      expect(crosshair).toHaveAttribute('data-state', 'open')
      const tooltip = container.querySelector('.or-chart__tooltip')!
      expect(tooltip).toHaveTextContent('jan')
      expect(tooltip).toHaveTextContent('R$ 131,90')

      await user.keyboard('{ArrowRight}{ArrowRight}{ArrowDown}')
      expect(status).toHaveTextContent('mar · App: sem dados')
      expect(container.querySelector('[data-series="site"]')).toHaveAttribute(
        'data-emphasis',
        'muted',
      )
      // Marcador ativo (r = 6): o `d` do círculo começa em cx - r.
      const x = markerX(markers(container, 'site')[2]) + 6
      expect(crosshair.style.transform).toBe(`translateX(${Math.round(x)}px)`)

      await user.keyboard('{End}')
      expect(status).toHaveTextContent('mai · App: R$ 152,80')
      await user.keyboard('{Escape}')
      expect(status).toBeEmptyDOMElement()
      expect(crosshair).toHaveAttribute('data-state', 'closed')
    })

    it('o ponteiro encontra o X mais próximo e a série mais perto', () => {
      const { container } = renderChart()
      const target = markers(container, 'app')[1] // fev
      const d = target.getAttribute('d')!
      const [, mx, my] = d.match(/^M([\d.]+) ([\d.]+)/)!
      fireEvent.pointerMove(plot(), { clientX: Number(mx) + 4, clientY: Number(my) + 4 })
      const tooltip = container.querySelector('.or-chart__tooltip')!
      expect(tooltip).toHaveAttribute('data-state', 'open')
      expect(tooltip).toHaveTextContent('fev')
      expect(tooltip.querySelector('[data-active]')).toHaveTextContent('App')
      expect(screen.getByRole('status')).toBeEmptyDOMElement()
      fireEvent.pointerLeave(plot())
      expect(tooltip).toHaveAttribute('data-state', 'closed')
    })
  })

  describe('formatação', () => {
    it('pt-BR', () => {
      const { container } = renderChart()
      expect(screen.getByRole('table')).toHaveTextContent('R$ 158,10')
      expect(container.querySelector('.or-line-chart__end-label')).toHaveTextContent('R$ 171,00')
    })

    it('en-US', () => {
      render(
        <OrangeProvider locale="en-US" themeTarget="scoped">
          <LineChart title="Average order value" valueFormat={brl} series={series} data={data} />
        </OrangeProvider>,
      )
      expect(screen.getByRole('table', { name: 'Data: Average order value' })).toHaveTextContent(
        'R$158.10',
      )
      expect(
        screen.getByRole('img', { name: /^Line chart: Average order value\. From jan to mai\./ }),
      ).toBeInTheDocument()
      expect(screen.getByRole('table')).toHaveTextContent('no data')
    })
  })

  it('rótulos no fim das linhas podem ser desligados', () => {
    const { container } = renderChart({ endLabels: false })
    expect(container.querySelector('.or-line-chart__end-label')).toBeNull()
  })

  it('area preenche uma série e leva o eixo ao zero', () => {
    const { container } = renderChart({ series: [series[0]], area: true, valueFormat: undefined })
    expect(container.querySelector('.or-line-chart__area')).toBeInTheDocument()
    const ticks = Array.from(
      container.querySelectorAll('.or-line-chart__axis .or-chart__tick'),
    ).map((el) => el.textContent)
    expect(ticks[0]).toBe('0')
    // Com duas séries a área é ignorada (esconderia a outra).
    const two = renderChart({ area: true })
    expect(two.container.querySelector('.or-line-chart__area')).toBeNull()
  })

  describe('movimento', () => {
    const original = window.matchMedia
    afterEach(() => {
      window.matchMedia = original
    })

    it('desenha as linhas com stroke-dashoffset (máscara com pathLength=1) ao entrar na tela', () => {
      const { container } = renderChart()
      expect(screen.getByRole('figure')).toHaveAttribute('data-motion', 'pending')
      const line = lines(container, 'site')[0]
      const maskId = line.getAttribute('mask')!.match(/url\(#(.+)\)/)![1]
      const mask = container.querySelector(`mask[id="${maskId}"]`)!
      expect(mask.querySelector('path')).toHaveAttribute('pathLength', '1')
      expect(mask.querySelector('path')).toHaveClass('or-line-chart__draw')
    })

    it('movimento reduzido: sem máscara, tudo desenhado', () => {
      window.matchMedia = ((q: string) => ({
        ...original(q),
        matches: q.includes('reduce'),
      })) as typeof window.matchMedia
      const { container } = renderChart()
      expect(screen.getByRole('figure')).toHaveAttribute('data-motion', 'static')
      expect(container.querySelector('mask')).toBeNull()
      expect(lines(container, 'site')[0]).not.toHaveAttribute('mask')
    })
  })

  it('não possui violações de acessibilidade', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <div>
        <LineChart title="Ticket médio" valueFormat={brl} series={series} data={data} />
        <LineChart title="Pedidos" series={[series[0]]} data={data} area hideCaption />
      </div>,
    )
    await user.click(screen.getAllByRole('button', { name: 'Ver dados' })[0])
    screen.getAllByRole('img')[0].focus()
    await user.keyboard('{ArrowRight}')
    await expectNoA11yViolations(container)
  })
})
