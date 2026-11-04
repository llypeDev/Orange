import { Icon, ToggleButton } from '@orange/ui'
import { useState } from 'react'

export default function Controlled() {
  const [watching, setWatching] = useState(false)

  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <ToggleButton
        pressed={watching}
        onPressedChange={setWatching}
        startIcon={<Icon name={watching ? 'eye' : 'eye-off'} />}
      >
        Acompanhar pedido
      </ToggleButton>
      <p style={{ margin: 0, fontSize: 'var(--or-text-sm)', color: 'var(--or-color-text-muted)' }}>
        {watching
          ? 'Você receberá um e-mail a cada mudança de status do pedido #48213.'
          : 'Ative para receber atualizações do pedido #48213 por e-mail.'}
      </p>
    </div>
  )
}
