import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { RelativeTime } from './RelativeTime'

const NOW = new Date(2026, 10, 3, 14, 0, 0) // 3 nov. 2026, 14:00 (horário local)
const minutesAgo = (n: number) => new Date(NOW.getTime() - n * 60_000)
const daysAgo = (n: number) => new Date(NOW.getTime() - n * 86_400_000)

/** Avança o relógio em passos, deixando o React reagendar o próximo timer a cada passo. */
function tick(total: number, step = 5_000) {
  for (let elapsed = 0; elapsed < total; elapsed += step) {
    act(() => {
      vi.advanceTimersByTime(step)
    })
  }
}

describe('RelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(NOW)
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renderiza <time dateTime> com texto relativo em português', () => {
    const date = minutesAgo(5)
    render(<RelativeTime date={date} />)
    const time = screen.getByText('há 5 minutos')
    expect(time.tagName).toBe('TIME')
    expect(time).toHaveAttribute('datetime', date.toISOString())
    expect(time).toHaveClass('or-relative-time')
  })

  it('usa o locale do provider', () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <RelativeTime date={minutesAgo(5)} />
      </OrangeProvider>,
    )
    expect(screen.getByText('5 minutes ago')).toBeInTheDocument()
  })

  it('escolhe a unidade adequada e expressões naturais com numeric="auto"', () => {
    const { rerender } = render(<RelativeTime date={new Date(NOW.getTime() - 10_000)} />)
    expect(screen.getByRole('time')).toHaveTextContent('agora')
    rerender(<RelativeTime date={new Date(NOW.getTime() - 3 * 3_600_000)} />)
    expect(screen.getByRole('time')).toHaveTextContent('há 3 horas')
    rerender(<RelativeTime date={daysAgo(1)} />)
    expect(screen.getByRole('time')).toHaveTextContent('ontem')
    rerender(<RelativeTime date={new Date(NOW.getTime() + 2 * 86_400_000)} />)
    expect(screen.getByRole('time')).toHaveTextContent('depois de amanhã')
    rerender(<RelativeTime date={daysAgo(1)} numeric="always" />)
    expect(screen.getByRole('time')).toHaveTextContent('há 1 dia')
    rerender(<RelativeTime date={daysAgo(60)} format="relative" />)
    expect(screen.getByRole('time')).toHaveTextContent('há 2 meses')
    rerender(<RelativeTime date={daysAgo(800)} format="relative" />)
    expect(screen.getByRole('time')).toHaveTextContent('há 2 anos')
  })

  it('formato auto vira absoluto depois do limite de dias', () => {
    const { rerender } = render(<RelativeTime date={daysAgo(3)} />)
    expect(screen.getByRole('time')).toHaveTextContent('há 3 dias')
    rerender(<RelativeTime date={daysAgo(10)} />)
    expect(screen.getByRole('time')).toHaveTextContent(/24 de out\.? de 2026/)
    rerender(<RelativeTime date={daysAgo(10)} threshold={30} />)
    expect(screen.getByRole('time')).toHaveTextContent('semana passada')
    rerender(<RelativeTime date={daysAgo(20)} threshold={30} />)
    expect(screen.getByRole('time')).toHaveTextContent('há 3 semanas')
  })

  it('formato absoluto aceita absoluteFormat', () => {
    render(<RelativeTime date={minutesAgo(5)} format="absolute" absoluteFormat={{ day: '2-digit', month: '2-digit' }} />)
    expect(screen.getByRole('time')).toHaveTextContent('03/11')
  })

  it('mostra a data completa no title (desligável)', () => {
    const { rerender } = render(<RelativeTime date={minutesAgo(5)} />)
    expect(screen.getByRole('time').getAttribute('title')).toMatch(/terça-feira, 3 de novembro de 2026/)
    rerender(<RelativeTime date={minutesAgo(5)} showTitle={false} />)
    expect(screen.getByRole('time')).not.toHaveAttribute('title')
  })

  it('atualiza o texto periodicamente', () => {
    render(<RelativeTime date={new Date(NOW.getTime() - 30_000)} />)
    expect(screen.getByRole('time')).toHaveTextContent('agora')
    tick(30_000)
    expect(screen.getByRole('time')).toHaveTextContent('há 1 minuto')
    tick(5 * 60_000, 30_000)
    expect(screen.getByRole('time')).toHaveTextContent('há 6 minutos')
  })

  it('respeita updateInterval fixo e updateInterval={false}', () => {
    const { unmount } = render(<RelativeTime date={minutesAgo(1)} updateInterval={false} />)
    act(() => {
      vi.advanceTimersByTime(10 * 60_000)
    })
    expect(screen.getByRole('time')).toHaveTextContent('há 1 minuto')
    unmount()
    vi.setSystemTime(NOW)
    render(<RelativeTime date={minutesAgo(1)} updateInterval={120_000} />)
    act(() => {
      vi.advanceTimersByTime(60_000)
    })
    expect(screen.getByRole('time')).toHaveTextContent('há 1 minuto')
    act(() => {
      vi.advanceTimersByTime(60_000)
    })
    expect(screen.getByRole('time')).toHaveTextContent('há 3 minutos')
  })

  it('aceita string ISO, AAAA-MM-DD local e timestamp', () => {
    const { rerender } = render(<RelativeTime date={minutesAgo(10).toISOString()} />)
    expect(screen.getByRole('time')).toHaveTextContent('há 10 minutos')
    rerender(<RelativeTime date="2026-11-02" numeric="always" format="relative" />)
    expect(screen.getByRole('time')).toHaveAttribute('datetime', new Date(2026, 10, 2).toISOString())
    rerender(<RelativeTime date={minutesAgo(2).getTime()} />)
    expect(screen.getByRole('time')).toHaveTextContent('há 2 minutos')
  })

  it('data inválida exibe o valor original sem dateTime', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(<RelativeTime date="ontem à noite" />)
    const time = screen.getByText('ontem à noite')
    expect(time).not.toHaveAttribute('datetime')
    warn.mockRestore()
  })

  it('não possui violações de acessibilidade', async () => {
    vi.useRealTimers()
    const { container } = render(
      <p>
        Atualizado <RelativeTime date={new Date(Date.now() - 5 * 60_000)} />
      </p>,
    )
    await expectNoA11yViolations(container)
  })
})
