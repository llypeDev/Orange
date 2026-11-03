import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Button } from '../Button'
import { ConfirmDialog, useConfirm, type ConfirmDialogProps } from './ConfirmDialog'

function Example(props: Partial<ConfirmDialogProps>) {
  return (
    <ConfirmDialog
      title="Excluir projeto?"
      description="O projeto Site 2025 e seus 12 arquivos serão removidos para sempre."
      confirmLabel="Excluir projeto"
      tone="danger"
      trigger={<Button variant="danger">Excluir</Button>}
      {...props}
    />
  )
}

function deferred() {
  let resolve!: () => void
  let reject!: (error: Error) => void
  const promise = new Promise<void>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

describe('ConfirmDialog', () => {
  it('é um alertdialog modal com título e descrição', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.click(screen.getByRole('button', { name: 'Excluir' }))
    const dialog = screen.getByRole('alertdialog', { name: 'Excluir projeto?' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAccessibleDescription(
      'O projeto Site 2025 e seus 12 arquivos serão removidos para sempre.',
    )
  })

  it('tone="danger" usa botão danger e foca Cancelar', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.click(screen.getByRole('button', { name: 'Excluir' }))
    expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveFocus()
    expect(screen.getByRole('button', { name: 'Excluir projeto' })).toHaveClass('or-button--danger')
  })

  it('tom neutro foca o botão de confirmação e usa rótulos padrão traduzidos', async () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <ConfirmDialog title="Publish changes?" defaultOpen />
      </OrangeProvider>,
    )
    expect(await screen.findByRole('button', { name: 'Confirm' })).toHaveFocus()
    expect(screen.getByRole('button', { name: 'Confirm' })).toHaveClass('or-button--primary')
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('confirma de forma síncrona e fecha devolvendo o foco', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(<Example onConfirm={onConfirm} />)
    const trigger = screen.getByRole('button', { name: 'Excluir' })
    await user.click(trigger)
    await user.click(screen.getByRole('button', { name: 'Excluir projeto' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('Cancelar e Escape chamam onCancel; clique no fundo não fecha', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(<Example onCancel={onCancel} />)
    await user.click(screen.getByRole('button', { name: 'Excluir' }))
    await user.click(document.querySelector('.or-dialog__backdrop')!)
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Excluir' }))
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onCancel).toHaveBeenCalledTimes(2)
  })

  it('onConfirm com Promise mantém o botão em loading até resolver', async () => {
    const user = userEvent.setup()
    const task = deferred()
    render(<Example onConfirm={() => task.promise} loadingText="Excluindo projeto" />)
    await user.click(screen.getByRole('button', { name: 'Excluir' }))
    await user.click(screen.getByRole('button', { name: /Excluir projeto/ }))

    const confirm = screen.getByRole('button', { name: /Excluir projeto/ })
    expect(confirm).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByText('Excluindo projeto')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled()
    // Escape é ignorado enquanto a ação está pendente
    await user.keyboard('{Escape}')
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()

    await act(async () => task.resolve())
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
  })

  it('se a Promise rejeitar, continua aberto e sai do loading', async () => {
    const user = userEvent.setup()
    const task = deferred()
    render(<Example onConfirm={() => task.promise} />)
    await user.click(screen.getByRole('button', { name: 'Excluir' }))
    await user.click(screen.getByRole('button', { name: 'Excluir projeto' }))
    await act(async () => {
      task.reject(new Error('Falha de rede'))
      await task.promise.catch(() => {})
    })
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Excluir projeto' })).not.toHaveAttribute('aria-busy')
  })

  it('useConfirm resolve true ao confirmar e false ao cancelar', async () => {
    const user = userEvent.setup()
    const results: boolean[] = []
    function Page() {
      const [confirm, confirmDialog] = useConfirm()
      const [status, setStatus] = useState('')
      return (
        <>
          <Button
            onClick={async () => {
              const ok = await confirm({
                title: 'Arquivar 3 conversas?',
                description: 'Elas saem da caixa de entrada.',
                confirmLabel: 'Arquivar',
              })
              results.push(ok)
              setStatus(ok ? 'arquivadas' : 'mantidas')
            }}
          >
            Arquivar
          </Button>
          <p>{status}</p>
          {confirmDialog}
        </>
      )
    }
    render(<Page />)
    const trigger = screen.getByRole('button', { name: 'Arquivar' })
    await user.click(trigger)
    expect(screen.getByRole('alertdialog', { name: 'Arquivar 3 conversas?' })).toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: 'Arquivar' }).at(-1)!)
    expect(await screen.findByText('arquivadas')).toBeInTheDocument()

    await user.click(trigger)
    await user.keyboard('{Escape}')
    expect(await screen.findByText('mantidas')).toBeInTheDocument()
    expect(results).toEqual([true, false])
    expect(trigger).toHaveFocus()
  })

  it('não possui violações de acessibilidade aberto', async () => {
    const user = userEvent.setup()
    render(
      <Example>
        <ul>
          <li>Site 2025</li>
          <li>12 arquivos</li>
        </ul>
      </Example>,
    )
    await user.click(screen.getByRole('button', { name: 'Excluir' }))
    await expectNoA11yViolations(document.body)
  })
})
