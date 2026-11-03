import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { CurrencyField } from './CurrencyField'

const norm = (text: string) => text.replace(/[\u00a0\u202f]/g, ' ')

function setup(props: Partial<React.ComponentProps<typeof CurrencyField>> = {}) {
  const user = userEvent.setup()
  const onChange = vi.fn()
  const utils = render(<CurrencyField label="Valor" onChange={onChange} {...props} />)
  const input = screen.getByRole('textbox', { name: 'Valor' }) as HTMLInputElement
  return { user, onChange, input, ...utils }
}

describe('CurrencyField', () => {
  it('mostra o símbolo do real e descreve a moeda para leitores de tela', () => {
    const { input, container } = setup({ defaultValue: 1234.5 })
    expect(container.querySelector('.or-currency-field__symbol')).toHaveTextContent('R$')
    expect(input).toHaveValue('1.234,50')
    expect(input).toHaveAttribute('inputmode', 'decimal')
    expect(input).toHaveAttribute('placeholder', '0,00')
    expect(input).toHaveAccessibleDescription('Moeda: Real brasileiro')
  })

  it('aceita digitação natural com vírgula e formata ao sair', async () => {
    const { user, input, onChange } = setup()
    await user.type(input, '1500,9')
    expect(onChange).toHaveBeenLastCalledWith(1500.9)
    expect(input).toHaveValue('1500,9')
    await user.tab()
    expect(input).toHaveValue('1.500,90')
  })

  it('interpreta ponto como decimal ou milhar conforme o contexto', async () => {
    const { user, input, onChange } = setup()
    await user.type(input, '12.5')
    await user.tab()
    expect(onChange).toHaveBeenLastCalledWith(12.5)
    await user.clear(input)
    await user.type(input, '1.500')
    await user.tab()
    expect(onChange).toHaveBeenLastCalledWith(1500)
    expect(input).toHaveValue('1.500,00')
    await user.clear(input)
    await user.type(input, '2.345.678,123')
    await user.tab()
    expect(onChange).toHaveBeenLastCalledWith(2345678.12)
  })

  it('descarta caracteres inválidos e não aceita negativo sem min < 0', async () => {
    const { user, input } = setup()
    await user.type(input, 'a1-2b')
    expect(input).toHaveValue('12')
  })

  it('aplica min e max ao sair do campo', async () => {
    const { user, input, onChange } = setup({ min: 10, max: 1000 })
    await user.type(input, '5')
    await user.tab()
    expect(onChange).toHaveBeenLastCalledWith(10)
    expect(input).toHaveValue('10,00')
    await user.clear(input)
    await user.type(input, '5000')
    await user.tab()
    expect(onChange).toHaveBeenLastCalledWith(1000)
  })

  it('aceita negativos quando min é negativo', async () => {
    const { user, input, onChange } = setup({ min: -500 })
    await user.type(input, '-25,5')
    await user.tab()
    expect(onChange).toHaveBeenLastCalledWith(-25.5)
    expect(input).toHaveValue('-25,50')
  })

  it('apagar tudo resulta em null', async () => {
    const { user, input, onChange } = setup({ defaultValue: 99 })
    await user.clear(input)
    await user.tab()
    expect(onChange).toHaveBeenLastCalledWith(null)
    expect(input).toHaveValue('')
  })

  it('usa a moeda e o locale informados', () => {
    const { container, input } = setup({ currency: 'USD', locale: 'en-US', defaultValue: 1234.5 })
    expect(container.querySelector('.or-currency-field__symbol')).toHaveTextContent('$')
    expect(input).toHaveValue('1,234.50')
  })

  it('posiciona o símbolo depois do número quando o locale pede (EUR em de-DE)', () => {
    const { container, input } = setup({ currency: 'EUR', locale: 'de-DE', defaultValue: 10 })
    expect(container.querySelector('.or-currency-field__symbol')).toHaveClass(
      'or-control-frame__addon--end',
    )
    expect(norm(input.value)).toBe('10,00')
  })

  it('respeita moedas sem centavos (JPY)', async () => {
    const { user, input, onChange } = setup({ currency: 'JPY', locale: 'ja-JP' })
    await user.type(input, '1234.6')
    await user.tab()
    expect(onChange).toHaveBeenLastCalledWith(1235)
    expect(input).toHaveValue('1,235')
  })

  it('segue o locale do provider', () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <CurrencyField label="Amount" currency="USD" defaultValue={50} />
      </OrangeProvider>,
    )
    const input = screen.getByRole('textbox', { name: 'Amount' })
    expect(input).toHaveValue('50.00')
    expect(input).toHaveAccessibleDescription('Currency: US Dollar')
  })

  it('funciona controlado e envia o número com name', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [v, setV] = useState<number | null>(10)
      return (
        <>
          <CurrencyField label="Preço" name="price" value={v} onChange={setV} />
          <button type="button" onClick={() => setV(250)}>
            Sugerir
          </button>
        </>
      )
    }
    const { container } = render(<Controlled />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('10,00')
    await user.click(screen.getByRole('button', { name: 'Sugerir' }))
    expect(input).toHaveValue('250,00')
    expect(container.querySelector('input[name="price"]')).toHaveValue('250')
  })

  it('expõe erro e desabilitado', () => {
    render(<CurrencyField label="Valor" error="Informe um valor" disabled />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Moeda: Real brasileiro Informe um valor')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <CurrencyField label="Valor do pedido" description="Sem frete" defaultValue={89.9} />
        <CurrencyField label="Limite" error="Acima do permitido" required />
        <CurrencyField label="Em euros" currency="EUR" locale="de-DE" size="lg" />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
