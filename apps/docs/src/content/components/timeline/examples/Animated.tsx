import { Button, Icon, Timeline, TimelineItem } from '@orangesys/ui'
import { useState } from 'react'

export default function Animated() {
  // Trocar a key remonta a timeline e repete a entrada.
  const [rodada, setRodada] = useState(0)

  return (
    <div style={{ display: 'grid', gap: 20, width: '100%' }}>
      <div>
        <Button size="sm" variant="outline" startIcon={<Icon name="refresh" />} onClick={() => setRodada((r) => r + 1)}>
          Repetir animação
        </Button>
      </div>
      <Timeline key={rodada} animated aria-label="Deploy da versão 3.2.0" dateFormat={{ timeStyle: 'short' }}>
        <TimelineItem date={new Date(2026, 10, 4, 14, 2)} title="Build iniciado" tone="success" />
        <TimelineItem
          date={new Date(2026, 10, 4, 14, 4)}
          title="Testes aprovados"
          tone="success"
          description="312 testes em 1 min 48 s."
        />
        <TimelineItem
          date={new Date(2026, 10, 4, 14, 5)}
          title="Publicando em São Paulo"
          current
          description="Ao vivo — 2 de 3 servidores atualizados."
        />
        <TimelineItem dateLabel="Previsto para 14:08" title="Disponível para todos" />
      </Timeline>
    </div>
  )
}
