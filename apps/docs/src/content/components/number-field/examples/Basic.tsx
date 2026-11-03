import { NumberField } from '@orange/ui'

export default function Basic() {
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 280 }}>
      <NumberField label="Quantidade" defaultValue={1} min={1} max={10} description="Máximo de 10 unidades por pedido." />
      <NumberField label="Hóspedes" defaultValue={2} min={1} max={8} size="sm" />
    </div>
  )
}
