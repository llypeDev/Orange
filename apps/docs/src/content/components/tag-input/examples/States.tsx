import { TagInput } from '@orange/ui'

export default function States() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 440 }}>
      <TagInput size="sm" label="Rótulos (sm)" defaultValue={['bug', 'urgente']} />
      <TagInput label="Códigos de rastreio" required error="Informe ao menos um código." placeholder="Ex.: BR123456789BR" />
      <TagInput size="lg" label="Categorias (lg, desabilitado)" defaultValue={['eletrônicos', 'casa']} disabled />
    </div>
  )
}
