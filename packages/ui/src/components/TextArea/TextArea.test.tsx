import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { TextArea } from './TextArea'


/** jsdom não tem AnimationEvent: dispara um animationend com o nome informado. */
function endAnimation(element: Element, animationName: string) {
  const event = new Event('animationend', { bubbles: true })
  Object.defineProperty(event, 'animationName', { value: animationName })
  act(() => {
    element.dispatchEvent(event)
  })
}

describe('TextArea', () => {
  it('renderiza um textarea multilinha associado ao rótulo', () => {
    render(<TextArea label="Comentário" />)
    const textarea = screen.getByRole('textbox', { name: 'Comentário' })
    expect(textarea.tagName).toBe('TEXTAREA')
    expect(textarea).toHaveAttribute('rows', '3')
    expect(textarea).toHaveClass('or-control', 'or-control--md')
  })

  it('aceita rows, descrição, erro e required', () => {
    render(<TextArea label="Motivo" rows={5} description="Seja específico." error="Descreva o motivo." required />)
    const textarea = screen.getByRole('textbox', { name: 'Motivo' })
    expect(textarea).toHaveAttribute('rows', '5')
    expect(textarea).toBeRequired()
    expect(textarea).toHaveAttribute('aria-invalid', 'true')
    expect(textarea).toHaveAccessibleDescription('Seja específico. Descreva o motivo.')
  })

  it('não controlado: aceita quebras de linha pelo teclado', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<TextArea label="Endereço" onValueChange={onValueChange} />)
    const textarea = screen.getByRole('textbox')
    await user.type(textarea, 'Rua A{Enter}Apto 3')
    expect(textarea).toHaveValue('Rua A\nApto 3')
    expect(onValueChange).toHaveBeenLastCalledWith('Rua A\nApto 3')
  })

  it('controlado: reflete o estado externo', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [value, setValue] = useState('Olá')
      return <TextArea label="Mensagem" value={value} onValueChange={setValue} maxLength={50} showCount />
    }
    render(<Controlled />)
    expect(screen.getByText('3 de 50 caracteres')).toBeInTheDocument()
    await user.type(screen.getByRole('textbox'), '!')
    expect(screen.getByRole('textbox')).toHaveValue('Olá!')
    expect(screen.getByText('4 de 50 caracteres')).toBeInTheDocument()
  })

  it('contador ligado por aria-describedby e anunciado após a pausa', async () => {
    const user = userEvent.setup()
    render(<TextArea label="Bio" description="Conte sobre você." maxLength={10} showCount />)
    const textarea = screen.getByRole('textbox', { name: 'Bio' })
    expect(textarea).toHaveAccessibleDescription('0 de 10 caracteres Conte sobre você.')
    await user.type(textarea, 'abcdefghijkl')
    expect(textarea).toHaveValue('abcdefghij')
    expect(screen.getByText('10 de 10 caracteres').parentElement).toHaveAttribute('data-state', 'limit')
    const live = document.querySelector('[aria-live="polite"]')!
    await waitFor(() => expect(live).toHaveTextContent('10 de 10 caracteres'), { timeout: 2000 })
  })

  it('autoResize ajusta a altura conforme o conteúdo e desliga o redimensionamento manual', async () => {
    const user = userEvent.setup()
    render(<TextArea label="Notas" autoResize />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(textarea).toHaveClass('or-text-area__control--auto')
    textarea.style.border = '1px solid'
    let scrollHeight = 60
    Object.defineProperty(textarea, 'scrollHeight', { configurable: true, get: () => scrollHeight })
    await user.type(textarea, 'a')
    expect(textarea.style.height).toBe('62px')
    scrollHeight = 120
    await user.type(textarea, '{Enter}b')
    expect(textarea.style.height).toBe('122px')
  })

  it('autoResize respeita maxRows e passa a rolar', async () => {
    const user = userEvent.setup()
    render(<TextArea label="Notas" autoResize maxRows={2} />)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    textarea.style.border = '1px solid'
    textarea.style.lineHeight = '20px'
    textarea.style.paddingTop = '8px'
    textarea.style.paddingBottom = '8px'
    Object.defineProperty(textarea, 'scrollHeight', { configurable: true, get: () => 400 })
    await user.type(textarea, 'x')
    expect(textarea.style.height).toBe('58px')
    expect(textarea.style.overflowY).toBe('auto')
  })

  it('desabilitado', () => {
    render(<TextArea label="Observações" disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <TextArea label="Comentário" />
        <TextArea label="Motivo" description="Obrigatório para reembolsos." error="Campo obrigatório" required />
        <TextArea label="Bio" maxLength={160} showCount autoResize />
      </div>,
    )
    await expectNoA11yViolations(container)
  })

  it('motion: o textarea treme uma vez quando passa a ficar inválido', () => {
    const { rerender } = render(<TextArea label="Motivo" />)
    const textarea = screen.getByRole('textbox')
    rerender(<TextArea label="Motivo" invalid />)
    expect(textarea).toHaveClass('or-forms-shake')
    endAnimation(textarea, 'or-draw')
    expect(textarea).toHaveClass('or-forms-shake')
    endAnimation(textarea, 'or-shake')
    expect(textarea).not.toHaveClass('or-forms-shake')
  })
})
