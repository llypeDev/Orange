import { CurrencyField } from '@orange/ui'
import { useState } from 'react'

const LIMITE = 5000

export default function Limits() {
  const [valor, setValor] = useState<number | null>(null)
  const acima = valor !== null && valor > LIMITE

  return (
    <div style={{ width: '100%', maxWidth: 320 }}>
      <CurrencyField
        label="Valor do Pix"
        description="Limite disponível: R$ 5.000,00. Valores fora da faixa são ajustados ao sair do campo."
        min={1}
        max={LIMITE}
        value={valor}
        onChange={setValor}
        error={acima ? 'O valor excede o seu limite disponível.' : undefined}
        size="lg"
      />
    </div>
  )
}
