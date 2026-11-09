import { ColorField, Stack } from '@orangesys/ui'

export default function States() {
  return (
    <Stack gap={6} direction="horizontal" wrap>
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
    </Stack>
  )
}
