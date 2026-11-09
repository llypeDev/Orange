import { Meter, Stack } from '@orangesys/ui'
import { useState } from 'react'

export default function Interactive() {
  const [value, setValue] = useState(72)

  return (
    <Stack gap={5} style={{ width: '100%', maxWidth: 480 }}>
      <Meter
        label="Uso de CPU do servidor"
        value={value}
        low={60}
        high={85}
        optimum={0}
        description="Faixas: até 60% normal, até 85% atenção, acima disso crítico."
      />
      <label style={{ display: 'grid', gap: 8, color: 'var(--or-color-text-muted)', fontSize: 13 }}>
        Simular carga
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
      </label>
    </Stack>
  )
}
