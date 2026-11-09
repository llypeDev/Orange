import { Icon, Stack, ToggleButton } from '@orangesys/ui'
import { useState } from 'react'

export default function Controlled() {
  const [watching, setWatching] = useState(false)

  return (
    <Stack gap={3} align="start">
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
    </Stack>
  )
}
