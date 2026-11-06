import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Button } from '../Button'
import { Form, type FormValues } from '../Form'
import { DateTimePicker } from './DateTimePicker'

const dateInput = (name = 'Data') => screen.getByRole('textbox', { name })
const timeInput = (name = 'Hora') => screen.getByLabelText(name) as HTMLInputElement
const reuniao = new Date(2026, 2, 15, 14, 30)

describe('DateTimePicker', () => {
  it('agrupa data, hora e calendário sob o rótulo, cada campo com nome próprio', () => {
    render(<DateTimePicker label="Data e hora da reunião" description="Horário de Brasília." />)
    const group = screen.getByRole('group', { name: 'Data e hora da reunião' })
    expect(within(group).getByRole('textbox', { name: 'Data' })).toBe(dateInput())
    expect(group).toContainElement(timeInput())
    expect(timeInput()).toHaveAttribute('type', 'time')
    expect(dateInput()).toHaveAttribute('placeholder', 'dd/mm/aaaa')
    expect(dateInput()).toHaveAttribute('inputmode', 'numeric')
    expect(dateInput()).toHaveAccessibleDescription('Horário de Brasília. Formato: dd/mm/aaaa')
    expect(timeInput()).toHaveAccessibleDescription('Horário de Brasília.')
    const button = within(group).getByRole('button', { name: 'Escolher data' })
    expect(button).toHaveAttribute('aria-haspopup', 'dialog')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    // o rótulo leva ao campo de data
    expect(screen.getByText('Data e hora da reunião')).toHaveAttribute('for', dateInput().id)
  })

  it('digitar a data e a hora emite a combinação; faltando uma delas, emite null', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DateTimePicker label="Agendar publicação" onChange={onChange} />)
    await user.type(dateInput(), '15032026')
    expect(dateInput()).toHaveValue('15/03/2026')
    // só a data: ainda não há valor
    expect(onChange).not.toHaveBeenCalled()
    expect(
      screen.getByRole('button', { name: 'Alterar data, domingo, 15 de março de 2026' }),
    ).toBeInTheDocument()

    await user.type(timeInput(), '1430')
    expect(timeInput()).toHaveValue('14:30')
    expect(onChange).toHaveBeenLastCalledWith(reuniao)
  })

  it('editar a hora mantém a data; apagar qualquer um dos campos emite null', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DateTimePicker label="Reunião" defaultValue={reuniao} onChange={onChange} />)
    expect(dateInput()).toHaveValue('15/03/2026')
    expect(timeInput()).toHaveValue('14:30')

    fireEvent.change(timeInput(), { target: { value: '09:15' } })
    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 2, 15, 9, 15))

    fireEvent.change(timeInput(), { target: { value: '' } })
    expect(onChange).toHaveBeenLastCalledWith(null)
    expect(dateInput()).toHaveValue('15/03/2026')

    fireEvent.change(timeInput(), { target: { value: '10:00' } })
    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 2, 15, 10, 0))
    await user.clear(dateInput())
    expect(onChange).toHaveBeenLastCalledWith(null)
    expect(timeInput()).toHaveValue('10:00')
  })

  it('usa mm/dd/yyyy e nomes em inglês em en-US', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <DateTimePicker label="Meeting" onChange={onChange} />
      </OrangeProvider>,
    )
    const date = dateInput('Date')
    expect(date).toHaveAttribute('placeholder', 'mm/dd/yyyy')
    await user.type(date, '03152026')
    await user.type(timeInput('Time'), '1430')
    expect(onChange).toHaveBeenLastCalledWith(reuniao)
    expect(
      screen.getByRole('button', { name: 'Change date, Sunday, March 15, 2026' }),
    ).toBeInTheDocument()
  })

  it('escolher um dia no calendário mantém a hora e devolve o foco ao botão', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DateTimePicker label="Reunião" defaultValue={reuniao} onChange={onChange} />)
    const button = screen.getByRole('button', { name: /^Alterar data/ })
    await user.click(button)

    const dialog = await screen.findByRole('dialog', { name: 'Março de 2026' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(button).toHaveAttribute('aria-expanded', 'true')
    await waitFor(() => expect(screen.getByRole('gridcell', { name: /15 de março/ })).toHaveFocus())
    await user.keyboard('{ArrowRight}{Enter}')

    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 2, 16, 14, 30))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(dateInput()).toHaveValue('16/03/2026')
    expect(timeInput()).toHaveValue('14:30')
    expect(screen.getByRole('button', { name: /^Alterar data, segunda-feira, 16/ })).toHaveFocus()
  })

  it('sem hora, o dia escolhido usa defaultTime; sem defaultTime, a hora continua vazia', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { unmount } = render(
      <DateTimePicker label="Publicação" defaultTime="09:00" onChange={onChange} />,
    )
    await user.click(screen.getByRole('button', { name: 'Escolher data' }))
    await screen.findByRole('dialog')
    await user.click(screen.getByRole('button', { name: 'Hoje' }))
    const now = new Date()
    expect(onChange).toHaveBeenLastCalledWith(
      new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0),
    )
    expect(timeInput()).toHaveValue('09:00')
    unmount()

    onChange.mockClear()
    render(<DateTimePicker label="Publicação" onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Escolher data' }))
    await screen.findByRole('dialog')
    await user.click(screen.getByRole('button', { name: 'Hoje' }))
    expect(dateInput()).not.toHaveValue('')
    expect(timeInput()).toHaveValue('')
    expect(onChange).not.toHaveBeenCalled()
    // ao digitar a hora, o valor fica completo
    await user.type(timeInput(), '1800')
    expect(onChange).toHaveBeenLastCalledWith(
      new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0),
    )
  })

  it('min/max valem para data e hora; dias fora e desabilitados ficam indisponíveis', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <DateTimePicker
        label="Entrega agendada"
        min={new Date(2026, 2, 10, 8, 0)}
        max={new Date(2026, 2, 20, 18, 0)}
        isDateDisabled={(d) => d.getDay() === 0}
        onChange={onChange}
      />,
    )
    await user.type(dateInput(), '09032026')
    expect(screen.getByText('Data indisponível. Escolha outra data.')).toBeInTheDocument()
    expect(dateInput()).toHaveAttribute('aria-invalid', 'true')

    await user.clear(dateInput())
    await user.type(dateInput(), '15032026') // domingo
    expect(screen.getByText('Data indisponível. Escolha outra data.')).toBeInTheDocument()

    await user.clear(dateInput())
    await user.type(dateInput(), '10032026')
    await user.type(timeInput(), '0730')
    expect(screen.getByText('Escolha um horário a partir de 08:00.')).toBeInTheDocument()
    expect(timeInput()).toHaveAttribute('aria-invalid', 'true')
    expect(dateInput()).not.toHaveAttribute('aria-invalid')
    expect(onChange).not.toHaveBeenCalledWith(expect.any(Date))

    fireEvent.change(timeInput(), { target: { value: '08:00' } })
    expect(screen.queryByText(/Escolha um horário/)).not.toBeInTheDocument()
    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 2, 10, 8, 0))

    await user.clear(dateInput())
    await user.type(dateInput(), '20032026')
    fireEvent.change(timeInput(), { target: { value: '18:30' } })
    expect(screen.getByText('Escolha um horário até 18:00.')).toBeInTheDocument()
    expect(onChange).toHaveBeenLastCalledWith(null)

    // no calendário, os dias fora do intervalo e os domingos ficam desabilitados
    await user.click(screen.getByRole('button', { name: /^Alterar data/ }))
    await screen.findByRole('dialog')
    const day = (name: string) => screen.getByRole('gridcell', { name: `${name} de março de 2026` })
    expect(day('segunda-feira, 9')).toHaveAttribute('aria-disabled', 'true')
    expect(day('domingo, 15')).toHaveAttribute('aria-disabled', 'true')
    expect(day('sábado, 21')).toHaveAttribute('aria-disabled', 'true')
    expect(day('terça-feira, 10')).not.toHaveAttribute('aria-disabled')
    expect(day('sexta-feira, 20')).not.toHaveAttribute('aria-disabled')
  })

  it('valida datas inexistentes, incompletas e campos deixados pela metade', async () => {
    const user = userEvent.setup()
    render(
      <>
        <DateTimePicker label="Reunião" />
        <button type="button">Depois</button>
      </>,
    )
    await user.type(dateInput(), '31022026')
    expect(screen.getByText('Data inválida. Use o formato dd/mm/aaaa.')).toBeInTheDocument()
    expect(dateInput()).toHaveAttribute('aria-invalid', 'true')

    await user.clear(dateInput())
    await user.type(dateInput(), '1203')
    expect(dateInput()).not.toHaveAttribute('aria-invalid')
    await user.tab() // botão do calendário
    expect(dateInput()).toHaveAttribute('aria-invalid', 'true')

    // data completa, hora vazia: o aviso só aparece ao sair do grupo
    await user.clear(dateInput())
    await user.type(dateInput(), '12032026')
    await user.tab()
    await user.tab()
    expect(timeInput()).toHaveFocus()
    expect(screen.queryByText('Informe a hora.')).not.toBeInTheDocument()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Depois' })).toHaveFocus()
    expect(screen.getByText('Informe a hora.')).toBeInTheDocument()
    expect(timeInput()).toHaveAttribute('aria-invalid', 'true')
    fireEvent.change(timeInput(), { target: { value: '10:00' } })
    expect(screen.queryByText('Informe a hora.')).not.toBeInTheDocument()

    // só a hora
    await user.clear(dateInput())
    await user.click(screen.getByRole('button', { name: 'Depois' }))
    expect(screen.getByText('Informe a data.')).toBeInTheDocument()
    expect(dateInput()).toHaveAttribute('aria-invalid', 'true')
  })

  it('teclado: Tab percorre data → calendário → hora; Alt+↓ abre e Escape fecha', async () => {
    const user = userEvent.setup()
    render(<DateTimePicker label="Reunião" defaultValue={reuniao} />)
    await user.tab()
    expect(dateInput()).toHaveFocus()
    await user.tab()
    const button = screen.getByRole('button', { name: /^Alterar data/ })
    expect(button).toHaveFocus()
    await user.tab()
    expect(timeInput()).toHaveFocus()

    dateInput().focus()
    await user.keyboard('{Alt>}{ArrowDown}{/Alt}')
    const dialog = await screen.findByRole('dialog')
    await waitFor(() => expect(screen.getByRole('gridcell', { name: /15 de março/ })).toHaveFocus())
    await user.tab()
    expect(screen.getByRole('button', { name: 'Hoje' })).toHaveFocus()
    await user.tab()
    expect(dialog).toContainElement(document.activeElement as HTMLElement)
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(button).toHaveFocus()
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('fecha ao clicar fora', async () => {
    const user = userEvent.setup()
    render(
      <>
        <DateTimePicker label="Reunião" />
        <p>Fora</p>
      </>,
    )
    await user.click(screen.getByRole('button', { name: 'Escolher data' }))
    await screen.findByRole('dialog')
    await user.click(screen.getByText('Fora'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('modo controlado sincroniza os dois campos e o input oculto', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [value, setValue] = useState<Date | null>(new Date(2026, 4, 1, 10, 0))
      return (
        <>
          <DateTimePicker label="Início" name="inicio" value={value} onChange={setValue} />
          <button type="button" onClick={() => setValue(new Date(2026, 11, 24, 19, 45))}>
            Ceia de Natal
          </button>
          <button type="button" onClick={() => setValue(null)}>
            Limpar
          </button>
        </>
      )
    }
    const { container } = render(<Controlled />)
    const hidden = () => container.querySelector('input[name="inicio"]')
    expect(dateInput()).toHaveValue('01/05/2026')
    expect(timeInput()).toHaveValue('10:00')
    expect(hidden()).toHaveAttribute('type', 'hidden')
    expect(hidden()).toHaveValue('2026-05-01T10:00')

    await user.click(screen.getByRole('button', { name: 'Ceia de Natal' }))
    expect(dateInput()).toHaveValue('24/12/2026')
    expect(timeInput()).toHaveValue('19:45')
    expect(hidden()).toHaveValue('2026-12-24T19:45')

    fireEvent.change(timeInput(), { target: { value: '20:00' } })
    expect(hidden()).toHaveValue('2026-12-24T20:00')
    fireEvent.change(timeInput(), { target: { value: '' } })
    expect(hidden()).toHaveValue('')
    // a data digitada continua no campo enquanto a hora é refeita
    expect(dateInput()).toHaveValue('24/12/2026')
    fireEvent.change(timeInput(), { target: { value: '20:30' } })
    expect(hidden()).toHaveValue('2026-12-24T20:30')

    await user.click(screen.getByRole('button', { name: 'Limpar' }))
    expect(dateInput()).toHaveValue('')
    expect(timeInput()).toHaveValue('')
  })

  it('não controlado: defaultValue preenche os campos', () => {
    render(<DateTimePicker label="Reunião" defaultValue={reuniao} name="reuniao" />)
    expect(dateInput()).toHaveValue('15/03/2026')
    expect(timeInput()).toHaveValue('14:30')
  })

  it('envia aaaa-mm-ddTHH:mm no FormData (com segundos quando o step pede)', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(
      <Form onSubmit={(values: FormValues) => onSubmit(values)}>
        <DateTimePicker label="Publicação" name="publicacao" defaultValue={reuniao} />
        <DateTimePicker
          label="Largada"
          name="largada"
          step={1}
          defaultValue={new Date(2026, 5, 7, 8, 0, 5)}
        />
        <DateTimePicker label="Prazo" name="prazo" />
        <DateTimePicker label="Arquivado" name="arquivado" defaultValue={reuniao} disabled />
        <Button type="submit">Salvar</Button>
      </Form>,
    )
    const [publicacao, largada] = screen.getAllByLabelText('Hora')
    expect(publicacao).toHaveValue('14:30')
    expect(largada).toHaveValue('08:00:05')
    expect(largada).toHaveAttribute('step', '1')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(onSubmit).toHaveBeenCalledWith({
      publicacao: '2026-03-15T14:30',
      largada: '2026-06-07T08:00:05',
      prazo: '',
    })
  })

  it('o Form revalida e o link do resumo foca o campo de data', async () => {
    const user = userEvent.setup()
    render(
      <Form
        validate={(values) => ({
          publicacao: values.publicacao ? undefined : 'Informe quando publicar.',
        })}
      >
        {({ errors }) => (
          <>
            <DateTimePicker
              label="Agendar publicação"
              name="publicacao"
              error={errors.publicacao}
            />
            <Button type="submit">Agendar</Button>
          </>
        )}
      </Form>,
    )
    await user.click(screen.getByRole('button', { name: 'Agendar' }))
    const link = screen.getByRole('link', { name: 'Informe quando publicar.' })
    expect(link).toHaveAttribute('href', `#${dateInput().id}`)
    await user.click(link)
    expect(dateInput()).toHaveFocus()
    await user.type(dateInput(), '15032026')
    await user.type(timeInput(), '1430')
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(dateInput()).not.toHaveAttribute('aria-invalid')
  })

  it('repassa step e o relógio abre o seletor nativo da hora', () => {
    render(<DateTimePicker label="Reunião" step={900} />)
    const input = timeInput()
    expect(input).toHaveAttribute('step', '900')
    const showPicker = vi.fn()
    input.showPicker = showPicker
    fireEvent.pointerDown(document.querySelector('.or-date-time-picker__clock')!)
    expect(input).toHaveFocus()
    expect(showPicker).toHaveBeenCalled()
  })

  it('desabilitado e somente leitura bloqueiam os campos e o calendário', () => {
    const { unmount } = render(<DateTimePicker label="Reunião" disabled />)
    expect(dateInput()).toBeDisabled()
    expect(timeInput()).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Escolher data' })).toBeDisabled()
    unmount()
    render(<DateTimePicker label="Reunião" readOnly defaultValue={reuniao} />)
    expect(dateInput()).toHaveAttribute('readonly')
    expect(timeInput()).toHaveAttribute('readonly')
    expect(screen.getByRole('button', { name: /^Alterar data/ })).toBeDisabled()
  })

  it('required marca os dois campos; erro externo tem precedência; invalid sem mensagem', () => {
    const { container, rerender } = render(
      <DateTimePicker label="Reunião" required error="Informe a data e a hora da reunião." />,
    )
    expect(dateInput()).toBeRequired()
    expect(timeInput()).toBeRequired()
    expect(dateInput()).toHaveAttribute('aria-invalid', 'true')
    expect(timeInput()).toHaveAttribute('aria-invalid', 'true')
    expect(dateInput()).toHaveAccessibleDescription(
      'Informe a data e a hora da reunião. Formato: dd/mm/aaaa',
    )
    rerender(<DateTimePicker label="Reunião" invalid />)
    expect(dateInput()).toHaveAttribute('aria-invalid', 'true')
    expect(timeInput()).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('group')).toHaveAttribute('data-invalid')
    expect(container.querySelector('.or-field__error')).toBeNull()
  })

  it('repassa ref e atributos ao grupo e aplica o tamanho', () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<DateTimePicker ref={ref} label="Reunião" size="lg" data-testid="grupo" />)
    const group = screen.getByRole('group', { name: 'Reunião' })
    expect(ref.current).toBe(group)
    expect(group).toHaveAttribute('data-testid', 'grupo')
    expect(group).toHaveClass('or-control-frame--lg')
  })

  it('placeholder próprio substitui o formato no campo de data', () => {
    render(<DateTimePicker label="Reunião" placeholder="Ex.: 15/03/2026" />)
    expect(dateInput()).toHaveAttribute('placeholder', 'Ex.: 15/03/2026')
    expect(dateInput()).toHaveAccessibleDescription('Formato: dd/mm/aaaa')
  })

  it('open/onOpenChange controlam o calendário', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    const { rerender } = render(
      <DateTimePicker label="Reunião" open={false} onOpenChange={onOpenChange} />,
    )
    await user.click(screen.getByRole('button', { name: 'Escolher data' }))
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    rerender(<DateTimePicker label="Reunião" open onOpenChange={onOpenChange} />)
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
  })

  it('sai animado (usePresence) antes de desmontar o diálogo', async () => {
    const user = userEvent.setup()
    const original = window.getComputedStyle
    const spy = vi.spyOn(window, 'getComputedStyle').mockImplementation((element, pseudo) => {
      const style = original.call(window, element, pseudo)
      if (!(element as HTMLElement).classList?.contains('or-date-time-picker__dialog')) return style
      return new Proxy(style, {
        get(target, prop) {
          if (prop === 'animationName') return 'or-date-time-picker-out'
          if (prop === 'animationDuration') return '0.16s'
          const result = Reflect.get(target, prop)
          return typeof result === 'function' ? result.bind(target) : result
        },
      })
    })
    render(<DateTimePicker label="Reunião" />)
    await user.click(screen.getByRole('button', { name: 'Escolher data' }))
    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveAttribute('data-state', 'open')
    await user.keyboard('{Escape}')
    const closing = document.querySelector('.or-date-time-picker__dialog') as HTMLElement
    expect(closing).toHaveAttribute('data-state', 'closed')
    expect(closing).toHaveAttribute('inert')
    act(() => {
      closing.dispatchEvent(new Event('animationend', { bubbles: true }))
    })
    expect(document.querySelector('.or-date-time-picker__dialog')).toBeNull()
    spy.mockRestore()
  })

  it('não possui violações de acessibilidade (fechado, com erro e aberto)', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <div>
        <DateTimePicker
          label="Data e hora da reunião"
          description="Horário de Brasília."
          defaultValue={reuniao}
          required
        />
        <DateTimePicker label="Fim" error="O fim deve ser depois do início." size="sm" />
        <DateTimePicker label="Intervalo" disabled size="lg" />
      </div>,
    )
    await expectNoA11yViolations(container)
    await user.click(screen.getByRole('button', { name: /^Alterar data/ }))
    await screen.findByRole('dialog')
    await expectNoA11yViolations(document.body)
  })
})
