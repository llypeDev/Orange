import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Icon } from '../../icons'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { PasswordField, type PasswordRequirement } from './PasswordField'

const rules = (value: string): PasswordRequirement[] => [
  { label: 'Pelo menos 8 caracteres', met: value.length >= 8 },
  { label: 'Uma letra maiúscula', met: /[A-Z]/.test(value) },
  { label: 'Um número', met: /\d/.test(value) },
]

describe('PasswordField', () => {
  it('renderiza um campo de senha com rótulo e botão de alternância', () => {
    render(<PasswordField label="Senha" />)
    const input = screen.getByLabelText('Senha')
    expect(input).toHaveAttribute('type', 'password')
    expect(input).toHaveAttribute('autocomplete', 'current-password')
    const toggle = screen.getByRole('button', { name: 'Mostrar senha' })
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    expect(toggle).toHaveAttribute('aria-controls', input.id)
  })

  it('alterna a visibilidade com o mouse e mantém o foco e o cursor no campo', async () => {
    const user = userEvent.setup()
    const onVisibleChange = vi.fn()
    render(<PasswordField label="Senha" onVisibleChange={onVisibleChange} />)
    const input = screen.getByLabelText('Senha') as HTMLInputElement
    const toggle = screen.getByRole('button', { name: 'Mostrar senha' })
    await user.type(input, 'segredo')
    input.setSelectionRange(2, 2)
    await user.click(toggle)
    expect(input).toHaveAttribute('type', 'text')
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
    expect(input).toHaveFocus()
    expect(input.selectionStart).toBe(2)
    expect(onVisibleChange).toHaveBeenLastCalledWith(true)
    await user.click(toggle)
    expect(input).toHaveAttribute('type', 'password')
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
  })

  it('pelo teclado alterna com Enter/Espaço e mantém o foco no botão', async () => {
    const user = userEvent.setup()
    render(<PasswordField label="Senha" />)
    const input = screen.getByLabelText('Senha')
    await user.click(input)
    await user.tab()
    const toggle = screen.getByRole('button', { name: 'Mostrar senha' })
    expect(toggle).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(input).toHaveAttribute('type', 'text')
    expect(toggle).toHaveFocus()
    await user.keyboard(' ')
    expect(input).toHaveAttribute('type', 'password')
  })

  it('visibilidade controlada', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [visible, setVisible] = useState(true)
      return (
        <>
          <PasswordField label="Senha" visible={visible} onVisibleChange={setVisible} />
          <span data-testid="state">{String(visible)}</span>
        </>
      )
    }
    render(<Controlled />)
    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'text')
    await user.click(screen.getByRole('button', { name: 'Mostrar senha' }))
    expect(screen.getByTestId('state')).toHaveTextContent('false')
    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'password')
  })

  it('lista requisitos com estado acessível e os liga ao campo', async () => {
    const user = userEvent.setup()
    function WithRules() {
      const [value, setValue] = useState('')
      return <PasswordField label="Nova senha" value={value} onValueChange={setValue} requirements={rules(value)} />
    }
    render(<WithRules />)
    const input = screen.getByLabelText('Nova senha')
    expect(input).toHaveAttribute('autocomplete', 'new-password')
    expect(input).toHaveAccessibleDescription(
      'Requisitos da senha Pelo menos 8 caracteres (não atendido) Uma letra maiúscula (não atendido) Um número (não atendido)',
    )
    const live = document.querySelector('[aria-live="polite"]')!
    expect(live).toBeEmptyDOMElement()
    await user.type(input, 'Laranja1')
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
    items.forEach((item) => expect(item).toHaveAttribute('data-met'))
    expect(input).toHaveAccessibleDescription(/Um número \(atendido\)/)
    await waitFor(() => expect(live).toHaveTextContent('3 de 3 requisitos atendidos'), { timeout: 2000 })
  })

  it('traduz os textos internos pelo provider', () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <PasswordField label="Password" requirements={rules('')} />
      </OrangeProvider>,
    )
    expect(screen.getByRole('button', { name: 'Show password' })).toBeInTheDocument()
    expect(screen.getByText('Password requirements')).toBeInTheDocument()
  })

  it('desabilitado desabilita também o botão', () => {
    render(<PasswordField label="Senha" disabled />)
    expect(screen.getByLabelText('Senha')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Mostrar senha' })).toBeDisabled()
  })

  it('erro marca o campo como inválido', () => {
    render(<PasswordField label="Senha" error="Senha incorreta." />)
    const input = screen.getByLabelText('Senha')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Senha incorreta.')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <form>
        <PasswordField label="Senha atual" startIcon={<Icon name="lock" />} required />
        <PasswordField label="Nova senha" requirements={rules('Abc')} description="Use uma senha que você não usa em outros sites." />
        <PasswordField label="Confirmar" error="As senhas não coincidem." defaultVisible />
      </form>,
    )
    await expectNoA11yViolations(container)
  })

  it('motion: olho e olho cortado ficam empilhados para o crossfade; requisitos têm os dois ícones', () => {
    render(<PasswordField label="Senha" requirements={rules('Abc')} />)
    const toggle = screen.getByRole('button', { name: 'Mostrar senha' })
    const icons = Array.from(toggle.querySelectorAll('svg')).map((svg) => svg.getAttribute('data-icon'))
    expect(icons).toEqual(['eye', 'eye-off'])
    const [first] = screen.getAllByRole('listitem')
    expect(first.querySelector('.or-password-field__requirement-met')).not.toBeNull()
    expect(first.querySelector('.or-password-field__requirement-unmet')).not.toBeNull()
  })
})
