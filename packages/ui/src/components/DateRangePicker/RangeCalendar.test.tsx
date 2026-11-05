import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { RangeCalendar } from './RangeCalendar'
import type { DateRange } from './rangeUtils'

const cell = (name: string | RegExp) => screen.getByRole('gridcell', { name })
const march = new Date(2026, 2, 1)

/** Simula uma tela larga (>= 768px) para o modo de dois meses. */
function mockWideScreen(matches: boolean) {
  return vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList,
  )
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('RangeCalendar', () => {
  it('renderiza a grade do mês, multisseleção e cada data uma vez só', () => {
    render(<RangeCalendar defaultMonth={march} />)
    const grid = screen.getByRole('grid', { name: 'Março de 2026' })
    expect(grid).toHaveAttribute('aria-multiselectable', 'true')
    expect(within(grid).getAllByRole('columnheader')).toHaveLength(7)
    expect(screen.getByRole('group', { name: 'Março de 2026' })).toBeInTheDocument()
    // dias de outros meses ficam vazios (sem data, sem nome)
    expect(screen.queryByRole('gridcell', { name: /de fevereiro/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('gridcell', { name: /de abril/ })).not.toBeInTheDocument()
    expect(grid.querySelectorAll('[data-date]')).toHaveLength(31)
    expect(cell('domingo, 1 de março de 2026')).toHaveAttribute('tabindex', '0')
  })

  it('primeiro clique marca o início, o segundo marca o fim (mouse)', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RangeCalendar defaultMonth={march} onChange={onChange} />)

    await user.click(cell(/^terça-feira, 10 de março/))
    expect(onChange).not.toHaveBeenCalled()
    expect(cell(/10 de março/)).toHaveAttribute('aria-selected', 'true')
    expect(cell(/10 de março/)).toHaveAccessibleDescription('início')
    expect(cell(/10 de março/)).toHaveClass('or-range-calendar__day--start')
    expect(screen.getByRole('status')).toHaveTextContent(
      'Início: 10 de março de 2026. Escolha a data final.',
    )

    await user.click(cell(/^domingo, 15 de março/))
    expect(onChange).toHaveBeenCalledWith({
      start: new Date(2026, 2, 10),
      end: new Date(2026, 2, 15),
    })
    for (const day of [10, 11, 12, 13, 14, 15]) {
      expect(cell(new RegExp(`, ${day} de março`))).toHaveAttribute('aria-selected', 'true')
    }
    expect(cell(/, 9 de março/)).toHaveAttribute('aria-selected', 'false')
    expect(cell(/, 16 de março/)).toHaveAttribute('aria-selected', 'false')
    expect(cell(/15 de março/)).toHaveAccessibleDescription('fim')
    expect(cell(/15 de março/)).toHaveClass('or-range-calendar__day--end')
    expect(cell(/12 de março/)).toHaveClass('or-range-calendar__day--in-range')
    expect(cell(/12 de março/)).not.toHaveAccessibleDescription()
    expect(screen.getByRole('status')).toHaveTextContent(
      'Período selecionado: 10 de março de 2026 a 15 de março de 2026.',
    )
  })

  it('troca início e fim quando a segunda data vem antes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RangeCalendar defaultMonth={march} onChange={onChange} />)
    await user.click(cell(/, 20 de março/))
    await user.click(cell(/, 5 de março/))
    expect(onChange).toHaveBeenCalledWith({
      start: new Date(2026, 2, 5),
      end: new Date(2026, 2, 20),
    })
    expect(cell(/, 5 de março/)).toHaveAccessibleDescription('início')
    expect(cell(/, 20 de março/)).toHaveAccessibleDescription('fim')
  })

  it('o mesmo dia duas vezes forma um período de um dia', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RangeCalendar defaultMonth={march} onChange={onChange} />)
    await user.click(cell(/, 10 de março/))
    await user.click(cell(/, 10 de março/))
    expect(onChange).toHaveBeenCalledWith({
      start: new Date(2026, 2, 10),
      end: new Date(2026, 2, 10),
    })
    expect(cell(/, 10 de março/)).toHaveAccessibleDescription('início fim')
  })

  it('mostra a prévia da faixa ao passar o mouse depois do início', async () => {
    const user = userEvent.setup()
    const { container } = render(<RangeCalendar defaultMonth={march} />)
    const root = container.firstElementChild as HTMLElement
    await user.hover(cell(/, 14 de março/))
    // sem início escolhido não há prévia
    expect(container.querySelector('.or-range-calendar__day--preview')).toBeNull()

    await user.click(cell(/, 10 de março/))
    await user.hover(cell(/, 14 de março/))
    for (const day of [10, 11, 12, 13, 14]) {
      expect(cell(new RegExp(`, ${day} de março`))).toHaveClass('or-range-calendar__day--preview')
    }
    expect(cell(/, 14 de março/)).toHaveClass('or-range-calendar__day--preview-edge')
    // a prévia não é seleção: só o início fica aria-selected
    expect(cell(/, 12 de março/)).toHaveAttribute('aria-selected', 'false')
    expect(cell(/, 10 de março/)).toHaveAttribute('aria-selected', 'true')
    expect(root).toHaveAttribute('data-preview', 'forward')

    await user.hover(cell(/, 6 de março/))
    expect(root).toHaveAttribute('data-preview', 'backward')
    expect(cell(/, 6 de março/)).toHaveClass('or-range-calendar__day--preview-edge')
    expect(cell(/, 10 de março/)).toHaveClass('or-range-calendar__day--end')
    expect(cell(/, 12 de março/)).not.toHaveClass('or-range-calendar__day--preview')

    await user.unhover(screen.getByRole('grid'))
    expect(container.querySelector('.or-range-calendar__day--preview-edge')).toBeNull()
  })

  it('seleciona e pré-visualiza pelo teclado conforme o padrão grid', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RangeCalendar defaultMonth={march} onChange={onChange} />)
    cell(/, 1 de março/).focus()
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowRight}{ArrowRight}{ArrowLeft}')
    expect(cell(/^segunda-feira, 16 de março/)).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(cell(/16 de março/)).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{ArrowDown}{ArrowUp}{ArrowDown}')
    expect(cell(/23 de março/)).toHaveFocus()
    // a prévia acompanha o foco
    expect(cell(/20 de março/)).toHaveClass('or-range-calendar__day--preview')
    await user.keyboard('{End}')
    expect(cell(/^sábado, 28 de março/)).toHaveFocus()
    await user.keyboard('{Home}')
    expect(cell(/^domingo, 22 de março/)).toHaveFocus()
    await user.keyboard('{PageDown}')
    expect(screen.getByRole('grid', { name: 'Abril de 2026' })).toBeInTheDocument()
    expect(cell(/22 de abril de 2026/)).toHaveFocus()
    await user.keyboard('{Shift>}{PageDown}{/Shift}')
    expect(cell(/22 de abril de 2027/)).toHaveFocus()
    await user.keyboard('{Shift>}{PageUp}{/Shift}{PageUp}')
    expect(cell(/22 de março de 2026/)).toHaveFocus()
    await user.keyboard(' ')
    expect(onChange).toHaveBeenCalledWith({
      start: new Date(2026, 2, 16),
      end: new Date(2026, 2, 22),
    })
  })

  it('Escape cancela o início pendente', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RangeCalendar defaultMonth={march} onChange={onChange} />)
    await user.click(cell(/, 10 de março/))
    await user.keyboard('{Escape}')
    expect(cell(/, 10 de março/)).toHaveAttribute('aria-selected', 'false')
    await user.click(cell(/, 12 de março/))
    await user.click(cell(/, 14 de março/))
    expect(onChange).toHaveBeenCalledWith({
      start: new Date(2026, 2, 12),
      end: new Date(2026, 2, 14),
    })
  })

  it('aplica min, max e isDateDisabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <RangeCalendar
        defaultMonth={march}
        min={new Date(2026, 2, 5)}
        max={new Date(2026, 2, 25)}
        isDateDisabled={(d) => d.getDay() === 0}
        onChange={onChange}
      />,
    )
    expect(cell(/, 4 de março/)).toHaveAttribute('aria-disabled', 'true')
    expect(cell(/, 26 de março/)).toHaveAttribute('aria-disabled', 'true')
    expect(cell(/^domingo, 8 de março/)).toHaveAttribute('aria-disabled', 'true')
    await user.click(cell(/, 4 de março/))
    await user.click(cell(/^domingo, 8 de março/))
    expect(cell(/, 4 de março/)).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByRole('button', { name: 'Mês anterior' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Próximo mês' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
    // um domingo desabilitado pode ficar no meio do período; só as pontas contam
    await user.click(cell(/, 6 de março/))
    await user.click(cell(/, 10 de março/))
    expect(onChange).toHaveBeenCalledWith({
      start: new Date(2026, 2, 6),
      end: new Date(2026, 2, 10),
    })
    // o foco do teclado não sai do intervalo permitido
    cell(/, 10 de março/).focus()
    await user.keyboard('{PageUp}')
    expect(cell(/^quinta-feira, 5 de março/)).toHaveFocus()
  })

  it('minLength e maxLength desabilitam datas depois do início', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RangeCalendar defaultMonth={march} minLength={2} maxLength={5} onChange={onChange} />)
    expect(cell(/, 11 de março/)).not.toHaveAttribute('aria-disabled')

    await user.click(cell(/, 10 de março/))
    // distância < 2 ou > 5 dias do início
    for (const day of [9, 11, 4, 16]) {
      expect(cell(new RegExp(`, ${day} de março`))).toHaveAttribute('aria-disabled', 'true')
    }
    for (const day of [5, 8, 12, 15]) {
      expect(cell(new RegExp(`, ${day} de março`))).not.toHaveAttribute('aria-disabled')
    }
    // o próprio início continua ativo (e não fecha um período de 0 dias)
    expect(cell(/, 10 de março/)).not.toHaveAttribute('aria-disabled')
    await user.click(cell(/, 11 de março/))
    await user.click(cell(/, 10 de março/))
    await user.click(cell(/, 16 de março/))
    expect(onChange).not.toHaveBeenCalled()

    await user.click(cell(/, 15 de março/))
    expect(onChange).toHaveBeenCalledWith({
      start: new Date(2026, 2, 10),
      end: new Date(2026, 2, 15),
    })
    // período confirmado: as restrições de comprimento somem até o próximo início
    expect(cell(/, 11 de março/)).not.toHaveAttribute('aria-disabled')
  })

  it('funciona como componente controlado e acompanha o valor externo', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [range, setRange] = useState<DateRange | null>({
        start: new Date(2026, 2, 3),
        end: new Date(2026, 2, 6),
      })
      return (
        <>
          <RangeCalendar value={range} onChange={setRange} />
          <button
            type="button"
            onClick={() => setRange({ start: new Date(2026, 6, 1), end: new Date(2026, 6, 4) })}
          >
            Julho
          </button>
          <output>
            {range?.start?.getDate()}–{range?.end?.getDate()}
          </output>
        </>
      )
    }
    const { container } = render(<Controlled />)
    expect(cell(/, 4 de março/)).toHaveAttribute('aria-selected', 'true')
    await user.click(cell(/, 20 de março/))
    await user.click(cell(/, 22 de março/))
    expect(container.querySelector('output')).toHaveTextContent('20–22')
    expect(cell(/, 4 de março/)).toHaveAttribute('aria-selected', 'false')

    await user.click(screen.getByRole('button', { name: 'Julho' }))
    expect(screen.getByRole('grid', { name: 'Julho de 2026' })).toBeInTheDocument()
    expect(cell(/, 2 de julho/)).toHaveAttribute('aria-selected', 'true')
  })

  it('valor só com início já espera a data final', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RangeCalendar defaultValue={{ start: new Date(2026, 2, 10), end: null }} onChange={onChange} />)
    expect(cell(/, 10 de março/)).toHaveAccessibleDescription('início')
    await user.click(cell(/, 13 de março/))
    expect(onChange).toHaveBeenCalledWith({
      start: new Date(2026, 2, 10),
      end: new Date(2026, 2, 13),
    })
  })

  it('as pontas entram com pop ao serem marcadas', async () => {
    const user = userEvent.setup()
    const { container } = render(<RangeCalendar defaultMonth={march} />)
    const mark = (day: number) =>
      cell(new RegExp(`, ${day} de março`)).querySelector('.or-range-calendar__mark')
    expect(container.querySelector('.or-range-calendar__mark--pop')).toBeNull()
    await user.click(cell(/, 10 de março/))
    expect(mark(10)).toHaveClass('or-range-calendar__mark--pop')
    await user.click(cell(/, 12 de março/))
    expect(mark(12)).toHaveClass('or-range-calendar__mark--pop')
    expect(mark(10)).not.toHaveClass('or-range-calendar__mark--pop')
  })

  describe('visibleMonths', () => {
    it('mostra dois meses lado a lado em telas largas', async () => {
      mockWideScreen(true)
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<RangeCalendar defaultMonth={march} visibleMonths={2} onChange={onChange} />)
      expect(screen.getAllByRole('grid')).toHaveLength(2)
      expect(screen.getByRole('grid', { name: 'Março de 2026' })).toBeInTheDocument()
      expect(screen.getByRole('grid', { name: 'Abril de 2026' })).toBeInTheDocument()
      // anterior só no primeiro mês, próximo só no último
      expect(screen.getAllByRole('button', { name: 'Mês anterior' })).toHaveLength(1)
      expect(screen.getAllByRole('button', { name: 'Próximo mês' })).toHaveLength(1)
      // só um dia tabulável entre as duas grades
      expect(document.querySelectorAll('[role="gridcell"][tabindex="0"]')).toHaveLength(1)

      // período atravessando os dois meses
      await user.click(cell(/, 28 de março/))
      await user.hover(cell(/, 3 de abril/))
      expect(cell(/, 31 de março/)).toHaveClass('or-range-calendar__day--preview')
      expect(cell(/, 1 de abril/)).toHaveClass('or-range-calendar__day--preview')
      await user.click(cell(/, 3 de abril/))
      expect(onChange).toHaveBeenCalledWith({
        start: new Date(2026, 2, 28),
        end: new Date(2026, 3, 3),
      })

      // o teclado passa para o 2º mês sem trocar a visão; depois dele, avança um mês
      cell(/, 3 de abril/).focus()
      await user.keyboard('{PageDown}')
      expect(cell(/, 3 de maio/)).toHaveFocus()
      expect(screen.getByRole('grid', { name: 'Abril de 2026' })).toBeInTheDocument()
      expect(screen.getByRole('grid', { name: 'Maio de 2026' })).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Mês anterior' }))
      expect(screen.getByRole('grid', { name: 'Março de 2026' })).toBeInTheDocument()
      expect(screen.getByRole('grid', { name: 'Abril de 2026' })).toBeInTheDocument()
    })

    it('mostra um mês só em telas estreitas', () => {
      mockWideScreen(false)
      render(<RangeCalendar defaultMonth={march} visibleMonths={2} />)
      expect(screen.getAllByRole('grid')).toHaveLength(1)
    })
  })

  it('formata conforme o locale', async () => {
    const user = userEvent.setup()
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <RangeCalendar defaultMonth={march} />
      </OrangeProvider>,
    )
    expect(screen.getByRole('grid', { name: 'March 2026' })).toBeInTheDocument()
    await user.click(screen.getByRole('gridcell', { name: 'Tuesday, March 10, 2026' }))
    expect(screen.getByRole('gridcell', { name: 'Tuesday, March 10, 2026' })).toHaveAccessibleDescription(
      'start',
    )
    expect(screen.getByRole('status')).toHaveTextContent('Start: March 10, 2026. Choose the end date.')
  })

  it('não possui violações de acessibilidade', async () => {
    mockWideScreen(true)
    const user = userEvent.setup()
    const { container } = render(
      <RangeCalendar
        visibleMonths={2}
        defaultValue={{ start: new Date(2026, 2, 10), end: new Date(2026, 2, 15) }}
        min={new Date(2026, 2, 3)}
      />,
    )
    await expectNoA11yViolations(container)
    await user.click(cell(/, 20 de março/))
    await user.hover(cell(/, 24 de março/))
    await expectNoA11yViolations(container)
  })
})
