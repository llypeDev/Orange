import { Stack, ToggleButton, ToggleButtonGroup } from '@orangesys/ui'
import { useState } from 'react'

export default function GroupMultiple() {
  const [modes, setModes] = useState<string[]>(['remote', 'hybrid'])

  return (
    <Stack gap={3} align="start">
      <ToggleButtonGroup
        selectionMode="multiple"
        aria-label="Modalidade de trabalho"
        value={modes}
        onChange={setModes}
      >
        <ToggleButton value="remote">Remoto</ToggleButton>
        <ToggleButton value="hybrid">Híbrido</ToggleButton>
        <ToggleButton value="onsite">Presencial</ToggleButton>
      </ToggleButtonGroup>
      <p style={{ margin: 0, fontSize: 'var(--or-text-sm)', color: 'var(--or-color-text-muted)' }}>
        {modes.length === 0
          ? 'Mostrando vagas de todas as modalidades.'
          : `${modes.length} filtro(s) de modalidade ativo(s).`}
      </p>
    </Stack>
  )
}
