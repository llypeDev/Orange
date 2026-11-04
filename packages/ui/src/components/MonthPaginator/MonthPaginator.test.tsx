import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { MonthPaginator, type YearMonth } from './MonthPaginator'

describe('MonthPaginator', () => {
  it('renderiza o grupo, os botões e o rótulo em região live', () => {
    render(<MonthPaginator defaultValue={{ year: 2026, month: 2 }} />)
    expect(screen.getByRole('group', { name: 'Navegação por mês' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mês anterior' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Próximo mês' })).toBeInTheDocument()
    const label = screen.getByText('Março de 2026')
    expect(label.closest('[aria-live]')).toHaveAttribute('aria-live', 'polite')
    expect(label).toHaveAttribute('datetime', '2026-03')
  })

  it('navega com mouse e teclado, atravessando a virada do ano', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<MonthPaginator defaultValue={{ year: 2026, month: 11 }} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Próximo mês' }))
    expect(screen.getByText('Janeiro de 2027')).toBeInTheDocument()
    expect(onChange).toHaveBeenLastCalledWith({ year: 2027, month: 0 })

    screen.getByRole('button', { name: 'Mês anterior' }).focus()
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    expect(screen.getByText('Novembro de 2026')).toBeInTheDocument()
    expect(onChange).toHaveBeenLastCalledWith({ year: 2026, month: 10 })
  })

  it('controlado: segue o value do estado', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [month, setMonth] = useState<YearMonth>({ year: 2026, month: 5 })
      return (
        <>
          <MonthPaginator value={month} onChange={setMonth} />
          <button type="button" onClick={() => setMonth({ year: 2026, month: 0 })}>
            Início do ano
          </button>
        </>
      )
    }
    render(<Controlled />)
    expect(screen.getByText('Junho de 2026')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Início do ano' }))
    expect(screen.getByText('Janeiro de 2026')).toBeInTheDocument()
  })

  it('min e max deixam os limites indisponíveis sem perder o foco', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <MonthPaginator
        defaultValue={{ year: 2026, month: 1 }}
        min={{ year: 2026, month: 0 }}
        max={{ year: 2026, month: 2 }}
        onChange={onChange}
      />,
    )
    const previous = screen.getByRole('button', { name: 'Mês anterior' })
    const next = screen.getByRole('button', { name: 'Próximo mês' })
    await user.click(previous)
    expect(previous).toHaveAttribute('aria-disabled', 'true')
    expect(previous).toHaveFocus()
    await user.click(previous)
    expect(screen.getByText('Janeiro de 2026')).toBeInTheDocument()
    expect(onChange).toHaveBeenCalledTimes(1)

    await user.click(next)
    await user.click(next)
    expect(next).toHaveAttribute('aria-disabled', 'true')
    await user.click(next)
    expect(screen.getByText('Março de 2026')).toBeInTheDocument()
  })

  it('o rótulo desliza na direção da navegação com crossfade do mês anterior', async () => {
    const user = userEvent.setup()
    const { container } = render(<MonthPaginator defaultValue={{ year: 2026, month: 2 }} />)
    expect(container.querySelector('[class*="or-month-paginator__text--"]')).toBeNull()

    await user.click(screen.getByRole('button', { name: 'Próximo mês' }))
    expect(screen.getByText('Abril de 2026')).toHaveClass('or-month-paginator__text--in-next')
    const outgoing = container.querySelector('.or-month-paginator__text--out-next')
    expect(outgoing).toHaveTextContent('Março de 2026')
    expect(outgoing).toHaveAttribute('aria-hidden', 'true')

    await user.click(screen.getByRole('button', { name: 'Mês anterior' }))
    expect(screen.getByText('Março de 2026', { selector: 'time' })).toHaveClass(
      'or-month-paginator__text--in-prev',
    )
    expect(container.querySelector('.or-month-paginator__text--out-prev')).toHaveTextContent(
      'Abril de 2026',
    )
  })

  it('desabilitado ignora cliques', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<MonthPaginator defaultValue={{ year: 2026, month: 2 }} disabled onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Próximo mês' }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('formata conforme o locale e aceita aria-label próprio', () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <MonthPaginator
          defaultValue={{ year: 2026, month: 2 }}
          aria-label="Statement month"
          monthFormat="short"
        />
      </OrangeProvider>,
    )
    expect(screen.getByRole('group', { name: 'Statement month' })).toBeInTheDocument()
    expect(screen.getByText('Mar 2026')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next month' })).toBeInTheDocument()
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <MonthPaginator defaultValue={{ year: 2026, month: 2 }} min={{ year: 2026, month: 2 }} />
        <MonthPaginator
          defaultValue={{ year: 2026, month: 2 }}
          size="sm"
          disabled
          aria-label="Mês da fatura"
        />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
