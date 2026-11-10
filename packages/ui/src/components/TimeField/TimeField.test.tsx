import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, useState, type ReactElement } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider, type Locale } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Modal } from '../Modal'
import { TimeField } from './TimeField'

/** O input oculto que guarda o valor (`HH:mm`). */
const getInput = (container: HTMLElement) =>
  container.querySelector('input[type="time"]') as HTMLInputElement

const segment = (name: string | RegExp) => screen.getByRole('spinbutton', { name })
const segments = () => screen.getAllByRole('spinbutton')
/** O que a pessoa lê no campo: "09:30", "02:30 PM", "--:--". */
const shown = (container: HTMLElement) =>
  container.querySelector('.or-time-field__segments')?.textContent

const renderIn = (locale: Locale, ui: ReactElement) =>
  render(
    <OrangeProvider locale={locale} themeTarget="scoped">
      {ui}
    </OrangeProvider>,
  )

describe('TimeField: estrutura', () => {
  it('mostra segmentos de hora e minuto rotulados pelo campo', () => {
    const { container } = render(
      <TimeField label="Horário de início" description="Horário de Brasília" />,
    )
    expect(screen.getByRole('group', { name: 'Horário de início' })).toBeInTheDocument()
    const [hour, minute] = segments()
    expect(hour).toHaveAccessibleName('hora Horário de início')
    expect(minute).toHaveAccessibleName('minuto Horário de início')
    // A descrição é lida uma vez, no primeiro segmento.
    expect(hour).toHaveAccessibleDescription('Horário de Brasília')
    expect(minute).not.toHaveAttribute('aria-describedby')
    expect(shown(container)).toBe('--:--')
    expect(hour).toHaveAttribute('aria-valuetext', 'vazio')
    expect(hour).not.toHaveAttribute('aria-valuenow')
    expect(container.querySelector('.or-control-frame')).toHaveClass('or-control-frame--md')
  })

  it('guarda o valor num input type="time" oculto, fora do Tab e dos leitores de tela', () => {
    const { container } = render(
      <TimeField label="Horário" defaultValue="09:30" min="08:00" max="18:00" step={900} />,
    )
    const input = getInput(container)
    expect(input).toHaveValue('09:30')
    expect(input).toHaveAttribute('aria-hidden', 'true')
    expect(input).toHaveAttribute('tabindex', '-1')
    expect(input).toHaveAttribute('min', '08:00')
    expect(input).toHaveAttribute('max', '18:00')
    expect(input).toHaveAttribute('step', '900')
  })

  it('mostra o valor inicial nos segmentos, com os valores para leitores de tela', () => {
    const { container } = render(<TimeField label="Horário" defaultValue="09:05" />)
    expect(shown(container)).toBe('09:05')
    const hour = segment(/^hora/)
    expect(hour).toHaveAttribute('aria-valuenow', '9')
    expect(hour).toHaveAttribute('aria-valuemin', '0')
    expect(hour).toHaveAttribute('aria-valuemax', '23')
    expect(hour).toHaveAttribute('aria-valuetext', '09')
    expect(segment(/^minuto/)).toHaveAttribute('aria-valuenow', '5')
  })

  it('sem rótulo visível, usa o aria-label no grupo e em cada segmento', () => {
    render(<TimeField aria-label="Início" />)
    expect(screen.getByRole('group', { name: 'Início' })).toBeInTheDocument()
    expect(segments()[0]).toHaveAccessibleName('hora, Início')
    expect(segments()[1]).toHaveAccessibleName('minuto, Início')
  })

  it('aplica a classe do tamanho e repassa className', () => {
    const { container } = render(<TimeField label="Horário" size="lg" className="extra" />)
    expect(container.querySelector('.or-control-frame')).toHaveClass('or-control-frame--lg')
    expect(container.querySelector('.or-time-field')).toHaveClass('extra')
  })

  it('mostra o segmento de segundos quando o passo é menor que um minuto', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { container } = render(
      <TimeField label="Horário" step={30} defaultValue="10:15:00" onChange={onChange} />,
    )
    expect(segments()).toHaveLength(3)
    expect(shown(container)).toBe('10:15:00')
    await user.click(segment(/^segundo/))
    await user.keyboard('{ArrowUp}')
    expect(onChange).toHaveBeenLastCalledWith('10:15:30', expect.anything())
    await user.keyboard('{ArrowUp}')
    expect(shown(container)).toBe('10:15:00')
  })
})

describe('TimeField: digitação', () => {
  it('digitar preenche os segmentos, avança sozinho e emite HH:mm com o evento do input', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { container } = render(<TimeField label="Horário" onChange={onChange} />)
    await user.click(segment(/^hora/))
    await user.keyboard('09')
    expect(segment(/^minuto/)).toHaveFocus()
    // Só a hora: o valor ainda é vazio, como no input nativo.
    expect(getInput(container)).toHaveValue('')
    await user.keyboard('30')
    expect(shown(container)).toBe('09:30')
    expect(getInput(container)).toHaveValue('09:30')
    expect(onChange).toHaveBeenLastCalledWith('09:30', expect.anything())
    const event = onChange.mock.lastCall?.[1]
    expect(event.target).toBe(getInput(container))
    expect(event.type).toBe('change')
  })

  it('um dígito que não admite outro depois já passa para o próximo segmento', async () => {
    const user = userEvent.setup()
    const { container } = render(<TimeField label="Horário" />)
    await user.click(segment(/^hora/))
    await user.keyboard('9')
    expect(segment(/^minuto/)).toHaveFocus()
    await user.keyboard('7')
    expect(shown(container)).toBe('09:07')
  })

  it('um número grande demais recomeça pelo último dígito', async () => {
    const user = userEvent.setup()
    const { container } = render(<TimeField label="Horário" />)
    await user.click(segment(/^hora/))
    await user.keyboard('25')
    expect(shown(container)).toBe('05:--')
    expect(segment(/^minuto/)).toHaveFocus()
  })

  it('dois-pontos avança, setas laterais andam entre os segmentos', async () => {
    const user = userEvent.setup()
    render(<TimeField label="Horário" />)
    await user.click(segment(/^hora/))
    await user.keyboard('1:')
    expect(segment(/^minuto/)).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(segment(/^hora/)).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(segment(/^hora/)).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(segment(/^minuto/)).toHaveFocus()
  })

  it('Backspace apaga o segmento (o valor fica vazio) e, vazio, volta ao anterior', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { container } = render(
      <TimeField label="Horário" defaultValue="09:30" onChange={onChange} />,
    )
    await user.click(segment(/^minuto/))
    await user.keyboard('{Backspace}')
    expect(shown(container)).toBe('09:--')
    expect(onChange).toHaveBeenLastCalledWith('', expect.anything())
    await user.keyboard('{Backspace}')
    expect(segment(/^hora/)).toHaveFocus()
    await user.keyboard('{Delete}')
    expect(shown(container)).toBe('--:--')
  })

  it('colar um horário escrito de outro jeito preenche o campo', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { container } = render(<TimeField label="Horário" onChange={onChange} />)
    await user.click(segment(/^hora/))
    await user.paste('14h30')
    expect(shown(container)).toBe('14:30')
    expect(onChange).toHaveBeenLastCalledWith('14:30', expect.anything())
    await user.paste('não é horário')
    expect(shown(container)).toBe('14:30')
  })

  it('teclado virtual: o texto que chega por beforeinput é tratado e nunca inserido', () => {
    const { container } = render(<TimeField label="Horário" />)
    const hour = segment(/^hora/)
    hour.focus()
    const typed = new InputEvent('beforeinput', {
      bubbles: true,
      cancelable: true,
      data: '7',
      inputType: 'insertText',
    })
    fireEvent(hour, typed)
    expect(typed.defaultPrevented).toBe(true)
    expect(shown(container)).toBe('07:--')
    const erased = new InputEvent('beforeinput', {
      bubbles: true,
      cancelable: true,
      inputType: 'deleteContentBackward',
    })
    fireEvent(segment(/^hora/), erased)
    expect(shown(container)).toBe('--:--')
  })

  it('teclado virtual: vários caracteres de uma vez seguem de um segmento para o outro', () => {
    const onChange = vi.fn()
    const { container } = render(<TimeField label="Horário" onChange={onChange} />)
    const hour = segment(/^hora/)
    hour.focus()
    fireEvent(
      hour,
      new InputEvent('beforeinput', {
        bubbles: true,
        cancelable: true,
        data: '0930',
        inputType: 'insertText',
      }),
    )
    expect(shown(container)).toBe('09:30')
    expect(onChange).toHaveBeenLastCalledWith('09:30', expect.anything())
  })

  it('teclado virtual: texto composto é desfeito no segmento e tratado pela última tecla', () => {
    const { container } = render(<TimeField label="Horário" hourCycle={12} defaultValue="09:30" />)
    const period = segment(/^AM ou PM/)
    period.focus()
    const composing = new InputEvent('beforeinput', {
      bubbles: true,
      cancelable: true,
      data: 'p',
      inputType: 'insertCompositionText',
    })
    fireEvent(period, composing)
    // Esse o navegador não deixa cancelar: ele escreve no segmento…
    expect(composing.defaultPrevented).toBe(false)
    period.textContent = 'AMp'
    fireEvent(
      period,
      new InputEvent('input', { bubbles: true, data: 'p', inputType: 'insertCompositionText' }),
    )
    // …e o campo desfaz e trata a tecla.
    expect(shown(container)).toBe('09:30 PM')
    expect(getInput(container)).toHaveValue('21:30')
  })

  it('letras e símbolos soltos não mudam nada', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { container } = render(<TimeField label="Horário" onChange={onChange} />)
    await user.click(segment(/^hora/))
    await user.keyboard('xz!')
    expect(shown(container)).toBe('--:--')
    expect(onChange).not.toHaveBeenCalled()
  })
})

describe('TimeField: setas, passo e limites', () => {
  it('setas para cima e para baixo mudam o segmento e dão a volta', async () => {
    const user = userEvent.setup()
    const { container } = render(<TimeField label="Horário" defaultValue="23:59" />)
    await user.click(segment(/^hora/))
    await user.keyboard('{ArrowUp}')
    expect(shown(container)).toBe('00:59')
    await user.keyboard('{ArrowDown}')
    expect(shown(container)).toBe('23:59')
    await user.keyboard('{ArrowRight}{ArrowUp}')
    expect(shown(container)).toBe('23:00')
  })

  it('num segmento vazio, a seta começa pelo primeiro (ou último) valor', async () => {
    const user = userEvent.setup()
    const { container } = render(<TimeField label="Horário" />)
    await user.click(segment(/^hora/))
    await user.keyboard('{ArrowUp}{ArrowRight}{ArrowDown}')
    expect(shown(container)).toBe('00:59')
  })

  it('os minutos andam no passo, contado a partir do mínimo', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <TimeField label="Horário" defaultValue="10:10" min="08:10" step={900} />,
    )
    await user.click(segment(/^minuto/))
    await user.keyboard('{ArrowUp}')
    expect(shown(container)).toBe('10:25')
    await user.keyboard('{ArrowUp}{ArrowUp}{ArrowUp}')
    expect(shown(container)).toBe('10:10')
    await user.keyboard('{ArrowDown}')
    expect(shown(container)).toBe('10:55')
  })

  it('um valor fora do passo encaixa no passo com a primeira seta', async () => {
    const user = userEvent.setup()
    const { container } = render(<TimeField label="Horário" defaultValue="10:07" step={900} />)
    await user.click(segment(/^minuto/))
    await user.keyboard('{ArrowUp}')
    expect(shown(container)).toBe('10:15')
    await user.keyboard('{ArrowDown}{ArrowDown}')
    expect(shown(container)).toBe('10:45')
  })

  it('PageUp/PageDown andam mais; Home e End vão aos extremos', async () => {
    const user = userEvent.setup()
    const { container } = render(<TimeField label="Horário" defaultValue="10:20" />)
    await user.click(segment(/^hora/))
    await user.keyboard('{PageUp}')
    expect(shown(container)).toBe('12:20')
    await user.keyboard('{End}')
    expect(shown(container)).toBe('23:20')
    await user.keyboard('{ArrowRight}{PageDown}')
    expect(shown(container)).toBe('23:05')
    await user.keyboard('{Home}')
    expect(shown(container)).toBe('23:00')
  })

  it('as setas param em min e max em vez de passar do limite', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { container } = render(
      <TimeField
        label="Horário"
        defaultValue="17:30"
        min="08:00"
        max="18:00"
        step={900}
        onChange={onChange}
      />,
    )
    await user.click(segment(/^hora/))
    await user.keyboard('{ArrowUp}')
    expect(shown(container)).toBe('18:00')
    await user.keyboard('{ArrowUp}{ArrowUp}')
    expect(shown(container)).toBe('18:00')
    expect(screen.queryByText(/Escolha um horário/)).not.toBeInTheDocument()
    await user.keyboard('{ArrowRight}{ArrowUp}')
    expect(shown(container)).toBe('18:00')
    expect(onChange).toHaveBeenLastCalledWith('18:00', expect.anything())
  })
})

describe('TimeField: relógio de 12 horas', () => {
  it('em inglês americano mostra AM/PM e emite o valor em 24 horas', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { container } = renderIn('en-US', <TimeField label="Start" onChange={onChange} />)
    expect(segments().map((item) => item.getAttribute('aria-label'))).toEqual([
      'hour',
      'minute',
      'AM or PM',
    ])
    await user.click(segment(/^hour/))
    await user.keyboard('0230')
    expect(segment(/^AM or PM/)).toHaveFocus()
    // Falta o período: ainda não há horário.
    expect(getInput(container)).toHaveValue('')
    await user.keyboard('p')
    expect(shown(container)).toBe('02:30 PM')
    expect(onChange).toHaveBeenLastCalledWith('14:30', expect.anything())
    await user.keyboard('{ArrowUp}')
    expect(shown(container)).toBe('02:30 AM')
    expect(onChange).toHaveBeenLastCalledWith('02:30', expect.anything())
  })

  it('a hora anda como no mostrador: 11, 12, 1', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { container } = renderIn(
      'en-US',
      <TimeField label="Start" defaultValue="23:00" onChange={onChange} />,
    )
    expect(shown(container)).toBe('11:00 PM')
    const hour = segment(/^hour/)
    expect(hour).toHaveAttribute('aria-valuemin', '1')
    expect(hour).toHaveAttribute('aria-valuemax', '12')
    await user.click(hour)
    await user.keyboard('{ArrowUp}')
    expect(shown(container)).toBe('12:00 PM')
    expect(onChange).toHaveBeenLastCalledWith('12:00', expect.anything())
    await user.keyboard('{ArrowUp}')
    expect(shown(container)).toBe('01:00 PM')
  })

  it('no relógio de 12h o zero sozinho é só o zero à esquerda', async () => {
    const user = userEvent.setup()
    const { container } = renderIn('en-US', <TimeField label="Start" />)
    await user.click(segment(/^hour/))
    await user.keyboard('0')
    expect(shown(container)).toBe('--:-- --')
    await user.keyboard('7')
    expect(shown(container)).toBe('07:-- --')
  })

  it('hourCycle vence o idioma, nos dois sentidos', () => {
    const { container, unmount } = render(
      <TimeField label="Horário" defaultValue="14:30" hourCycle={12} />,
    )
    expect(shown(container)).toBe('02:30 PM')
    unmount()
    const english = renderIn('en-US', <TimeField label="Start" defaultValue="14:30" hourCycle={24} />)
    expect(shown(english.container)).toBe('14:30')
  })

  it('em espanhol o relógio é de 24 horas', () => {
    const { container } = renderIn('es-ES', <TimeField label="Hora" defaultValue="14:30" />)
    expect(shown(container)).toBe('14:30')
    expect(segments()).toHaveLength(2)
  })
})

describe('TimeField: avisos do próprio campo', () => {
  it('avisa quando o horário digitado fica fora de min e max', async () => {
    const user = userEvent.setup()
    render(<TimeField label="Horário" min="08:00" max="18:00" />)
    await user.click(segment(/^hora/))
    await user.keyboard('1930')
    expect(screen.getByText('Escolha um horário até 18:00.')).toBeInTheDocument()
    segments().forEach((item) => expect(item).toHaveAttribute('aria-invalid', 'true'))
    expect(segments()[0]).toHaveAccessibleDescription('Escolha um horário até 18:00.')
    await user.click(segment(/^hora/))
    await user.keyboard('07')
    expect(screen.getByText('Escolha um horário a partir de 08:00.')).toBeInTheDocument()
    await user.click(segment(/^hora/))
    await user.keyboard('09')
    expect(screen.queryByText(/Escolha um horário/)).not.toBeInTheDocument()
    expect(segments()[0]).not.toHaveAttribute('aria-invalid')
  })

  it('avisa quando o horário não está no passo, mas não no meio de um número', async () => {
    const user = userEvent.setup()
    render(<TimeField label="Horário" step={900} />)
    await user.click(segment(/^hora/))
    await user.keyboard('101')
    // "10:01" à espera do segundo dígito: ainda não é hora de reclamar.
    expect(screen.queryByText(/intervalos/)).not.toBeInTheDocument()
    await user.keyboard('5')
    expect(screen.queryByText(/intervalos/)).not.toBeInTheDocument()
    await user.keyboard('07')
    expect(
      screen.getByText('Escolha um horário em intervalos de 15 minutos.'),
    ).toBeInTheDocument()
  })

  it('avisa ao sair do campo com o horário pela metade e para quando ele é completado', async () => {
    const user = userEvent.setup()
    render(
      <>
        <TimeField label="Horário" listStep={false} />
        <button type="button">Depois</button>
      </>,
    )
    await user.click(segment(/^hora/))
    await user.keyboard('09')
    expect(screen.queryByText('Horário incompleto.')).not.toBeInTheDocument()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Depois' })).toHaveFocus()
    expect(screen.getByText('Horário incompleto.')).toBeInTheDocument()
    await user.click(segment(/^minuto/))
    await user.keyboard('30')
    expect(screen.queryByText('Horário incompleto.')).not.toBeInTheDocument()
  })

  it('a prop error vence os avisos do campo; invalid marca sem mensagem', () => {
    const { rerender } = render(
      <TimeField label="Horário" defaultValue="20:00" max="18:00" error="Fora do expediente." />,
    )
    expect(screen.getByText('Fora do expediente.')).toBeInTheDocument()
    expect(screen.queryByText(/Escolha um horário/)).not.toBeInTheDocument()
    rerender(<TimeField label="Horário" defaultValue="10:00" invalid />)
    expect(segments()[0]).toHaveAttribute('aria-invalid', 'true')
  })

  it('escreve os avisos no relógio e no idioma do provider', () => {
    renderIn('en-US', <TimeField label="Start" defaultValue="20:00" max="18:00" />)
    expect(screen.getByText('Choose a time at or before 06:00 PM.')).toBeInTheDocument()
  })
})

describe('TimeField: lista de horários', () => {
  it('o botão do relógio abre a lista, com foco no horário escolhido', async () => {
    const user = userEvent.setup()
    render(<TimeField label="Horário" defaultValue="09:30" />)
    const button = screen.getByRole('button', { name: 'Alterar horário, 09:30' })
    expect(button).toHaveAttribute('aria-haspopup', 'listbox')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    const list = screen.getByRole('listbox', { name: 'Horários' })
    expect(button).toHaveAttribute('aria-controls', list.id)
    // De meia em meia hora, o dia inteiro.
    expect(within(list).getAllByRole('option')).toHaveLength(48)
    const chosen = within(list).getByRole('option', { name: '09:30' })
    expect(chosen).toHaveAttribute('aria-selected', 'true')
    expect(chosen).toHaveFocus()
  })

  it('escolher com o mouse emite, fecha e devolve o foco ao botão', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { container } = render(<TimeField label="Horário" onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Escolher horário' }))
    await user.click(screen.getByRole('option', { name: '14:30' }))
    expect(onChange).toHaveBeenLastCalledWith('14:30', expect.anything())
    expect(shown(container)).toBe('14:30')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Alterar horário, 14:30' })).toHaveFocus()
  })

  it('teclado na lista: setas, Home/End, Enter escolhe', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TimeField label="Horário" min="08:00" max="12:00" step={3600} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Escolher horário' }))
    const options = screen.getAllByRole('option')
    expect(options.map((option) => option.textContent)).toEqual([
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
    ])
    expect(options[0]).toHaveFocus()
    await user.keyboard('{ArrowDown}{ArrowDown}')
    expect(options[2]).toHaveFocus()
    await user.keyboard('{End}')
    expect(options[4]).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(options[4]).toHaveFocus()
    await user.keyboard('{Home}{ArrowDown}{Enter}')
    expect(onChange).toHaveBeenLastCalledWith('09:00', expect.anything())
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('digitar números na lista leva ao horário', async () => {
    const user = userEvent.setup()
    render(<TimeField label="Horário" />)
    await user.click(screen.getByRole('button', { name: 'Escolher horário' }))
    await user.keyboard('14')
    expect(screen.getByRole('option', { name: '14:00' })).toHaveFocus()
  })

  it('Escape e Tab fecham a lista e devolvem o foco ao botão, sem escolher', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TimeField label="Horário" onChange={onChange} />)
    const button = screen.getByRole('button', { name: 'Escolher horário' })
    await user.click(button)
    await user.keyboard('{ArrowDown}{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(button).toHaveFocus()
    await user.click(button)
    await user.tab()
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(button).toHaveFocus()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('o Escape da lista não chega a quem está por trás (um Modal, por exemplo)', async () => {
    const user = userEvent.setup()
    const onKeyDown = vi.fn()
    render(
      <div onKeyDown={onKeyDown}>
        <TimeField label="Horário" />
      </div>,
    )
    await user.click(screen.getByRole('button', { name: 'Escolher horário' }))
    await user.keyboard('{Escape}')
    expect(onKeyDown).not.toHaveBeenCalled()
  })

  it('Alt + seta para baixo abre a lista a partir de um segmento', async () => {
    const user = userEvent.setup()
    render(<TimeField label="Horário" defaultValue="10:10" />)
    await user.click(segment(/^hora/))
    await user.keyboard('{Alt>}{ArrowDown}{/Alt}')
    // 10:10 não está na lista: o foco vai para o próximo horário, 10:30.
    expect(screen.getByRole('option', { name: '10:30' })).toHaveFocus()
  })

  it('clicar fora fecha a lista', async () => {
    const user = userEvent.setup()
    render(
      <>
        <TimeField label="Horário" />
        <p>Fora</p>
      </>,
    )
    await user.click(screen.getByRole('button', { name: 'Escolher horário' }))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    await user.click(screen.getByText('Fora'))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('a lista segue o step quando ele é de 5 minutos ou mais, e listStep muda o intervalo', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<TimeField label="Horário" min="09:00" max="10:00" step={900} />)
    await user.click(screen.getByRole('button', { name: 'Escolher horário' }))
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      '09:00',
      '09:15',
      '09:30',
      '09:45',
      '10:00',
    ])
    rerender(<TimeField label="Horário" min="09:00" max="10:00" step={900} listStep={1800} />)
    expect(screen.getAllByRole('option')).toHaveLength(3)
  })

  it('listStep={false} tira o botão e a lista', async () => {
    const user = userEvent.setup()
    render(<TimeField label="Horário" listStep={false} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    await user.click(segment(/^hora/))
    await user.keyboard('{Alt>}{ArrowDown}{/Alt}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('a lista leva o tema do campo quando o provider está em escopo', async () => {
    const user = userEvent.setup()
    render(
      <OrangeProvider theme="light" themeTarget="scoped">
        <TimeField label="Horário" />
      </OrangeProvider>,
    )
    await user.click(screen.getByRole('button', { name: 'Escolher horário' }))
    expect(screen.getByRole('listbox').closest('.or-time-field__popup')).toHaveAttribute(
      'data-theme',
      'light',
    )
  })

  it('dentro de um Modal: Escape fecha só a lista e escolher não fecha o diálogo', async () => {
    const user = userEvent.setup()
    render(
      <Modal title="Agendar" defaultOpen>
        <TimeField label="Horário" />
      </Modal>,
    )
    const dialog = screen.getByRole('dialog', { name: 'Agendar' })
    await user.click(within(dialog).getByRole('button', { name: 'Escolher horário' }))
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(dialog).toBeInTheDocument()
    await user.click(within(dialog).getByRole('button', { name: 'Escolher horário' }))
    await user.click(screen.getByRole('option', { name: '10:00' }))
    expect(screen.getByRole('dialog', { name: 'Agendar' })).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Alterar horário, 10:00' })).toHaveFocus()
  })

  it('a lista usa o relógio do idioma', async () => {
    const user = userEvent.setup()
    renderIn('en-US', <TimeField label="Start" min="11:00" max="13:00" step={3600} />)
    await user.click(screen.getByRole('button', { name: 'Choose time' }))
    expect(screen.getByRole('listbox', { name: 'Times' })).toBeInTheDocument()
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      '11:00 AM',
      '12:00 PM',
      '01:00 PM',
    ])
  })
})

describe('TimeField: formulário, ref e foco', () => {
  it('a ref é o input do valor; focá-lo leva o foco ao primeiro segmento', () => {
    const ref = createRef<HTMLInputElement>()
    render(<TimeField label="Horário" defaultValue="09:30" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
    expect(ref.current).toHaveValue('09:30')
    ref.current?.focus()
    expect(segment(/^hora/)).toHaveFocus()
  })

  it('autoFocus começa com o foco no primeiro segmento', () => {
    render(<TimeField label="Horário" autoFocus />)
    expect(segment(/^hora/)).toHaveFocus()
  })

  it('clicar no rótulo foca o primeiro segmento', async () => {
    const user = userEvent.setup()
    render(<TimeField label="Horário" />)
    await user.click(screen.getByText('Horário'))
    expect(segment(/^hora/)).toHaveFocus()
  })

  it('envia o valor pelo name e Enter envia o formulário', async () => {
    const user = userEvent.setup()
    let sent: FormDataEntryValue | null = null
    render(
      <form
        onSubmit={(event) => {
          event.preventDefault()
          sent = new FormData(event.currentTarget).get('inicio')
        }}
      >
        <TimeField label="Horário" name="inicio" />
      </form>,
    )
    await user.click(segment(/^hora/))
    await user.keyboard('0845{Enter}')
    expect(sent).toBe('08:45')
  })

  it('horário pela metade é inválido para o formulário, como no input nativo', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <form>
        <TimeField label="Horário" name="inicio" />
      </form>,
    )
    const input = getInput(container)
    expect(input.validity.valid).toBe(true)
    await user.click(segment(/^hora/))
    await user.keyboard('09')
    expect(input.validity.customError).toBe(true)
    expect(input.validationMessage).toBe('Horário incompleto.')
    expect(container.querySelector('form')?.checkValidity()).toBe(false)
    await user.keyboard('30')
    expect(input.validity.valid).toBe(true)
  })

  it('onFocus e onBlur valem para o campo inteiro, não para cada segmento', async () => {
    const user = userEvent.setup()
    const onFocus = vi.fn()
    const onBlur = vi.fn()
    render(<TimeField label="Horário" onFocus={onFocus} onBlur={onBlur} />)
    await user.tab()
    expect(segment(/^hora/)).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    await user.tab()
    expect(screen.getByRole('button', { name: 'Escolher horário' })).toHaveFocus()
    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(onBlur).not.toHaveBeenCalled()
    await user.tab()
    expect(onBlur).toHaveBeenCalledTimes(1)
  })

  it('onKeyDown recebe as teclas e pode cancelar o comportamento do campo', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <TimeField
        label="Horário"
        defaultValue="10:00"
        onKeyDown={(event) => {
          if (event.key === 'ArrowUp') event.preventDefault()
        }}
      />,
    )
    await user.click(segment(/^hora/))
    await user.keyboard('{ArrowUp}')
    expect(shown(container)).toBe('10:00')
    await user.keyboard('{ArrowDown}')
    expect(shown(container)).toBe('09:00')
  })
})

describe('TimeField: controlado e estados', () => {
  it('controlado: mostra o value e acompanha mudanças de fora', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [value, setValue] = useState('08:00')
      return (
        <>
          <TimeField label="Horário" value={value} onChange={setValue} />
          <button type="button" onClick={() => setValue('16:45')}>
            Fim do dia
          </button>
          <button type="button" onClick={() => setValue('')}>
            Limpar
          </button>
          <output>{value}</output>
        </>
      )
    }
    const { container } = render(<Controlled />)
    expect(shown(container)).toBe('08:00')
    await user.click(segment(/^hora/))
    await user.keyboard('{ArrowUp}')
    expect(screen.getByRole('status')).toHaveTextContent('09:00')
    await user.click(screen.getByRole('button', { name: 'Fim do dia' }))
    expect(shown(container)).toBe('16:45')
    await user.click(screen.getByRole('button', { name: 'Limpar' }))
    expect(shown(container)).toBe('--:--')
  })

  it('controlado sem atualizar o value: o campo continua mostrando o value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { container } = render(<TimeField label="Horário" value="10:00" onChange={onChange} />)
    await user.click(segment(/^hora/))
    await user.keyboard('{ArrowUp}')
    expect(onChange).toHaveBeenLastCalledWith('11:00', expect.anything())
    expect(shown(container)).toBe('10:00')
    expect(getInput(container)).toHaveValue('10:00')
  })

  it('desabilitado: segmentos fora do Tab, botão e input desabilitados', async () => {
    const user = userEvent.setup()
    const { container } = render(<TimeField label="Horário" defaultValue="09:30" disabled />)
    segments().forEach((item) => {
      expect(item).toHaveAttribute('tabindex', '-1')
      expect(item).toHaveAttribute('aria-disabled', 'true')
      expect(item).not.toHaveAttribute('contenteditable')
    })
    expect(screen.getByRole('button')).toBeDisabled()
    expect(getInput(container)).toBeDisabled()
    expect(container.querySelector('.or-control-frame')).toHaveAttribute('data-disabled')
    await user.tab()
    expect(document.body).toHaveFocus()
  })

  it('somente leitura: dá para focar e ler, mas nada muda', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { container } = render(
      <TimeField label="Horário" defaultValue="09:30" readOnly onChange={onChange} />,
    )
    const hour = segment(/^hora/)
    expect(hour).toHaveAttribute('aria-readonly', 'true')
    expect(hour).not.toHaveAttribute('contenteditable')
    await user.click(hour)
    await user.keyboard('{ArrowUp}12{Backspace}')
    await user.paste('14:30')
    expect(shown(container)).toBe('09:30')
    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByRole('button')).toBeDisabled()
    await user.keyboard('{ArrowRight}')
    expect(segment(/^minuto/)).toHaveFocus()
  })

  it('obrigatório: marca os segmentos e o input do valor', () => {
    const { container } = render(<TimeField label="Horário" required />)
    segments().forEach((item) => expect(item).toHaveAttribute('aria-required', 'true'))
    expect(getInput(container)).toBeRequired()
  })
})

describe('TimeField: acessibilidade', () => {
  it('não tem violações no estado inicial, com valor e erro, e com a lista aberta', async () => {
    const user = userEvent.setup()
    const { container, rerender } = render(
      <TimeField label="Horário de início" description="Horário de Brasília" />,
    )
    await expectNoA11yViolations(container)
    rerender(
      <TimeField
        label="Horário de início"
        defaultValue="20:00"
        max="18:00"
        required
        description="Horário de Brasília"
      />,
    )
    await expectNoA11yViolations(container)
    await user.click(screen.getByRole('button'))
    await expectNoA11yViolations(document.body)
  })

  it('não tem violações no relógio de 12 horas, desabilitado e somente leitura', async () => {
    const { container } = renderIn(
      'en-US',
      <>
        <TimeField label="Start" defaultValue="14:30" />
        <TimeField label="Closed" defaultValue="09:00" disabled />
        <TimeField label="Fixed" defaultValue="09:00" readOnly />
      </>,
    )
    await expectNoA11yViolations(container)
  })
})
