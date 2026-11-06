import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { DatePicker } from './DatePicker'

describe('DatePicker', () => {
  it('renderiza campo rotulado com máscara do locale e botão de calendário', () => {
    render(<DatePicker label="Data de entrega" />)
    const input = screen.getByRole('textbox', { name: 'Data de entrega' })
    expect(input).toHaveAttribute('placeholder', 'dd/mm/aaaa')
    expect(input).toHaveAttribute('inputmode', 'numeric')
    expect(input).toHaveAccessibleDescription('Formato: dd/mm/aaaa')
    const button = screen.getByRole('button', { name: 'Escolher data' })
    expect(button).toHaveAttribute('aria-haspopup', 'dialog')
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('aplica a máscara dd/mm/aaaa e emite a data', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DatePicker label="Data" onChange={onChange} />)
    const input = screen.getByRole('textbox', { name: 'Data' })
    await user.type(input, '15032026')
    expect(input).toHaveValue('15/03/2026')
    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 2, 15))
    expect(
      screen.getByRole('button', { name: 'Alterar data, domingo, 15 de março de 2026' }),
    ).toBeInTheDocument()
  })

  it('completa dia/mês com zero quando o usuário digita o separador', async () => {
    const user = userEvent.setup()
    render(<DatePicker label="Data" />)
    const input = screen.getByRole('textbox', { name: 'Data' })
    await user.type(input, '5/3/2026')
    expect(input).toHaveValue('05/03/2026')
  })

  it('usa mm/dd/yyyy em en-US', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <DatePicker label="Due date" onChange={onChange} />
      </OrangeProvider>,
    )
    const input = screen.getByRole('textbox', { name: 'Due date' })
    expect(input).toHaveAttribute('placeholder', 'mm/dd/yyyy')
    await user.type(input, '03152026')
    expect(input).toHaveValue('03/15/2026')
    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 2, 15))
    expect(
      screen.getByRole('button', { name: 'Change date, Sunday, March 15, 2026' }),
    ).toBeInTheDocument()
  })

  it('valida datas inexistentes e incompletas', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DatePicker label="Data" onChange={onChange} />)
    const input = screen.getByRole('textbox', { name: 'Data' })
    await user.type(input, '31022026')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Data inválida. Use o formato dd/mm/aaaa.')).toBeInTheDocument()
    expect(onChange).not.toHaveBeenCalled()

    await user.clear(input)
    await user.type(input, '1203')
    expect(input).not.toHaveAttribute('aria-invalid')
    await user.tab()
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('recusa datas fora de min/max ou desabilitadas', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <DatePicker
        label="Data"
        min={new Date(2026, 0, 1)}
        isDateDisabled={(d) => d.getDay() === 0}
        onChange={onChange}
      />,
    )
    const input = screen.getByRole('textbox', { name: 'Data' })
    await user.type(input, '31122025')
    expect(screen.getByText('Data indisponível. Escolha outra data.')).toBeInTheDocument()
    await user.clear(input)
    await user.type(input, '15032026') // domingo
    expect(screen.getByText('Data indisponível. Escolha outra data.')).toBeInTheDocument()
    expect(onChange).not.toHaveBeenCalledWith(expect.any(Date))
  })

  it('abre o diálogo, navega pelo teclado e seleciona com Enter', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DatePicker label="Data" defaultValue={new Date(2026, 2, 15)} onChange={onChange} />)
    const button = screen.getByRole('button', { name: /^Alterar data/ })
    await user.click(button)

    const dialog = await screen.findByRole('dialog', { name: 'Março de 2026' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(button).toHaveAttribute('aria-expanded', 'true')
    const selected = screen.getByRole('gridcell', { name: /15 de março/ })
    await waitFor(() => expect(selected).toHaveFocus())
    expect(selected).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{ArrowRight}{ArrowDown}')
    expect(screen.getByRole('gridcell', { name: /23 de março/ })).toHaveFocus()
    await user.keyboard('{PageDown}')
    expect(screen.getByRole('dialog', { name: 'Abril de 2026' })).toBeInTheDocument()
    await user.keyboard('{Enter}')

    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 3, 23))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Data' })).toHaveValue('23/04/2026')
    expect(screen.getByRole('button', { name: /^Alterar data/ })).toHaveFocus()
  })

  it('Escape fecha o diálogo e devolve o foco ao botão', async () => {
    const user = userEvent.setup()
    render(<DatePicker label="Data" />)
    const button = screen.getByRole('button', { name: 'Escolher data' })
    await user.click(button)
    await screen.findByRole('dialog')
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(button).toHaveFocus()
  })

  it('Alt+ArrowDown no campo abre o calendário e Tab fica preso no diálogo', async () => {
    const user = userEvent.setup()
    render(<DatePicker label="Data" defaultValue={new Date(2026, 2, 15)} />)
    screen.getByRole('textbox', { name: 'Data' }).focus()
    await user.keyboard('{Alt>}{ArrowDown}{/Alt}')
    const dialog = await screen.findByRole('dialog')
    await waitFor(() => expect(screen.getByRole('gridcell', { name: /15 de março/ })).toHaveFocus())
    await user.tab()
    expect(screen.getByRole('button', { name: 'Hoje' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Ano anterior' })).toHaveFocus()
    expect(dialog).toContainElement(document.activeElement as HTMLElement)
    await user.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Hoje' })).toHaveFocus()
  })

  it('fecha ao clicar fora', async () => {
    const user = userEvent.setup()
    render(
      <>
        <DatePicker label="Data" />
        <p>Fora</p>
      </>,
    )
    await user.click(screen.getByRole('button', { name: 'Escolher data' }))
    await screen.findByRole('dialog')
    await user.click(screen.getByText('Fora'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('modo controlado sincroniza o texto e envia o valor ISO no formulário', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [date, setDate] = useState<Date | null>(new Date(2026, 4, 1))
      return (
        <>
          <DatePicker label="Início" name="inicio" value={date} onChange={setDate} />
          <button type="button" onClick={() => setDate(new Date(2026, 11, 24))}>
            Véspera de Natal
          </button>
        </>
      )
    }
    const { container } = render(<Controlled />)
    const input = screen.getByRole('textbox', { name: 'Início' })
    expect(input).toHaveValue('01/05/2026')
    expect(container.querySelector('input[name="inicio"]')).toHaveValue('2026-05-01')
    await user.click(screen.getByRole('button', { name: 'Véspera de Natal' }))
    expect(input).toHaveValue('24/12/2026')
    expect(container.querySelector('input[name="inicio"]')).toHaveValue('2026-12-24')
    await user.clear(input)
    expect(container.querySelector('input[name="inicio"]')).toHaveValue('')
  })

  it('desabilitado bloqueia o campo e o botão', () => {
    render(<DatePicker label="Data" disabled />)
    expect(screen.getByRole('textbox', { name: 'Data' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Escolher data' })).toBeDisabled()
  })

  it('erro externo tem precedência', () => {
    render(<DatePicker label="Data" error="Informe a data de entrega" />)
    expect(screen.getByRole('textbox', { name: 'Data' })).toHaveAccessibleDescription(
      'Informe a data de entrega Formato: dd/mm/aaaa',
    )
  })

  it('aceita invalid sem mensagem de erro', () => {
    const { container } = render(<DatePicker label="Data" invalid />)
    const input = screen.getByRole('textbox', { name: 'Data' })
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Formato: dd/mm/aaaa')
    expect(input.closest('.or-control-frame')).toHaveAttribute('data-invalid')
    expect(container.querySelector('.or-field__error')).toBeNull()
  })

  it('entra pelo lado do campo e sai animado (usePresence) antes de desmontar', async () => {
    const user = userEvent.setup()
    const original = window.getComputedStyle
    // Simula a animação de saída só no diálogo (o jsdom não roda CSS).
    const spy = vi.spyOn(window, 'getComputedStyle').mockImplementation((element, pseudo) => {
      const style = original.call(window, element, pseudo)
      if (!(element as HTMLElement).classList?.contains('or-date-picker__dialog')) return style
      return new Proxy(style, {
        get(target, prop) {
          if (prop === 'animationName') return 'or-date-picker-out'
          if (prop === 'animationDuration') return '0.16s'
          const result = Reflect.get(target, prop)
          return typeof result === 'function' ? result.bind(target) : result
        },
      })
    })
    render(<DatePicker label="Data" />)
    const button = screen.getByRole('button', { name: 'Escolher data' })
    await user.click(button)
    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveAttribute('data-state', 'open')
    expect(dialog).toHaveAttribute('data-side', 'bottom')

    await user.keyboard('{Escape}')
    expect(button).toHaveFocus()
    expect(button).toHaveAttribute('aria-expanded', 'false')
    const closing = document.querySelector('.or-date-picker__dialog') as HTMLElement
    expect(closing).toHaveAttribute('data-state', 'closed')
    expect(closing).toHaveAttribute('inert')
    act(() => {
      closing.dispatchEvent(new Event('animationend', { bubbles: true }))
    })
    expect(document.querySelector('.or-date-picker__dialog')).toBeNull()
    spy.mockRestore()
  })

  it('não possui violações de acessibilidade (fechado e aberto)', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <DatePicker
        label="Data de entrega"
        description="Dias úteis apenas"
        defaultValue={new Date(2026, 2, 15)}
      />,
    )
    await expectNoA11yViolations(container)
    await user.click(screen.getByRole('button', { name: /^Alterar data/ }))
    await screen.findByRole('dialog')
    await expectNoA11yViolations(document.body)
  })
})
