import { ProgressCircle } from '@orangesys/ui'

export default function Indeterminate() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
      <ProgressCircle size="sm" label="Sincronizando agenda" />
      <ProgressCircle size="md" tone="neutral" label="Sincronizando agenda" />
      <ProgressCircle size="lg" label="Sincronizando agenda" />
    </div>
  )
}
