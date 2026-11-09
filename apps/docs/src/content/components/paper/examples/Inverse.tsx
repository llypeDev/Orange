import { Button, Heading, Icon, Paper, Stack } from '@orangesys/ui'

export default function Inverse() {
  return (
    <Paper tone="inverse" padding={8} border="none" style={{ width: '100%' }}>
      <p className="or-eyebrow" style={{ margin: 0 }}>
        Teste grátis
      </p>
      <Heading level={3} size="2xl" style={{ margin: '8px 0 8px' }}>
        Leve a conciliação bancária para toda a equipe
      </Heading>
      <p style={{ margin: '0 0 20px', color: 'var(--or-color-text-muted)', maxWidth: 520 }}>
        14 dias com todos os recursos do plano Pro. Sem cartão de crédito.
      </p>
      <Stack gap={3} direction="horizontal" wrap>
        <Button endIcon={<Icon name="arrow-right" />}>Começar agora</Button>
        <Button variant="outline">Falar com vendas</Button>
      </Stack>
    </Paper>
  )
}
