import { NumberField, Text } from '@orangesys/ui'
import { useState } from 'react'

const unitPrice = 39.9
const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Controlled() {
  const [quantity, setQuantity] = useState<number | null>(2)
  const total = (quantity ?? 0) * unitPrice

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 280 }}>
      <NumberField
        label="Camisetas (R$ 39,90 cada)"
        value={quantity}
        onChange={setQuantity}
        min={0}
        max={20}
        error={quantity === null ? 'Informe a quantidade.' : undefined}
      />
      <Text size="sm" tone="muted" aria-live="polite">
        Total: <strong>{brl.format(total)}</strong>
      </Text>
    </div>
  )
}
