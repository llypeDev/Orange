import { act, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Icon } from '../../icons'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Timeline, TimelineItem } from './Timeline'

function OrderHistory({ animated }: { animated?: boolean }) {
  return (
    <Timeline aria-label="Histórico do pedido" animated={animated}>
      <TimelineItem date="2026-03-02" title="Pedido realizado" tone="success" description="Pagamento aprovado." />
      <TimelineItem date="2026-03-03" title="Em separação" tone="success" />
      <TimelineItem date="2026-03-05" title="Saiu para entrega" current />
      <TimelineItem dateLabel="Previsto" title="Entregue" />
    </Timeline>
  )
}

type IOCallback = (entries: Partial<IntersectionObserverEntry>[]) => void

/** IntersectionObserver controlável: `enter()` simula a entrada na viewport. */
function mockIntersectionObserver() {
  const callbacks: IOCallback[] = []
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(cb: IOCallback) {
        callbacks.push(cb)
      }
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return []
      }
    },
  )
  return { enter: () => act(() => callbacks.forEach((cb) => cb([{ isIntersecting: true }]))) }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Timeline', () => {
  it('renderiza uma lista ordenada com um item por evento', () => {
    render(<OrderHistory />)
    const list = screen.getByRole('list', { name: 'Histórico do pedido' })
    expect(list.tagName).toBe('OL')
    expect(list).toHaveClass('or-timeline', 'or-timeline--default')
    expect(within(list).getAllByRole('listitem')).toHaveLength(4)
  })

  it('usa <time dateTime> com a data formatada no locale do provider (sem deslocar o fuso)', () => {
    const { container } = render(<OrderHistory />)
    const times = container.querySelectorAll('time')
    expect(times).toHaveLength(3)
    expect(times[0]).toHaveAttribute('datetime', '2026-03-02')
    expect(times[0]).toHaveTextContent(/2 de mar\.? de 2026/)
  })

  it('formata em inglês e aceita dateFormat na Timeline e no item', () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <Timeline dateFormat={{ month: 'long', year: 'numeric' }}>
          <TimelineItem date="2026-03-02" title="A" />
          <TimelineItem date={new Date(2026, 4, 10)} title="B" dateFormat={{ day: '2-digit', month: '2-digit' }} />
        </Timeline>
      </OrangeProvider>,
    )
    expect(screen.getByText('March 2026').tagName).toBe('TIME')
    expect(screen.getByText('05/10')).toHaveAttribute('datetime', new Date(2026, 4, 10).toISOString())
  })

  it('dateLabel substitui o texto; sem data válida não há <time>', () => {
    render(
      <Timeline>
        <TimelineItem dateLabel="Previsto" title="Entrega" />
        <TimelineItem date="data inválida" title="Sem data" />
      </Timeline>,
    )
    expect(screen.getByText('Previsto').tagName).toBe('SPAN')
    expect(document.querySelector('time')).toBeNull()
  })

  it('marca o item atual com aria-current="step"', () => {
    render(<OrderHistory />)
    const current = screen.getByText('Saiu para entrega').closest('li')!
    expect(current).toHaveAttribute('aria-current', 'step')
    expect(current).toHaveClass('or-timeline__item--current')
    expect(screen.getByText('Pedido realizado').closest('li')).not.toHaveAttribute('aria-current')
  })

  it('aplica tom, ícone, variante alternada e elemento do título', () => {
    render(
      <Timeline variant="alternate">
        <TimelineItem title="Deploy" titleAs="h3" tone="danger" icon={<Icon name="rocket" />} />
      </Timeline>,
    )
    expect(screen.getByRole('list')).toHaveClass('or-timeline--alternate')
    const heading = screen.getByRole('heading', { level: 3, name: 'Deploy' })
    const item = heading.closest('li')!
    expect(item).toHaveClass('or-timeline__item--danger', 'or-timeline__item--with-icon')
    expect(item.querySelector('.or-timeline__marker')).toHaveAttribute('aria-hidden', 'true')
  })

  it('o marcador do item atual pulsa (or-pulse); pulse controla o efeito', () => {
    render(
      <Timeline>
        <TimelineItem title="Concluído" tone="success" />
        <TimelineItem title="Em andamento" current />
        <TimelineItem title="Ao vivo" pulse tone="info" />
        <TimelineItem title="Atual sem pulso" current pulse={false} />
      </Timeline>,
    )
    const marker = (title: string) => screen.getByText(title).closest('li')!.querySelector('.or-timeline__marker')
    expect(marker('Concluído')).not.toHaveClass('or-pulse')
    expect(marker('Em andamento')).toHaveClass('or-pulse')
    expect(marker('Ao vivo')).toHaveClass('or-pulse')
    expect(marker('Atual sem pulso')).not.toHaveClass('or-pulse')
  })

  it('animated esconde os itens até a timeline entrar na viewport', async () => {
    const io = mockIntersectionObserver()
    render(<OrderHistory animated />)
    const list = screen.getByRole('list')
    expect(list).toHaveAttribute('data-reveal', 'hidden')
    // conteúdo continua no DOM e acessível enquanto escondido visualmente
    expect(within(list).getAllByRole('listitem')).toHaveLength(4)
    io.enter()
    await waitFor(() => expect(list).toHaveAttribute('data-reveal', 'shown'))
  })

  it('sem animated (padrão) ou com movimento reduzido, não esconde nada', () => {
    const matchMedia = vi.spyOn(window, 'matchMedia').mockImplementation(
      (query: string) =>
        ({
          matches: query.includes('reduce'),
          media: query,
          addEventListener: () => {},
          removeEventListener: () => {},
        }) as unknown as MediaQueryList,
    )
    const { rerender } = render(<OrderHistory />)
    expect(screen.getByRole('list')).not.toHaveAttribute('data-reveal')
    rerender(<OrderHistory animated />)
    expect(screen.getByRole('list')).not.toHaveAttribute('data-reveal')
    matchMedia.mockRestore()
  })

  it('renderiza children no corpo do evento', () => {
    render(
      <Timeline>
        <TimelineItem title="Comentário">
          <a href="#ticket">Ver chamado</a>
        </TimelineItem>
      </Timeline>,
    )
    expect(screen.getByRole('link', { name: 'Ver chamado' }).closest('.or-timeline__body')).not.toBeNull()
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <OrderHistory />
        <Timeline variant="alternate">
          <TimelineItem date="2026-01-10" title="v2.0" icon={<Icon name="tag" />} tone="accent" />
          <TimelineItem date="2026-02-14" title="v2.1" />
        </Timeline>
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
