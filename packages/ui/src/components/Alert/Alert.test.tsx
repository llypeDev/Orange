import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Icon } from '../../icons'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Button } from '../Button'
import { Alert } from './Alert'

describe('Alert', () => {
  it('renderiza título, conteúdo e ícone do tom, sem papel de região viva por padrão', () => {
    const { container } = render(
      <Alert tone="success" title="Pagamento confirmado">
        O recibo foi enviado para o seu e-mail.
      </Alert>,
    )
    const root = container.firstElementChild!
    expect(root).toHaveClass('or-alert', 'or-alert--success')
    expect(screen.getByText('Pagamento confirmado')).toHaveClass('or-alert__title')
    expect(screen.getByText('O recibo foi enviado para o seu e-mail.')).toBeInTheDocument()
    expect(container.querySelector('[data-icon="check-circle"]')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('usa info como tom padrão e prefixa o tom para leitores de tela', () => {
    const { container } = render(<Alert title="Manutenção programada">Sábado, das 2h às 4h.</Alert>)
    expect(container.firstElementChild).toHaveClass('or-alert--info')
    expect(container).toHaveTextContent('Informação: Manutenção programada')
  })

  it('o tom neutral não recebe prefixo', () => {
    const { container } = render(<Alert tone="neutral">Sem novidades.</Alert>)
    expect(container.textContent).toBe('Sem novidades.')
  })

  it('com live aplica role="alert" em danger/warning e role="status" nos demais', () => {
    const { rerender } = render(
      <Alert live tone="danger" title="Falha ao salvar">
        Tente novamente.
      </Alert>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Erro: Falha ao salvar')
    rerender(
      <Alert live tone="warning" title="Sessão expirando">
        Faltam 2 minutos.
      </Alert>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Atenção: Sessão expirando')
    rerender(
      <Alert live tone="success" title="Salvo">
        Alterações publicadas.
      </Alert>,
    )
    expect(screen.getByRole('status')).toHaveAttribute('aria-atomic', 'true')
  })

  it('a região viva não inclui ações nem o botão de fechar', () => {
    render(
      <Alert
        live
        tone="danger"
        title="Falha no envio"
        dismissible
        action={<Button size="sm">Reenviar</Button>}
      >
        Verifique a conexão.
      </Alert>,
    )
    const alert = screen.getByRole('alert')
    expect(alert).not.toHaveTextContent('Reenviar')
    expect(alert).not.toHaveTextContent('Fechar')
    expect(screen.getByRole('button', { name: 'Reenviar' })).toBeInTheDocument()
  })

  it('aceita ícone personalizado ou nenhum ícone', () => {
    const { container, rerender } = render(<Alert icon={<Icon name="rocket" />}>Novidade</Alert>)
    expect(container.querySelector('[data-icon="rocket"]')).toBeInTheDocument()
    rerender(<Alert icon={false}>Novidade</Alert>)
    expect(container.querySelector('.or-alert__icon')).not.toBeInTheDocument()
  })

  it('fecha com mouse (não controlado) e chama onDismiss', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(
      <Alert dismissible onDismiss={onDismiss} title="Convite enviado">
        A Ana receberá um e-mail.
      </Alert>,
    )
    await user.click(screen.getByRole('button', { name: 'Fechar' }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Convite enviado')).not.toBeInTheDocument()
  })

  it('fecha pelo teclado e move o foco para o próximo elemento focável', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <Alert dismissible title="Dica">
          Use atalhos para ganhar tempo.
        </Alert>
        <button type="button">Continuar</button>
      </div>,
    )
    await user.tab()
    expect(screen.getByRole('button', { name: 'Fechar' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.queryByText('Dica')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continuar' })).toHaveFocus()
  })

  it('respeita a visibilidade controlada', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [open, setOpen] = useState(true)
      return (
        <>
          <Alert open={open} dismissible onDismiss={() => setOpen(false)} title="Controlado" />
          <button type="button" onClick={() => setOpen(true)}>
            Mostrar
          </button>
        </>
      )
    }
    render(<Controlled />)
    await user.click(screen.getByRole('button', { name: 'Fechar' }))
    expect(screen.queryByText('Controlado')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Mostrar' }))
    expect(screen.getByText('Controlado')).toBeInTheDocument()

    render(<Alert open={false} title="Oculto" />)
    expect(screen.queryByText('Oculto')).not.toBeInTheDocument()
  })

  it('traduz textos internos', () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <Alert live tone="danger" dismissible title="Payment failed" />
      </OrangeProvider>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Error: Payment failed')
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <Alert tone="info" title="Informação">
          Texto de apoio com <a href="#ajuda">link</a>.
        </Alert>
        <Alert tone="success" title="Sucesso" dismissible />
        <Alert tone="warning" live title="Atenção" action={<Button size="sm">Revisar</Button>} />
        <Alert tone="danger" live dismissible>
          Erro sem título.
        </Alert>
        <Alert tone="neutral" icon={false}>
          Neutro.
        </Alert>
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
