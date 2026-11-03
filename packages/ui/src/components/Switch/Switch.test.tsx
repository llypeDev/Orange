import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Switch } from './Switch'

describe('Switch', () => {
  it('renderiza um button role="switch" nomeado pelo rótulo', () => {
    render(<Switch label="Notificações por e-mail" />)
    const control = screen.getByRole('switch', { name: 'Notificações por e-mail' })
    expect(control.tagName).toBe('BUTTON')
    expect(control).toHaveAttribute('type', 'button')
    expect(control).toHaveAttribute('aria-checked', 'false')
  })

  it('alterna com clique no switch e no rótulo', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Switch label="Modo escuro" onCheckedChange={onCheckedChange} />)
    const control = screen.getByRole('switch')
    await user.click(control)
    expect(control).toHaveAttribute('aria-checked', 'true')
    expect(onCheckedChange).toHaveBeenLastCalledWith(true)
    await user.click(screen.getByText('Modo escuro'))
    expect(control).toHaveAttribute('aria-checked', 'false')
    expect(onCheckedChange).toHaveBeenLastCalledWith(false)
  })

  it('alterna com Espaço e Enter', async () => {
    const user = userEvent.setup()
    render(<Switch label="Backup automático" defaultChecked />)
    const control = screen.getByRole('switch')
    expect(control).toBeChecked()
    await user.tab()
    expect(control).toHaveFocus()
    await user.keyboard(' ')
    expect(control).not.toBeChecked()
    await user.keyboard('{Enter}')
    expect(control).toBeChecked()
  })

  it('controlado', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [on, setOn] = useState(false)
      return (
        <>
          <Switch label="Wi-Fi" checked={on} onCheckedChange={setOn} />
          <span data-testid="out">{on ? 'ligado' : 'desligado'}</span>
        </>
      )
    }
    render(<Controlled />)
    await user.click(screen.getByRole('switch'))
    expect(screen.getByTestId('out')).toHaveTextContent('ligado')
  })

  it('descrição ligada por aria-describedby, tamanho e posição do rótulo', () => {
    const { container } = render(
      <Switch label="Perfil público" description="Qualquer pessoa poderá ver seus projetos." size="sm" labelPosition="start" />,
    )
    expect(screen.getByRole('switch')).toHaveAccessibleDescription('Qualquer pessoa poderá ver seus projetos.')
    expect(container.firstChild).toHaveClass('or-switch--sm', 'or-switch--label-start')
  })

  it('desabilitado não alterna', async () => {
    const user = userEvent.setup()
    render(<Switch label="Sincronizar" disabled />)
    await user.click(screen.getByRole('switch'))
    expect(screen.getByRole('switch')).not.toBeChecked()
    expect(screen.getByRole('switch')).toBeDisabled()
  })

  it('envia name=value no formulário apenas quando ligado', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <form>
        <Switch label="Newsletter" name="newsletter" />
      </form>,
    )
    const form = container.querySelector('form')!
    expect(new FormData(form).get('newsletter')).toBeNull()
    await user.click(screen.getByRole('switch'))
    expect(new FormData(form).get('newsletter')).toBe('on')
  })

  it('aceita aria-label quando não há rótulo visível', () => {
    render(<Switch aria-label="Ativar regra" />)
    expect(screen.getByRole('switch', { name: 'Ativar regra' })).toBeInTheDocument()
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <Switch label="Desligado" />
        <Switch label="Ligado" defaultChecked description="Com descrição" />
        <Switch label="Pequeno" size="sm" labelPosition="start" />
        <Switch aria-label="Sem rótulo visível" />
        <Switch label="Desabilitado" disabled />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
