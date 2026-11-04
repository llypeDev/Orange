import { RadioGroup } from '@orange/ui'
import { useState } from 'react'

export default function Horizontal() {
  const [size, setSize] = useState<string | null>('m')

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <RadioGroup
        label="Tamanho"
        orientation="horizontal"
        value={size}
        onChange={setSize}
        options={['PP', 'P', 'M', 'G', 'GG'].map((s) => ({ value: s.toLowerCase(), label: s }))}
      />
      <p style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-subtle)' }}>Selecionado: {size?.toUpperCase()}</p>
    </div>
  )
}
