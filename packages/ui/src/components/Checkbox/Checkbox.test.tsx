import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Checkbox } from './Checkbox'
import { CheckboxGroup } from './CheckboxGroup'


/** jsdom não tem AnimationEvent: dispara um animationend com o nome informado. */
function endAnimation(element: Element, animationName: string) {
  const event = new Event('animationend', { bubbles: true })
  Object.defineProperty(event, 'animationName', { value: animationName })
  act(() => {
    element.dispatchEvent(event)
  })
}

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

  it('aceita invalid sem mensagem de erro', () => {
    const { container } = render(<CheckboxGroup label="Canais" options={options} invalid />)
    const group = screen.getByRole('group', { name: 'Canais' })
    expect(group).toHaveAttribute('data-invalid')
    expect(group).not.toHaveAccessibleDescription()
    expect(container.querySelector('.or-fieldset__error')).toBeNull()
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

  describe('variante card', () => {
    const modules = [
      { value: 'financeiro', label: 'Financeiro', description: 'Contas a pagar e a receber e conciliação bancária.' },
      { value: 'estoque', label: 'Estoque', description: 'Inventário, lotes e transferências entre depósitos.' },
      { value: 'fiscal', label: 'Fiscal', description: 'Disponível a partir do plano Pro.', disabled: true },
    ]

    it('renderiza cada opção como um cartão <label> com nome e descrição próprios', () => {
      render(
        <CheckboxGroup label="Módulos do plano" variant="card" orientation="horizontal" options={modules} name="modulos" />,
      )
      const group = screen.getByRole('group', { name: 'Módulos do plano' })
      expect(group).toHaveClass('or-checkbox-group--card')
      expect(group.querySelector('.or-checkbox-group__options')).toHaveAttribute('data-orientation', 'horizontal')
      const financeiro = screen.getByRole('checkbox', { name: 'Financeiro' })
      expect(financeiro).toHaveAttribute('type', 'checkbox')
      expect(financeiro).toHaveAttribute('name', 'modulos')
      // o nome vem só do rótulo, mesmo com a descrição dentro do <label>
      expect(financeiro).toHaveAccessibleName('Financeiro')
      expect(financeiro).toHaveAccessibleDescription('Contas a pagar e a receber e conciliação bancária.')
      const card = financeiro.closest('.or-checkbox')!
      expect(card.tagName).toBe('LABEL')
      expect(card).toHaveClass('or-checkbox--card')
      expect(card).not.toHaveAttribute('data-checked')
      expect(screen.getByRole('checkbox', { name: 'Fiscal' })).toBeDisabled()
      expect(screen.getByRole('checkbox', { name: 'Fiscal' }).closest('.or-checkbox')).toHaveAttribute('data-disabled')
    })

    it('o cartão inteiro alterna com o mouse (inclusive pela descrição) e marca data-checked', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<CheckboxGroup label="Módulos do plano" variant="card" options={modules} onChange={onChange} />)
      const financeiro = screen.getByRole('checkbox', { name: 'Financeiro' })
      const card = financeiro.closest('.or-checkbox')!
      await user.click(screen.getByText('Contas a pagar e a receber e conciliação bancária.'))
      expect(financeiro).toBeChecked()
      expect(card).toHaveAttribute('data-checked')
      expect(onChange).toHaveBeenLastCalledWith(['financeiro'])
      await user.click(screen.getByText('Estoque'))
      expect(onChange).toHaveBeenLastCalledWith(['financeiro', 'estoque'])
      await user.click(card)
      expect(financeiro).not.toBeChecked()
      expect(card).not.toHaveAttribute('data-checked')
      expect(onChange).toHaveBeenLastCalledWith(['estoque'])
      await user.click(screen.getByText('Disponível a partir do plano Pro.'))
      expect(screen.getByRole('checkbox', { name: 'Fiscal' })).not.toBeChecked()
    })

    it('teclado inalterado: Tab entre as caixas e Espaço alterna (controlado, com filhos)', async () => {
      const user = userEvent.setup()
      function Controlled() {
        const [value, setValue] = useState<string[]>(['financeiro'])
        return (
          <>
            <CheckboxGroup label="Módulos do plano" variant="card" value={value} onChange={setValue}>
              <Checkbox value="financeiro" label="Financeiro" />
              <Checkbox value="estoque" label="Estoque" description="Inventário e lotes." />
            </CheckboxGroup>
            <span data-testid="out">{value.join(',')}</span>
          </>
        )
      }
      render(<Controlled />)
      await user.tab()
      expect(screen.getByRole('checkbox', { name: 'Financeiro' })).toHaveFocus()
      await user.tab()
      expect(screen.getByRole('checkbox', { name: 'Estoque' })).toHaveFocus()
      await user.keyboard(' ')
      expect(screen.getByTestId('out')).toHaveTextContent('financeiro,estoque')
      expect(screen.getByRole('checkbox', { name: 'Estoque' }).closest('.or-checkbox')).toHaveAttribute('data-checked')
    })

    it('a variante padrão mantém a marcação de lista (sem aria-labelledby)', () => {
      render(<CheckboxGroup label="Canais" options={options} />)
      const email = screen.getByRole('checkbox', { name: 'E-mail' })
      expect(email).not.toHaveAttribute('aria-labelledby')
      expect(email.closest('.or-checkbox')!.tagName).toBe('DIV')
      expect(screen.getByRole('group')).toHaveClass('or-checkbox-group--default')
    })

    it('não possui violações de acessibilidade', async () => {
      const { container } = render(
        <div>
          <CheckboxGroup
            label="Módulos do plano"
            variant="card"
            orientation="horizontal"
            options={modules}
            defaultValue={['estoque']}
            description="Você pode adicionar módulos depois."
          />
          <CheckboxGroup label="Integrações" variant="card" error="Escolha pelo menos uma integração." required>
            <Checkbox value="banco" label="Conciliação bancária" description="Importa extratos OFX." />
            <Checkbox value="loja" label="Loja virtual" error="Requer o módulo Estoque." />
          </CheckboxGroup>
        </div>,
      )
      await expectNoA11yViolations(container)
    })
  })

  it('motion: a caixa (Checkbox) e as opções (grupo) tremem quando o erro surge', () => {
    const { rerender } = render(
      <>
        <Checkbox label="Aceito os termos" />
        <CheckboxGroup label="Canais" options={options} />
      </>,
    )
    rerender(
      <>
        <Checkbox label="Aceito os termos" error="Obrigatório" />
        <CheckboxGroup label="Canais" options={options} error="Escolha um canal." />
      </>,
    )
    const box = document.querySelector('.or-checkbox__box')!
    expect(box).toHaveClass('or-forms-shake')
    endAnimation(box, 'or-shake')
    expect(box).not.toHaveClass('or-forms-shake')
    expect(document.querySelector('.or-checkbox-group .or-fieldset__content')).toHaveClass('or-forms-shake')
  })

  it('motion: check e traço indeterminado ficam no DOM para animar (desenho/scaleX)', () => {
    render(<Checkbox label="Todos" indeterminate />)
    expect(document.querySelector('.or-checkbox__check path')).not.toBeNull()
    expect(document.querySelector('.or-checkbox__dash')).not.toBeNull()
  })
})
