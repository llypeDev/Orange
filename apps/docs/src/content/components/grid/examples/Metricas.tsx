import { Grid, Stat } from '@orange/ui'

export default function Metricas() {
  return (
    // bordered: células encostadas com linhas de 1px; o gap vira o respiro interno de cada célula.
    // Com 5 métricas em 3 colunas, a célula que sobra fica fechada pela moldura.
    <Grid variant="bordered" columns={{ base: 1, sm: 2, lg: 3 }} gap={5}>
      <Stat
        size="sm"
        label="Receita do mês"
        value="R$ 48,2 mil"
        delta="12%"
        trend="increase"
        help="vs. fevereiro"
      />
      <Stat
        size="sm"
        label="Pedidos"
        value="1.284"
        delta="4%"
        trend="increase"
        help="vs. fevereiro"
      />
      <Stat
        size="sm"
        label="Ticket médio"
        value="R$ 37,50"
        delta="2%"
        trend="decrease"
        help="vs. fevereiro"
      />
      <Stat
        size="sm"
        label="Taxa de devolução"
        value="1,8%"
        delta="0,3 p.p."
        trend="decrease"
        deltaTone="positive"
        help="vs. fevereiro"
      />
      <Stat size="sm" label="Avaliação média" value="4,7 de 5" help="312 avaliações" />
    </Grid>
  )
}
