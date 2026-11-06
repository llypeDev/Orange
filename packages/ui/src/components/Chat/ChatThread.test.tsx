import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { ChatMessage, type ChatMessageProps } from './ChatMessage'
import { ChatThread, type ChatThreadProps } from './ChatThread'

/* Métricas de rolagem falsas para a área rolável (o jsdom não faz layout). */
const metrics = { scrollHeight: 0, clientHeight: 0, scrollTop: 0 }
const isViewport = (el: Element) => el.classList.contains('or-chat-thread__viewport')
const scrollTo = vi.fn(function (this: HTMLElement, options: ScrollToOptions) {
  this.scrollTop = options.top ?? 0
})

beforeEach(() => {
  Object.assign(metrics, { scrollHeight: 0, clientHeight: 0, scrollTop: 0 })
  scrollTo.mockClear()
  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    configurable: true,
    get(this: HTMLElement) {
      return isViewport(this) ? metrics.scrollHeight : 0
    },
  })
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
    configurable: true,
    get(this: HTMLElement) {
      return isViewport(this) ? metrics.clientHeight : 0
    },
  })
  Object.defineProperty(HTMLElement.prototype, 'scrollTop', {
    configurable: true,
    get(this: HTMLElement) {
      return isViewport(this) ? metrics.scrollTop : 0
    },
    set(this: HTMLElement, value: number) {
      if (isViewport(this)) {
        metrics.scrollTop = Math.max(
          0,
          Math.min(value, metrics.scrollHeight - metrics.clientHeight),
        )
      }
    },
  })
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
    configurable: true,
    writable: true,
    value: scrollTo,
  })
})

afterEach(() => {
  const proto = HTMLElement.prototype as unknown as Record<string, unknown>
  delete proto.scrollHeight
  delete proto.clientHeight
  delete proto.scrollTop
  delete proto.scrollTo
})

interface Msg {
  id: string
  from: ChatMessageProps['from']
  text: string
  status?: ChatMessageProps['status']
  author?: string
}

const history: Msg[] = [
  { id: '1', from: 'user', text: 'Como fechou o relatório de vendas de outubro?' },
  {
    id: '2',
    from: 'assistant',
    author: 'Assistente de vendas',
    text: 'Faturamento de R$ 1,2 mi, 12% acima de setembro.',
  },
]

function Thread({ messages = history, ...props }: { messages?: Msg[] } & ChatThreadProps) {
  return (
    <ChatThread {...props}>
      {messages.map((m) => (
        <ChatMessage key={m.id} from={m.from} author={m.author} status={m.status}>
          {m.text}
        </ChatMessage>
      ))}
    </ChatThread>
  )
}

const reply: Msg = {
  id: '3',
  from: 'assistant',
  author: 'Assistente de vendas',
  text: 'O Sudeste puxou o crescimento, com alta de 18%.',
}

const wait = (ms: number) => act(() => new Promise((resolve) => setTimeout(resolve, ms)))

describe('ChatThread', () => {
  it('é um role="log" nomeado "Conversa", com as mensagens como article', () => {
    render(<Thread />)
    const log = screen.getByRole('log', { name: 'Conversa' })
    expect(within(log).getAllByRole('article')).toHaveLength(2)
    // O log não lê as mudanças sozinho: os anúncios saem da região de status.
    expect(log).toHaveAttribute('aria-live', 'off')
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('aceita aria-label próprio e traduz o padrão', () => {
    const { unmount } = render(<Thread aria-label="Suporte — pedido 4821" />)
    expect(screen.getByRole('log', { name: 'Suporte — pedido 4821' })).toBeInTheDocument()
    unmount()
    render(
      <OrangeProvider locale="en-US">
        <Thread />
      </OrangeProvider>,
    )
    expect(screen.getByRole('log', { name: 'Conversation' })).toBeInTheDocument()
  })

  it('aria-labelledby substitui o nome padrão', () => {
    render(
      <>
        <h2 id="titulo">Comentários da tarefa</h2>
        <Thread aria-labelledby="titulo" />
      </>,
    )
    const log = screen.getByRole('log', { name: 'Comentários da tarefa' })
    expect(log).not.toHaveAttribute('aria-label')
  })

  it('repassa ref e props nativas ao log; className e style ao contêiner', () => {
    const ref = createRef<HTMLDivElement>()
    const { container } = render(
      <ChatThread ref={ref} className="painel" style={{ height: 320 }} data-testid="log">
        <ChatMessage from="assistant">Oi</ChatMessage>
      </ChatThread>,
    )
    expect(ref.current).toBe(screen.getByRole('log'))
    expect(screen.getByTestId('log')).toBe(ref.current)
    const root = container.firstElementChild as HTMLElement
    expect(root).toHaveClass('or-chat-thread', 'painel')
    expect(root).toHaveStyle({ height: '320px' })
  })

  it('mostra o emptyState sem mensagens (e o esconde com loading)', () => {
    const { rerender } = render(
      <Thread messages={[]} emptyState={<p>Pergunte sobre suas vendas</p>} />,
    )
    expect(screen.getByText('Pergunte sobre suas vendas')).toBeInTheDocument()
    rerender(<Thread messages={[]} emptyState={<p>Pergunte sobre suas vendas</p>} loading />)
    expect(screen.queryByText('Pergunte sobre suas vendas')).not.toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Digitando…' })).toBeInTheDocument()
  })

  describe('indicador "Digitando…"', () => {
    it('aparece no fim do log com loading', () => {
      const { rerender } = render(<Thread />)
      expect(screen.queryByRole('img', { name: 'Digitando…' })).not.toBeInTheDocument()
      rerender(<Thread loading />)
      const log = screen.getByRole('log')
      const typing = within(log).getByRole('img', { name: 'Digitando…' })
      expect(typing.querySelectorAll('.or-chat-thread__dot')).toHaveLength(3)
    })

    it('é anunciado quando loading liga, mas não na montagem', () => {
      const { rerender } = render(<Thread loading />)
      expect(screen.getByRole('status')).toBeEmptyDOMElement()
      rerender(<Thread loading={false} />)
      rerender(<Thread loading />)
      expect(screen.getByRole('status')).toHaveTextContent('Digitando…')
    })
  })

  describe('anúncios', () => {
    it('não anuncia o histórico presente na montagem', async () => {
      render(<Thread />)
      await wait(650)
      expect(screen.getByRole('status')).toBeEmptyDOMElement()
    })

    it('anuncia a nova mensagem do assistente (autor + texto)', async () => {
      const { rerender } = render(<Thread />)
      rerender(<Thread messages={[...history, reply]} />)
      await waitFor(() =>
        expect(screen.getByRole('status')).toHaveTextContent(
          'Assistente de vendas: O Sudeste puxou o crescimento, com alta de 18%.',
        ),
      )
    })

    it('usa o nome padrão quando a mensagem não tem author', async () => {
      const { rerender } = render(<Thread />)
      rerender(<Thread messages={[...history, { id: '3', from: 'assistant', text: 'Pronto.' }]} />)
      await waitFor(() =>
        expect(screen.getByRole('status')).toHaveTextContent('Assistente: Pronto.'),
      )
    })

    it('anuncia mensagens novas de outra pessoa (from="other"), uma por vez', async () => {
      const support: Msg[] = [
        { id: '1', from: 'other', author: 'Ana · Suporte', text: 'Olá! Como posso ajudar?' },
        { id: '2', from: 'user', text: 'O pedido 4821 atrasou.' },
      ]
      const { rerender } = render(<Thread messages={support} />)
      await wait(650)
      // Histórico de outra pessoa presente na montagem: silêncio.
      expect(screen.getByRole('status')).toBeEmptyDOMElement()

      const first: Msg = {
        id: '3',
        from: 'other',
        author: 'Ana · Suporte',
        text: 'Já abri um chamado com a transportadora.',
      }
      rerender(<Thread messages={[...support, first]} />)
      await waitFor(() =>
        expect(screen.getByRole('status')).toHaveTextContent(
          'Ana · Suporte: Já abri um chamado com a transportadora.',
        ),
      )
      const second: Msg = {
        id: '4',
        from: 'other',
        author: 'Ana · Suporte',
        text: 'A entrega ficou para sexta-feira.',
      }
      rerender(<Thread messages={[...support, first, second]} />)
      await waitFor(() =>
        expect(screen.getByRole('status')).toHaveTextContent(
          'Ana · Suporte: A entrega ficou para sexta-feira.',
        ),
      )
      expect(screen.getByRole('status')).not.toHaveTextContent('chamado')
    })

    it('não anuncia as mensagens do próprio usuário', async () => {
      const { rerender } = render(<Thread />)
      rerender(<Thread messages={[...history, { id: '3', from: 'user', text: 'E por região?' }]} />)
      await wait(650)
      expect(screen.getByRole('status')).toBeEmptyDOMElement()
    })

    it('espera a mensagem ficar completa (status sending / loading) antes de anunciar', async () => {
      const streaming = { ...reply, text: 'O Sudeste', status: 'sending' as const }
      const { rerender } = render(<Thread />)
      rerender(<Thread messages={[...history, streaming]} />)
      await wait(650)
      expect(screen.getByRole('status')).toBeEmptyDOMElement()

      rerender(<Thread messages={[...history, { ...reply, status: 'sent' }]} />)
      await waitFor(() =>
        expect(screen.getByRole('status')).toHaveTextContent(
          'Assistente de vendas: O Sudeste puxou o crescimento, com alta de 18%.',
        ),
      )
    })

    it('com loading ligado, a resposta só é anunciada quando loading desliga', async () => {
      const { rerender } = render(<Thread />)
      rerender(<Thread loading />)
      rerender(<Thread loading messages={[...history, reply]} />)
      await wait(650)
      expect(screen.getByRole('status')).toHaveTextContent('Digitando…')
      rerender(<Thread loading={false} messages={[...history, reply]} />)
      await waitFor(() =>
        expect(screen.getByRole('status')).toHaveTextContent('Assistente de vendas: O Sudeste'),
      )
    })

    it('mensagens com erro não são lidas pela região de status (o alerta já avisa)', async () => {
      const { rerender } = render(<Thread />)
      rerender(<Thread messages={[...history, { ...reply, status: 'error' }]} />)
      await wait(650)
      expect(screen.getByRole('status')).toBeEmptyDOMElement()
      expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível enviar a mensagem.')
    })
  })

  describe('rolagem', () => {
    it('começa no fim e é focável quando rola', () => {
      Object.assign(metrics, { scrollHeight: 1000, clientHeight: 300 })
      render(<Thread />)
      expect(metrics.scrollTop).toBe(700)
      expect(screen.getByRole('log')).toHaveAttribute('tabindex', '0')
    })

    it('não entra na ordem de foco quando não rola', () => {
      Object.assign(metrics, { scrollHeight: 200, clientHeight: 300 })
      render(<Thread />)
      expect(screen.getByRole('log')).not.toHaveAttribute('tabindex')
    })

    it('no fim: acompanha a mensagem nova, sem botão', () => {
      Object.assign(metrics, { scrollHeight: 1000, clientHeight: 300 })
      const { rerender } = render(<Thread />)
      metrics.scrollHeight = 1200
      rerender(<Thread messages={[...history, reply]} />)
      expect(metrics.scrollTop).toBe(900)
      expect(screen.queryByRole('button', { name: 'Novas mensagens' })).not.toBeInTheDocument()
    })

    it('rolado para cima: mantém a posição e mostra "Novas mensagens", que leva ao fim', async () => {
      const user = userEvent.setup()
      Object.assign(metrics, { scrollHeight: 1000, clientHeight: 300 })
      const { rerender } = render(<Thread />)
      const log = screen.getByRole('log')
      metrics.scrollTop = 100
      fireEvent.scroll(log)

      metrics.scrollHeight = 1200
      rerender(<Thread messages={[...history, reply]} />)
      expect(metrics.scrollTop).toBe(100)
      const jump = screen.getByRole('button', { name: 'Novas mensagens' })

      await user.click(jump)
      expect(scrollTo).toHaveBeenCalledWith({ top: 1200, behavior: 'smooth' })
      expect(metrics.scrollTop).toBe(900)
      await waitFor(() =>
        expect(screen.queryByRole('button', { name: 'Novas mensagens' })).not.toBeInTheDocument(),
      )
      // O botão some: o foco vai para a conversa.
      expect(log).toHaveFocus()
    })

    it('o botão some quando a pessoa rola até o fim', async () => {
      Object.assign(metrics, { scrollHeight: 1000, clientHeight: 300 })
      const { rerender } = render(<Thread />)
      const log = screen.getByRole('log')
      metrics.scrollTop = 0
      fireEvent.scroll(log)
      metrics.scrollHeight = 1200
      rerender(<Thread messages={[...history, reply]} />)
      expect(screen.getByRole('button', { name: 'Novas mensagens' })).toBeInTheDocument()

      metrics.scrollTop = 880 // a menos de 32px do fim
      fireEvent.scroll(log)
      await waitFor(() =>
        expect(screen.queryByRole('button', { name: 'Novas mensagens' })).not.toBeInTheDocument(),
      )
    })

    it('mensagem nova do próprio usuário sempre leva ao fim', () => {
      Object.assign(metrics, { scrollHeight: 1000, clientHeight: 300 })
      const { rerender } = render(<Thread />)
      metrics.scrollTop = 0
      fireEvent.scroll(screen.getByRole('log'))
      metrics.scrollHeight = 1100
      rerender(<Thread messages={[...history, { id: '3', from: 'user', text: 'E por região?' }]} />)
      expect(metrics.scrollTop).toBe(800)
      expect(screen.queryByRole('button', { name: 'Novas mensagens' })).not.toBeInTheDocument()
    })

    it('crescer o texto da última mensagem (streaming) não mostra o botão', () => {
      Object.assign(metrics, { scrollHeight: 1000, clientHeight: 300 })
      const { rerender } = render(
        <Thread messages={[...history, { ...reply, text: 'O Sudeste' }]} />,
      )
      metrics.scrollTop = 0
      fireEvent.scroll(screen.getByRole('log'))
      metrics.scrollHeight = 1100
      rerender(<Thread messages={[...history, reply]} />)
      expect(screen.queryByRole('button', { name: 'Novas mensagens' })).not.toBeInTheDocument()
    })

    it('com movimento reduzido, o salto é instantâneo', async () => {
      const original = window.matchMedia
      window.matchMedia = ((query: string) => ({
        ...original(query),
        matches: query.includes('prefers-reduced-motion'),
      })) as typeof window.matchMedia
      try {
        const user = userEvent.setup()
        Object.assign(metrics, { scrollHeight: 1000, clientHeight: 300 })
        const { rerender } = render(<Thread />)
        metrics.scrollTop = 0
        fireEvent.scroll(screen.getByRole('log'))
        metrics.scrollHeight = 1200
        rerender(<Thread messages={[...history, reply]} />)
        await user.click(screen.getByRole('button', { name: 'Novas mensagens' }))
        expect(scrollTo).not.toHaveBeenCalled()
        expect(metrics.scrollTop).toBe(900)
      } finally {
        window.matchMedia = original
      }
    })
  })

  it('só as mensagens que chegam depois da montagem entram animadas', () => {
    const { rerender } = render(<Thread />)
    screen
      .getAllByRole('article')
      .forEach((article) => expect(article).not.toHaveClass('or-chat-message--enter'))
    rerender(<Thread messages={[...history, reply]} />)
    const articles = screen.getAllByRole('article')
    expect(articles[2]).toHaveClass('or-chat-message--enter')
    expect(articles[0]).not.toHaveClass('or-chat-message--enter')
  })

  it('não tem violações de acessibilidade (rolando, com loading e o botão)', async () => {
    Object.assign(metrics, { scrollHeight: 1000, clientHeight: 300 })
    const { container, rerender } = render(<Thread />)
    metrics.scrollTop = 0
    fireEvent.scroll(screen.getByRole('log'))
    rerender(<Thread messages={[...history, reply]} loading />)
    expect(screen.getByRole('button', { name: 'Novas mensagens' })).toBeInTheDocument()
    await expectNoA11yViolations(container)
  })
})
