import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { DateRangePicker } from './DateRangePicker'
import type { DateRange } from './rangeUtils'

const startInput = () => screen.getByRole('textbox', { name: 'Data inicial' })
const endInput = () => screen.getByRole('textbox', { name: 'Data final' })
const cell = (name: string | RegExp) => screen.getByRole('gridcell', { name })
const today = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}
const march = { start: new Date(2026, 2, 10), end: new Date(2026, 2, 15) }

async function openCalendar(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /período/ }))
  return screen.findByRole('dialog', { name: 'Escolher período' })
}

describe('DateRangePicker', () => {
  it('agrupa os dois campos sob o rótulo, cada um com nome próprio', () => {
    render(<DateRangePicker label="Período do relatório" description="Até 90 dias." />)
    const group = screen.getByRole('group', { name: 'Período do relatório' })
    expect(within(group).getAllByRole('textbox')).toHaveLength(2)
    expect(startInput()).toHaveAttribute('placeholder', 'dd/mm/aaaa')
    expect(startInput()).toHaveAttribute('inputmode', 'numeric')
    expect(startInput()).toHaveAccessibleDescription('Até 90 dias. Formato: dd/mm/aaaa')
    expect(endInput()).toHaveAccessibleDescription('Até 90 dias. Formato: dd/mm/aaaa')
    const button = screen.getByRole('button', { name: 'Escolher período' })
    expect(button).toHaveAttribute('aria-haspopup', 'dialog')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    // o rótulo leva ao primeiro campo
    expect(screen.getByText('Período do relatório')).toHaveAttribute('for', startInput().id)
  })

  it('digitar as duas datas aplica a máscara e emite o período', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DateRangePicker label="Período" onChange={onChange} />)
    await user.type(startInput(), '10032026')
    expect(startInput()).toHaveValue('10/03/2026')
    expect(onChange).toHaveBeenLastCalledWith({ start: new Date(2026, 2, 10), end: null })
    await user.type(endInput(), '15/3/2026')
    expect(endInput()).toHaveValue('15/03/2026')
    expect(onChange).toHaveBeenLastCalledWith(march)
    expect(
      screen.getByRole('button', {
        name: 'Alterar período, 10 de março de 2026 a 15 de março de 2026',
      }),
    ).toBeInTheDocument()
    // cada tecla de um campo incompleto não reemite o mesmo período
    expect(onChange).toHaveBeenCalledTimes(2)
  })

  it('usa mm/dd/yyyy e textos em inglês em en-US', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <DateRangePicker label="Billing period" onChange={onChange} />
      </OrangeProvider>,
    )
    const start = screen.getByRole('textbox', { name: 'Start date' })
    expect(start).toHaveAttribute('placeholder', 'mm/dd/yyyy')
    await user.type(start, '03102026')
    await user.type(screen.getByRole('textbox', { name: 'End date' }), '03152026')
    expect(onChange).toHaveBeenLastCalledWith(march)
    expect(
      screen.getByRole('button', { name: 'Change date range, March 10, 2026 to March 15, 2026' }),
    ).toBeInTheDocument()
  })

  it('valida fim antes do início no Field e não emite o fim', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DateRangePicker label="Período" onChange={onChange} />)
    await user.type(startInput(), '20032026')
    await user.type(endInput(), '10032026')
    expect(screen.getByText('A data final deve ser igual ou posterior à inicial.')).toBeInTheDocument()
    expect(endInput()).toHaveAttribute('aria-invalid', 'true')
    expect(startInput()).not.toHaveAttribute('aria-invalid')
    expect(endInput()).toHaveAccessibleDescription(
      'A data final deve ser igual ou posterior à inicial. Formato: dd/mm/aaaa',
    )
    expect(onChange).toHaveBeenLastCalledWith({ start: new Date(2026, 2, 20), end: null })

    // corrigir o início resolve o erro e completa o período
    await user.clear(startInput())
    await user.type(startInput(), '01032026')
    expect(screen.queryByText(/data final deve ser/)).not.toBeInTheDocument()
    expect(onChange).toHaveBeenLastCalledWith({
      start: new Date(2026, 2, 1),
      end: new Date(2026, 2, 10),
    })
  })

  it('valida minLength e maxLength com mensagens no plural certo', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { rerender } = render(
      <DateRangePicker label="Estadia" minLength={1} maxLength={14} onChange={onChange} />,
    )
    await user.type(startInput(), '10032026')
    await user.type(endInput(), '10032026')
    expect(screen.getByText('O período deve ter no mínimo 1 dia.')).toBeInTheDocument()
    expect(onChange).toHaveBeenLastCalledWith({ start: new Date(2026, 2, 10), end: null })

    await user.clear(endInput())
    await user.type(endInput(), '30032026')
    expect(screen.getByText('O período deve ter no máximo 14 dias.')).toBeInTheDocument()

    rerender(<DateRangePicker label="Estadia" minLength={1} maxLength={20} onChange={onChange} />)
    expect(screen.queryByText(/O período deve ter/)).not.toBeInTheDocument()
  })

  it('aponta datas inválidas, indisponíveis e incompletas em cada campo', async () => {
    const user = userEvent.setup()
    render(
      <DateRangePicker
        label="Período"
        min={new Date(2026, 0, 1)}
        isDateDisabled={(d) => d.getDay() === 0}
      />,
    )
    await user.type(startInput(), '31022026')
    expect(
      screen.getByText('Data inicial inválida. Use o formato dd/mm/aaaa.'),
    ).toBeInTheDocument()
    expect(startInput()).toHaveAttribute('aria-invalid', 'true')

    await user.clear(startInput())
    await user.type(startInput(), '31122025')
    expect(screen.getByText('Data inicial indisponível. Escolha outra data.')).toBeInTheDocument()

    await user.clear(startInput())
    await user.type(startInput(), '10032026')
    await user.type(endInput(), '15032026') // domingo
    expect(screen.getByText('Data final indisponível. Escolha outra data.')).toBeInTheDocument()
    expect(endInput()).toHaveAttribute('aria-invalid', 'true')

    await user.clear(endInput())
    await user.type(endInput(), '1203')
    expect(endInput()).not.toHaveAttribute('aria-invalid')
    await user.tab()
    expect(screen.getByText('Data final inválida. Use o formato dd/mm/aaaa.')).toBeInTheDocument()
  })

  it('erro externo tem precedência e marca os dois campos', () => {
    render(<DateRangePicker label="Vigência" error="Informe a vigência do contrato" />)
    expect(startInput()).toHaveAttribute('aria-invalid', 'true')
    expect(endInput()).toHaveAttribute('aria-invalid', 'true')
    expect(endInput()).toHaveAccessibleDescription(
      'Informe a vigência do contrato Formato: dd/mm/aaaa',
    )
  })

  it('seleciona o período no calendário com o mouse e devolve o foco', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DateRangePicker label="Período" defaultValue={march} onChange={onChange} />)
    const button = screen.getByRole('button', { name: /^Alterar período/ })
    const dialog = await openCalendar(user)
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(button).toHaveAttribute('aria-expanded', 'true')
    await waitFor(() => expect(cell(/, 10 de março de 2026/)).toHaveFocus())
    expect(cell(/, 12 de março/)).toHaveAttribute('aria-selected', 'true')

    await user.click(cell(/, 20 de março/))
    expect(within(dialog).getByRole('status')).toHaveTextContent(
      'Início: 20 de março de 2026. Escolha a data final.',
    )
    await user.click(cell(/, 24 de março/))
    expect(onChange).toHaveBeenLastCalledWith({
      start: new Date(2026, 2, 20),
      end: new Date(2026, 2, 24),
    })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(startInput()).toHaveValue('20/03/2026')
    expect(endInput()).toHaveValue('24/03/2026')
    expect(screen.getByRole('button', { name: /^Alterar período/ })).toHaveFocus()
    expect(screen.getByRole('status')).toHaveTextContent(
      'Período selecionado: 20 de março de 2026 a 24 de março de 2026.',
    )
  })

  it('seleciona pelo teclado e troca as datas se o fim vier antes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DateRangePicker label="Período" defaultValue={march} onChange={onChange} />)
    await openCalendar(user)
    await waitFor(() => expect(cell(/, 10 de março de 2026/)).toHaveFocus())
    await user.keyboard('{ArrowDown}{Enter}') // 17/03 = início
    await user.keyboard('{ArrowUp}{ArrowUp}{ArrowLeft}')
    expect(cell(/, 2 de março/)).toHaveFocus()
    expect(cell(/, 5 de março/)).toHaveClass('or-range-calendar__day--preview')
    await user.keyboard('{Enter}')
    expect(onChange).toHaveBeenLastCalledWith({
      start: new Date(2026, 2, 2),
      end: new Date(2026, 2, 17),
    })
    expect(startInput()).toHaveValue('02/03/2026')
    expect(endInput()).toHaveValue('17/03/2026')
  })

  it('início digitado: o calendário já espera a data final', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DateRangePicker label="Período" onChange={onChange} />)
    await user.type(startInput(), '10032026')
    await user.keyboard('{Alt>}{ArrowDown}{/Alt}')
    await screen.findByRole('dialog')
    await waitFor(() => expect(cell(/, 10 de março de 2026/)).toHaveFocus())
    expect(cell(/, 10 de março de 2026/)).toHaveAccessibleDescription('início')
    await user.click(cell(/, 13 de março/))
    expect(onChange).toHaveBeenLastCalledWith({
      start: new Date(2026, 2, 10),
      end: new Date(2026, 2, 13),
    })
  })

  it('atalhos aplicam o período, marcam o atual e respeitam os limites', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const day = today()
    render(
      <DateRangePicker
        label="Período"
        onChange={onChange}
        max={day}
        presets={[
          'last7Days',
          'lastMonth',
          {
            label: 'Próxima semana',
            range: () => ({
              start: new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1),
              end: new Date(day.getFullYear(), day.getMonth(), day.getDate() + 7),
            }),
          },
        ]}
      />,
    )
    const dialog = await openCalendar(user)
    const list = within(dialog).getByRole('list', { name: 'Atalhos de período' })
    expect(within(list).getAllByRole('button')).toHaveLength(3)
    // depois de max: indisponível
    const future = within(list).getByRole('button', { name: 'Próxima semana' })
    expect(future).toHaveAttribute('aria-disabled', 'true')
    await user.click(future)
    expect(onChange).not.toHaveBeenCalled()

    await user.click(within(list).getByRole('button', { name: 'Últimos 7 dias' }))
    const start = new Date(day.getFullYear(), day.getMonth(), day.getDate() - 6)
    expect(onChange).toHaveBeenLastCalledWith({ start, end: day })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Alterar período/ })).toHaveFocus()

    const reopened = await openCalendar(user)
    expect(within(reopened).getByRole('button', { name: 'Últimos 7 dias' })).toHaveAttribute(
      'aria-current',
      'true',
    )
    await user.click(within(reopened).getByRole('button', { name: 'Mês passado' }))
    const lastMonthStart = new Date(day.getFullYear(), day.getMonth() - 1, 1)
    const lastMonthEnd = new Date(day.getFullYear(), day.getMonth(), 0)
    expect(onChange).toHaveBeenLastCalledWith({ start: lastMonthStart, end: lastMonthEnd })
  })

  it('aplica min, max e datas desabilitadas no calendário', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <DateRangePicker
        label="Período"
        defaultValue={march}
        min={new Date(2026, 2, 5)}
        max={new Date(2026, 2, 25)}
        isDateDisabled={(d) => d.getDay() === 0}
        onChange={onChange}
      />,
    )
    await openCalendar(user)
    expect(cell(/, 4 de março/)).toHaveAttribute('aria-disabled', 'true')
    expect(cell(/, 26 de março/)).toHaveAttribute('aria-disabled', 'true')
    expect(cell(/^domingo, 22 de março/)).toHaveAttribute('aria-disabled', 'true')
    await user.click(cell(/, 4 de março/))
    await user.click(cell(/^domingo, 22 de março/))
    await user.click(cell(/, 26 de março/))
    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('minLength desabilita as datas próximas depois do início', async () => {
    const user = userEvent.setup()
    render(<DateRangePicker label="Estadia" defaultValue={march} minLength={2} />)
    await openCalendar(user)
    await user.click(cell(/, 20 de março/))
    expect(cell(/, 21 de março/)).toHaveAttribute('aria-disabled', 'true')
    expect(cell(/, 19 de março/)).toHaveAttribute('aria-disabled', 'true')
    expect(cell(/, 22 de março/)).not.toHaveAttribute('aria-disabled')
  })

  it('envia o período em dois inputs ocultos ISO e funciona controlado', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [range, setRange] = useState<DateRange>(march)
      return (
        <>
          <DateRangePicker label="Período" name="periodo" value={range} onChange={setRange} />
          <button
            type="button"
            onClick={() => setRange({ start: new Date(2026, 11, 24), end: new Date(2026, 11, 31) })}
          >
            Fim de ano
          </button>
        </>
      )
    }
    const { container } = render(<Controlled />)
    const hidden = (edge: string) => container.querySelector(`input[name="periodo[${edge}]"]`)
    expect(hidden('start')).toHaveValue('2026-03-10')
    expect(hidden('end')).toHaveValue('2026-03-15')
    expect(hidden('start')).toHaveAttribute('type', 'hidden')

    await user.click(screen.getByRole('button', { name: 'Fim de ano' }))
    expect(startInput()).toHaveValue('24/12/2026')
    expect(endInput()).toHaveValue('31/12/2026')
    expect(hidden('end')).toHaveValue('2026-12-31')

    await user.clear(endInput())
    expect(hidden('start')).toHaveValue('2026-12-24')
    expect(hidden('end')).toHaveValue('')
    // o texto parcial não é sobrescrito pelo eco do valor controlado
    await user.type(endInput(), '0201')
    expect(endInput()).toHaveValue('02/01')
  })

  it('Escape fecha o diálogo, descarta o início pendente e devolve o foco', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DateRangePicker label="Período" defaultValue={march} onChange={onChange} />)
    const button = screen.getByRole('button', { name: /^Alterar período/ })
    await openCalendar(user)
    await user.click(cell(/, 20 de março/))
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(button).toHaveFocus()
    expect(onChange).not.toHaveBeenCalled()
    expect(startInput()).toHaveValue('10/03/2026')
  })

  it('Tab fica preso no diálogo, passando pelos atalhos', async () => {
    const user = userEvent.setup()
    render(<DateRangePicker label="Período" defaultValue={march} presets={['thisMonth']} />)
    const dialog = await openCalendar(user)
    await waitFor(() => expect(cell(/, 10 de março de 2026/)).toHaveFocus())
    await user.tab()
    expect(screen.getByRole('button', { name: 'Este mês' })).toHaveFocus()
    expect(dialog).toContainElement(document.activeElement as HTMLElement)
    await user.tab({ shift: true })
    expect(cell(/, 10 de março de 2026/)).toHaveFocus()
  })

  it('fecha ao clicar fora', async () => {
    const user = userEvent.setup()
    render(
      <>
        <DateRangePicker label="Período" />
        <p>Fora</p>
      </>,
    )
    await openCalendar(user)
    await user.click(screen.getByText('Fora'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('desabilitado e somente leitura bloqueiam o calendário', () => {
    const { unmount } = render(<DateRangePicker label="Período" disabled name="p" />)
    expect(startInput()).toBeDisabled()
    expect(endInput()).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Escolher período' })).toBeDisabled()
    expect(document.querySelector('input[name="p[start]"]')).toBeDisabled()
    unmount()
    render(<DateRangePicker label="Período" readOnly defaultValue={march} />)
    expect(startInput()).toHaveAttribute('readonly')
    expect(screen.getByRole('button', { name: /^Alterar período/ })).toBeDisabled()
  })

  it('obrigatório marca os dois campos', () => {
    render(<DateRangePicker label="Período" required />)
    expect(startInput()).toBeRequired()
    expect(endInput()).toBeRequired()
  })

  it('entra pelo lado do campo e sai animado (usePresence) antes de desmontar', async () => {
    const user = userEvent.setup()
    const original = window.getComputedStyle
    // Simula a animação de saída só no diálogo (o jsdom não roda CSS).
    const spy = vi.spyOn(window, 'getComputedStyle').mockImplementation((element, pseudo) => {
      const style = original.call(window, element, pseudo)
      if (!(element as HTMLElement).classList?.contains('or-date-range-picker__dialog'))
        return style
      return new Proxy(style, {
        get(target, prop) {
          if (prop === 'animationName') return 'or-date-range-picker-out'
          if (prop === 'animationDuration') return '0.16s'
          const result = Reflect.get(target, prop)
          return typeof result === 'function' ? result.bind(target) : result
        },
      })
    })
    render(<DateRangePicker label="Período" />)
    const button = screen.getByRole('button', { name: 'Escolher período' })
    const dialog = await openCalendar(user)
    expect(dialog).toHaveAttribute('data-state', 'open')
    expect(dialog).toHaveAttribute('data-side', 'bottom')

    await user.keyboard('{Escape}')
    expect(button).toHaveFocus()
    const closing = document.querySelector('.or-date-range-picker__dialog') as HTMLElement
    expect(closing).toHaveAttribute('data-state', 'closed')
    expect(closing).toHaveAttribute('inert')
    act(() => {
      closing.dispatchEvent(new Event('animationend', { bubbles: true }))
    })
    expect(document.querySelector('.or-date-range-picker__dialog')).toBeNull()
    spy.mockRestore()
  })

  it('não possui violações de acessibilidade (fechado e aberto)', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <DateRangePicker
        label="Período do relatório"
        description="Até 90 dias."
        defaultValue={march}
        name="periodo"
        presets={['last7Days', 'thisMonth', 'lastMonth']}
      />,
    )
    await expectNoA11yViolations(container)
    await openCalendar(user)
    await expectNoA11yViolations(document.body)
    await user.click(cell(/, 20 de março/))
    await expectNoA11yViolations(document.body)
  })
})
