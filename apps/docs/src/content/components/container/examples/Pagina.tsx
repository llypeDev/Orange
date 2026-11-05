import { Button, Container, Grid, Heading, Icon, Stack, Stat, Text } from '@orangesys/ui'

export default function Pagina() {
  return (
    // Container dá a largura máxima e as margens laterais; Stack e Grid organizam o resto.
    // Numa página real, o Container do conteúdo principal costuma ser as="main".
    <Container as="section" size="lg" aria-labelledby="titulo-visao-geral">
      <Stack gap={8}>
        <Stack
          direction={{ base: 'vertical', md: 'horizontal' }}
          justify="between"
          align="start"
          gap={4}
        >
          <Stack gap={1}>
            <Heading level={4} id="titulo-visao-geral">
              Visão geral da loja
            </Heading>
            <Text size="sm" tone="muted">
              Março de 2026 · atualizado há 5 minutos
            </Text>
          </Stack>
          <Button variant="outline" startIcon={<Icon name="download" />}>
            Exportar relatório
          </Button>
        </Stack>

        <Grid variant="bordered" columns={{ base: 1, sm: 3 }} gap={5}>
          <Stat size="sm" label="Receita" value="R$ 48,2 mil" delta="12%" trend="increase" />
          <Stat size="sm" label="Pedidos" value="1.284" delta="4%" trend="increase" />
          <Stat size="sm" label="Ticket médio" value="R$ 37,50" delta="2%" trend="decrease" />
        </Grid>
      </Stack>
    </Container>
  )
}
