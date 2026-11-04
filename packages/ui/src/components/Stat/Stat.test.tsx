import { render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Stat, StatGroup } from './Stat'

describe('Stat', () => {
  it('sozinho renderiza um <dl> com termo e definição', () => {
    const { container } = render(<Stat label="Receita mensal" value="R$ 48,2 mil" />)
    const dl = container.querySelector('dl')!
    expect(dl).toHaveClass('or-stat', 'or-stat--md')
    expect(within(dl).getByRole('term')).toHaveTextContent('Receita mensal')
    expect(within(dl).getByRole('definition')).toHaveTextContent('R$ 48,2 mil')
  })

  it('mostra a variação com seta e texto acessível', () => {
    const { container } = render(
      <Stat label="Pedidos" value="1.284" delta="12%" trend="increase" help="vs. mês anterior" />,
    )
    const delta = container.querySelector('.or-stat__delta')!
    expect(delta).toHaveClass('or-stat__delta--positive')
    expect(delta.querySelector('[data-icon="arrow-up"]')).toHaveAttribute('aria-hidden', 'true')
    expect(delta).toHaveTextContent('aumento de 12%')
    expect(screen.getByText('vs. mês anterior')).toHaveClass('or-stat__help')
  })

  it('queda é negativa por padrão; deltaTone inverte para métricas como churn', () => {
    const { container, rerender } = render(<Stat label="Ticket médio" value="R$ 182" delta="3,1%" trend="decrease" />)
    expect(container.querySelector('.or-stat__delta')).toHaveClass('or-stat__delta--negative')
    expect(container.querySelector('.or-stat__delta')).toHaveTextContent('queda de 3,1%')
    rerender(<Stat label="Churn" value="2,4%" delta="0,6 p.p." trend="decrease" deltaTone="positive" />)
    expect(container.querySelector('.or-stat__delta')).toHaveClass('or-stat__delta--positive')
    rerender(<Stat label="NPS" value="72" delta="0" trend="neutral" />)
    expect(container.querySelector('.or-stat__delta')).toHaveTextContent('variação de 0')
    expect(container.querySelector('[data-icon="minus"]')).not.toBeNull()
  })

  it('traduz o texto da variação', () => {
    const { container } = render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <Stat label="Revenue" value="$48.2k" delta="12%" trend="increase" />
      </OrangeProvider>,
    )
    expect(container.querySelector('.or-stat__delta')).toHaveTextContent('increase of 12%')
  })
})

describe('Stat animate', () => {
  const OriginalIO = window.IntersectionObserver
  afterEach(() => {
    window.IntersectionObserver = OriginalIO
    vi.unstubAllGlobals()
  })

  function mockInView() {
    class InstantObserver {
      constructor(private callback: IntersectionObserverCallback) {}
      observe(target: Element) {
        this.callback([{ isIntersecting: true, target } as IntersectionObserverEntry], this as unknown as IntersectionObserver)
      }
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return []
      }
    }
    window.IntersectionObserver = InstantObserver as unknown as typeof IntersectionObserver
  }

  it('antes de entrar na tela mostra zero, mas o leitor de tela lê o valor final', () => {
    const { container } = render(<Stat animate label="Receita" value="R$ 48,2 mil" delta="12%" trend="increase" />)
    const valueEl = container.querySelector('.or-stat__value')!
    expect(valueEl).toHaveAttribute('data-counting')
    expect(valueEl.querySelector('.or-stat__value-count')).toHaveAttribute('aria-hidden', 'true')
    expect(valueEl.querySelector('.or-stat__value-count')).toHaveTextContent('R$ 0,0 mil')
    expect(valueEl.querySelector('.or-stat__value-final')).toHaveTextContent('R$ 48,2 mil')
    expect(container.querySelector('dl')).toHaveAttribute('data-animate')
    expect(container.querySelector('dl')).not.toHaveAttribute('data-inview')
  })

  it('interpola todos os números do texto com os separadores do idioma', () => {
    const { container, rerender } = render(<Stat animate label="Tempo" value="1h 12min" />)
    expect(container.querySelector('.or-stat__value-count')).toHaveTextContent('0h 0min')
    rerender(<Stat animate label="Pedidos" value={12840} />)
    expect(container.querySelector('.or-stat__value-final')).toHaveTextContent('12.840')
    expect(container.querySelector('.or-stat__value-count')).toHaveTextContent(/^0$/)
  })

  it('ao entrar na tela conta até o valor final e remove a camada animada', async () => {
    mockInView()
    // jsdom usa outro relógio no timestamp do rAF; aqui ele segue performance.now()
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => window.setTimeout(() => cb(performance.now()), 16))
    vi.stubGlobal('cancelAnimationFrame', (id: number) => window.clearTimeout(id))
    const { container } = render(
      <Stat animate label="Pedidos" value={1284} format={(n) => `${Math.round(n)} pedidos`} />,
    )
    expect(container.querySelector('dl')).toHaveAttribute('data-inview')
    await waitFor(() => expect(container.querySelector('.or-stat__value-count')).toBeNull(), { timeout: 3000 })
    expect(container.querySelector('.or-stat__value')).toHaveTextContent('1284 pedidos')
    expect(container.querySelector('.or-stat__value')).not.toHaveAttribute('data-counting')
  })

  it('sem animate não usa a camada de contagem', () => {
    const { container } = render(<Stat label="NPS" value="72" />)
    expect(container.querySelector('.or-stat__value-count')).toBeNull()
    expect(container.querySelector('dl')).not.toHaveAttribute('data-animate')
  })
})

describe('StatGroup', () => {
  it('agrupa os Stats em um único <dl> com colunas', () => {
    const { container } = render(
      <StatGroup aria-label="Resumo de vendas" size="lg">
        <Stat label="Receita" value="R$ 48,2 mil" />
        <Stat label="Pedidos" value="1.284" />
        <Stat label="Conversão" value="3,8%" />
      </StatGroup>,
    )
    expect(container.querySelectorAll('dl')).toHaveLength(1)
    const list = container.querySelector('dl')!
    expect(list.style.getPropertyValue('--_cols')).toBe('3')
    expect(list.style.getPropertyValue('--_cols-md')).toBe('2')
    expect(within(list).getAllByRole('term')).toHaveLength(3)
    expect(list.querySelector('.or-stat')!.tagName).toBe('DIV')
    expect(list.querySelector('.or-stat')).toHaveClass('or-stat--lg')
  })

  it('respeita columns', () => {
    const { container } = render(
      <StatGroup columns={2}>
        <Stat label="A" value="1" />
        <Stat label="B" value="2" />
        <Stat label="C" value="3" />
        <Stat label="D" value="4" />
        <Stat label="E" value="5" />
      </StatGroup>,
    )
    expect(container.querySelector('dl')!.style.getPropertyValue('--_cols')).toBe('2')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <StatGroup>
          <Stat label="Receita" value="R$ 48,2 mil" delta="12%" trend="increase" help="vs. setembro" />
          <Stat label="Churn" value="2,4%" delta="0,6 p.p." trend="decrease" deltaTone="positive" />
          <Stat label="NPS" value="72" />
        </StatGroup>
        <Stat label="Usuários ativos" value="8.930" size="sm" />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
