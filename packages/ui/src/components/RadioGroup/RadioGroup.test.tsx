import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Radio } from './Radio'
import { RadioGroup } from './RadioGroup'

const plans = [
  { value: 'mensal', label: 'Mensal', description: 'R$ 49 por mês' },
  { value: 'anual', label: 'Anual', description: 'R$ 490 por ano — 2 meses grátis' },
  { value: 'empresa', label: 'Empresarial', disabled: true },
]


/** jsdom não tem AnimationEvent: dispara um animationend com o nome informado. */
function endAnimation(element: Element, animationName: string) {
  const event = new Event('animationend', { bubbles: true })
  Object.defineProperty(event, 'animationName', { value: animationName })
  act(() => {
    element.dispatchEvent(event)
  })
}

describe('RadioGroup', () => {
  it('renderiza fieldset/legend com radios nativos que compartilham o name', () => {
    render(<RadioGroup label="Plano" options={plans} />)
    const group = screen.getByRole('group', { name: 'Plano' })
    expect(group.tagName).toBe('FIELDSET')
    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(3)
    const name = radios[0].getAttribute('name')
    expect(name).toBeTruthy()
    radios.forEach((r) => expect(r).toHaveAttribute('name', name!))
    expect(screen.getByRole('radio', { name: 'Anual' })).toHaveAccessibleDescription('R$ 490 por ano — 2 meses grátis')
    expect(screen.getByRole('radio', { name: 'Empresarial' })).toBeDisabled()
  })

  it('seleciona com clique no rótulo e chama onChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RadioGroup label="Plano" options={plans} onChange={onChange} />)
    await user.click(screen.getByText('Anual'))
    expect(screen.getByRole('radio', { name: 'Anual' })).toBeChecked()
    expect(onChange).toHaveBeenCalledWith('anual')
  })

  it('setas movem a seleção entre as opções', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <RadioGroup label="Entrega" defaultValue="padrao" onChange={onChange}>
        <Radio value="padrao" label="Padrão" />
        <Radio value="expressa" label="Expressa" />
        <Radio value="retirada" label="Retirar na loja" />
      </RadioGroup>,
    )
    await user.tab()
    expect(screen.getByRole('radio', { name: 'Padrão' })).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('radio', { name: 'Expressa' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Expressa' })).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: 'Retirar na loja' })).toBeChecked()
    await user.keyboard('{ArrowUp}')
    expect(screen.getByRole('radio', { name: 'Expressa' })).toBeChecked()
    expect(onChange).toHaveBeenLastCalledWith('expressa')
  })

  it('controlado', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [value, setValue] = useState<string | null>('mensal')
      return (
        <>
          <RadioGroup label="Plano" value={value} onChange={setValue} options={plans} />
          <span data-testid="out">{value}</span>
        </>
      )
    }
    render(<Controlled />)
    expect(screen.getByRole('radio', { name: 'Mensal' })).toBeChecked()
    await user.click(screen.getByRole('radio', { name: 'Anual' }))
    expect(screen.getByTestId('out')).toHaveTextContent('anual')
    expect(screen.getByRole('radio', { name: 'Mensal' })).not.toBeChecked()
  })

  it('required, descrição e erro do grupo', () => {
    render(<RadioGroup label="Forma de pagamento" description="Escolha uma." error="Selecione uma forma de pagamento." required options={plans} />)
    screen.getAllByRole('radio').forEach((r) => expect(r).toBeRequired())
    expect(screen.getByRole('group')).toHaveAccessibleDescription('Escolha uma. Selecione uma forma de pagamento.')
  })

  it('aceita invalid sem mensagem de erro', () => {
    const { container } = render(<RadioGroup label="Plano" options={plans} invalid />)
    const group = screen.getByRole('group', { name: 'Plano' })
    expect(group).toHaveAttribute('data-invalid')
    expect(group).not.toHaveAccessibleDescription()
    expect(container.querySelector('.or-fieldset__error')).toBeNull()
  })

  it('variante card marca o cartão selecionado e aceita orientação horizontal', async () => {
    const user = userEvent.setup()
    render(<RadioGroup label="Plano" variant="card" orientation="horizontal" options={plans} name="plano" />)
    await user.click(screen.getByText('R$ 49 por mês'))
    const card = screen.getByRole('radio', { name: 'Mensal' }).closest('.or-radio')!
    expect(card).toHaveClass('or-radio--card')
    expect(card).toHaveAttribute('data-checked')
    expect(screen.getByRole('radio', { name: 'Mensal' })).toHaveAttribute('name', 'plano')
    expect(document.querySelector('[data-orientation="horizontal"]')).not.toBeNull()
  })

  it('disabled desabilita todas as opções', () => {
    render(<RadioGroup label="Plano" options={plans} disabled />)
    expect(screen.getByRole('group')).toBeDisabled()
    screen.getAllByRole('radio').forEach((r) => expect(r).toBeDisabled())
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <RadioGroup label="Plano" options={plans} defaultValue="anual" description="Pode mudar a qualquer momento." />
        <RadioGroup label="Plano (cartões)" options={plans} variant="card" error="Escolha um plano." required />
      </div>,
    )
    await expectNoA11yViolations(container)
  })

  it('motion: as opções tremem uma vez quando o erro do grupo surge', () => {
    const { rerender } = render(<RadioGroup label="Plano" options={plans} />)
    rerender(<RadioGroup label="Plano" options={plans} error="Escolha um plano." />)
    const content = document.querySelector('.or-radio-group__options')!
    expect(content).toHaveClass('or-forms-shake')
    endAnimation(content, 'or-shake')
    expect(content).not.toHaveClass('or-forms-shake')
  })
})
