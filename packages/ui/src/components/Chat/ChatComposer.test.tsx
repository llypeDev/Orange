import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { IconButton } from '../IconButton'
import { ChatComposer } from './ChatComposer'

describe('ChatComposer', () => {
  it('textarea com rótulo oculto por padrão e instrução de teclado na descrição', () => {
    render(
      <ChatComposer label="Mensagem para o assistente" placeholder="Pergunte sobre o relatório…" />,
    )
    const field = screen.getByRole('textbox', { name: 'Mensagem para o assistente' })
    expect(field.tagName).toBe('TEXTAREA')
    expect(field).toHaveAttribute('placeholder', 'Pergunte sobre o relatório…')
    expect(field).toHaveAttribute('rows', '1')
    expect(field).toHaveAccessibleDescription('Enter envia; Shift + Enter quebra a linha.')
    expect(screen.getByText('Mensagem para o assistente')).toHaveClass('or-visually-hidden')
  })

  it('hideLabel={false} mostra o rótulo', () => {
    render(<ChatComposer label="Comentário" hideLabel={false} />)
    expect(screen.getByText('Comentário')).not.toHaveClass('or-visually-hidden')
  })

  it('botão "Enviar mensagem" fica aria-disabled (mas focável) com o campo vazio', async () => {
    const user = userEvent.setup()
    render(<ChatComposer label="Mensagem" />)
    const send = screen.getByRole('button', { name: 'Enviar mensagem' })
    expect(send).toHaveAttribute('type', 'submit')
    expect(send).toHaveAttribute('aria-disabled', 'true')
    expect(send).not.toBeDisabled()
    await user.type(screen.getByRole('textbox'), 'Oi')
    expect(send).not.toHaveAttribute('aria-disabled')
  })

  it('Enter envia o texto (sem espaços nas pontas) e limpa o campo não controlado', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const onChange = vi.fn()
    render(<ChatComposer label="Mensagem" onSubmit={onSubmit} onChange={onChange} />)
    const field = screen.getByRole('textbox')
    await user.type(field, '  Qual foi o ticket médio?  {Enter}')
    expect(onSubmit).toHaveBeenCalledWith('Qual foi o ticket médio?')
    expect(field).toHaveValue('')
    expect(onChange).toHaveBeenLastCalledWith('')
    expect(field).toHaveFocus()
  })

  it('Shift + Enter quebra a linha sem enviar', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ChatComposer label="Mensagem" onSubmit={onSubmit} />)
    const field = screen.getByRole('textbox')
    await user.type(field, 'Linha 1{Shift>}{Enter}{/Shift}Linha 2')
    expect(onSubmit).not.toHaveBeenCalled()
    expect(field).toHaveValue('Linha 1\nLinha 2')
    await user.keyboard('{Enter}')
    expect(onSubmit).toHaveBeenCalledWith('Linha 1\nLinha 2')
  })

  it('não envia enquanto há composição de IME', () => {
    const onSubmit = vi.fn()
    render(<ChatComposer label="Mensagem" defaultValue="こんにちは" onSubmit={onSubmit} />)
    const field = screen.getByRole('textbox')
    fireEvent.compositionStart(field)
    fireEvent.keyDown(field, { key: 'Enter' })
    expect(onSubmit).not.toHaveBeenCalled()
    fireEvent.compositionEnd(field)
    // Safari: o keydown do Enter que confirma a composição chega depois, com keyCode 229.
    fireEvent.keyDown(field, { key: 'Enter', keyCode: 229 })
    expect(onSubmit).not.toHaveBeenCalled()
    fireEvent.keyDown(field, { key: 'Enter', isComposing: true })
    expect(onSubmit).not.toHaveBeenCalled()
    fireEvent.keyDown(field, { key: 'Enter' })
    expect(onSubmit).toHaveBeenCalledWith('こんにちは')
  })

  it('o botão envia e devolve o foco ao campo', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ChatComposer label="Mensagem" onSubmit={onSubmit} />)
    const field = screen.getByRole('textbox')
    await user.type(field, 'Exporte em PDF')
    await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }))
    expect(onSubmit).toHaveBeenCalledWith('Exporte em PDF')
    expect(field).toHaveValue('')
    expect(field).toHaveFocus()
  })

  it('não envia texto vazio ou só com espaços', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ChatComposer label="Mensagem" onSubmit={onSubmit} />)
    const field = screen.getByRole('textbox')
    await user.type(field, '   {Enter}')
    await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }))
    expect(onSubmit).not.toHaveBeenCalled()
    // Enter não insere a quebra de linha quando não há o que enviar.
    expect(field).toHaveValue('   ')
  })

  it('controlado: reflete value, chama onChange e não limpa sozinho', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const onChange = vi.fn()
    const { rerender } = render(
      <ChatComposer label="Mensagem" value="Rascunho" onChange={onChange} onSubmit={onSubmit} />,
    )
    const field = screen.getByRole('textbox')
    expect(field).toHaveValue('Rascunho')
    await user.type(field, '!')
    expect(onChange).toHaveBeenLastCalledWith('Rascunho!')
    expect(field).toHaveValue('Rascunho')
    await user.keyboard('{Enter}')
    expect(onSubmit).toHaveBeenCalledWith('Rascunho')
    expect(field).toHaveValue('Rascunho')
    rerender(<ChatComposer label="Mensagem" value="" onChange={onChange} onSubmit={onSubmit} />)
    expect(field).toHaveValue('')
  })

  it('controlado com estado do pai: limpar no onSubmit funciona', async () => {
    const user = userEvent.setup()
    const sent: string[] = []
    function Controlled() {
      const [text, setText] = useState('')
      return (
        <ChatComposer
          label="Mensagem"
          value={text}
          onChange={setText}
          onSubmit={(value) => {
            sent.push(value)
            setText('')
          }}
        />
      )
    }
    render(<Controlled />)
    const field = screen.getByRole('textbox')
    await user.type(field, 'Primeira{Enter}Segunda{Enter}')
    expect(sent).toEqual(['Primeira', 'Segunda'])
    expect(field).toHaveValue('')
  })

  it('defaultValue preenche o campo não controlado', () => {
    render(<ChatComposer label="Mensagem" defaultValue="Resumo da reunião" />)
    expect(screen.getByRole('textbox')).toHaveValue('Resumo da reunião')
  })

  it('disabled desabilita o campo e o botão', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ChatComposer label="Mensagem" defaultValue="Oi" disabled onSubmit={onSubmit} />)
    expect(screen.getByRole('textbox')).toBeDisabled()
    const send = screen.getByRole('button', { name: 'Enviar mensagem' })
    expect(send).toBeDisabled()
    await user.click(send)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('loading: o botão vira "Parar" (chama onStop) e Enter não envia', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const onStop = vi.fn()
    const { rerender } = render(
      <ChatComposer label="Mensagem" onSubmit={onSubmit} onStop={onStop} />,
    )
    const send = screen.getByRole('button', { name: 'Enviar mensagem' })
    rerender(<ChatComposer label="Mensagem" onSubmit={onSubmit} onStop={onStop} loading />)
    const stop = screen.getByRole('button', { name: 'Parar' })
    // Mesmo nó: quem estava no botão não perde o foco na troca.
    expect(stop).toBe(send)
    expect(stop).toHaveAttribute('type', 'button')
    expect(stop).not.toHaveAttribute('aria-disabled')

    const field = screen.getByRole('textbox')
    await user.type(field, 'Próxima pergunta{Enter}')
    expect(onSubmit).not.toHaveBeenCalled()
    expect(field).toHaveValue('Próxima pergunta')

    await user.click(stop)
    expect(onStop).toHaveBeenCalledTimes(1)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('loading sem onStop: "Parar" fica aria-disabled', () => {
    render(<ChatComposer label="Mensagem" loading />)
    expect(screen.getByRole('button', { name: 'Parar' })).toHaveAttribute('aria-disabled', 'true')
  })

  it('maxLength + showCount mostra o contador ligado ao campo', async () => {
    const user = userEvent.setup()
    render(<ChatComposer label="Mensagem" maxLength={280} showCount />)
    const field = screen.getByRole('textbox')
    expect(field).toHaveAttribute('maxlength', '280')
    expect(screen.getByText('0 de 280 caracteres')).toBeInTheDocument()
    await user.type(field, 'Oi')
    expect(screen.getByText('2 de 280 caracteres')).toBeInTheDocument()
    expect(field).toHaveAccessibleDescription(/2 de 280 caracteres/)
  })

  it('renderiza as ações no slot', () => {
    render(
      <ChatComposer
        label="Mensagem"
        actions={<IconButton icon="upload" label="Anexar arquivo" size="sm" />}
      />,
    )
    expect(screen.getByRole('button', { name: 'Anexar arquivo' })).toBeInTheDocument()
  })

  it('ref e props nativas vão para o textarea; className e formProps para o form', () => {
    const ref = createRef<HTMLTextAreaElement>()
    const { container } = render(
      <ChatComposer
        ref={ref}
        label="Mensagem"
        name="mensagem"
        className="composer"
        formProps={{ 'aria-label': 'Responder ao cliente' }}
      />,
    )
    expect(ref.current).toBe(screen.getByRole('textbox'))
    expect(ref.current).toHaveAttribute('name', 'mensagem')
    const form = container.querySelector('form')
    expect(form).toHaveClass('or-chat-composer', 'composer')
    expect(screen.getByRole('form', { name: 'Responder ao cliente' })).toBe(form)
  })

  it('usa os textos do locale do provider', () => {
    const { rerender } = render(
      <OrangeProvider locale="en-US">
        <ChatComposer label="Message" />
      </OrangeProvider>,
    )
    expect(screen.getByRole('button', { name: 'Send message' })).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription(
      'Enter sends; Shift + Enter adds a new line.',
    )
    rerender(
      <OrangeProvider locale="en-US">
        <ChatComposer label="Message" loading />
      </OrangeProvider>,
    )
    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument()
  })

  it('não tem violações de acessibilidade', async () => {
    const { container, rerender } = render(
      <ChatComposer
        label="Mensagem"
        maxLength={500}
        showCount
        actions={<IconButton icon="upload" label="Anexar arquivo" size="sm" />}
      />,
    )
    await expectNoA11yViolations(container)
    rerender(<ChatComposer label="Mensagem" loading onStop={() => {}} />)
    await expectNoA11yViolations(container)
  })
})
