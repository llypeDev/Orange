import { CurrencyField, Select } from '@orange/ui'
import { useState } from 'react'

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Installments() {
  const [total, setTotal] = useState<number | null>(3600)
  const [parcelas, setParcelas] = useState('6')
  const valorParcela = total ? total / Number(parcelas) : 0

  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 360 }}>
      <CurrencyField label="Valor total" value={total} onChange={setTotal} min={0} />
      <Select
        label="Parcelas"
        value={parcelas}
        onChange={(event) => setParcelas(event.target.value)}
        options={[1, 2, 3, 6, 10, 12].map((n) => ({ value: String(n), label: n === 1 ? 'À vista' : `${n}x sem juros` }))}
      />
      <p role="status" style={{ margin: 0, fontFamily: 'var(--or-font-display)', fontSize: 18, fontWeight: 600 }}>
        {total ? `${parcelas}x de ${brl.format(valorParcela)}` : 'Informe o valor total'}
      </p>
    </div>
  )
}
