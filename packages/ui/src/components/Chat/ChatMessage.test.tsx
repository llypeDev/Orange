import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Avatar } from '../Avatar'
import { CopyButton } from '../CopyButton'
import { IconButton } from '../IconButton'
import { ChatMessage } from './ChatMessage'

const NOW = new Date(2026, 10, 12, 12, 0, 0) // 12 nov. 2026, 12:00 (horário local)

describe('ChatMessage', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(NOW)
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('é um article nomeado pelo autor e pelo horário', () => {
    render(
      <ChatMessage
        from="assistant"
        author="Assistente de vendas"
        timestamp={new Date(2026, 10, 12, 11, 42)}
      >
        O faturamento de outubro foi 12% maior que o de setembro.
      </ChatMessage>,
    )
    const article = screen.getByRole('article', { name: 'Assistente de vendas 11:42' })
    expect(article).toHaveClass('or-chat-message', 'or-chat-message--assistant')
    expect(article).toHaveAttribute('data-from', 'assistant')
    expect(screen.getByText('Assistente de vendas')).toBeVisible()
    expect(article).toHaveTextContent('O faturamento de outubro foi 12% maior que o de setembro.')
  })

  it('sem author, usa um nome padrão oculto visualmente para cada remetente', () => {
    render(
      <>
        <ChatMessage from="user">Pode detalhar por região?</ChatMessage>
        <ChatMessage from="assistant">Claro: Sudeste lidera com 48%.</ChatMessage>
        <ChatMessage from="system">Conversa transferida para o time de suporte.</ChatMessage>
      </>,
    )
    expect(screen.getByRole('article', { name: 'Você' })).toHaveClass('or-chat-message--user')
    expect(screen.getByRole('article', { name: 'Assistente' })).toHaveClass(
      'or-chat-message--assistant',
    )
    expect(screen.getByRole('article', { name: 'Sistema' })).toHaveClass('or-chat-message--system')
    expect(screen.getByText('Você')).toHaveClass('or-visually-hidden')
  })

  it('from="other": outra pessoa, à esquerda e neutra, com o nome visível', () => {
    render(
      <ChatMessage
        from="other"
        author="Ana · Suporte"
        avatar={<Avatar name="Ana Ribeiro" size="sm" />}
        timestamp={new Date(2026, 10, 12, 11, 45)}
      >
        A transportadora confirmou a entrega para sexta-feira.
      </ChatMessage>,
    )
    const article = screen.getByRole('article', { name: 'Ana · Suporte 11:45' })
    expect(article).toHaveClass('or-chat-message--other')
    expect(article).not.toHaveClass('or-chat-message--assistant')
    expect(article).toHaveAttribute('data-from', 'other')
    expect(screen.getByText('Ana · Suporte')).not.toHaveClass('or-visually-hidden')
    expect(article.querySelector('.or-chat-message__avatar')).toHaveAttribute('aria-hidden', 'true')
  })

  it('from="other" sem author avisa em desenvolvimento e usa "Participante" oculto', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      render(<ChatMessage from="other">Oi, tudo certo com o pedido?</ChatMessage>)
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('`from="other"` precisa de `author`'),
      )
      const article = screen.getByRole('article', { name: 'Participante' })
      expect(article).toHaveClass('or-chat-message--other')
      expect(screen.getByText('Participante')).toHaveClass('or-visually-hidden')
    } finally {
      warn.mockRestore()
    }
  })

  it('from="other" com author não avisa', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      render(
        <ChatMessage from="other" author="Bruno Lima">
          Subi a versão 3 do contrato.
        </ChatMessage>,
      )
      expect(warn).not.toHaveBeenCalled()
    } finally {
      warn.mockRestore()
    }
  })

  it('traduz os nomes padrão com o locale do provider', () => {
    render(
      <OrangeProvider locale="en-US">
        <ChatMessage from="user">Hi</ChatMessage>
        <ChatMessage from="assistant">Hello</ChatMessage>
        <ChatMessage from="other">Hey</ChatMessage>
      </OrangeProvider>,
    )
    expect(screen.getByRole('article', { name: 'You' })).toBeInTheDocument()
    expect(screen.getByRole('article', { name: 'Assistant' })).toBeInTheDocument()
    expect(screen.getByRole('article', { name: 'Participant' })).toBeInTheDocument()
  })

  it('mostra só a hora para hoje e dia + hora para outros dias, em <time dateTime>', () => {
    const today = new Date(2026, 10, 12, 9, 5)
    const earlier = new Date(2026, 10, 10, 16, 30)
    render(
      <>
        <ChatMessage from="assistant" timestamp={today}>
          Hoje
        </ChatMessage>
        <ChatMessage from="assistant" timestamp={earlier}>
          Antes
        </ChatMessage>
      </>,
    )
    const [first, second] = screen.getAllByRole('time')
    expect(first).toHaveTextContent('09:05')
    expect(first).toHaveAttribute('datetime', today.toISOString())
    expect(second).toHaveTextContent(/10 de nov/)
    expect(second).toHaveTextContent(/16:30/)
  })

  it('timestampFormat="relative" usa o texto relativo do RelativeTime', () => {
    render(
      <ChatMessage
        from="user"
        author="Ana"
        timestamp={new Date(NOW.getTime() - 5 * 60_000)}
        timestampFormat="relative"
      >
        Revisei o contrato.
      </ChatMessage>,
    )
    expect(screen.getByRole('time')).toHaveTextContent('há 5 minutos')
  })

  it('texto simples mantém quebras de linha; palavras longas quebram no balão', () => {
    render(<ChatMessage from="user">{'Linha 1\nLinha 2'}</ChatMessage>)
    const bubble = screen.getByText(/Linha 1/)
    expect(bubble).toHaveClass('or-chat-message__bubble', 'or-chat-message__bubble--text')
  })

  it('status="sending" marca aria-busy e mostra "Enviando…" nas mensagens do usuário', () => {
    const { rerender } = render(
      <ChatMessage from="user" status="sending">
        Pode gerar o PDF?
      </ChatMessage>,
    )
    const article = screen.getByRole('article', { name: 'Você' })
    expect(article).toHaveAttribute('aria-busy', 'true')
    expect(article).toHaveAttribute('data-status', 'sending')
    expect(screen.getByText('Enviando…')).toBeInTheDocument()

    rerender(
      <ChatMessage from="user" status="sent">
        Pode gerar o PDF?
      </ChatMessage>,
    )
    expect(article).not.toHaveAttribute('aria-busy')
    expect(screen.queryByText('Enviando…')).not.toBeInTheDocument()
  })

  it('em respostas do assistente, "sending" só marca aria-busy (sem texto visível)', () => {
    render(
      <ChatMessage from="assistant" status="sending">
        Analisando o relatório
      </ChatMessage>,
    )
    expect(screen.getByRole('article')).toHaveAttribute('aria-busy', 'true')
    expect(screen.queryByText('Enviando…')).not.toBeInTheDocument()
  })

  it('status="error" anuncia a falha (role="alert") e oferece "Tentar novamente"', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    render(
      <ChatMessage from="user" status="error" onRetry={onRetry}>
        Pode gerar o PDF?
      </ChatMessage>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível enviar a mensagem.')
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('erro sem onRetry não mostra o botão', () => {
    render(
      <ChatMessage from="user" status="error">
        Pode gerar o PDF?
      </ChatMessage>,
    )
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renderiza ações e um avatar decorativo', async () => {
    const user = userEvent.setup()
    const onLike = vi.fn()
    render(
      <ChatMessage
        from="assistant"
        author="Assistente de vendas"
        avatar={<Avatar name="Assistente de vendas" size="sm" />}
        actions={
          <>
            <CopyButton value="Resumo" size="sm" />
            <IconButton icon="heart" label="Resposta útil" size="sm" onClick={onLike} />
          </>
        }
      >
        Resumo
      </ChatMessage>,
    )
    const article = screen.getByRole('article', { name: 'Assistente de vendas' })
    // O avatar não repete o nome: o autor já nomeia a mensagem.
    expect(within(article).queryByRole('img')).not.toBeInTheDocument()
    expect(article.querySelector('.or-chat-message__avatar')).toHaveAttribute('aria-hidden', 'true')
    await user.click(within(article).getByRole('button', { name: 'Resposta útil' }))
    expect(onLike).toHaveBeenCalled()
    expect(
      within(article).getByRole('button', { name: 'Copiar para a área de transferência' }),
    ).toBeInTheDocument()
  })

  it('mensagem de sistema não mostra avatar nem nome visível', () => {
    render(
      <ChatMessage from="system" author="Bot" avatar={<Avatar name="Bot" />}>
        Ana entrou na conversa.
      </ChatMessage>,
    )
    const article = screen.getByRole('article', { name: 'Bot' })
    expect(article.querySelector('.or-chat-message__avatar')).toBeNull()
    expect(screen.getByText('Bot')).toHaveClass('or-visually-hidden')
  })

  it('fora de um ChatThread não anima a entrada', () => {
    render(<ChatMessage from="assistant">Oi</ChatMessage>)
    expect(screen.getByRole('article')).not.toHaveClass('or-chat-message--enter')
  })

  it('repassa ref, className e props nativas ao article', () => {
    const ref = createRef<HTMLElement>()
    render(
      <ChatMessage ref={ref} from="assistant" className="extra" data-testid="msg" id="m1">
        Oi
      </ChatMessage>,
    )
    expect(ref.current).toBe(screen.getByTestId('msg'))
    expect(ref.current?.tagName).toBe('ARTICLE')
    expect(ref.current).toHaveClass('extra')
    expect(ref.current).toHaveAttribute('id', 'm1')
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <ChatMessage from="system" timestamp={new Date(2026, 10, 12, 11, 30)}>
          Conversa iniciada
        </ChatMessage>
        <ChatMessage
          from="user"
          author="Marina"
          avatar={<Avatar name="Marina Costa" size="sm" />}
          timestamp={new Date(2026, 10, 12, 11, 31)}
        >
          Qual região mais cresceu?
        </ChatMessage>
        <ChatMessage
          from="assistant"
          timestamp={new Date(2026, 10, 12, 11, 32)}
          actions={<CopyButton value="Sudeste" size="sm" />}
        >
          <p>Sudeste, com alta de 18%.</p>
        </ChatMessage>
        <ChatMessage
          from="other"
          author="Ana · Suporte"
          avatar={<Avatar name="Ana Ribeiro" size="sm" />}
          timestamp={new Date(2026, 10, 12, 11, 33)}
        >
          Posso ajudar com mais alguma coisa?
        </ChatMessage>
        <ChatMessage from="user" status="error" onRetry={() => {}}>
          Exporte em PDF
        </ChatMessage>
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
