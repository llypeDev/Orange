import { CopyButton } from '@orange/ui'

const pedido = 'PED-2026-048213'

export default function Variants() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
      <CopyButton value={pedido} size="sm" variant="outline" />
      <CopyButton value={pedido} variant="outline" />
      <CopyButton value={pedido} size="lg" variant="outline" />
      <CopyButton value={pedido} size="sm" variant="ghost">
        Copiar número do pedido
      </CopyButton>
      <CopyButton value={pedido} variant="secondary">
        Copiar
      </CopyButton>
    </div>
  )
}
