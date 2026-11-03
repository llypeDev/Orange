import { TimeField } from '@orange/ui'

export default function Sizes() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 16 }}>
      <TimeField label="Pequeno" size="sm" defaultValue="07:45" />
      <TimeField label="Médio" size="md" defaultValue="12:00" />
      <TimeField label="Grande" size="lg" defaultValue="18:30" />
    </div>
  )
}
