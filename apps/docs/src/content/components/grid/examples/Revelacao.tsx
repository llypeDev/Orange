import { Grid, Paper, Reveal, Stack, Text } from '@orangesys/ui'

const colecoes = [
  { id: 'home-office', nome: 'Home office', itens: '48 produtos' },
  { id: 'estudos', nome: 'Cantinho de estudos', itens: '32 produtos' },
  { id: 'reunioes', nome: 'Sala de reuniões', itens: '21 produtos' },
  { id: 'recepcao', nome: 'Recepção', itens: '17 produtos' },
  { id: 'copa', nome: 'Copa', itens: '26 produtos' },
  { id: 'deposito', nome: 'Depósito', itens: '14 produtos' },
]

export default function Revelacao() {
  return (
    <Grid as="ul" columns={{ base: 1, sm: 2, lg: 3 }} gap={4} aria-label="Coleções">
      {colecoes.map((c, i) => (
        // Cada item é um Reveal (filho direto da Grid): index soma 80ms por posição.
        // Reveal com stagger não serve aqui — ele escalona os filhos diretos dele, não os da Grid.
        <Reveal as="li" key={c.id} index={i}>
          <Paper padding={5}>
            <Stack gap={1}>
              <Text weight="semibold">{c.nome}</Text>
              <Text size="sm" tone="muted">
                {c.itens}
              </Text>
            </Stack>
          </Paper>
        </Reveal>
      ))}
    </Grid>
  )
}
