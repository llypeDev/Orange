import { SplitButton } from '@orange/ui'
import { useState } from 'react'

export default function Basic() {
  const [status, setStatus] = useState('Rascunho salvo às 14:32')

  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <SplitButton
        onClick={() => setStatus('Artigo publicado agora')}
        actions={[
          {
            label: 'Salvar como rascunho',
            icon: 'file',
            onSelect: () => setStatus('Rascunho salvo agora'),
          },
          {
            label: 'Agendar publicação',
            icon: 'calendar',
            onSelect: () => setStatus('Publicação agendada para amanhã, 9h'),
          },
          {
            label: 'Enviar para revisão',
            icon: 'send',
            onSelect: () => setStatus('Enviado para a equipe editorial'),
          },
        ]}
      >
        Publicar artigo
      </SplitButton>
      <p
        role="status"
        style={{ margin: 0, fontSize: 'var(--or-text-sm)', color: 'var(--or-color-text-muted)' }}
      >
        {status}
      </p>
    </div>
  )
}
