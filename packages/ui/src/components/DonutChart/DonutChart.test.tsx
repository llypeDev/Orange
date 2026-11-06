import { createRef } from 'react'
import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { DonutChart, type DonutChartProps } from './DonutChart'

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

const brl = { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 } as const

// 48.200 + 39.800 + 24.400 + 12.200 + 3.800 = 128.400
const data = [
  { label: 'Site', value: 48200 },
  { label: 'App', value: 39800 },
  { label: 'Lojas físicas', value: 24400 },
  { label: 'Marketplace', value: 12200 },
  { label: 'Outros', value: 3800, color: 'var(--or-color-viz-other)' },
]

function renderChart(props: Partial<DonutChartProps> = {}) {
  return render(
    <DonutChart
      title="Vendas por canal"
      description="R$ · março de 2026"
      categoryLabel="Canal"
      valueFormat={brl}
      data={data}
      {...props}
    />,
  )
}

const plot = () => screen.getByRole('img', { name: /^Gráfico de rosca: Vendas por canal/ })
const slices = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<SVGPathElement>('.or-donut-chart__slice'))
const legendItems = () =>
  within(screen.getByRole('list', { name: 'Legenda' })).getAllByRole('listitem')
const text = (el: Element | null) => (el?.textContent ?? '').replace(/\s/g, ' ')

describe('DonutChart', () => {
  describe('figura e resumo', () => {
    it('renderiza <figure> com figcaption e o SVG como imagem com total e participações', () => {
      renderChart()
      const figure = screen.getByRole('figure', { name: 'Vendas por canal' })
      expect(figure.querySelector('figcaption')).toHaveTextContent('R$ · março de 2026')
      const svg = plot()
      expect(svg.tagName.toLowerCase()).toBe('svg')
      const name = svg.getAttribute('aria-label')!.replace(/\s/g, ' ')
      expect(name).toContain('Total: R$ 128.400.')
      expect(name).toContain('Site: R$ 48.200 (38%), App: R$ 39.800 (31%)')
      expect(name).toContain('e Outros: R$ 3.800 (3%).')
    })

    it('usa o `summary` informado no lugar do resumo automático', () => {
      renderChart({ summary: 'O site responde por mais de um terço das vendas.' })
      expect(plot()).toHaveAttribute(
        'aria-label',
        'Gráfico de rosca: Vendas por canal. O site responde por mais de um terço das vendas.',
      )
    })

    it('mostra o total formatado e a legenda do centro (padrão "Total", ou centerLabel)', () => {
      const { container, rerender } = renderChart()
      const face = container.querySelector('.or-donut-chart__face')!
      expect(text(face.querySelector('.or-donut-chart__total'))).toBe('R$ 128.400')
      expect(face.querySelector('.or-donut-chart__caption')).toHaveTextContent('Total')
      rerender(
        <DonutChart title="Vendas por canal" valueFormat={brl} data={data} centerLabel="vendas" />,
      )
      expect(face.querySelector('.or-donut-chart__caption')).toHaveTextContent('vendas')
      expect(plot().getAttribute('aria-label')!.replace(/\s/g, ' ')).toContain(
        'vendas: R$ 128.400.',
      )
    })

    it('hideCaption esconde o título só visualmente', () => {
      renderChart({ hideCaption: true })
      expect(screen.getByRole('figure').querySelector('figcaption')).toHaveClass(
        'or-visually-hidden',
      )
    })

    it('a área do gráfico é focável e descreve o uso do teclado', () => {
      renderChart()
      expect(plot()).toHaveAttribute('tabindex', '0')
      expect(plot()).toHaveAccessibleDescription(/Use as setas para percorrer os valores/)
    })

    it('repassa ref e atributos ao <figure>', () => {
      const ref = createRef<HTMLElement>()
      renderChart({ ref, id: 'vendas', className: 'extra', 'data-testid': 'rosca' } as never)
      const figure = screen.getByTestId('rosca')
      expect(ref.current).toBe(figure)
      expect(figure).toHaveAttribute('id', 'vendas')
      expect(figure).toHaveClass('or-chart', 'or-donut-chart', 'extra')
    })
  })

  describe('legenda e percentuais', () => {
    it('lista cada fatia com cor, valor e percentual, na ordem dos dados', () => {
      renderChart()
      const items = legendItems()
      // Arredondar cada um daria 38 + 31 + 19 + 10 + 3 = 101%. Pelo maior resto, o Marketplace
      // (9,50%) fica com 9 e o site (37,54%) com 38: a legenda soma 100%.
      expect(items.map(text)).toEqual([
        'SiteR$ 48.20038%',
        'AppR$ 39.80031%',
        'Lojas físicasR$ 24.40019%',
        'MarketplaceR$ 12.2009%',
        'OutrosR$ 3.8003%',
      ])
      items.forEach((li) => expect(li.querySelector('svg')).toHaveAttribute('aria-hidden', 'true'))
    })

    it('percentuais arredondados pelo maior resto sempre somam 100%', () => {
      renderChart({
        valueFormat: undefined,
        data: [
          { label: 'Abertos', value: 1 },
          { label: 'Em andamento', value: 1 },
          { label: 'Resolvidos', value: 1 },
        ],
      })
      const shares = legendItems().map((li) =>
        Number(li.querySelector('.or-donut-chart__share')!.textContent!.replace(/\D/g, '')),
      )
      expect(shares).toEqual([34, 33, 33])
    })

    it('restos empatados: o ponto vai para a fatia que vem antes (0,4% + 0,4% + 99,2%)', () => {
      renderChart({
        valueFormat: undefined,
        data: [
          { label: 'A', value: 4 },
          { label: 'B', value: 4 },
          { label: 'C', value: 992 },
        ],
      })
      const shares = legendItems().map((li) =>
        Number(li.querySelector('.or-donut-chart__share')!.textContent!.replace(/\D/g, '')),
      )
      expect(shares.reduce((a, b) => a + b, 0)).toBe(100)
      expect(shares).toEqual([1, 0, 99])
    })

    it('cores: tokens viz na ordem, `color` sobrescreve e a sexta fatia vira viz-other', () => {
      const { container } = renderChart({
        data: [
          { label: 'A', value: 6 },
          { label: 'B', value: 5 },
          { label: 'C', value: 4 },
          { label: 'D', value: 3, color: 'var(--or-color-accent)' },
          { label: 'E', value: 2 },
          { label: 'F', value: 1 },
        ],
      })
      const styles = slices(container).map((s) => s.getAttribute('style'))
      expect(styles[0]).toContain('var(--or-color-viz-1)')
      expect(styles[1]).toContain('var(--or-color-viz-2)')
      expect(styles[3]).toContain('var(--or-color-accent)')
      expect(styles[4]).toContain('var(--or-color-viz-5)')
      expect(styles[5]).toContain('var(--or-color-viz-other)')
      expect(legendItems()[0].getAttribute('style')).toContain('var(--or-color-viz-1)')
    })
  })

  describe('tabela de dados', () => {
    it('existe para leitores de tela mesmo recolhida, com valor, participação e total', () => {
      renderChart()
      const table = screen.getByRole('table', { name: 'Dados: Vendas por canal' })
      expect(
        within(table)
          .getAllByRole('columnheader')
          .map((th) => th.textContent),
      ).toEqual(['Canal', 'Valor', 'Participação'])
      const rows = within(table).getAllByRole('row').slice(1)
      expect(rows).toHaveLength(6)
      expect(within(rows[0]).getByRole('rowheader')).toHaveTextContent('Site')
      expect(text(rows[0])).toContain('R$ 48.200')
      expect(text(rows[0])).toContain('38%')
      expect(within(rows[5]).getByRole('rowheader')).toHaveTextContent('Total')
      expect(text(rows[5])).toContain('R$ 128.400')
      expect(text(rows[5])).toContain('100%')
      expect(table.closest('.or-chart__data')).toHaveAttribute('data-state', 'closed')
    })

    it('"Ver dados" mostra a tabela; defaultShowData começa aberta', async () => {
      const user = userEvent.setup()
      const { unmount } = renderChart()
      const toggle = screen.getByRole('button', { name: 'Ver dados' })
      await user.click(toggle)
      expect(toggle).toHaveAttribute('aria-expanded', 'true')
      expect(screen.getByRole('region', { name: 'Dados: Vendas por canal' })).toBeInTheDocument()
      unmount()
      renderChart({ defaultShowData: true })
      expect(screen.getByRole('button', { name: 'Ocultar dados' })).toHaveAttribute(
        'aria-expanded',
        'true',
      )
    })
  })

  describe('destaque por teclado, ponteiro e legenda', () => {
    it('setas percorrem as fatias, a região status anuncia e o resto recua', async () => {
      const user = userEvent.setup()
      const { container } = renderChart()
      await user.tab()
      expect(plot()).toHaveFocus()
      const status = screen.getByRole('status')
      expect(status).toBeEmptyDOMElement()

      await user.keyboard('{ArrowRight}')
      expect(status).toHaveTextContent('Site: R$ 48.200 (38%)')
      expect(slices(container)[0]).toHaveAttribute('data-emphasis', 'active')
      expect(slices(container)[1]).toHaveAttribute('data-emphasis', 'muted')
      expect(legendItems()[0]).toHaveAttribute('data-emphasis', 'active')
      expect(legendItems()[1]).toHaveAttribute('data-emphasis', 'muted')

      // ↓ e ↑ também percorrem (não há séries para trocar).
      await user.keyboard('{ArrowDown}')
      expect(status).toHaveTextContent('App: R$ 39.800 (31%)')
      await user.keyboard('{End}')
      expect(status).toHaveTextContent('Outros: R$ 3.800 (3%)')
      await user.keyboard('{ArrowUp}')
      expect(status).toHaveTextContent('Marketplace: R$ 12.200 (9%)')
      await user.keyboard('{Home}{ArrowLeft}')
      expect(status).toHaveTextContent('Site: R$ 48.200 (38%)')

      await user.keyboard('{Escape}')
      expect(status).toBeEmptyDOMElement()
      expect(slices(container)[0]).not.toHaveAttribute('data-emphasis')
    })

    it('com uma fatia em destaque, o centro troca o total pelo percentual dela', async () => {
      const user = userEvent.setup()
      const { container } = renderChart()
      plot().focus()
      const [totalFace] = container.querySelectorAll('.or-donut-chart__face')
      expect(totalFace).toHaveAttribute('data-state', 'open')
      await user.keyboard('{ArrowRight}{ArrowRight}')
      const sliceFace = container.querySelector('.or-donut-chart__face--slice')!
      expect(totalFace).toHaveAttribute('data-state', 'closed')
      expect(sliceFace).toHaveAttribute('data-state', 'open')
      expect(sliceFace).toHaveTextContent('31%')
      expect(sliceFace).toHaveTextContent('App')
    })

    it('sair do gráfico (blur) limpa o destaque do teclado', async () => {
      const user = userEvent.setup()
      const { container } = renderChart()
      plot().focus()
      await user.keyboard('{ArrowRight}')
      await user.tab()
      expect(screen.getByRole('button', { name: 'Ver dados' })).toHaveFocus()
      expect(slices(container)[0]).not.toHaveAttribute('data-emphasis')
    })

    it('passar o ponteiro na legenda destaca a fatia, sem anunciar', () => {
      const { container } = renderChart()
      fireEvent.pointerEnter(legendItems()[2])
      expect(slices(container)[2]).toHaveAttribute('data-emphasis', 'active')
      expect(slices(container)[0]).toHaveAttribute('data-emphasis', 'muted')
      expect(screen.getByRole('status')).toBeEmptyDOMElement()
      fireEvent.pointerLeave(screen.getByRole('list', { name: 'Legenda' }))
      expect(slices(container)[2]).not.toHaveAttribute('data-emphasis')
    })

    it('o ponteiro sobre o anel encontra a fatia pelo ângulo; no furo, limpa', async () => {
      const user = userEvent.setup()
      const { container } = renderChart()
      const svg = plot()
      svg.getBoundingClientRect = () =>
        ({ left: 0, top: 0, width: 200, height: 200, right: 200, bottom: 200 }) as DOMRect
      // Topo do anel (12h): primeira fatia. Lado esquerdo (9h, 75% da volta): Lojas físicas
      // ocupa de 68,5% a 87,5%.
      fireEvent.pointerMove(svg, { clientX: 100, clientY: 12 })
      expect(slices(container)[0]).toHaveAttribute('data-emphasis', 'active')
      fireEvent.pointerMove(svg, { clientX: 12, clientY: 100 })
      expect(slices(container)[2]).toHaveAttribute('data-emphasis', 'active')
      // Escape também fecha o destaque do ponteiro (WCAG 1.4.13).
      await user.keyboard('{Escape}')
      expect(slices(container)[2]).not.toHaveAttribute('data-emphasis')
      fireEvent.pointerMove(svg, { clientX: 12, clientY: 100 })
      fireEvent.pointerMove(svg, { clientX: 100, clientY: 100 })
      expect(slices(container)[2]).not.toHaveAttribute('data-emphasis')
    })
  })

  describe('geometria', () => {
    it('uma fatia por valor positivo; zero e negativos ficam fora do anel', () => {
      const { container } = renderChart({
        valueFormat: undefined,
        data: [
          { label: 'A', value: 3 },
          { label: 'B', value: 0 },
          { label: 'C', value: -2 },
          { label: 'D', value: 1 },
        ],
      })
      expect(slices(container)).toHaveLength(2)
      expect(legendItems()).toHaveLength(4)
      expect(text(legendItems()[1].querySelector('.or-donut-chart__share'))).toBe('0%')
      expect(text(legendItems()[3].querySelector('.or-donut-chart__share'))).toBe('25%')
    })

    it('uma única fatia vira um anel inteiro; height define o diâmetro', () => {
      const { container } = renderChart({ data: [data[0]], height: 160 })
      const [slice] = slices(container)
      expect(slice.getAttribute('d')!.match(/M/g)).toHaveLength(2)
      expect(slice).toHaveAttribute('fill-rule', 'evenodd')
      expect(plot()).toHaveAttribute('viewBox', '0 0 160 160')
      expect(container.querySelector('.or-donut-chart__ring')).toHaveStyle({ width: '160px' })
    })
  })

  describe('vazio', () => {
    it('sem dados mostra um aviso, sem imagem nem dica de teclado', () => {
      renderChart({ data: [] })
      expect(screen.getByRole('figure')).toHaveTextContent('Sem dados para exibir')
      expect(screen.queryByRole('img')).toBeNull()
      expect(screen.queryByRole('list', { name: 'Legenda' })).toBeNull()
    })

    it('todos os valores zerados também é vazio, mas a tabela mantém as linhas', () => {
      renderChart({
        data: [
          { label: 'Abertos', value: 0 },
          { label: 'Resolvidos', value: 0 },
        ],
      })
      expect(screen.getByRole('figure')).toHaveTextContent('Sem dados para exibir')
      expect(screen.queryByRole('img')).toBeNull()
      expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(3)
    })
  })

  describe('idioma e formatação', () => {
    it('en-US: separadores, percentuais e mensagens em inglês', () => {
      render(
        <OrangeProvider locale="en-US" themeTarget="scoped">
          <DonutChart title="Sales by channel" valueFormat={brl} data={data} />
        </OrangeProvider>,
      )
      const svg = screen.getByRole('img', { name: /^Donut chart: Sales by channel\./ })
      expect(svg.getAttribute('aria-label')).toContain('Total: R$128,400.')
      expect(svg.getAttribute('aria-label')).toContain('and Outros: R$3,800 (3%).')
      expect(screen.getByRole('list', { name: 'Legend' })).toBeInTheDocument()
      const table = screen.getByRole('table', { name: 'Data: Sales by channel' })
      expect(
        within(table)
          .getAllByRole('columnheader')
          .map((th) => th.textContent),
      ).toEqual(['Category', 'Value', 'Share'])
    })

    it('valueFormat como função', () => {
      renderChart({ valueFormat: (n) => `${n / 1000} mil` })
      expect(text(legendItems()[0])).toContain('48.2 mil')
    })
  })

  describe('movimento', () => {
    const original = window.matchMedia
    afterEach(() => {
      window.matchMedia = original
    })

    it('aguarda a entrada na tela para varrer o anel (máscara)', () => {
      const { container } = renderChart()
      expect(screen.getByRole('figure')).toHaveAttribute('data-motion', 'pending')
      const mask = container.querySelector('mask')!
      expect(mask.querySelector('.or-donut-chart__sweep')).toHaveAttribute('pathLength', '1')
      expect(container.querySelector('.or-donut-chart__slices')).toHaveAttribute(
        'mask',
        `url(#${mask.id})`,
      )
    })

    it('com movimento reduzido tudo fica desenhado, sem máscara', () => {
      window.matchMedia = ((q: string) => ({
        ...original(q),
        matches: q.includes('reduce'),
      })) as typeof window.matchMedia
      const { container } = renderChart()
      expect(screen.getByRole('figure')).toHaveAttribute('data-motion', 'static')
      expect(container.querySelector('mask')).toBeNull()
    })
  })

  it('não possui violações de acessibilidade', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <div>
        <DonutChart title="Vendas por canal" valueFormat={brl} data={data} />
        <DonutChart
          title="Tickets por status"
          centerLabel="tickets"
          variant="plain"
          data={[
            { label: 'Abertos', value: 42 },
            { label: 'Em andamento', value: 31 },
            { label: 'Resolvidos', value: 118 },
          ]}
        />
        <DonutChart title="Sem dados" data={[]} />
      </div>,
    )
    await user.click(screen.getAllByRole('button', { name: 'Ver dados' })[0])
    screen.getAllByRole('img')[0].focus()
    await user.keyboard('{ArrowRight}')
    await expectNoA11yViolations(container)
  })
})
