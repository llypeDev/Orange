import { NumberField } from '@orange/ui'

export default function States() {
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 280 }}>
      <NumberField label="Parcelas" defaultValue={0} min={1} max={12} error="Escolha de 1 a 12 parcelas." />
      <NumberField label="Estoque atual" defaultValue={128} readOnly />
      <NumberField label="Limite de usuários" defaultValue={5} disabled description="Disponível no plano Pro." />
    </div>
  )
}
