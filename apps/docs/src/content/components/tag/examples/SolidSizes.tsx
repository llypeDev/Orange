import { Tag } from '@orangesys/ui'

export default function SolidSizes() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <Tag variant="solid">Neutro</Tag>
        <Tag variant="solid" tone="accent">Destaque</Tag>
        <Tag variant="solid" tone="success">Ativo</Tag>
        <Tag variant="solid" tone="warning">Em teste</Tag>
        <Tag variant="solid" tone="danger">Suspenso</Tag>
        <Tag variant="solid" tone="info">Beta</Tag>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
        <Tag size="sm" tone="success">sm · 22px</Tag>
        <Tag size="md" tone="success">md · 28px</Tag>
        <Tag size="lg" tone="success">lg · 32px</Tag>
      </div>
    </div>
  )
}
