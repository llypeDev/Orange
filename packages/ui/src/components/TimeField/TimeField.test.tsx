import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { TimeField } from './TimeField'

const getInput = (container: HTMLElement) =>
  container.querySelector('input[type="time"]') as HTMLInputElement

describe('TimeField', () => {
  it('renderiza um <input type="time"> rotulado dentro do frame', () => {
    const { container } = render(
      <TimeField label="Horário de início" description="Horário de Brasília" />,
    )
    const input = getInput(container)
    expect(input).toHaveAccessibleName('Horário de início')
    expect(input).toHaveAccessibleDescription('Horário de Brasília')
    expect(input.closest('.or-control-frame')).toHaveClass('or-control-frame--md')
    expect(container.querySelector('[data-icon="clock"]')).toHaveAttribute('aria-hidden', 'true')
  })

  it('repassa min, max e step', () => {
    const { container } = render(<TimeField label="Horário" min="08:00" max="18:00" step={900} />)
    const input = getInput(container)
    expect(input).toHaveAttribute('min', '08:00')
    expect(input).toHaveAttribute('max', '18:00')
    expect(input).toHaveAttribute('step', '900')
  })

  it('não controlado: usa defaultValue e emite onChange com a string HH:mm', () => {
    const onChange = vi.fn()
    const { container } = render(
      <TimeField label="Horário" defaultValue="09:30" onChange={onChange} />,
    )
    const input = getInput(container)
    expect(input).toHaveValue('09:30')
    fireEvent.change(input, { target: { value: '14:45' } })
    expect(input).toHaveValue('14:45')
    expect(onChange).toHaveBeenCalledWith('14:45', expect.anything())
  })

  it('controlado: reflete o valor do estado', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [time, setTime] = useState('10:00')
      return (
        <>
          <TimeField label="Horário" value={time} onChange={setTime} />
          <button type="button" onClick={() => setTime('16:20')}>
            Fim do expediente
          </button>
        </>
      )
    }
    const { container } = render(<Controlled />)
    expect(getInput(container)).toHaveValue('10:00')
    await user.click(screen.getByRole('button', { name: 'Fim do expediente' }))
    expect(getInput(container)).toHaveValue('16:20')
  })

  it('recebe foco pelo teclado', async () => {
    const user = userEvent.setup()
    const { container } = render(<TimeField label="Horário" />)
    await user.tab()
    expect(getInput(container)).toHaveFocus()
  })

  it('o ícone de relógio foca o campo e abre o seletor nativo', () => {
    const showPicker = vi.fn()
    const { container } = render(<TimeField label="Horário" />)
    const input = getInput(container)
    input.showPicker = showPicker
    fireEvent.pointerDown(container.querySelector('.or-time-field__icon')!)
    expect(input).toHaveFocus()
    expect(showPicker).toHaveBeenCalled()
  })

  it('mostra erro com aria-invalid e estados disabled/readOnly', () => {
    const { container, rerender } = render(
      <TimeField label="Horário" error="Escolha um horário comercial" />,
    )
    const input = getInput(container)
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Escolha um horário comercial')
    expect(input.closest('.or-control-frame')).toHaveAttribute('data-invalid')
    rerender(<TimeField label="Horário" disabled />)
    expect(getInput(container)).toBeDisabled()
    rerender(<TimeField label="Horário" readOnly />)
    expect(getInput(container)).toHaveAttribute('readonly')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <TimeField label="Início" defaultValue="09:00" required />
        <TimeField label="Fim" error="O fim deve ser depois do início" size="sm" />
        <TimeField label="Intervalo" disabled size="lg" />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
