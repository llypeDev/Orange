import { Stack, Tag } from '@orangesys/ui'

export default function SolidSizes() {
  return (
    <Stack gap={4}>
      <Stack gap={2} direction="horizontal" wrap>
        <Tag variant="solid">Neutro</Tag>
        <Tag variant="solid" tone="accent">Destaque</Tag>
        <Tag variant="solid" tone="success">Ativo</Tag>
        <Tag variant="solid" tone="warning">Em teste</Tag>
        <Tag variant="solid" tone="danger">Suspenso</Tag>
        <Tag variant="solid" tone="info">Beta</Tag>
      </Stack>
      <Stack gap={2} direction="horizontal" align="center" wrap>
        <Tag size="sm" tone="success">sm · 22px</Tag>
        <Tag size="md" tone="success">md · 28px</Tag>
        <Tag size="lg" tone="success">lg · 32px</Tag>
      </Stack>
    </Stack>
  )
}
