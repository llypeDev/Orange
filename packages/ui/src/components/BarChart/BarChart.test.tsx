import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { BarChart, type BarChartProps } from './BarChart'

const brl = { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 } as const

const series = [
  { key: 'site', label: 'Site' },
  { key: 'app', label: 'App' },
  { key: 'loja', label: 'Loja física' },
]

const data = [
  { label: 'jan', values: { site: 12400, app: 8100, loja: 6200 } },
  { label: 'fev', values: { site: 13900, app: 9300, loja: 5800 } },
  { label: 'mar', values: { site: 15200, app: 11800, loja: null } },
]

function renderChart(props: Partial<BarChartProps> = {}) {
  return render(
    <BarChart
      title="Vendas por canal"
      description="R$ por mês · 1º trimestre de 2026"
      categoryLabel="Mês"
      valueFormat={brl}
      series={series}
      data={data}
      {...props}
    />,
  )
}

const plot = () => screen.getByRole('img', { name: /^Gráfico de barras: Vendas por canal/ })
const bars = (container: HTMLElement, key?: string) =>
  Array.from(container.querySelectorAll<SVGRectElement>(`.or-bar-chart__bar${key ? `[data-series="${key}"]` : ''}`))
const num = (el: Element, attr: string) => Number(el.getAttribute(attr))

describe('BarChart', () => {
  describe('figura e resumo', () => {
    it('renderiza <figure> com figcaption (título + subtítulo) e o SVG como imagem com resumo', () => {
      renderChart()
      const figure = screen.getByRole('figure', { name: /Vendas por canal/ })
      expect(figure.querySelector('figcaption')).toHaveTextContent('Vendas por canal')
      expect(figure.querySelector('figcaption')).toHaveTextContent('R$ por mês · 1º trimestre de 2026')
      const svg = plot()
      expect(svg.tagName.toLowerCase()).toBe('svg')
      const name = svg.getAttribute('aria-label')!.replace(/\s/g, ' ')
      expect(name).toContain('Séries: Site, App e Loja física.')
      expect(name).toContain('Maior valor: mar · Site: R$ 15.200.')
      expect(name).toContain('Menor valor: fev · Loja física: R$ 5.800.')
    })

    it('usa o `summary` informado no lugar do resumo automático', () => {
      renderChart({ summary: 'O site lidera em todos os meses.' })
      expect(plot()).toHaveAttribute('aria-label', 'Gráfico de barras: Vendas por canal. O site lidera em todos os meses.')
    })

    it('hideCaption esconde o título só visualmente', () => {
      renderChart({ hideCaption: true })
      const caption = screen.getByRole('figure', { name: /Vendas por canal/ }).querySelector('figcaption')
      expect(caption).toHaveClass('or-visually-hidden')
    })

    it('a área do gráfico é focável e descreve o uso do teclado', () => {
      renderChart()
      const svg = plot()
      expect(svg).toHaveAttribute('tabindex', '0')
      expect(svg).toHaveAccessibleDescription(/Use as setas para percorrer os valores/)
    })
  })

  describe('tabela de dados', () => {
    it('existe para leitores de tela mesmo recolhida, com os mesmos dados formatados', () => {
      renderChart()
      const table = screen.getByRole('table', { name: 'Dados: Vendas por canal' })
      const headers = within(table).getAllByRole('columnheader').map((th) => th.textContent)
      expect(headers).toEqual(['Mês', 'Site', 'App', 'Loja física'])
      const rows = within(table).getAllByRole('row').slice(1)
      expect(rows).toHaveLength(3)
      expect(within(rows[0]).getByRole('rowheader')).toHaveTextContent('jan')
      expect(rows[0]).toHaveTextContent('R$ 12.400')
      // Lacuna: traço visual + "sem dados" para o leitor de tela.
      expect(rows[2].querySelectorAll('td')[2]).toHaveTextContent('sem dados')
      expect(table.closest('.or-chart__data')).toHaveAttribute('data-state', 'closed')
      expect(table.closest('[inert]')).toBeNull()
    })

    it('"Ver dados" mostra a tabela e vira "Ocultar dados"', async () => {
      const user = userEvent.setup()
      renderChart()
      const toggle = screen.getByRole('button', { name: 'Ver dados' })
      expect(toggle).toHaveAttribute('aria-expanded', 'false')
      expect(screen.queryByRole('region', { name: 'Dados: Vendas por canal' })).toBeNull()
      await user.click(toggle)
      expect(toggle).toHaveAttribute('aria-expanded', 'true')
      expect(toggle).toHaveAccessibleName('Ocultar dados')
      const region = screen.getByRole('region', { name: 'Dados: Vendas por canal' })
      expect(region).toHaveAttribute('tabindex', '0')
      expect(document.getElementById(toggle.getAttribute('aria-controls')!)).toHaveAttribute('data-state', 'open')
    })

    it('empilhado ganha a coluna Total', () => {
      renderChart({ layout: 'stacked' })
      const table = screen.getByRole('table')
      expect(within(table).getAllByRole('columnheader').at(-1)).toHaveTextContent('Total')
      expect(within(table).getAllByRole('row')[1]).toHaveTextContent('R$ 26.700')
    })
  })

  describe('legenda e cores', () => {
    it('lista as séries na ordem, com marca e texto, e usa os tokens viz na ordem', () => {
      const { container } = renderChart({ series: [...series.slice(0, 2), { ...series[2], color: 'var(--or-color-accent)' }] })
      const legend = screen.getByRole('list', { name: 'Legenda' })
      const items = within(legend).getAllByRole('listitem')
      expect(items.map((li) => li.textContent)).toEqual(['Site', 'App', 'Loja física'])
      items.forEach((li) => expect(li.querySelector('svg')).toHaveAttribute('aria-hidden', 'true'))
      expect(items[0].getAttribute('style')).toContain('var(--or-color-viz-1)')
      expect(bars(container, 'app')[0].getAttribute('style')).toContain('var(--or-color-viz-2)')
      expect(bars(container, 'loja')[0].getAttribute('style')).toContain('var(--or-color-accent)')
    })

    it('uma série não tem legenda (o título já diz o que é)', () => {
      renderChart({ series: [series[0]] })
      expect(screen.queryByRole('list', { name: 'Legenda' })).toBeNull()
    })

    it('highlight pinta a categoria com o acento e o resto no neutro, com rótulo de valor', () => {
      const { container } = renderChart({ series: [series[0]], highlight: 'mar' })
      const [jan, , mar] = bars(container)
      expect(jan.getAttribute('style')).toContain('var(--or-color-viz-other)')
      expect(mar.getAttribute('style')).toContain('var(--or-color-accent)')
      const labels = container.querySelectorAll('.or-chart__value')
      expect(labels).toHaveLength(1)
      expect(labels[0]).toHaveTextContent('R$ 15.200')
    })
  })

  describe('exploração por teclado e ponteiro', () => {
    it('setas movem o destaque, a dica mostra os valores e a região status anuncia', async () => {
      const user = userEvent.setup()
      const { container } = renderChart()
      await user.tab()
      expect(plot()).toHaveFocus()
      const status = screen.getByRole('status')
      expect(status).toBeEmptyDOMElement()

      await user.keyboard('{ArrowRight}')
      expect(status).toHaveTextContent('jan · Site: R$ 12.400')
      const tooltip = container.querySelector('.or-chart__tooltip')!
      expect(tooltip).toHaveAttribute('data-state', 'open')
      expect(tooltip).toHaveAttribute('aria-hidden', 'true')
      expect(tooltip).toHaveTextContent('jan')
      expect(tooltip).toHaveTextContent('R$ 8.100')
      expect(bars(container, 'site')[0]).toHaveAttribute('data-emphasis', 'active')
      expect(bars(container, 'app')[0]).toHaveAttribute('data-emphasis', 'related')
      expect(bars(container, 'site')[1]).toHaveAttribute('data-emphasis', 'muted')

      await user.keyboard('{ArrowRight}{ArrowDown}')
      expect(status).toHaveTextContent('fev · App: R$ 9.300')

      await user.keyboard('{End}{ArrowDown}')
      expect(status).toHaveTextContent('mar · Loja física: sem dados')

      await user.keyboard('{Home}{ArrowUp}')
      expect(status).toHaveTextContent('jan · App: R$ 8.100')

      await user.keyboard('{Escape}')
      expect(status).toBeEmptyDOMElement()
      expect(tooltip).toHaveAttribute('data-state', 'closed')
      expect(bars(container, 'site')[0]).not.toHaveAttribute('data-emphasis')
    })

    it('na horizontal, ↑ ↓ trocam a categoria e ← → a série', async () => {
      const user = userEvent.setup()
      renderChart({ orientation: 'horizontal' })
      plot().focus()
      await user.keyboard('{ArrowDown}{ArrowDown}{ArrowRight}')
      expect(screen.getByRole('status')).toHaveTextContent('fev · App: R$ 9.300')
    })

    it('sair do gráfico (blur) limpa o destaque do teclado', async () => {
      const user = userEvent.setup()
      const { container } = renderChart()
      plot().focus()
      await user.keyboard('{ArrowRight}')
      await user.tab()
      expect(container.querySelector('.or-chart__tooltip')).toHaveAttribute('data-state', 'closed')
    })

    it('o ponteiro sobre uma barra mostra a mesma dica, sem anunciar', () => {
      const { container } = renderChart()
      const target = bars(container, 'app')[1]
      fireEvent.pointerMove(plot(), { clientX: num(target, 'x') + 2, clientY: num(target, 'y') + 2 })
      const tooltip = container.querySelector('.or-chart__tooltip')!
      expect(tooltip).toHaveAttribute('data-state', 'open')
      expect(tooltip).toHaveTextContent('fev')
      expect(tooltip.querySelector('[data-active]')).toHaveTextContent('App')
      expect(screen.getByRole('status')).toBeEmptyDOMElement()
      fireEvent.pointerLeave(plot())
      expect(tooltip).toHaveAttribute('data-state', 'closed')
    })

    it('Escape também fecha a dica do ponteiro (WCAG 1.4.13)', async () => {
      const user = userEvent.setup()
      const { container } = renderChart()
      const target = bars(container, 'site')[0]
      fireEvent.pointerMove(plot(), { clientX: num(target, 'x') + 2, clientY: num(target, 'y') + 2 })
      await user.keyboard('{Escape}')
      expect(container.querySelector('.or-chart__tooltip')).toHaveAttribute('data-state', 'closed')
    })
  })

  describe('formatação', () => {
    it('pt-BR: moeda e eixo compacto no idioma', () => {
      const { container } = renderChart()
      expect(screen.getByRole('table')).toHaveTextContent('R$ 13.900')
      const ticks = Array.from(container.querySelectorAll('.or-bar-chart__axis .or-chart__tick')).map((el) =>
        el.textContent!.replace(/\s/g, ' '),
      )
      expect(ticks).toContain('R$ 10 mil')
    })

    it('en-US: separadores, eixo compacto e mensagens em inglês', () => {
      const { container } = render(
        <OrangeProvider locale="en-US" themeTarget="scoped">
          <BarChart title="Sales by channel" valueFormat={brl} series={series} data={data} />
        </OrangeProvider>,
      )
      expect(screen.getByRole('table', { name: 'Data: Sales by channel' })).toHaveTextContent('R$12,400')
      const ticks = Array.from(container.querySelectorAll('.or-bar-chart__axis .or-chart__tick')).map((el) => el.textContent)
      expect(ticks).toContain('R$10K')
      expect(screen.getByRole('button', { name: 'Show data' })).toBeInTheDocument()
      expect(screen.getByRole('img', { name: /^Bar chart: Sales by channel\. Series: Site, App, and Loja física\./ })).toBeInTheDocument()
    })

    it('valueFormat como função', () => {
      renderChart({ valueFormat: (n) => `${n / 1000} mil` })
      expect(screen.getByRole('table')).toHaveTextContent('12.4 mil')
    })
  })

  describe('geometria', () => {
    const simple = [
      { label: 'A', values: { a: 100, b: 50 } },
      { label: 'B', values: { a: 200, b: -40 } },
    ]
    const ab = [
      { key: 'a', label: 'A' },
      { key: 'b', label: 'B' },
    ]

    it('agrupado: alturas proporcionais aos valores, a partir da base zero', () => {
      const { container } = renderChart({ data: simple, series: ab, valueFormat: undefined })
      const [a1, a2] = bars(container, 'a')
      expect(num(a2, 'height') / num(a1, 'height')).toBeCloseTo(2, 1)
      const baseline = container.querySelector('.or-chart__baseline')!
      const zero = num(baseline, 'y1') - 0.5
      expect(num(a1, 'y') + num(a1, 'height')).toBeCloseTo(zero, 0)
      // Negativa: começa na base e desce.
      const negative = bars(container, 'b')[1]
      expect(num(negative, 'y')).toBeCloseTo(zero, 0)
      expect(num(negative, 'height') / num(a1, 'height')).toBeCloseTo(0.4, 1)
      // Barras do grupo lado a lado com 2px de fundo entre elas.
      const b1 = bars(container, 'b')[0]
      expect(num(b1, 'x') - (num(a1, 'x') + num(a1, 'width'))).toBeCloseTo(2, 5)
    })

    it('a base é sempre zero, mesmo com valores altos', () => {
      const { container } = renderChart({
        data: [
          { label: 'A', values: { a: 900 } },
          { label: 'B', values: { a: 1000 } },
        ],
        series: [ab[0]],
        valueFormat: undefined,
      })
      const ticks = Array.from(container.querySelectorAll('.or-bar-chart__axis .or-chart__tick')).map((el) => el.textContent)
      expect(ticks[0]).toBe('0')
      const [a, b] = bars(container)
      expect(num(a, 'height') / num(b, 'height')).toBeCloseTo(0.9, 2)
    })

    it('empilhado: segmentos um sobre o outro, com 2px de fundo, e total proporcional', () => {
      const data2 = [
        { label: 'A', values: { a: 100, b: 100 } },
        { label: 'B', values: { a: 300, b: 100 } },
      ]
      const { container } = renderChart({ data: data2, series: ab, layout: 'stacked', valueFormat: undefined })
      const [a1, a2] = bars(container, 'a')
      const [b1, b2] = bars(container, 'b')
      expect(num(a1, 'x')).toBe(num(b1, 'x'))
      expect(num(b1, 'y') + num(b1, 'height') + 2).toBeCloseTo(num(a1, 'y'), 1)
      const stack = (a: Element, b: Element) => num(a, 'y') + num(a, 'height') - num(b, 'y')
      expect(stack(a2, b2) / stack(a1, b1)).toBeCloseTo(2, 1)
    })

    it('horizontal: larguras proporcionais e barras de no máximo 24px de espessura', () => {
      const { container } = renderChart({ data: simple.map((d) => ({ ...d, values: { a: d.values.a } })), series: [ab[0]], orientation: 'horizontal', valueFormat: undefined })
      const [a1, a2] = bars(container)
      expect(num(a2, 'width') / num(a1, 'width')).toBeCloseTo(2, 1)
      expect(num(a1, 'height')).toBeLessThanOrEqual(24)
      expect(num(a2, 'y')).toBeGreaterThan(num(a1, 'y'))
      expect(screen.getByRole('figure')).toHaveClass('or-bar-chart--horizontal')
    })

    it('rótulos de valor (showValues) na ponta das barras', () => {
      const { container } = renderChart({ series: [series[0]], showValues: true })
      const labels = Array.from(container.querySelectorAll('.or-chart__value')).map((el) => el.textContent!.replace(/\s/g, ' '))
      expect(labels).toEqual(['R$ 12.400', 'R$ 13.900', 'R$ 15.200'])
    })
  })

  describe('movimento', () => {
    const original = window.matchMedia
    afterEach(() => {
      window.matchMedia = original
    })

    it('aguarda a entrada na tela para crescer as barras a partir da base', () => {
      const { container } = renderChart()
      expect(screen.getByRole('figure')).toHaveAttribute('data-motion', 'pending')
      const group = container.querySelector<SVGGElement>('.or-bar-chart__group')!
      const zero = num(container.querySelector('.or-chart__baseline')!, 'y1') - 0.5
      expect(group.style.transformOrigin).toBe(`0px ${zero}px`)
      expect(group.style.getPropertyValue('--_i')).toBe('0')
    })

    it('com movimento reduzido tudo fica desenhado, sem animação', () => {
      window.matchMedia = ((q: string) => ({ ...original(q), matches: q.includes('reduce') })) as typeof window.matchMedia
      renderChart()
      expect(screen.getByRole('figure')).toHaveAttribute('data-motion', 'static')
    })
  })

  it('sem dados mostra um aviso e não quebra', () => {
    renderChart({ data: [] })
    expect(screen.getByRole('figure')).toHaveTextContent('Sem dados para exibir')
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('não possui violações de acessibilidade', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <div>
        <BarChart title="Vendas por canal" valueFormat={brl} series={series} data={data} />
        <BarChart title="Receita por região" layout="stacked" series={series} data={data} showValues />
        <BarChart title="Pedidos por categoria" orientation="horizontal" series={[series[0]]} data={data} highlight="mar" />
      </div>,
    )
    await user.click(screen.getAllByRole('button', { name: 'Ver dados' })[0])
    screen.getAllByRole('img')[0].focus()
    await user.keyboard('{ArrowRight}')
    await expectNoA11yViolations(container)
  })
})
