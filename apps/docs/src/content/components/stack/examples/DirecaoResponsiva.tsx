import { Badge, Button, Heading, Stack, Text } from '@orangesys/ui'

export default function DirecaoResponsiva() {
  return (
    // Empilhado no celular; em linha a partir de 768px (md), com mais espaço
    <Stack
      direction={{ base: 'vertical', md: 'horizontal' }}
      gap={{ base: 4, md: 8 }}
      justify="between"
      align="start"
    >
      <Stack gap={2}>
        <Stack direction="horizontal" gap={2} align="center">
          <Heading level={4}>Plano Pro</Heading>
          <Badge tone="accent">Atual</Badge>
        </Stack>
        <Text size="sm" tone="muted">
          Até 10 lojas, relatórios diários e suporte em português. Renova em 12 de março.
        </Text>
      </Stack>
      <Stack direction="horizontal" gap={3} wrap>
        <Button variant="outline">Ver faturas</Button>
        <Button>Mudar de plano</Button>
      </Stack>
    </Stack>
  )
}
