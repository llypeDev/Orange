import { ColorField, Stack } from '@orangesys/ui'
import { useState } from 'react'

export default function Preview() {
  const [cor, setCor] = useState('#4a66d4')

  return (
    <Stack gap={8} direction="horizontal" align="start" wrap>
      <ColorField
        label="Cor do cabeçalho do e-mail"
        value={cor}
        onChange={setCor}
        swatches={['#0f0f12', '#4a66d4', '#f58549', '#7fb236']}
      />
      <div
        style={{ width: 260, border: '1px solid var(--or-color-border-strong)' }}
        aria-hidden="true"
      >
        <div style={{ height: 56, background: cor || 'transparent' }} />
        <div style={{ padding: 16, display: 'grid', gap: 8 }}>
          <div style={{ height: 10, width: '70%', background: 'var(--or-color-surface-active)' }} />
          <div style={{ height: 10, width: '90%', background: 'var(--or-color-surface-hover)' }} />
          <div style={{ height: 10, width: '55%', background: 'var(--or-color-surface-hover)' }} />
        </div>
      </div>
    </Stack>
  )
}
