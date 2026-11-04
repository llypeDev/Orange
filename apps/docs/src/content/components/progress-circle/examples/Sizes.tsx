import { ProgressCircle } from '@orange/ui'

export default function Sizes() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
      <ProgressCircle size="sm" value={68} label="Perfil completo" />
      <ProgressCircle size="md" value={68} showValue label="Perfil completo" />
      <ProgressCircle size="lg" value={68} showValue label="Perfil completo" />
    </div>
  )
}
