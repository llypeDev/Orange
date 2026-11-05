import { CurrencyField } from '@orangesys/ui'
import { useState } from 'react'

export default function Basic() {
  const [preco, setPreco] = useState<number | null>(1299.9)

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 320 }}>
      <CurrencyField
        label="Preço de venda"
        description="Use vírgula para os centavos."
        value={preco}
        onChange={setPreco}
        name="preco"
      />
      <p style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-subtle)' }}>
        Valor numérico: <code>{preco === null ? 'null' : preco}</code>
      </p>
    </div>
  )
}
