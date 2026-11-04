import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Calendar } from './Calendar'

const cell = (name: string | RegExp) => screen.getByRole('gridcell', { name })

describe('Calendar', () => {
  it('renderiza a grade do mês com cabeçalhos de dia da semana', () => {
    render(<Calendar defaultMonth={new Date(2026, 2, 1)} />)
    const grid = screen.getByRole('grid', { name: 'Março de 2026' })
    const headers = within(grid).getAllByRole('columnheader')
    expect(headers).toHaveLength(7)
    expect(headers[0]).toHaveTextContent('domingo')
    expect(within(grid).getAllByRole('row')).toHaveLength(7)
    expect(cell('domingo, 15 de março de 2026')).toHaveAttribute('tabindex', '-1')
    expect(cell('domingo, 1 de março de 2026')).toHaveAttribute('tabindex', '0')
  })

  it('respeita weekStartsOn', () => {
    render(<Calendar defaultMonth={new Date(2026, 2, 1)} weekStartsOn={1} />)
    expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent('segunda-feira')
  })

  it('seleciona um dia com clique (não controlado)', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Calendar defaultMonth={new Date(2026, 2, 1)} onChange={onChange} />)
    await user.click(cell(/^terça-feira, 10 de março/))
    expect(onChange).toHaveBeenCalledWith(new Date(2026, 2, 10))
    expect(cell(/^terça-feira, 10 de março/)).toHaveAttribute('aria-selected', 'true')
  })

  it('funciona como componente controlado', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [value, setValue] = useState<Date | null>(new Date(2026, 2, 15))
      return (
        <>
          <Calendar value={value} onChange={setValue} />
          <output>{value?.getDate()}</output>
        </>
      )
    }
    render(<Controlled />)
    expect(cell(/15 de março/)).toHaveAttribute('aria-selected', 'true')
    await user.click(cell(/20 de março/))
    expect(screen.getByRole('status')).toHaveTextContent('20')
    expect(cell(/15 de março/)).toHaveAttribute('aria-selected', 'false')
  })

  it('navega pelo teclado conforme o padrão grid', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Calendar defaultValue={new Date(2026, 2, 18)} onChange={onChange} />)
    cell(/18 de março/).focus()

    await user.keyboard('{ArrowRight}')
    expect(cell(/19 de março/)).toHaveFocus()
    expect(cell(/19 de março/)).toHaveAttribute('tabindex', '0')
    await user.keyboard('{ArrowDown}')
    expect(cell(/26 de março/)).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(cell(/25 de março/)).toHaveFocus()
    await user.keyboard('{ArrowUp}')
    expect(cell(/18 de março/)).toHaveFocus()
    await user.keyboard('{Home}')
    expect(cell(/^domingo, 15 de março/)).toHaveFocus()
    await user.keyboard('{End}')
    expect(cell(/^sábado, 21 de março/)).toHaveFocus()

    await user.keyboard('{PageDown}')
    expect(screen.getByRole('grid', { name: 'Abril de 2026' })).toBeInTheDocument()
    expect(cell(/21 de abril de 2026/)).toHaveFocus()
    await user.keyboard('{Shift>}{PageDown}{/Shift}')
    expect(cell(/21 de abril de 2027/)).toHaveFocus()
    await user.keyboard('{Shift>}{PageUp}{/Shift}{PageUp}')
    expect(cell(/21 de março de 2026/)).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 2, 21))
    await user.keyboard('{ArrowRight} ')
    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 2, 22))
  })

  it('setas atravessam os limites do mês', async () => {
    const user = userEvent.setup()
    render(<Calendar defaultValue={new Date(2026, 2, 31)} />)
    cell(/31 de março/).focus()
    await user.keyboard('{ArrowRight}')
    expect(cell(/, 1 de abril de 2026/)).toHaveFocus()
    expect(screen.getByRole('grid', { name: 'Abril de 2026' })).toBeInTheDocument()
  })

  it('botões de mês e ano mudam o mês exibido', async () => {
    const user = userEvent.setup()
    render(<Calendar defaultMonth={new Date(2026, 2, 1)} />)
    await user.click(screen.getByRole('button', { name: 'Próximo mês' }))
    expect(screen.getByRole('grid', { name: 'Abril de 2026' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Mês anterior' }))
    await user.click(screen.getByRole('button', { name: 'Mês anterior' }))
    expect(screen.getByRole('grid', { name: 'Fevereiro de 2026' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Próximo ano' }))
    expect(screen.getByRole('grid', { name: 'Fevereiro de 2027' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Ano anterior' }))
    expect(screen.getByRole('grid', { name: 'Fevereiro de 2026' })).toBeInTheDocument()
  })

  it('aplica min, max e isDateDisabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <Calendar
        defaultMonth={new Date(2026, 2, 10)}
        min={new Date(2026, 2, 5)}
        max={new Date(2026, 2, 25)}
        isDateDisabled={(d) => d.getDay() === 0}
        onChange={onChange}
      />,
    )
    expect(cell(/^quarta-feira, 4 de março/)).toHaveAttribute('aria-disabled', 'true')
    expect(cell(/26 de março/)).toHaveAttribute('aria-disabled', 'true')
    expect(cell(/^domingo, 8 de março/)).toHaveAttribute('aria-disabled', 'true')
    await user.click(cell(/^domingo, 8 de março/))
    await user.click(cell(/^quarta-feira, 4 de março/))
    expect(onChange).not.toHaveBeenCalled()

    expect(screen.getByRole('button', { name: 'Mês anterior' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Próximo mês' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
    await user.click(screen.getByRole('button', { name: 'Próximo mês' }))
    expect(screen.getByRole('grid', { name: 'Março de 2026' })).toBeInTheDocument()

    // o foco do teclado não sai do intervalo permitido
    cell(/^terça-feira, 10 de março/).focus()
    await user.keyboard('{PageUp}')
    expect(cell(/^quinta-feira, 5 de março/)).toHaveFocus()
  })

  it('destaca hoje com aria-current="date"', () => {
    render(<Calendar />)
    const today = screen.getByRole('grid').querySelector('[aria-current="date"]')
    expect(today).toHaveClass('or-calendar__day--today')
    expect(today).toHaveAttribute('tabindex', '0')
  })

  it('botão Hoje seleciona a data atual', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Calendar showTodayButton onChange={onChange} defaultMonth={new Date(2020, 0, 1)} />)
    await user.click(screen.getByRole('button', { name: 'Hoje' }))
    const now = new Date()
    expect(onChange).toHaveBeenCalledWith(
      new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    )
  })

  it('formata conforme o locale', () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <Calendar defaultMonth={new Date(2026, 2, 1)} />
      </OrangeProvider>,
    )
    expect(screen.getByRole('grid', { name: 'March 2026' })).toBeInTheDocument()
    expect(screen.getByRole('gridcell', { name: 'Sunday, March 15, 2026' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next month' })).toBeInTheDocument()
  })

  it('ao trocar de mês, a grade e o título animam na direção da navegação', async () => {
    const user = userEvent.setup()
    const { container } = render(<Calendar defaultValue={new Date(2026, 2, 18)} />)
    const body = () => container.querySelector('tbody') as HTMLElement
    // na montagem não há deslize
    expect(body()).not.toHaveClass('or-calendar__body--next')
    expect(body()).not.toHaveClass('or-calendar__body--prev')

    cell(/18 de março/).focus()
    await user.keyboard('{PageDown}')
    expect(body()).toHaveClass('or-calendar__body--next')
    const outgoing = container.querySelector('.or-calendar__title-text--out-next')
    expect(outgoing).toHaveTextContent('Março de 2026')
    expect(outgoing).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('.or-calendar__title-text--in-next')).toHaveTextContent('Abril de 2026')
    // o título que sai não entra no nome acessível
    expect(screen.getByRole('grid', { name: 'Abril de 2026' })).toBeInTheDocument()

    await user.keyboard('{PageUp}{PageUp}')
    expect(body()).toHaveClass('or-calendar__body--prev')
    expect(container.querySelector('.or-calendar__title-text--in-prev')).toHaveTextContent('Fevereiro de 2026')

    // mudar de dia dentro do mês mantém a mesma grade (sem nova animação)
    const current = body()
    await user.keyboard('{ArrowRight}')
    expect(body()).toBe(current)
  })

  it('o dia escolhido ganha o pop de seleção', async () => {
    const user = userEvent.setup()
    render(<Calendar defaultMonth={new Date(2026, 2, 1)} />)
    expect(cell(/10 de março/)).not.toHaveClass('or-calendar__day--pop')
    await user.click(cell(/10 de março/))
    expect(cell(/10 de março/)).toHaveClass('or-calendar__day--selected', 'or-calendar__day--pop')
    await user.click(cell(/12 de março/))
    expect(cell(/10 de março/)).not.toHaveClass('or-calendar__day--pop')
    expect(cell(/12 de março/)).toHaveClass('or-calendar__day--pop')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <Calendar defaultValue={new Date(2026, 2, 15)} min={new Date(2026, 2, 3)} showTodayButton />,
    )
    await expectNoA11yViolations(container)
  })
})
