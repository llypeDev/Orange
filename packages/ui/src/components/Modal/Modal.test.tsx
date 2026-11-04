import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Button } from '../Button'
import { Modal, ModalBody, ModalFooter, type ModalProps } from './Modal'

function Example(props: Partial<ModalProps>) {
  return (
    <Modal
      title="Convidar pessoas"
      description="Elas receberão um e-mail com o link do projeto."
      trigger={<Button>Convidar</Button>}
      {...props}
    >
      {({ close }) => (
        <>
          <ModalBody>
            <label htmlFor="email">E-mail</label>
            <input id="email" />
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={close}>
              Cancelar
            </Button>
            <Button onClick={close}>Enviar convite</Button>
          </ModalFooter>
        </>
      )}
    </Modal>
  )
}

describe('Modal', () => {
  it('abre pelo gatilho com papel, nome e descrição acessíveis', async () => {
    const user = userEvent.setup()
    render(<Example />)
    const trigger = screen.getByRole('button', { name: 'Convidar' })
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Convidar pessoas' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAccessibleDescription('Elas receberão um e-mail com o link do projeto.')
    expect(dialog).toHaveClass('or-modal', 'or-modal--md')
  })

  it('foca o primeiro campo do conteúdo (não o botão fechar) ao abrir', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.click(screen.getByRole('button', { name: 'Convidar' }))
    expect(screen.getByLabelText('E-mail')).toHaveFocus()
  })

  it('respeita initialFocus', async () => {
    function WithInitialFocus() {
      const ref = useRef<HTMLButtonElement>(null)
      return (
        <Modal title="Publicar" defaultOpen initialFocus={ref}>
          <ModalFooter>
            <Button variant="outline">Voltar</Button>
            <Button ref={ref}>Publicar agora</Button>
          </ModalFooter>
        </Modal>
      )
    }
    render(<WithInitialFocus />)
    expect(await screen.findByRole('button', { name: 'Publicar agora' })).toHaveFocus()
  })

  it('prende o foco com Tab e Shift+Tab', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.click(screen.getByRole('button', { name: 'Convidar' }))
    const close = screen.getByRole('button', { name: 'Fechar' })
    const send = screen.getByRole('button', { name: 'Enviar convite' })

    send.focus()
    await user.tab()
    expect(close).toHaveFocus()
    await user.tab({ shift: true })
    expect(send).toHaveFocus()
  })

  it('fecha com Escape e devolve o foco ao gatilho', async () => {
    const user = userEvent.setup()
    render(<Example />)
    const trigger = screen.getByRole('button', { name: 'Convidar' })
    await user.click(trigger)
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('fecha pelo botão Fechar e por ações do rodapé', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.click(screen.getByRole('button', { name: 'Convidar' }))
    await user.click(screen.getByRole('button', { name: 'Fechar' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Convidar' }))
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('fecha ao clicar no fundo, a menos que closeOnOverlayClick seja false', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<Example />)
    await user.click(screen.getByRole('button', { name: 'Convidar' }))
    await user.click(document.querySelector('.or-dialog__backdrop')!)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    unmount()

    render(<Example closeOnOverlayClick={false} />)
    await user.click(screen.getByRole('button', { name: 'Convidar' }))
    await user.click(document.querySelector('.or-dialog__backdrop')!)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('não fecha com Escape quando closeOnEscape é false', async () => {
    const user = userEvent.setup()
    render(<Example closeOnEscape={false} />)
    await user.click(screen.getByRole('button', { name: 'Convidar' }))
    await user.keyboard('{Escape}')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('funciona controlado com open/onOpenChange', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    function Controlled() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <Button onClick={() => setOpen(true)}>Abrir</Button>
          <Modal
            title="Detalhes"
            open={open}
            onOpenChange={(next) => {
              onOpenChange(next)
              setOpen(next)
            }}
          >
            <ModalBody>Conteúdo</ModalBody>
          </Modal>
        </>
      )
    }
    render(<Controlled />)
    await user.click(screen.getByRole('button', { name: 'Abrir' }))
    expect(screen.getByRole('dialog', { name: 'Detalhes' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('bloqueia o scroll da página enquanto aberto', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.click(screen.getByRole('button', { name: 'Convidar' }))
    expect(document.body.style.overflow).toBe('hidden')
    await user.keyboard('{Escape}')
    expect(document.body.style.overflow).toBe('')
  })

  it('Escape fecha apenas o diálogo do topo quando há diálogos empilhados', async () => {
    const user = userEvent.setup()
    render(
      <Modal title="Configurações" trigger={<Button>Configurações</Button>}>
        <ModalBody>
          <Modal title="Confirmar e-mail" trigger={<Button>Alterar e-mail</Button>}>
            <ModalBody>Enviamos um código.</ModalBody>
          </Modal>
        </ModalBody>
      </Modal>,
    )
    await user.click(screen.getByRole('button', { name: 'Configurações' }))
    const inner = screen.getByRole('button', { name: 'Alterar e-mail' })
    await user.click(inner)
    expect(screen.getByRole('dialog', { name: 'Confirmar e-mail' })).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: 'Confirmar e-mail' })).not.toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: 'Configurações' })).toBeInTheDocument()
    expect(inner).toHaveFocus()
  })

  it('aplica tamanhos e traduz o botão fechar', async () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <Modal title="Share" size="lg" defaultOpen>
          <ModalBody>Body</ModalBody>
        </Modal>
      </OrangeProvider>,
    )
    expect(await screen.findByRole('dialog')).toHaveClass('or-modal--lg')
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })

  it('não possui violações de acessibilidade com o diálogo aberto', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.click(screen.getByRole('button', { name: 'Convidar' }))
    await expectNoA11yViolations(document.body)
  })
})
