import { ColorField } from '@orangesys/ui'

export default function States() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      <ColorField
        label="Cor de destaque"
        optional
        defaultValue=""
        description="Sem cor definida."
      />
      <ColorField
        label="Cor do texto"
        defaultValue="#d4cdb5"
        error="Contraste insuficiente com o fundo claro."
      />
      <ColorField label="Cor do tema" defaultValue="#0f0f12" disabled size="sm" />
    </div>
  )
}
