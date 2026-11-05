import { Splitter, SplitterHandle, SplitterPanel } from '@orangesys/ui'
import { useState } from 'react'

const tickets = [
  { id: '1093', subject: 'Troca de tamanho — tênis de corrida', status: 'Aberto' },
  { id: '1092', subject: 'Atraso na entrega do pedido #4818', status: 'Aguardando cliente' },
  { id: '1091', subject: 'Cupom de frete grátis não aplicado', status: 'Resolvido' },
]

const messages = [
  { from: 'Cliente', text: 'O tênis chegou, mas ficou apertado. Consigo trocar pelo número 41?' },
  { from: 'Equipe', text: 'Claro! Geramos a etiqueta de devolução — é só postar em até 7 dias.' },
]

export default function Persisted() {
  const [saved, setSaved] = useState<number[] | null>(null)

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%' }}>
      <div style={{ height: 320, border: '1px solid var(--or-color-border)' }}>
        {/* Salvo em localStorage como "or-splitter:docs-atendimento" ao fim de cada ajuste. */}
        <Splitter
          label="Atendimento"
          storageKey="docs-atendimento"
          defaultSizes={[34, 66]}
          onResizeEnd={setSaved}
          stackBelow="sm"
        >
          <SplitterPanel label="Fila de chamados" minSize={24} maxSize={50}>
            <ul role="list" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {tickets.map((ticket) => (
                <li
                  key={ticket.id}
                  style={{ display: 'grid', gap: 2, padding: '12px 16px', borderBottom: '1px solid var(--or-color-border)' }}
                >
                  <strong>#{ticket.id}</strong>
                  <span>{ticket.subject}</span>
                  <span style={{ color: 'var(--or-color-text-subtle)', fontSize: 'var(--or-text-sm)' }}>
                    {ticket.status}
                  </span>
                </li>
              ))}
            </ul>
          </SplitterPanel>
          <SplitterHandle />
          <SplitterPanel label="Conversa" minSize={40}>
            <div style={{ display: 'grid', gap: 12, padding: 16 }}>
              <p className="or-eyebrow" style={{ margin: 0 }}>
                Chamado #1093
              </p>
              {messages.map((message, i) => (
                <p key={i} style={{ margin: 0 }}>
                  <strong>{message.from}:</strong> {message.text}
                </p>
              ))}
            </div>
          </SplitterPanel>
        </Splitter>
      </div>
      <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
        {saved
          ? `Salvo: ${saved.map((size) => `${Math.round(size)}%`).join(' · ')}. Recarregue a página para conferir.`
          : 'Redimensione e recarregue a página: o layout volta como você deixou. Clique duas vezes no separador para voltar ao padrão.'}
      </p>
    </div>
  )
}
