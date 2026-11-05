import { Button, Icon, Stack, Text } from '@orange/ui'

export default function Alinhamento() {
  return (
    <Stack gap={6}>
      {/* justify="between" afasta os grupos; align="center" alinha no eixo cruzado */}
      <Stack direction="horizontal" justify="between" align="center" wrap gap={3}>
        <Text weight="semibold">3 pedidos selecionados</Text>
        <Stack direction="horizontal" wrap gap={2}>
          <Button variant="ghost" size="sm" startIcon={<Icon name="download" />}>
            Exportar
          </Button>
          <Button size="sm" startIcon={<Icon name="send" />}>
            Marcar como enviados
          </Button>
        </Stack>
      </Stack>

      {/* align="baseline" alinha textos de tamanhos diferentes pela linha de base */}
      <Stack direction="horizontal" align="baseline" gap={2}>
        <Text size="xl" weight="bold" font="display">
          R$ 1.289,90
        </Text>
        <Text size="sm" tone="muted">
          ou 10x de R$ 128,99 sem juros
        </Text>
      </Stack>
    </Stack>
  )
}
