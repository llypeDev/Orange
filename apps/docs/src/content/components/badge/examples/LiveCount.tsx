import { Badge, Button, Icon } from '@orangesys/ui'
import { useState } from 'react'

export default function LiveCount() {
  const [unread, setUnread] = useState(2)

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
      <Badge count={unread} label={`${unread} notificações não lidas`}>
        <Button variant="outline" iconOnly aria-label="Notificações" startIcon={<Icon name="bell" />} />
      </Badge>
      <Button variant="ghost" size="sm" startIcon={<Icon name="plus" />} onClick={() => setUnread((n) => n + 1)}>
        Simular notificação
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setUnread(0)} disabled={unread === 0}>
        Marcar como lidas
      </Button>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
        <Badge dot pulse tone="danger" label="Transmissão ao vivo" />
        <span style={{ fontSize: 'var(--or-text-sm)' }}>Ao vivo · 128 assistindo</span>
      </span>
    </div>
  )
}
