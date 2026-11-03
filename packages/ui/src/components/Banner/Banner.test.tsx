import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Button } from '../Button'
import { Banner } from './Banner'

describe('Banner', () => {
  it('renderiza título, texto, ícone do tom e ação', () => {
    const { container } = render(
      <Banner tone="warning" title="Instabilidade no Pix" action={<a href="/status">Ver status</a>}>
        Alguns pagamentos podem levar até 30 minutos para compensar.
      </Banner>,
    )
    const root = container.firstElementChild!
    expect(root).toHaveClass('or-banner', 'or-banner--default', 'or-banner--warning')
    expect(screen.getByText('Instabilidade no Pix').tagName).toBe('P')
    expect(container.querySelector('[data-icon="alert-triangle"]')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver status' })).toHaveAttribute('href', '/status')
    expect(container).toHaveTextContent('Atenção: Instabilidade no Pix')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('usa heading quando headingLevel é informado', () => {
    render(<Banner variant="accent" headingLevel={2} title="Leve o Orange para o seu time" />)
    expect(
      screen.getByRole('heading', { level: 2, name: 'Leve o Orange para o seu time' }),
    ).toHaveClass('or-banner__title')
  })

  it('a variante accent não tem ícone nem prefixo de tom por padrão', () => {
    const { container } = render(
      <Banner variant="accent" tone="danger" title="Webinar ao vivo">
        Quinta, 19h.
      </Banner>,
    )
    const root = container.firstElementChild!
    expect(root).toHaveClass('or-banner--accent')
    expect(root).not.toHaveClass('or-banner--danger')
    expect(container.querySelector('.or-banner__icon')).not.toBeInTheDocument()
    expect(container).not.toHaveTextContent('Erro')
  })

  it('com live anuncia conforme o tom', () => {
    const { rerender } = render(<Banner live tone="danger" title="Sem conexão" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Erro: Sem conexão')
    rerender(<Banner live tone="success" title="Conexão restabelecida" />)
    expect(screen.getByRole('status')).toHaveTextContent('Sucesso: Conexão restabelecida')
  })

  it('pode ser dispensado por mouse e teclado', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(
      <>
        <Banner dismissible onDismiss={onDismiss} title="Novo painel disponível" />
        <main>
          <a href="#conteudo">Conteúdo</a>
        </main>
      </>,
    )
    await user.tab()
    expect(screen.getByRole('button', { name: 'Fechar' })).toHaveFocus()
    await user.keyboard(' ')
    expect(onDismiss).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Novo painel disponível')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Conteúdo' })).toHaveFocus()
  })

  it('respeita a visibilidade controlada', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [open, setOpen] = useState(true)
      return (
        <>
          <Banner open={open} dismissible onDismiss={() => setOpen(false)} title="Aviso" />
          <Button onClick={() => setOpen(true)}>Reabrir</Button>
        </>
      )
    }
    render(<Controlled />)
    await user.click(screen.getByRole('button', { name: 'Fechar' }))
    expect(screen.queryByText('Aviso')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Reabrir' }))
    expect(screen.getByText('Aviso')).toBeInTheDocument()
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <Banner tone="info" title="Manutenção" action={<a href="/status">Detalhes</a>} dismissible>
          Domingo, das 2h às 4h.
        </Banner>
        <Banner tone="danger" live title="Sem conexão" />
        <Banner
          variant="accent"
          headingLevel={2}
          title="Experimente o plano Pro"
          action={<Button>Começar teste grátis</Button>}
          dismissible
        >
          14 dias com todos os recursos, sem cartão de crédito.
        </Banner>
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
