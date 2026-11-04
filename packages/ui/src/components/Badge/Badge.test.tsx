import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Icon } from '../../icons'
import { expectNoA11yViolations } from '../../test/axe'
import { Button } from '../Button'
import { Badge } from './Badge'

describe('Badge', () => {
  it('mostra o número inline com tom e tamanho', () => {
    render(<Badge count={7} tone="danger" size="sm" data-testid="b" />)
    const badge = screen.getByTestId('b')
    expect(badge).toHaveTextContent('7')
    expect(badge).toHaveClass('or-badge', 'or-badge--danger', 'or-badge--sm')
  })

  it('limita com max (99+) e aceita max personalizado', () => {
    const { rerender } = render(<Badge count={120} data-testid="b" />)
    expect(screen.getByTestId('b')).toHaveTextContent('99+')
    rerender(<Badge count={12} max={9} data-testid="b" />)
    expect(screen.getByTestId('b')).toHaveTextContent('9+')
  })

  it('some com zero, a menos que showZero', () => {
    const { rerender } = render(<Badge count={0} data-testid="b" />)
    expect(screen.queryByTestId('b')).toBeNull()
    rerender(<Badge count={0} showZero data-testid="b" />)
    expect(screen.getByTestId('b')).toHaveTextContent('0')
  })

  it('com label, o texto acessível substitui o número', () => {
    render(<Badge count={3} label="3 tarefas atrasadas" data-testid="b" />)
    const badge = screen.getByTestId('b')
    expect(badge).toHaveTextContent('3 tarefas atrasadas')
    expect(screen.getByText('3', { selector: 'span' })).toHaveAttribute('aria-hidden', 'true')
  })

  it('ponto sem label é decorativo; com label é anunciado', () => {
    const { rerender } = render(<Badge dot tone="success" data-testid="b" />)
    expect(screen.getByTestId('b')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByTestId('b')).toHaveClass('or-badge--dot')
    rerender(<Badge dot tone="success" label="Online" data-testid="b" />)
    expect(screen.getByTestId('b')).not.toHaveAttribute('aria-hidden')
    expect(screen.getByTestId('b')).toHaveTextContent('Online')
  })

  it('sobreposto a um botão: liga o label via aria-describedby', () => {
    render(
      <Badge count={3} label="3 notificações não lidas" data-testid="b">
        <Button iconOnly aria-label="Notificações" variant="ghost" startIcon={<Icon name="bell" />} />
      </Badge>,
    )
    const button = screen.getByRole('button', { name: 'Notificações' })
    expect(button).toHaveAccessibleDescription('3 notificações não lidas')
    expect(screen.getByTestId('b')).toHaveClass('or-badge--overlay')
    expect(screen.getByTestId('b')).toHaveAttribute('aria-hidden', 'true')
  })

  it('sobreposto sem contagem não adiciona descrição e não remonta o filho', () => {
    const { rerender } = render(
      <Badge count={0} label="Nenhuma notificação">
        <Button aria-describedby="dica">Caixa de entrada</Button>
      </Badge>,
    )
    const button = screen.getByRole('button', { name: 'Caixa de entrada' })
    expect(button).toHaveAttribute('aria-describedby', 'dica')
    button.focus()
    rerender(
      <Badge count={2} label="2 mensagens novas">
        <Button aria-describedby="dica">Caixa de entrada</Button>
      </Badge>,
    )
    expect(screen.getByRole('button', { name: 'Caixa de entrada' })).toHaveFocus()
    expect(screen.getByRole('button').getAttribute('aria-describedby')).toMatch(/^dica or-badge-/)
  })

  it('motion: não anima na primeira renderização; "pop" ao surgir e "bump" ao mudar a contagem', () => {
    const { rerender } = render(<Badge count={3} data-testid="b" />)
    expect(screen.getByTestId('b')).not.toHaveAttribute('data-motion')
    expect(screen.getByTestId('b')).toHaveAttribute('data-state', 'open')
    rerender(<Badge count={4} data-testid="b" />)
    expect(screen.getByTestId('b')).toHaveAttribute('data-motion', 'bump')
    expect(screen.getByTestId('b')).toHaveTextContent('4')
    rerender(<Badge count={0} data-testid="b" />)
    expect(screen.queryByTestId('b')).toBeNull()
    rerender(<Badge count={1} data-testid="b" />)
    expect(screen.getByTestId('b')).toHaveAttribute('data-motion', 'pop')
  })

  it('pulse adiciona o anel pulsante', () => {
    render(<Badge dot pulse tone="success" label="Ao vivo" data-testid="b" />)
    expect(screen.getByTestId('b')).toHaveClass('or-badge--pulse')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <Badge count={12} label="12 itens no carrinho" />
        <Badge count={150} tone="neutral" />
        <Badge dot tone="warning" />
        <Badge count={5} label="5 mensagens não lidas" tone="info">
          <Button iconOnly aria-label="Mensagens" startIcon={<Icon name="mail" />} variant="outline" />
        </Badge>
        <Badge dot label="Nova versão disponível" overlap="circle">
          <Icon name="bell" label="Atualizações" />
        </Badge>
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
