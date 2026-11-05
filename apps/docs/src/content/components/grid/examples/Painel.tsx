import { Grid, GridItem, Heading, Paper, Stack, Text } from '@orange/ui'

export default function Painel() {
  return (
    <Grid columns={{ base: 1, md: 3 }} gap={4}>
      {/* span="full": a linha inteira em qualquer número de colunas */}
      <GridItem span="full">
        <Paper tone="subtle" padding={4}>
          <Text size="sm">Fechamento do mês em 3 dias — revise os pedidos pendentes.</Text>
        </Paper>
      </GridItem>

      {/* 1 coluna no celular, 2 de 3 a partir de 768px */}
      <GridItem span={{ base: 1, md: 2 }}>
        <Paper as="section" aria-labelledby="titulo-canais" padding={5} style={{ height: '100%' }}>
          <Stack gap={2}>
            <Heading level={4} id="titulo-canais">
              Vendas por canal
            </Heading>
            <Text size="sm" tone="muted">
              Loja online 62% · Marketplace 28% · Loja física 10%
            </Text>
          </Stack>
        </Paper>
      </GridItem>

      <Paper as="section" aria-labelledby="titulo-pendentes" padding={5}>
        <Stack gap={2}>
          <Heading level={4} id="titulo-pendentes">
            Pendentes
          </Heading>
          <Text size="sm" tone="muted">
            18 pedidos aguardando envio
          </Text>
        </Stack>
      </Paper>
    </Grid>
  )
}
