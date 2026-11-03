import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Checkbox } from './Checkbox'
import { CheckboxGroup } from './CheckboxGroup'

describe('Checkbox', () => {
  it('renderiza um checkbox nativo com rótulo clicável', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Checkbox label="Aceito os termos de uso" onCheckedChange={onCheckedChange} />)
    const checkbox = screen.getByRole('checkbox', { name: 'Aceito os termos de uso' })
    expect(checkbox).toHaveAttribute('type', 'checkbox')
    expect(checkbox).not.toBeChecked()
    await user.click(screen.getByText('Aceito os termos de uso'))
    expect(checkbox).toBeChecked()
    expect(onCheckedChange).toHaveBeenLastCalledWith(true)
  })

  it('alterna com a barra de espaço', async () => {
    const user = userEvent.setup()
    render(<Checkbox label="Receber novidades" defaultChecked />)
    const checkbox = screen.getByRole('checkbox')
    await user.tab()
    expect(checkbox).toHaveFocus()
    await user.keyboard(' ')
    expect(checkbox).not.toBeChecked()
  })

  it('controlado', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [checked, setChecked] = useState(false)
      return (
        <>
          <Checkbox label="Lembrar de mim" checked={checked} onCheckedChange={setChecked} />
          <span data-testid="out">{String(checked)}</span>
        </>
      )
    }
    render(<Controlled />)
    await user.click(screen.getByRole('checkbox'))
    expect(screen.getByTestId('out')).toHaveTextContent('true')
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('indeterminate é exposto como estado misto', () => {
    render(<Checkbox label="Selecionar todos" indeterminate />)
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement
    expect(checkbox.indeterminate).toBe(true)
    expect(checkbox).toBePartiallyChecked()
  })

  it('liga descrição e erro, marca aria-invalid e required', () => {
    render(
      <Checkbox
        label="Li e aceito a política de privacidade"
        description="Explica como tratamos seus dados."
        error="Você precisa aceitar para continuar."
        required
      />,
    )
    const checkbox = screen.getByRole('checkbox', { name: /política de privacidade/ })
    expect(checkbox).toBeRequired()
    expect(checkbox).toHaveAttribute('aria-invalid', 'true')
    expect(checkbox).toHaveAccessibleDescription('Explica como tratamos seus dados. Você precisa aceitar para continuar.')
  })

  it('desabilitado não alterna', async () => {
    const user = userEvent.setup()
    render(<Checkbox label="Indisponível" disabled />)
    await user.click(screen.getByRole('checkbox'))
    expect(screen.getByRole('checkbox')).not.toBeChecked()
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <Checkbox label="Padrão" />
        <Checkbox label="Marcado" defaultChecked />
        <Checkbox label="Misto" indeterminate />
        <Checkbox label="Com erro" error="Obrigatório" description="Ajuda" />
        <Checkbox aria-label="Selecionar linha" />
        <Checkbox label="Desabilitado" disabled />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})

describe('CheckboxGroup', () => {
  const options = [
    { value: 'email', label: 'E-mail' },
    { value: 'sms', label: 'SMS', description: 'Pode haver cobrança da operadora.' },
    { value: 'push', label: 'Notificação no app', disabled: true },
  ]

  it('renderiza fieldset/legend com as opções', () => {
    render(<CheckboxGroup label="Canais de aviso" options={options} name="canais" />)
    const group = screen.getByRole('group', { name: 'Canais de aviso' })
    expect(group.tagName).toBe('FIELDSET')
    const boxes = screen.getAllByRole('checkbox')
    expect(boxes).toHaveLength(3)
    boxes.forEach((box) => expect(box).toHaveAttribute('name', 'canais'))
    expect(screen.getByRole('checkbox', { name: 'Notificação no app' })).toBeDisabled()
    expect(screen.getByRole('checkbox', { name: 'SMS' })).toHaveAccessibleDescription('Pode haver cobrança da operadora.')
  })

  it('não controlado: mantém a lista de valores marcados', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<CheckboxGroup label="Canais" options={options} defaultValue={['email']} onChange={onChange} />)
    expect(screen.getByRole('checkbox', { name: 'E-mail' })).toBeChecked()
    await user.click(screen.getByRole('checkbox', { name: 'SMS' }))
    expect(onChange).toHaveBeenLastCalledWith(['email', 'sms'])
    await user.click(screen.getByRole('checkbox', { name: 'E-mail' }))
    expect(onChange).toHaveBeenLastCalledWith(['sms'])
    expect(screen.getByRole('checkbox', { name: 'E-mail' })).not.toBeChecked()
  })

  it('controlado com filhos <Checkbox> e navegação por Tab', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [value, setValue] = useState<string[]>([])
      return (
        <>
          <CheckboxGroup label="Tamanhos" value={value} onChange={setValue} orientation="horizontal">
            <Checkbox value="p" label="P" />
            <Checkbox value="m" label="M" />
            <Checkbox value="g" label="G" />
          </CheckboxGroup>
          <span data-testid="out">{value.join(',')}</span>
        </>
      )
    }
    render(<Controlled />)
    await user.tab()
    await user.tab()
    expect(screen.getByRole('checkbox', { name: 'M' })).toHaveFocus()
    await user.keyboard(' ')
    await user.tab()
    await user.keyboard(' ')
    expect(screen.getByTestId('out')).toHaveTextContent('m,g')
    expect(document.querySelector('[data-orientation="horizontal"]')).not.toBeNull()
  })

  it('erro, descrição e required ficam no grupo', () => {
    render(
      <CheckboxGroup label="Interesses" description="Escolha pelo menos um." error="Selecione uma opção." required options={options} />,
    )
    const group = screen.getByRole('group', { name: /^Interesses\s*\(obrigatório\)$/ })
    expect(group).toHaveAccessibleDescription('Escolha pelo menos um. Selecione uma opção.')
  })

  it('disabled desabilita todas as opções nativamente', () => {
    render(<CheckboxGroup label="Canais" options={options} disabled />)
    screen.getAllByRole('checkbox').forEach((box) => expect(box).toBeDisabled())
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <CheckboxGroup label="Canais" options={options} description="Como quer ser avisado." defaultValue={['sms']} />
        <CheckboxGroup label="Com erro" options={options} error="Selecione uma opção." required orientation="horizontal" />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
