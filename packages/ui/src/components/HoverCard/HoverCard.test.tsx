import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { HoverCard, type HoverCardProps } from './HoverCard'

function Example(props: Partial<HoverCardProps>) {
  return (
    <p>
      Revisado por{' '}
      <HoverCard
        trigger={<a href="/pessoas/ana-souza">Ana Souza</a>}
        openDelay={0}
        closeDelay={0}
        {...props}
      >
        <strong>Ana Souza</strong>
        <span>Designer de produto · Time Pagamentos</span>
      </HoverCard>
    </p>
  )
}

describe('HoverCard', () => {
  it('abre no hover após o atraso e fecha ao sair', async () => {
    const user = userEvent.setup()
    render(<Example openDelay={50} closeDelay={30} />)
    const link = screen.getByRole('link', { name: 'Ana Souza' })
    await user.hover(link)
    expect(screen.queryByText('Designer de produto · Time Pagamentos')).not.toBeInTheDocument()
    expect(await screen.findByText('Designer de produto · Time Pagamentos')).toBeInTheDocument()
    await user.unhover(link)
    await waitFor(() =>
      expect(screen.queryByText('Designer de produto · Time Pagamentos')).not.toBeInTheDocument(),
    )
  })

  it('permanece aberto enquanto o ponteiro está sobre o cartão', async () => {
    const user = userEvent.setup()
    render(<Example closeDelay={250} />)
    const link = screen.getByRole('link', { name: 'Ana Souza' })
    await user.hover(link)
    const card = (await screen.findByText('Designer de produto · Time Pagamentos')).closest(
      '.or-hover-card',
    )!
    await user.unhover(link)
    await user.hover(card)
    await new Promise((resolve) => setTimeout(resolve, 400))
    expect(card).toBeInTheDocument()
  })

  it('abre no foco por teclado, fecha no blur e com Escape', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Example />
        <button type="button">Seguir</button>
      </>,
    )
    await user.tab()
    expect(await screen.findByText('Designer de produto · Time Pagamentos')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByText('Designer de produto · Time Pagamentos')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ana Souza' })).toHaveFocus()

    await user.tab()
    await user.tab({ shift: true })
    expect(await screen.findByText('Designer de produto · Time Pagamentos')).toBeInTheDocument()
    await user.tab()
    expect(screen.queryByText('Designer de produto · Time Pagamentos')).not.toBeInTheDocument()
  })

  it('funciona controlado', () => {
    const onOpenChange = vi.fn()
    render(<Example open onOpenChange={onOpenChange} />)
    expect(screen.getByText('Designer de produto · Time Pagamentos')).toBeInTheDocument()
  })

  it('não possui violações de acessibilidade aberto', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.hover(screen.getByRole('link', { name: 'Ana Souza' }))
    await screen.findByText('Designer de produto · Time Pagamentos')
    await expectNoA11yViolations(document.body)
  })
})
