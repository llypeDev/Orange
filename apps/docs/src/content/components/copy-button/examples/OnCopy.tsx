import { CopyButton, Stack } from '@orangesys/ui'
import { useState } from 'react'

export default function OnCopy() {
  const [count, setCount] = useState(0)

  return (
    <Stack gap={4} direction="horizontal" align="center" wrap>
      <div style={{ padding: '8px 16px', border: '1px dashed var(--or-color-accent-border)' }}>
        <span className="or-eyebrow">Cupom</span>
        <div style={{ fontFamily: 'var(--or-font-mono)', fontSize: 'var(--or-text-lg)' }}>
          BEMVINDO15
        </div>
      </div>
      <CopyButton
        value="BEMVINDO15"
        variant="primary"
        copiedLabel="Cupom copiado"
        timeout={3000}
        onCopy={() => setCount((c) => c + 1)}
      >
        Copiar cupom
      </CopyButton>
      <span style={{ fontSize: 'var(--or-text-sm)', color: 'var(--or-color-text-muted)' }}>
        Copiado {count} {count === 1 ? 'vez' : 'vezes'}
      </span>
    </Stack>
  )
}
