import { Card, CardBody, CardHeader, Stat } from '@orange/ui'

export default function InCards() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, width: '100%' }}>
      <Card variant="accent">
        <CardHeader eyebrow="Loja virtual" title="Hoje" headingLevel={4} />
        <CardBody>
          <Stat size="lg" label="Vendas até 14h" value="R$ 9.870" delta="23%" trend="increase" help="vs. ontem" />
        </CardBody>
      </Card>
      <Card>
        <CardHeader eyebrow="Atendimento" title="Esta semana" headingLevel={4} />
        <CardBody>
          <Stat
            size="lg"
            label="Satisfação (CSAT)"
            value="94%"
            delta="1 p.p."
            trend="decrease"
            help="meta: 92%"
          />
        </CardBody>
      </Card>
      <Card>
        <CardHeader eyebrow="Estoque" title="Agora" headingLevel={4} />
        <CardBody>
          <Stat size="lg" label="Produtos sem estoque" value="7" help="de 412 ativos" />
        </CardBody>
      </Card>
    </div>
  )
}
