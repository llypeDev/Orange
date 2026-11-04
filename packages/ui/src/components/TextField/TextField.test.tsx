import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Icon } from '../../icons'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { TextField } from './TextField'


/** jsdom não tem AnimationEvent: dispara um animationend com o nome informado. */
function endAnimation(element: Element, animationName: string) {
  const event = new Event('animationend', { bubbles: true })
  Object.defineProperty(event, 'animationName', { value: animationName })
  act(() => {
    element.dispatchEvent(event)
  })
}

describe('TextField', () => {
  it('renderiza um textbox associado ao rótulo', () => {
    render(<TextField label="Nome completo" />)
    const input = screen.getByRole('textbox', { name: 'Nome completo' })
    expect(input).toHaveAttribute('type', 'text')
    expect(input).toHaveClass('or-control-frame__input')
  })

  it('liga descrição e erro por aria-describedby e marca aria-invalid', () => {
    render(<TextField label="E-mail" type="email" description="Usaremos para enviar recibos." error="Informe um e-mail válido." />)
    const input = screen.getByRole('textbox', { name: 'E-mail' })
    expect(input).toHaveAttribute('type', 'email')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription(/Usaremos para enviar recibos\..*Informe um e-mail válido\./)
    expect(input.closest('.or-control-frame')).toHaveAttribute('data-invalid')
  })

  it('aceita invalid sem mensagem de erro', () => {
    render(<TextField label="CEP" invalid />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('aplica required e mostra o asterisco decorativo', () => {
    render(<TextField label="Empresa" required />)
    const input = screen.getByRole('textbox', { name: 'Empresa' })
    expect(input).toBeRequired()
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true')
  })

  it('não controlado: digita e chama onChange e onValueChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const onValueChange = vi.fn()
    render(<TextField label="Cidade" defaultValue="Rec" onChange={onChange} onValueChange={onValueChange} />)
    const input = screen.getByRole('textbox')
    await user.type(input, 'ife')
    expect(input).toHaveValue('Recife')
    expect(onChange).toHaveBeenCalledTimes(3)
    expect(onValueChange).toHaveBeenLastCalledWith('Recife')
  })

  it('controlado: reflete o estado externo', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [value, setValue] = useState('')
      return (
        <>
          <TextField label="Apelido" value={value} onValueChange={(v) => setValue(v.toUpperCase())} />
          <output>{value}</output>
        </>
      )
    }
    render(<Controlled />)
    await user.type(screen.getByRole('textbox'), 'ana')
    expect(screen.getByRole('textbox')).toHaveValue('ANA')
    expect(screen.getByRole('status')).toHaveTextContent('ANA')
  })

  it('mostra o contador, liga-o ao campo e anuncia após a pausa', async () => {
    const user = userEvent.setup()
    render(<TextField label="Título" maxLength={20} showCount defaultValue="Oi" />)
    const input = screen.getByRole('textbox', { name: 'Título' })
    expect(input).toHaveAttribute('maxLength', '20')
    expect(screen.getByText('2 de 20 caracteres')).toBeInTheDocument()
    expect(input).toHaveAccessibleDescription('2 de 20 caracteres')
    const live = document.querySelector('[aria-live="polite"]')!
    expect(live).toBeEmptyDOMElement()
    await user.type(input, ' mundo')
    expect(screen.getByText('8 de 20 caracteres')).toBeInTheDocument()
    await waitFor(() => expect(live).toHaveTextContent('8 de 20 caracteres'), { timeout: 2000 })
  })

  it('usa o idioma do provider no contador', () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <TextField label="Title" maxLength={10} showCount value="abc" onChange={() => {}} />
      </OrangeProvider>,
    )
    expect(screen.getByText('3 of 10 characters')).toBeInTheDocument()
  })

  it('renderiza prefixo e sufixo e os inclui na descrição', () => {
    render(<TextField label="Site" prefix="https://" suffix=".com.br" />)
    const input = screen.getByRole('textbox', { name: 'Site' })
    expect(screen.getByText('https://')).toHaveClass('or-input-frame__affix--prefix')
    expect(input).toHaveAccessibleDescription('https:// .com.br')
  })

  it('clicar no ícone foca o campo', () => {
    render(<TextField label="Buscar" type="search" startIcon={<Icon name="search" />} />)
    const input = screen.getByRole('searchbox', { name: 'Buscar' })
    const addon = document.querySelector('.or-control-frame__addon')!
    fireEvent.mouseDown(addon)
    expect(input).toHaveFocus()
  })

  it('desabilitado não recebe digitação', async () => {
    const user = userEvent.setup()
    render(<TextField label="Código" disabled defaultValue="ABC" />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
    expect(input.closest('.or-control-frame')).toHaveAttribute('data-disabled')
    await user.type(input, 'X')
    expect(input).toHaveValue('ABC')
  })

  it('repassa a ref para o input e className para o contêiner', () => {
    const ref = { current: null as HTMLInputElement | null }
    const { container } = render(<TextField ref={ref} label="Nome" className="extra" size="lg" />)
    expect(ref.current).toBe(screen.getByRole('textbox'))
    expect(container.firstChild).toHaveClass('or-field', 'or-text-field', 'extra')
    expect(container.querySelector('.or-control-frame--lg')).not.toBeNull()
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <form>
        <TextField label="Nome" required />
        <TextField label="E-mail" type="email" description="Nunca compartilhamos." error="Campo obrigatório" />
        <TextField label="Valor" prefix="R$" suffix="BRL" />
        <TextField label="Busca" type="search" startIcon={<Icon name="search" />} hideLabel />
        <TextField label="Bio" maxLength={160} showCount />
        <TextField label="Desabilitado" disabled />
      </form>,
    )
    await expectNoA11yViolations(container)
  })

  it('motion: treme uma vez quando o erro surge (não na montagem já inválida)', () => {
    const { rerender } = render(<TextField label="E-mail" error="Já cadastrado." />)
    const frame = screen.getByRole('textbox').closest('.or-control-frame')!
    expect(frame).not.toHaveClass('or-forms-shake')
    rerender(<TextField label="E-mail" />)
    rerender(<TextField label="E-mail" error="Informe um e-mail válido." />)
    expect(frame).toHaveClass('or-forms-shake')
    rerender(<TextField label="E-mail" error="Outro erro" />)
    expect(frame).toHaveClass('or-forms-shake')
    endAnimation(frame, 'or-shake')
    expect(frame).not.toHaveClass('or-forms-shake')
    rerender(<TextField label="E-mail" error="Mais um erro" />)
    expect(frame).not.toHaveClass('or-forms-shake')
  })
})
