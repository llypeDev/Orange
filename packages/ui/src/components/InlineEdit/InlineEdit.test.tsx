import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { InlineEdit } from './InlineEdit'

describe('InlineEdit', () => {
  it('exibe o valor como botão com nome acessível "Editar <label>: <valor>"', () => {
    render(<InlineEdit label="Nome do projeto" defaultValue="Orange Pay" />)
    const button = screen.getByRole('button', { name: 'Editar Nome do projeto: Orange Pay' })
    expect(button).toHaveTextContent('Orange Pay')
  })

  it('sem valor, usa o placeholder no texto e no nome', () => {
    render(<InlineEdit label="Descrição" placeholder="Adicionar descrição" />)
    expect(
      screen.getByRole('button', { name: 'Editar Descrição: Adicionar descrição' }),
    ).toBeInTheDocument()
  })

  it('ao ativar vira um campo focado com o texto selecionado', async () => {
    const user = userEvent.setup()
    render(<InlineEdit label="Nome" defaultValue="Orange Pay" />)
    await user.click(screen.getByRole('button', { name: /Editar Nome/ }))
    const input = screen.getByRole('textbox', { name: 'Nome' }) as HTMLInputElement
    expect(input).toHaveFocus()
    expect(input).toHaveValue('Orange Pay')
    expect(input.selectionStart).toBe(0)
    expect(input.selectionEnd).toBe('Orange Pay'.length)
  })

  it('Enter salva e devolve o foco ao botão', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<InlineEdit label="Nome" defaultValue="Orange Pay" onSave={onSave} />)
    screen.getByRole('button', { name: /Editar Nome/ }).focus()
    await user.keyboard('{Enter}')
    await user.keyboard('Orange Bank{Enter}')
    expect(onSave).toHaveBeenCalledWith('Orange Bank')
    const button = screen.getByRole('button', { name: 'Editar Nome: Orange Bank' })
    expect(button).toHaveFocus()
  })

  it('sair do campo (blur) salva sem roubar o foco', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(
      <>
        <InlineEdit label="Cidade" defaultValue="Recife" onSave={onSave} />
        <button type="button">Outro</button>
      </>,
    )
    await user.click(screen.getByRole('button', { name: /Editar Cidade/ }))
    await user.keyboard('Olinda')
    await user.click(screen.getByRole('button', { name: 'Outro' }))
    expect(onSave).toHaveBeenCalledWith('Olinda')
    expect(screen.getByRole('button', { name: 'Editar Cidade: Olinda' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Outro' })).toHaveFocus()
  })

  it('Escape cancela, restaura o valor e devolve o foco', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    const onCancel = vi.fn()
    render(
      <InlineEdit label="Nome" defaultValue="Orange Pay" onSave={onSave} onCancel={onCancel} />,
    )
    await user.click(screen.getByRole('button', { name: /Editar Nome/ }))
    await user.keyboard('Rascunho{Escape}')
    expect(onSave).not.toHaveBeenCalled()
    expect(onCancel).toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Editar Nome: Orange Pay' })).toHaveFocus()
  })

  it('não chama onSave quando o valor não mudou', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<InlineEdit label="Nome" defaultValue="Orange" onSave={onSave} />)
    await user.click(screen.getByRole('button', { name: /Editar Nome/ }))
    await user.keyboard('{Enter}')
    expect(onSave).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Editar Nome: Orange' })).toHaveFocus()
  })

  it('validate impede salvar e mostra o erro vinculado ao campo', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(
      <InlineEdit
        label="E-mail"
        defaultValue="ana@orange.dev"
        onSave={onSave}
        validate={(v) => (v.includes('@') ? null : 'Informe um e-mail válido')}
      />,
    )
    await user.click(screen.getByRole('button', { name: /Editar E-mail/ }))
    await user.keyboard('ana.orange.dev{Enter}')
    const input = screen.getByRole('textbox', { name: 'E-mail' })
    expect(onSave).not.toHaveBeenCalled()
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Informe um e-mail válido')
    expect(input).toHaveFocus()
    await user.clear(input)
    await user.type(input, 'ana@orange.com')
    expect(input).not.toHaveAttribute('aria-invalid')
    await user.keyboard('{Enter}')
    expect(onSave).toHaveBeenCalledWith('ana@orange.com')
  })

  it('onSave assíncrono mostra carregamento e conclui', async () => {
    const user = userEvent.setup()
    let resolve!: () => void
    const onSave = vi.fn(() => new Promise<void>((r) => (resolve = r)))
    render(<InlineEdit label="Nome" defaultValue="A" onSave={onSave} />)
    await user.click(screen.getByRole('button', { name: /Editar Nome/ }))
    await user.keyboard('B{Enter}')
    const input = screen.getByRole('textbox', { name: 'Nome' })
    expect(input).toHaveAttribute('aria-busy', 'true')
    expect(input).toHaveAttribute('readonly')
    expect(screen.getByRole('status')).toHaveTextContent('Salvando…')
    await act(async () => resolve())
    expect(screen.getByRole('button', { name: 'Editar Nome: B' })).toHaveFocus()
  })

  it('onSave rejeitado mantém a edição com a mensagem de erro', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn().mockRejectedValue(new Error('Nome já está em uso'))
    render(<InlineEdit label="Nome" defaultValue="A" onSave={onSave} />)
    await user.click(screen.getByRole('button', { name: /Editar Nome/ }))
    await user.keyboard('B{Enter}')
    const input = await screen.findByRole('textbox', { name: 'Nome' })
    await waitFor(() => expect(input).toHaveAccessibleDescription('Nome já está em uso'))
    expect(input).not.toHaveAttribute('aria-busy')
  })

  it('botões salvar/cancelar opcionais', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<InlineEdit label="Título" defaultValue="Q3" showButtons onSave={onSave} />)
    await user.click(screen.getByRole('button', { name: /Editar Título/ }))
    await user.keyboard('Q4')
    // focar o botão Salvar não dispara o salvamento por blur
    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(onSave).toHaveBeenCalledTimes(1)
    expect(onSave).toHaveBeenCalledWith('Q4')

    await user.click(screen.getByRole('button', { name: /Editar Título/ }))
    await user.keyboard('Q5')
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onSave).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'Editar Título: Q4' })).toHaveFocus()
  })

  it('controlado e com rótulo visível', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [name, setName] = useState('Ana')
      return <InlineEdit label="Responsável" showLabel value={name} onSave={setName} />
    }
    render(<Controlled />)
    expect(screen.getByText('Responsável')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Editar Responsável: Ana' }))
    expect(screen.getByRole('textbox', { name: 'Responsável' })).toHaveFocus()
    await user.keyboard('Bruno{Enter}')
    expect(screen.getByRole('button', { name: 'Editar Responsável: Bruno' })).toBeInTheDocument()
  })

  it('desabilitado não entra em edição', () => {
    render(<InlineEdit label="Nome" defaultValue="A" disabled />)
    expect(screen.getByRole('button', { name: /Editar Nome/ })).toBeDisabled()
  })

  it('não possui violações de acessibilidade (leitura e edição)', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <div>
        <InlineEdit label="Nome do projeto" showLabel defaultValue="Orange Pay" showButtons />
        <InlineEdit label="Descrição" placeholder="Adicionar descrição" size="sm" />
      </div>,
    )
    await expectNoA11yViolations(container)
    await user.click(screen.getByRole('button', { name: /Editar Nome do projeto/ }))
    await expectNoA11yViolations(container)
  })
})
