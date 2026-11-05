import { ProgressBar } from '@orangesys/ui'

export default function TonesSizes() {
  return (
    <div style={{ display: 'grid', gap: 24, width: '100%', maxWidth: 480 }}>
      <ProgressBar label="Meta de vendas de outubro" value={82} tone="success" />
      <ProgressBar label="Treinamento de segurança" value={40} tone="info" />
      <ProgressBar label="Backup noturno" value={64} tone="neutral" size="sm" />
      <ProgressBar
        label="Envio interrompido"
        value={23}
        tone="danger"
        size="sm"
        description="Conexão perdida. Tente novamente."
      />
    </div>
  )
}
