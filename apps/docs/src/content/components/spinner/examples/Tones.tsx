import { Spinner } from '@orange/ui'

export default function Tones() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
      <Spinner tone="accent" label="Carregando pedidos" />
      <Spinner tone="neutral" label="Carregando clientes" />
      {/* current herda a cor do texto ao redor */}
      <span style={{ color: 'var(--or-color-info-text)' }}>
        <Spinner tone="current" label="Carregando agenda" />
      </span>
    </div>
  )
}
