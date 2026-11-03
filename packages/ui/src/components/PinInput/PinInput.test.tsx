import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { PinInput } from './PinInput'

const digits = () => screen.getAllByRole('textbox') as HTMLInputElement[]

describe('PinInput', () => {
  it('renderiza um grupo rotulado com um campo por dígito', () => {
    render(<PinInput label="Código de verificação" description="Enviamos por SMS" length={4} />)
    const group = screen.getByRole('group', { name: 'Código de verificação' })
    expect(group).toHaveAccessibleDescription('Enviamos por SMS')
    const fields = digits()
    expect(fields).toHaveLength(4)
    expect(fields[0]).toHaveAccessibleName('Dígito 1 de 4')
    expect(fields[3]).toHaveAccessibleName('Dígito 4 de 4')
    expect(fields[0]).toHaveAttribute('autocomplete', 'one-time-code')
    expect(fields[1]).toHaveAttribute('autocomplete', 'off')
    expect(fields[0]).toHaveAttribute('inputmode', 'numeric')
  })

  it('avança sozinho e chama onComplete', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const onComplete = vi.fn()
    render(<PinInput label="Código" length={4} onChange={onChange} onComplete={onComplete} />)
    await user.click(digits()[0])
    await user.keyboard('1234')
    expect(onChange).toHaveBeenLastCalledWith('1234')
    expect(onComplete).toHaveBeenCalledWith('1234')
    expect(digits()[3]).toHaveFocus()
  })

  it('ignora caracteres inválidos no modo numérico', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<PinInput label="Código" length={4} onChange={onChange} />)
    await user.click(digits()[0])
    await user.keyboard('a')
    expect(digits()[0]).toHaveValue('')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('aceita letras no modo alfanumérico', async () => {
    const user = userEvent.setup()
    render(<PinInput label="Cupom" length={3} type="alphanumeric" />)
    expect(digits()[0]).toHaveAccessibleName('Caractere 1 de 3')
    expect(digits()[0]).toHaveAttribute('inputmode', 'text')
    await user.click(digits()[0])
    await user.keyboard('a7Z')
    expect(digits().map((d) => d.value)).toEqual(['a', '7', 'Z'])
  })

  it('Backspace apaga e volta; setas, Home e End navegam', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<PinInput label="Código" length={4} defaultValue="123" onChange={onChange} />)
    const fields = digits()
    await user.click(fields[3])
    await user.keyboard('{Backspace}')
    expect(fields[2]).toHaveFocus()
    expect(onChange).toHaveBeenLastCalledWith('12')
    await user.keyboard('{Backspace}')
    expect(fields[1]).toHaveFocus()
    expect(fields[1]).toHaveValue('')
    expect(onChange).toHaveBeenLastCalledWith('1')
    await user.keyboard('{ArrowLeft}')
    expect(fields[0]).toHaveFocus()
    await user.keyboard('{ArrowRight}{ArrowRight}')
    expect(fields[2]).toHaveFocus()
    await user.keyboard('{Home}')
    expect(fields[0]).toHaveFocus()
    await user.keyboard('{End}')
    expect(fields[3]).toHaveFocus()
    await user.keyboard('{ArrowLeft}{ArrowLeft}{ArrowLeft}{Delete}')
    expect(fields[0]).toHaveValue('')
  })

  it('colar distribui os caracteres', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<PinInput label="Código" onComplete={onComplete} />)
    await user.click(digits()[0])
    await user.paste('482 913')
    expect(
      digits()
        .map((d) => d.value)
        .join(''),
    ).toBe('482913')
    expect(onComplete).toHaveBeenCalledWith('482913')
    expect(digits()[5]).toHaveFocus()
  })

  it('preenchimento automático no primeiro campo distribui o código', () => {
    render(<PinInput label="Código" length={4} />)
    fireEvent.change(digits()[0], { target: { value: '9876' } })
    expect(digits().map((d) => d.value)).toEqual(['9', '8', '7', '6'])
  })

  it('substitui o dígito ao digitar sobre um campo preenchido', async () => {
    const user = userEvent.setup()
    render(<PinInput label="Código" length={3} defaultValue="111" />)
    await user.click(digits()[1])
    await user.keyboard('5')
    expect(digits().map((d) => d.value)).toEqual(['1', '5', '1'])
    expect(digits()[2]).toHaveFocus()
  })

  it('mask usa campos de senha e groupSize adiciona separadores', () => {
    const { container } = render(<PinInput label="PIN" length={6} mask groupSize={3} />)
    expect(container.querySelectorAll('input[type="password"]')).toHaveLength(6)
    expect(container.querySelectorAll('.or-pin-input__separator')).toHaveLength(1)
  })

  it('funciona controlado, com name e ref no grupo', async () => {
    const user = userEvent.setup()
    const ref = createRef<HTMLDivElement>()
    function Controlled() {
      const [code, setCode] = useState('')
      return (
        <>
          <PinInput
            ref={ref}
            label="Código"
            length={4}
            value={code}
            onChange={setCode}
            name="otp"
          />
          <button type="button" onClick={() => setCode('')}>
            Reenviar
          </button>
        </>
      )
    }
    const { container } = render(<Controlled />)
    expect(ref.current).toHaveAttribute('role', 'group')
    await user.click(digits()[0])
    await user.keyboard('42')
    expect(container.querySelector('input[name="otp"]')).toHaveValue('42')
    await user.click(screen.getByRole('button', { name: 'Reenviar' }))
    expect(digits().map((d) => d.value)).toEqual(['', '', '', ''])
  })

  it('expõe erro e desabilitado', () => {
    render(<PinInput label="Código" length={4} error="Código expirado" disabled />)
    expect(screen.getByRole('group')).toHaveAccessibleDescription('Código expirado')
    digits().forEach((d) => {
      expect(d).toBeDisabled()
      expect(d).toHaveAttribute('aria-invalid', 'true')
    })
  })

  it('traduz os rótulos dos campos', () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <PinInput label="Code" length={4} />
      </OrangeProvider>,
    )
    expect(digits()[1]).toHaveAccessibleName('Digit 2 of 4')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <PinInput label="Código de verificação" description="Enviado para o seu celular" />
        <PinInput label="PIN" length={4} mask error="PIN incorreto" />
        <PinInput aria-label="Código do cupom" length={5} type="alphanumeric" groupSize={5} />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
