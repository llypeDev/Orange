import { Slider, Stack } from '@orangesys/ui'
import { useState } from 'react'

const brl = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

export default function Range() {
  const [faixa, setFaixa] = useState<[number, number]>([1500, 4500])

  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 420 }}>
      <Slider
        range
        label="Faixa de preço"
        min={0}
        max={8000}
        step={100}
        minDistance={200}
        value={faixa}
        onChange={setFaixa}
        formatValue={brl}
      />
      <p style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-subtle)' }}>
        Mostrando notebooks entre {brl(faixa[0])} e {brl(faixa[1])}.
      </p>
    </Stack>
  )
}
