import { TimeField } from '@orange/ui'

export default function States() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      <TimeField
        label="Abertura da loja"
        defaultValue="08:00"
        readOnly
        description="Definido pela franquia."
      />
      <TimeField label="Fechamento" defaultValue="23:30" error="A loja fecha no máximo às 22:00." />
      <TimeField label="Intervalo" defaultValue="12:00" disabled />
    </div>
  )
}
