import { Grid, Icon, Paper, Stack, Text } from '@orange/ui'

const integracoes = [
  { id: 'email', icone: 'mail', nome: 'E-mail marketing' },
  { id: 'agenda', icone: 'calendar', nome: 'Agenda de entregas' },
  { id: 'relatorios', icone: 'chart-bar', nome: 'Relatórios' },
  { id: 'estoque', icone: 'layers', nome: 'Controle de estoque' },
  { id: 'cupons', icone: 'tag', nome: 'Cupons de desconto' },
  { id: 'api', icone: 'code', nome: 'API e webhooks' },
] as const

export default function ColunasAutomaticas() {
  return (
    // Quantas colunas couberem com pelo menos 12rem cada — sem media queries.
    // Abaixo de 12rem de largura, cada item ocupa a linha inteira (sem rolagem horizontal).
    <Grid as="ul" minItemWidth="12rem" gap={3} aria-label="Integrações disponíveis">
      {integracoes.map((i) => (
        <Paper as="li" key={i.id} padding={4}>
          <Stack direction="horizontal" gap={3} align="center">
            <Icon name={i.icone} />
            <Text size="sm" weight="medium">
              {i.nome}
            </Text>
          </Stack>
        </Paper>
      ))}
    </Grid>
  )
}
