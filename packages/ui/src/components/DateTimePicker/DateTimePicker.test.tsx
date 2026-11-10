import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import { useState, type ReactElement } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider, type Locale } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Button } from '../Button'
import { Form, type FormValues } from '../Form'
import { DateTimePicker } from './DateTimePicker'

const dateInput = (name = 'Data') => screen.getByRole('textbox', { name })
/** O grupo da hora, com os segmentos dentro. */
const timeGroup = (name = 'Hora') => screen.getByRole('group', { name })
/** O que a pessoa lê na hora: "14:30", "02:30 PM", "--:--". */
const shownTime = (name = 'Hora') => timeGroup(name).textContent
const segment = (name: RegExp) => screen.getByRole('spinbutton', { name })
const hour = () => segment(/^hora/)
const minute = () => segment(/^minuto/)
/** Digita a hora a partir do primeiro segmento: "1430" preenche hora e minuto. */
const typeTime = async (user: UserEvent, text: string, first = hour()) => {
  await user.click(first)
  await user.keyboard(text)
}
const reuniao = new Date(2026, 2, 15, 14, 30)

const renderIn = (locale: Locale, ui: ReactElement) =>
  render(
    <OrangeProvider locale={locale} themeTarget="scoped">
      {ui}
    </OrangeProvider>,
  )

describe('DateTimePicker', () => {
  it('agrupa data, hora e calendário sob o rótulo, cada parte com nome próprio', () => {
    const { container } = render(
      <DateTimePicker label="Data e hora da reunião" description="Horário de Brasília." />,
    )
    const group = screen.getByRole('group', { name: 'Data e hora da reunião' })
    expect(within(group).getByRole('textbox', { name: 'Data' })).toBe(dateInput())
    expect(dateInput()).toHaveAttribute('placeholder', 'dd/mm/aaaa')
    expect(dateInput()).toHaveAttribute('inputmode', 'numeric')
    expect(dateInput()).toHaveAccessibleDescription('Horário de Brasília. Formato: dd/mm/aaaa')
    // A hora é um grupo de segmentos do Orange, não mais o input do navegador.
    const time = within(group).getByRole('group', { name: 'Hora' })
    expect(container.querySelector('input[type="time"]')).toBeNull()
    const [hours, minutes] = within(time).getAllByRole('spinbutton')
    // O nome do campo fica nos grupos em volta; cada segmento diz só o que é.
    expect(hours).toHaveAccessibleName('hora')
    expect(minutes).toHaveAccessibleName('minuto')
    expect(hours).not.toHaveAttribute('aria-labelledby')
    expect(hours).not.toHaveAttribute('id')
    expect(time).toHaveTextContent('--:--')
    expect(hours).toHaveAttribute('aria-valuetext', 'vazio')
    // A descrição é lida uma vez na hora, no primeiro segmento.
    expect(hours).toHaveAccessibleDescription('Horário de Brasília.')
    expect(minutes).not.toHaveAttribute('aria-describedby')
    const button = within(group).getByRole('button', { name: 'Escolher data' })
    expect(button).toHaveAttribute('aria-haspopup', 'dialog')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    // o rótulo leva ao campo de data
    expect(screen.getByText('Data e hora da reunião')).toHaveAttribute('for', dateInput().id)
  })

  it('sem rótulo visível, o grupo usa o aria-label recebido e a hora continua sendo "Hora"', () => {
    render(<DateTimePicker aria-label="Reunião" defaultValue={reuniao} />)
    const group = screen.getByRole('group', { name: 'Reunião' })
    expect(within(group).getByRole('group', { name: 'Hora' })).toHaveTextContent('14:30')
    expect(hour()).toHaveAccessibleName('hora')
    expect(hour()).toHaveAttribute('aria-valuenow', '14')
    expect(hour()).toHaveAttribute('aria-valuemin', '0')
    expect(hour()).toHaveAttribute('aria-valuemax', '23')
    expect(minute()).toHaveAttribute('aria-valuetext', '30')
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

    await typeTime(user, '14')
    // a hora completa passa sozinha para o minuto; pela metade, ainda não há valor
    expect(minute()).toHaveFocus()
    expect(shownTime()).toBe('14:--')
    expect(onChange).not.toHaveBeenCalled()
    await user.keyboard('30')
    expect(shownTime()).toBe('14:30')
    expect(onChange).toHaveBeenLastCalledWith(reuniao)
  })

  it('editar a hora mantém a data; apagar um segmento ou a data emite null', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DateTimePicker label="Reunião" defaultValue={reuniao} onChange={onChange} />)
    expect(dateInput()).toHaveValue('15/03/2026')
    expect(shownTime()).toBe('14:30')

    await typeTime(user, '0915')
    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 2, 15, 9, 15))

    await user.keyboard('{Backspace}')
    expect(shownTime()).toBe('09:--')
    expect(onChange).toHaveBeenLastCalledWith(null)
    expect(dateInput()).toHaveValue('15/03/2026')

    await typeTime(user, '1000')
    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 2, 15, 10, 0))
    await user.clear(dateInput())
    expect(onChange).toHaveBeenLastCalledWith(null)
    expect(shownTime()).toBe('10:00')
  })

  it('usa mm/dd/yyyy, AM/PM e nomes em inglês em en-US', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderIn('en-US', <DateTimePicker label="Meeting" onChange={onChange} />)
    const date = dateInput('Date')
    expect(date).toHaveAttribute('placeholder', 'mm/dd/yyyy')
    await user.type(date, '03152026')
    expect(segment(/^hour/)).toHaveAccessibleName('hour')
    await typeTime(user, '0230p', segment(/^hour/))
    expect(shownTime('Time')).toBe('02:30 PM')
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
    expect(shownTime()).toBe('14:30')
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
    expect(shownTime()).toBe('09:00')
    unmount()

    onChange.mockClear()
    render(<DateTimePicker label="Publicação" onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Escolher data' }))
    await screen.findByRole('dialog')
    await user.click(screen.getByRole('button', { name: 'Hoje' }))
    expect(dateInput()).not.toHaveValue('')
    expect(shownTime()).toBe('--:--')
    expect(onChange).not.toHaveBeenCalled()
    // ao digitar a hora, o valor fica completo
    await typeTime(user, '1800')
    expect(onChange).toHaveBeenLastCalledWith(
      new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0),
    )
  })

  it('uma hora pela metade dá lugar ao defaultTime quando o dia é escolhido', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DateTimePicker label="Publicação" defaultTime="09:00" onChange={onChange} />)
    await typeTime(user, '14')
    expect(shownTime()).toBe('14:--')
    await user.click(screen.getByRole('button', { name: 'Escolher data' }))
    await screen.findByRole('dialog')
    await user.click(screen.getByRole('button', { name: 'Hoje' }))
    expect(shownTime()).toBe('09:00')
    const now = new Date()
    expect(onChange).toHaveBeenLastCalledWith(
      new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0),
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
    await typeTime(user, '0730')
    expect(screen.getByText('Escolha um horário a partir de 08:00.')).toBeInTheDocument()
    expect(hour()).toHaveAttribute('aria-invalid', 'true')
    expect(minute()).toHaveAttribute('aria-invalid', 'true')
    expect(hour()).toHaveAccessibleDescription('Escolha um horário a partir de 08:00.')
    expect(dateInput()).not.toHaveAttribute('aria-invalid')
    expect(onChange).not.toHaveBeenCalledWith(expect.any(Date))

    await typeTime(user, '0800')
    expect(screen.queryByText(/Escolha um horário/)).not.toBeInTheDocument()
    expect(hour()).not.toHaveAttribute('aria-invalid')
    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 2, 10, 8, 0))

    await user.clear(dateInput())
    await user.type(dateInput(), '20032026')
    await typeTime(user, '1830')
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
    expect(hour()).toHaveFocus()
    await user.tab()
    expect(minute()).toHaveFocus()
    expect(screen.queryByText('Informe a hora.')).not.toBeInTheDocument()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Depois' })).toHaveFocus()
    expect(screen.getByText('Informe a hora.')).toBeInTheDocument()
    expect(hour()).toHaveAttribute('aria-invalid', 'true')
    expect(dateInput()).not.toHaveAttribute('aria-invalid')

    // o aviso fica até a hora estar completa
    await typeTime(user, '10')
    expect(shownTime()).toBe('10:--')
    expect(screen.getByText('Informe a hora.')).toBeInTheDocument()
    await user.keyboard('00')
    expect(screen.queryByText('Informe a hora.')).not.toBeInTheDocument()

    // hora pela metade também é hora que falta: avisa ao sair do grupo
    await user.keyboard('{Backspace}')
    expect(shownTime()).toBe('10:--')
    expect(screen.queryByText('Informe a hora.')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Depois' }))
    expect(screen.getByText('Informe a hora.')).toBeInTheDocument()
    await typeTime(user, '00', minute())
    expect(screen.queryByText('Informe a hora.')).not.toBeInTheDocument()

    // só a hora
    await user.clear(dateInput())
    await user.click(screen.getByRole('button', { name: 'Depois' }))
    expect(screen.getByText('Informe a data.')).toBeInTheDocument()
    expect(dateInput()).toHaveAttribute('aria-invalid', 'true')
  })

  it('teclado: Tab percorre data → calendário → hora → minuto; Alt+↓ abre e Escape fecha', async () => {
    const user = userEvent.setup()
    render(<DateTimePicker label="Reunião" defaultValue={reuniao} />)
    await user.tab()
    expect(dateInput()).toHaveFocus()
    await user.tab()
    const button = screen.getByRole('button', { name: /^Alterar data/ })
    expect(button).toHaveFocus()
    await user.tab()
    expect(hour()).toHaveFocus()
    // entre os segmentos, as setas laterais também andam
    await user.keyboard('{ArrowRight}')
    expect(minute()).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(hour()).toHaveFocus()

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

  it('modo controlado sincroniza a data, a hora e o input oculto', async () => {
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
    expect(shownTime()).toBe('10:00')
    expect(hidden()).toHaveAttribute('type', 'hidden')
    expect(hidden()).toHaveValue('2026-05-01T10:00')

    await user.click(screen.getByRole('button', { name: 'Ceia de Natal' }))
    expect(dateInput()).toHaveValue('24/12/2026')
    expect(shownTime()).toBe('19:45')
    expect(hidden()).toHaveValue('2026-12-24T19:45')

    await typeTime(user, '2000')
    expect(hidden()).toHaveValue('2026-12-24T20:00')
    await user.keyboard('{Backspace}')
    expect(shownTime()).toBe('20:--')
    expect(hidden()).toHaveValue('')
    // a data digitada continua no campo enquanto a hora é refeita
    expect(dateInput()).toHaveValue('24/12/2026')
    await user.keyboard('30')
    expect(hidden()).toHaveValue('2026-12-24T20:30')

    await user.click(screen.getByRole('button', { name: 'Limpar' }))
    expect(dateInput()).toHaveValue('')
    expect(shownTime()).toBe('--:--')
  })

  it('não controlado: defaultValue preenche a data e a hora', () => {
    render(<DateTimePicker label="Reunião" defaultValue={reuniao} name="reuniao" />)
    expect(dateInput()).toHaveValue('15/03/2026')
    expect(shownTime()).toBe('14:30')
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
    const [publicacao, largada] = screen.getAllByRole('group', { name: 'Hora' })
    expect(publicacao).toHaveTextContent('14:30')
    // step abaixo de um minuto: aparece o segmento dos segundos
    expect(largada).toHaveTextContent('08:00:05')
    expect(within(largada).getByRole('spinbutton', { name: /^segundo/ })).toBeInTheDocument()
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
    await typeTime(user, '1430')
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(dateInput()).not.toHaveAttribute('aria-invalid')
  })

  it('Enter num segmento da hora envia o formulário, como na data', async () => {
    const user = userEvent.setup()
    let sent: FormDataEntryValue | null = null
    render(
      <form
        onSubmit={(event) => {
          event.preventDefault()
          sent = new FormData(event.currentTarget).get('reuniao')
        }}
      >
        <DateTimePicker label="Reunião" name="reuniao" defaultValue={reuniao} />
      </form>,
    )
    await typeTime(user, '0845{Enter}')
    expect(sent).toBe('2026-03-15T08:45')
  })

  it('para a validação nativa, hora pela metade ou faltando invalida o campo de data', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <form>
        <DateTimePicker label="Reunião" name="reuniao" required />
      </form>,
    )
    const form = container.querySelector('form') as HTMLFormElement
    const date = dateInput() as HTMLInputElement
    // vazio e obrigatório: quem barra é o `required` da data
    expect(date.validity.valueMissing).toBe(true)
    expect(date.validity.customError).toBe(false)
    await user.type(date, '15032026')
    expect(date.validationMessage).toBe('Informe a hora.')
    expect(form.checkValidity()).toBe(false)
    await typeTime(user, '14')
    expect(date.validationMessage).toBe('Horário incompleto.')
    await user.keyboard('30')
    expect(date.validity.valid).toBe(true)
    expect(form.checkValidity()).toBe(true)
  })

  it('clicar no relógio ou na área livre da hora foca o primeiro segmento', () => {
    const { container } = render(<DateTimePicker label="Reunião" defaultValue={reuniao} />)
    const clock = container.querySelector('.or-date-time-picker__clock') as HTMLElement
    const down = fireEvent.pointerDown(clock)
    expect(down).toBe(false) // preventDefault: o clique não tira o foco do segmento
    expect(hour()).toHaveFocus()
    minute().focus()
    fireEvent.pointerDown(container.querySelector('.or-date-time-picker__time') as HTMLElement)
    expect(hour()).toHaveFocus()
    // no próprio segmento, o clique segue o caminho dele
    expect(fireEvent.pointerDown(minute())).toBe(true)
  })

  it('desabilitado e somente leitura bloqueiam a data, a hora e o calendário', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<DateTimePicker label="Reunião" disabled defaultValue={reuniao} />)
    expect(dateInput()).toBeDisabled()
    expect(timeGroup()).toHaveAttribute('aria-disabled', 'true')
    screen.getAllByRole('spinbutton').forEach((item) => {
      expect(item).toHaveAttribute('tabindex', '-1')
      expect(item).toHaveAttribute('aria-disabled', 'true')
      expect(item).not.toHaveAttribute('contenteditable')
    })
    expect(screen.getByRole('button', { name: /^Alterar data/ })).toBeDisabled()
    await user.tab()
    expect(document.body).toHaveFocus()
    unmount()

    const onChange = vi.fn()
    render(<DateTimePicker label="Reunião" readOnly defaultValue={reuniao} onChange={onChange} />)
    expect(dateInput()).toHaveAttribute('readonly')
    expect(hour()).toHaveAttribute('aria-readonly', 'true')
    expect(hour()).not.toHaveAttribute('contenteditable')
    expect(screen.getByRole('button', { name: /^Alterar data/ })).toBeDisabled()
    // dá para focar e ler a hora, mas nada muda
    await typeTime(user, '{ArrowUp}09{Backspace}')
    await user.paste('08:00')
    expect(shownTime()).toBe('14:30')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('required marca a data e a hora; erro externo tem precedência; invalid sem mensagem', () => {
    const { container, rerender } = render(
      <DateTimePicker label="Reunião" required error="Informe a data e a hora da reunião." />,
    )
    expect(dateInput()).toBeRequired()
    expect(hour()).toBeRequired()
    expect(minute()).toBeRequired()
    expect(dateInput()).toHaveAttribute('aria-invalid', 'true')
    expect(hour()).toHaveAttribute('aria-invalid', 'true')
    expect(dateInput()).toHaveAccessibleDescription(
      'Informe a data e a hora da reunião. Formato: dd/mm/aaaa',
    )
    rerender(<DateTimePicker label="Reunião" invalid />)
    expect(dateInput()).toHaveAttribute('aria-invalid', 'true')
    expect(hour()).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('group', { name: 'Reunião' })).toHaveAttribute('data-invalid')
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
})

describe('DateTimePicker: hora em segmentos', () => {
  it('o relógio de 12 ou 24 horas vem do idioma do provider', () => {
    const portuguese = render(<DateTimePicker label="Reunião" defaultValue={reuniao} />)
    expect(shownTime()).toBe('14:30')
    expect(screen.getAllByRole('spinbutton')).toHaveLength(2)
    portuguese.unmount()

    const english = renderIn('en-US', <DateTimePicker label="Meeting" defaultValue={reuniao} />)
    expect(shownTime('Time')).toBe('02:30 PM')
    expect(segment(/^hour/)).toHaveAttribute('aria-valuemax', '12')
    expect(segment(/^AM or PM/)).toHaveAttribute('aria-valuetext', 'PM')
    english.unmount()

    renderIn('es-ES', <DateTimePicker label="Reunión" defaultValue={reuniao} />)
    expect(screen.getByRole('group', { name: 'Hora' })).toHaveTextContent('14:30')
    expect(screen.getAllByRole('spinbutton')).toHaveLength(2)
  })

  it('em en-US, o valor continua em 24 horas e o aviso usa o relógio do campo', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderIn(
      'en-US',
      <DateTimePicker
        label="Delivery"
        min={new Date(2026, 2, 10, 8, 0)}
        defaultValue={new Date(2026, 2, 10, 9, 0)}
        onChange={onChange}
      />,
    )
    await user.click(segment(/^AM or PM/))
    await user.keyboard('p')
    expect(shownTime('Time')).toBe('09:00 PM')
    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 2, 10, 21, 0))
    await typeTime(user, '07', segment(/^hour/))
    await user.click(segment(/^AM or PM/))
    await user.keyboard('a')
    expect(screen.getByText('Choose a time at or after 08:00 AM.')).toBeInTheDocument()
    expect(onChange).toHaveBeenLastCalledWith(null)
  })

  it('as setas mudam o segmento, andam no step e dão a volta dentro dele', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DateTimePicker label="Reunião" defaultValue={reuniao} step={900} onChange={onChange} />)
    await user.click(minute())
    await user.keyboard('{ArrowUp}')
    expect(shownTime()).toBe('14:45')
    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 2, 15, 14, 45))
    await user.keyboard('{ArrowUp}')
    expect(shownTime()).toBe('14:00')
    await user.keyboard('{ArrowDown}{ArrowDown}')
    expect(shownTime()).toBe('14:30')
    await user.keyboard('{Home}')
    expect(shownTime()).toBe('14:00')
    await user.keyboard('{End}')
    expect(shownTime()).toBe('14:45')
    await user.keyboard('{ArrowLeft}{ArrowUp}')
    expect(shownTime()).toBe('15:45')
    await user.keyboard('{PageDown}')
    expect(shownTime()).toBe('13:45')
  })

  it('o step conta a partir da meia-noite e um horário fora dele encaixa na primeira seta', async () => {
    const user = userEvent.setup()
    render(
      <DateTimePicker
        label="Reunião"
        step={900}
        min={new Date(2026, 2, 15, 8, 10)}
        defaultValue={new Date(2026, 2, 15, 14, 37)}
      />,
    )
    // digitado fora do step, o horário continua valendo: o step só guia as setas
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    await user.click(minute())
    await user.keyboard('{ArrowUp}')
    expect(shownTime()).toBe('14:45')
    await user.keyboard('{ArrowDown}{ArrowDown}')
    // 14:15, e não 14:10: os minutos do `min` (08:10) não deslocam o step
    expect(shownTime()).toBe('14:15')
  })

  it('no dia de min e no de max as setas param no limite; nos outros dias, não', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <DateTimePicker
        label="Entrega agendada"
        min={new Date(2026, 2, 10, 8, 0)}
        max={new Date(2026, 2, 20, 18, 0)}
        defaultValue={new Date(2026, 2, 10, 9, 30)}
        onChange={onChange}
      />,
    )
    // dia de min (10/03): a hora desce até 08:00 e fica
    await user.click(hour())
    await user.keyboard('{ArrowDown}')
    expect(shownTime()).toBe('08:30')
    await user.keyboard('{ArrowDown}')
    expect(shownTime()).toBe('08:00')
    await user.keyboard('{ArrowDown}{PageDown}')
    expect(shownTime()).toBe('08:00')
    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 2, 10, 8, 0))
    expect(screen.queryByText(/Escolha um horário/)).not.toBeInTheDocument()

    // dia de max (20/03): sobe até 18:00 e fica
    await user.clear(dateInput())
    await user.type(dateInput(), '20032026')
    await user.click(hour())
    for (let i = 0; i < 12; i++) await user.keyboard('{ArrowUp}')
    expect(shownTime()).toBe('18:00')
    await user.keyboard('{ArrowRight}{ArrowUp}')
    expect(shownTime()).toBe('18:00')
    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 2, 20, 18, 0))

    // dia do meio (12/03): qualquer horário vale e a hora dá a volta
    await user.clear(dateInput())
    await user.type(dateInput(), '12032026')
    await user.click(hour())
    for (let i = 0; i < 6; i++) await user.keyboard('{ArrowUp}')
    expect(shownTime()).toBe('00:00')
    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 2, 12, 0, 0))
    await user.keyboard('{ArrowDown}')
    expect(shownTime()).toBe('23:00')
  })

  it('um min com segundos (agora) vale a partir do primeiro minuto inteiro', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <DateTimePicker
        label="Agendar publicação"
        min={new Date(2026, 2, 10, 14, 23, 37)}
        defaultValue={new Date(2026, 2, 10, 15, 0)}
        onChange={onChange}
      />,
    )
    await user.click(hour())
    await user.keyboard('{ArrowDown}')
    // 14:00 é cedo demais: a seta para em 14:24, o primeiro minuto depois de 14:23:37
    expect(shownTime()).toBe('14:24')
    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 2, 10, 14, 24))
    await typeTime(user, '23', minute())
    expect(screen.getByText('Escolha um horário a partir de 14:24.')).toBeInTheDocument()
    expect(onChange).toHaveBeenLastCalledWith(null)
  })

  it('no meio de um número o aviso de limite espera a pessoa terminar', async () => {
    const user = userEvent.setup()
    render(
      <DateTimePicker
        label="Entrega agendada"
        min={new Date(2026, 2, 10, 8, 0)}
        defaultValue={new Date(2026, 2, 10, 9, 30)}
      />,
    )
    await typeTime(user, '1')
    // "01:30" à espera do segundo dígito: ainda não é hora de reclamar
    expect(shownTime()).toBe('01:30')
    expect(screen.queryByText(/Escolha um horário/)).not.toBeInTheDocument()
    await user.keyboard('5')
    expect(shownTime()).toBe('15:30')
    expect(screen.queryByText(/Escolha um horário/)).not.toBeInTheDocument()
    // parou no "0" e saiu da hora: agora o aviso aparece
    await typeTime(user, '0')
    expect(screen.queryByText(/Escolha um horário/)).not.toBeInTheDocument()
    await user.click(dateInput())
    expect(screen.getByText('Escolha um horário a partir de 08:00.')).toBeInTheDocument()
  })

  it('colar um horário preenche a hora; Backspace volta ao segmento anterior', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DateTimePicker label="Reunião" defaultValue={reuniao} onChange={onChange} />)
    await user.click(minute())
    await user.paste('9h15')
    expect(shownTime()).toBe('09:15')
    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 2, 15, 9, 15))
    await user.paste('não é horário')
    expect(shownTime()).toBe('09:15')
    await user.keyboard('{Backspace}')
    expect(shownTime()).toBe('09:--')
    await user.keyboard('{Backspace}')
    expect(hour()).toHaveFocus()
  })

  it('teclado virtual: o texto que chega por beforeinput preenche os segmentos', () => {
    const onChange = vi.fn()
    render(<DateTimePicker label="Reunião" defaultValue={reuniao} onChange={onChange} />)
    hour().focus()
    const typed = new InputEvent('beforeinput', {
      bubbles: true,
      cancelable: true,
      data: '0930',
      inputType: 'insertText',
    })
    fireEvent(hour(), typed)
    expect(typed.defaultPrevented).toBe(true)
    expect(shownTime()).toBe('09:30')
    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 2, 15, 9, 30))
  })
})

describe('DateTimePicker: acessibilidade', () => {
  it('não possui violações (fechado, com erro, com segmento em foco e aberto)', async () => {
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
        <DateTimePicker label="Arquivado" readOnly defaultValue={reuniao} />
      </div>,
    )
    await expectNoA11yViolations(container)
    await user.click(screen.getAllByRole('spinbutton')[0])
    await user.keyboard('{ArrowUp}')
    await expectNoA11yViolations(container)
    await user.click(screen.getAllByRole('button', { name: /^Alterar data/ })[0])
    await screen.findByRole('dialog')
    await expectNoA11yViolations(document.body)
  })

  it('não possui violações no relógio de 12 horas, com aviso de limite', async () => {
    const { container } = renderIn(
      'en-US',
      <DateTimePicker
        label="Delivery"
        description="Pacific time."
        max={new Date(2026, 2, 10, 18, 0)}
        defaultValue={new Date(2026, 2, 10, 19, 0)}
      />,
    )
    expect(screen.getByText('Choose a time at or before 06:00 PM.')).toBeInTheDocument()
    await expectNoA11yViolations(container)
  })
})
