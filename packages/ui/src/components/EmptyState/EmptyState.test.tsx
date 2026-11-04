import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Icon } from '../../icons'
import { expectNoA11yViolations } from '../../test/axe'
import { Button } from '../Button'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('renderiza título como h3 por padrão, descrição e ilustração decorativa', () => {
    const { container } = render(
      <EmptyState
        title="Nenhum projeto ainda"
        description="Crie o primeiro projeto para convidar o time."
      />,
    )
    expect(
      screen.getByRole('heading', { level: 3, name: 'Nenhum projeto ainda' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Crie o primeiro projeto para convidar o time.')).toBeInTheDocument()
    const art = container.querySelector('.or-empty-state__art')!
    expect(art).toHaveAttribute('aria-hidden', 'true')
    expect(art.querySelector('[data-icon="inbox"]')).toBeInTheDocument()
    expect(container.firstElementChild).toHaveClass('or-empty-state', 'or-empty-state--default')
  })

  it('permite configurar o nível do heading', () => {
    render(<EmptyState title="Sem resultados" headingLevel={2} />)
    expect(screen.getByRole('heading', { level: 2, name: 'Sem resultados' })).toBeInTheDocument()
  })

  it('aceita nome de ícone, elemento ou ilustração própria', () => {
    const { container, rerender } = render(<EmptyState title="Sem resultados" icon="search" />)
    expect(container.querySelector('[data-icon="search"]')).toBeInTheDocument()
    rerender(<EmptyState title="Sem resultados" icon={<Icon name="filter" />} />)
    expect(container.querySelector('[data-icon="filter"]')).toBeInTheDocument()
    rerender(<EmptyState title="Sem resultados" illustration={<img src="/vazio.svg" alt="" />} />)
    expect(container.querySelector('.or-empty-state__art')).not.toBeInTheDocument()
    expect(container.querySelector('img')).toBeInTheDocument()
    rerender(<EmptyState title="Sem resultados" illustration={false} />)
    expect(container.querySelector('.or-empty-state__art')).not.toBeInTheDocument()
  })

  it('mostra ações primária e secundária, operáveis por mouse e teclado', async () => {
    const user = userEvent.setup()
    const onCreate = vi.fn()
    render(
      <EmptyState
        title="Nenhum cliente cadastrado"
        action={<Button onClick={onCreate}>Cadastrar cliente</Button>}
        secondaryAction={<a href="/importar">Importar planilha</a>}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Cadastrar cliente' }))
    await user.tab()
    expect(screen.getByRole('link', { name: 'Importar planilha' })).toHaveFocus()
    await user.tab({ shift: true })
    await user.keyboard('{Enter}')
    expect(onCreate).toHaveBeenCalledTimes(2)
  })

  it('anima a entrada por padrão e permite desligar', () => {
    const { container, rerender } = render(<EmptyState title="Sem pedidos" />)
    expect(container.firstElementChild).toHaveClass('or-empty-state--animated')
    rerender(<EmptyState title="Sem pedidos" animated={false} />)
    expect(container.firstElementChild).not.toHaveClass('or-empty-state--animated')
  })

  it('variante compacta', () => {
    const { container } = render(<EmptyState variant="compact" title="Sem comentários" />)
    expect(container.firstElementChild).toHaveClass('or-empty-state--compact')
  })

  it('repassa ref e atributos', () => {
    let node: HTMLDivElement | null = null
    render(
      <EmptyState
        ref={(el) => {
          node = el
        }}
        title="Vazio"
        data-testid="empty"
      />,
    )
    expect(node).toBe(screen.getByTestId('empty'))
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <main>
        <h2>Projetos</h2>
        <EmptyState
          title="Nenhum projeto ainda"
          description="Projetos reúnem tarefas, arquivos e pessoas."
          action={<Button>Criar projeto</Button>}
          secondaryAction={<Button variant="ghost">Ver modelos</Button>}
        />
        <EmptyState
          variant="compact"
          icon="search"
          title="Nenhum resultado para “boleto”"
          headingLevel={4}
        />
      </main>,
    )
    await expectNoA11yViolations(container)
  })
})
