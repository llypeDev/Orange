import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { NumberField } from './NumberField'

const nbsp = '\u00a0'

describe('NumberField', () => {
  it('renderiza um spinbutton com rótulo e atributos aria-value*', () => {
    render(<NumberField label="Quantidade" defaultValue={3} min={1} max={10} />)
    const input = screen.getByRole('spinbutton', { name: 'Quantidade' })
    expect(input).toHaveValue('3')
    expect(input).toHaveAttribute('aria-valuenow', '3')
    expect(input).toHaveAttribute('aria-valuemin', '1')
    expect(input).toHaveAttribute('aria-valuemax', '10')
    expect(input).toHaveAttribute('aria-valuetext', '3')
  })

  it('setas, PageUp/PageDown e Home/End alteram o valor', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<NumberField label="Assentos" defaultValue={5} min={0} max={50} onChange={onChange} />)
    const input = screen.getByRole('spinbutton')
    await user.click(input)
    await user.keyboard('{ArrowUp}{ArrowUp}')
    expect(input).toHaveAttribute('aria-valuenow', '7')
    await user.keyboard('{ArrowDown}')
    expect(input).toHaveValue('6')
    await user.keyboard('{PageUp}')
    expect(input).toHaveValue('16')
    await user.keyboard('{PageDown}{PageDown}')
    expect(input).toHaveValue('0')
    await user.keyboard('{End}')
    expect(input).toHaveValue('50')
    await user.keyboard('{ArrowUp}')
    expect(input).toHaveValue('50')
    await user.keyboard('{Home}')
    expect(input).toHaveValue('0')
    expect(onChange).toHaveBeenLastCalledWith(0)
  })

  it('botões − e + têm nome, ficam fora da ordem de tabulação e respeitam os limites', async () => {
    const user = userEvent.setup()
    render(<NumberField label="Hóspedes" defaultValue={1} min={1} max={3} />)
    const input = screen.getByRole('spinbutton')
    const dec = screen.getByRole('button', { name: 'Diminuir' })
    const inc = screen.getByRole('button', { name: 'Aumentar' })
    expect(dec).toHaveAttribute('tabindex', '-1')
    expect(inc).toHaveAttribute('aria-controls', input.id)
    expect(dec).toBeDisabled()
    await user.click(inc)
    await user.click(inc)
    expect(input).toHaveValue('3')
    expect(inc).toBeDisabled()
    await user.click(dec)
    expect(input).toHaveValue('2')
  })

  it('clique sem pointerdown (leitor de tela) também altera o valor', () => {
    render(<NumberField label="Itens" defaultValue={2} />)
    fireEvent.click(screen.getByRole('button', { name: 'Aumentar' }))
    expect(screen.getByRole('spinbutton')).toHaveValue('3')
  })

  it('digitar e sair do campo confirma, limita e formata o valor', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<NumberField label="Desconto" min={0} max={100} onChange={onChange} />)
    const input = screen.getByRole('spinbutton')
    expect(input).not.toHaveAttribute('aria-valuenow')
    await user.type(input, '250')
    expect(onChange).not.toHaveBeenCalled()
    await user.tab()
    expect(input).toHaveValue('100')
    expect(onChange).toHaveBeenLastCalledWith(100)
  })

  it('Enter confirma; texto inválido volta ao último valor; vazio vira null', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<NumberField label="Peso" defaultValue={10} step={0.5} onChange={onChange} />)
    const input = screen.getByRole('spinbutton')
    await user.clear(input)
    await user.type(input, '12,5{Enter}')
    expect(onChange).toHaveBeenLastCalledWith(12.5)
    expect(input).toHaveValue('12,5')
    await user.clear(input)
    await user.type(input, 'abc')
    await user.tab()
    expect(input).toHaveValue('12,5')
    await user.clear(input)
    await user.tab()
    expect(onChange).toHaveBeenLastCalledWith(null)
    expect(input).not.toHaveAttribute('aria-valuenow')
  })

  it('a seta usa o texto digitado como base e evita erros de ponto flutuante', async () => {
    const user = userEvent.setup()
    render(<NumberField label="Taxa" step={0.1} />)
    const input = screen.getByRole('spinbutton')
    await user.type(input, '0,2{ArrowUp}')
    expect(input).toHaveAttribute('aria-valuenow', '0.3')
    expect(input).toHaveValue('0,3')
  })

  it('passo em notação exponencial com casas na mantissa (1.5e-7) não é arredondado', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<NumberField label="Tolerância" defaultValue={0} step={1.5e-7} onChange={onChange} />)
    const input = screen.getByRole('spinbutton')
    input.focus()
    await user.keyboard('{ArrowUp}')
    // 1.5e-7 tem 8 casas decimais: com 7, o passo virava 0.0000002.
    expect(onChange).toHaveBeenLastCalledWith(1.5e-7)
    expect(input).toHaveAttribute('aria-valuenow', '1.5e-7')
    await user.keyboard('{ArrowUp}')
    expect(onChange).toHaveBeenLastCalledWith(3e-7)
  })

  it('formata moeda no idioma do provider e anuncia via aria-valuetext', async () => {
    const user = userEvent.setup()
    render(<NumberField label="Preço" defaultValue={1234.5} formatOptions={{ style: 'currency', currency: 'BRL' }} />)
    const input = screen.getByRole('spinbutton')
    expect(input).toHaveValue(`R$${nbsp}1.234,50`)
    expect(input).toHaveAttribute('aria-valuetext', `R$${nbsp}1.234,50`)
    await user.clear(input)
    await user.type(input, 'R$ 99,9')
    await user.tab()
    expect(input).toHaveAttribute('aria-valuenow', '99.9')
    expect(input).toHaveValue(`R$${nbsp}99,90`)
  })

  it('porcentagem: o valor é a fração e o texto é em %', async () => {
    const user = userEvent.setup()
    render(<NumberField label="Comissão" defaultValue={0.25} step={0.01} formatOptions={{ style: 'percent' }} />)
    const input = screen.getByRole('spinbutton')
    expect(input).toHaveValue('25%')
    await user.click(input)
    await user.keyboard('{ArrowUp}')
    expect(input).toHaveAttribute('aria-valuenow', '0.26')
    await user.clear(input)
    await user.type(input, '40{Enter}')
    expect(input).toHaveAttribute('aria-valuenow', '0.4')
  })

  it('usa o locale en-US do provider', () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <NumberField label="Amount" defaultValue={1234.5} />
      </OrangeProvider>,
    )
    expect(screen.getByRole('spinbutton')).toHaveValue('1,234.5')
    expect(screen.getByRole('button', { name: 'Increase' })).toBeInTheDocument()
  })

  it('controlado', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [value, setValue] = useState<number | null>(2)
      return (
        <>
          <NumberField label="Parcelas" value={value} onChange={setValue} min={1} max={12} />
          <span data-testid="out">{String(value)}</span>
        </>
      )
    }
    render(<Controlled />)
    await user.click(screen.getByRole('button', { name: 'Aumentar' }))
    expect(screen.getByTestId('out')).toHaveTextContent('3')
  })

  it('envia o valor numérico cru em um input oculto com o name', () => {
    const { container } = render(
      <form>
        <NumberField label="Preço" name="price" defaultValue={1500} formatOptions={{ style: 'currency', currency: 'BRL' }} />
      </form>,
    )
    const hidden = container.querySelector('input[type="hidden"]') as HTMLInputElement
    expect(hidden.name).toBe('price')
    expect(hidden.value).toBe('1500')
    expect(screen.getByRole('spinbutton')).not.toHaveAttribute('name')
  })

  it('desabilitado e somente leitura não alteram o valor', async () => {
    const user = userEvent.setup()
    render(
      <>
        <NumberField label="A" defaultValue={1} disabled />
        <NumberField label="B" defaultValue={1} readOnly />
      </>,
    )
    const [a, b] = screen.getAllByRole('spinbutton')
    expect(a).toBeDisabled()
    await user.click(b)
    await user.keyboard('{ArrowUp}')
    expect(b).toHaveValue('1')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <NumberField label="Quantidade" defaultValue={1} min={0} max={99} description="Máximo de 99 por pedido." />
        <NumberField label="Valor" prefix="R$" formatOptions={{ minimumFractionDigits: 2 }} error="Informe um valor." />
        <NumberField label="Altura" suffix="cm" hideStepper />
      </div>,
    )
    await expectNoA11yViolations(container)
  })

  it('motion: cada passo marca data-tick (alternando para reiniciar) e nada muda no limite', async () => {
    const user = userEvent.setup()
    render(<NumberField label="Quantidade" defaultValue={1} min={0} max={2} />)
    const input = screen.getByRole('spinbutton')
    expect(input).not.toHaveAttribute('data-tick')
    await user.click(input)
    await user.keyboard('{ArrowUp}')
    expect(input).toHaveAttribute('data-tick', 'up-1')
    await user.keyboard('{ArrowDown}')
    expect(input).toHaveAttribute('data-tick', 'down-0')
    await user.keyboard('{ArrowDown}')
    expect(input).toHaveAttribute('data-tick', 'down-1')
    await user.keyboard('{ArrowDown}')
    expect(input).toHaveValue('0')
    expect(input).toHaveAttribute('data-tick', 'down-1')
    await user.keyboard('{End}')
    expect(input).toHaveAttribute('data-tick', 'up-0')
  })
})
