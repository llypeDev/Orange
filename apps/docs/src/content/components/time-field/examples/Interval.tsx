import { Text, TimeField } from '@orange/ui'
import { useState } from 'react'

const emMinutos = (hora: string) => {
  const [h, m] = hora.split(':').map(Number)
  return h * 60 + m
}

export default function Interval() {
  const [inicio, setInicio] = useState('09:00')
  const [fim, setFim] = useState('10:30')
  const duracao = inicio && fim ? emMinutos(fim) - emMinutos(inicio) : 0
  const invalido = Boolean(inicio && fim && duracao <= 0)

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <TimeField label="Início do plantão" value={inicio} onChange={setInicio} required />
        <TimeField
          label="Fim do plantão"
          value={fim}
          onChange={setFim}
          required
          error={invalido ? 'O fim precisa ser depois do início.' : undefined}
        />
      </div>
      {!invalido && duracao > 0 && (
        <Text size="sm" tone="muted" aria-live="polite">
          Duração: {Math.floor(duracao / 60)}h{String(duracao % 60).padStart(2, '0')}
        </Text>
      )}
    </div>
  )
}
