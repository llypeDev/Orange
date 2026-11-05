import { Card, CardBody, CardHeader, Sparkline, Stat } from '@orange/ui'

export default function StatCards() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
        width: '100%',
      }}
    >
      <Card>
        <CardHeader eyebrow="Loja virtual" title="Últimos 7 dias" headingLevel={4} />
        <CardBody>
          <Stat
            label="Vendas"
            value="R$ 215 mil"
            delta="18%"
            trend="increase"
            help={<Sparkline data={[182, 176, 195, 201, 188, 214, 215]} label="Vendas subiram 18% em 7 dias" />}
          />
        </CardBody>
      </Card>
      <Card>
        <CardHeader eyebrow="Operação" title="Últimos 7 dias" headingLevel={4} />
        <CardBody>
          <Stat
            label="Pedidos"
            value={1284}
            delta="4%"
            trend="increase"
            help={
              <Sparkline
                data={[171, 180, 176, 189, 185, 190, 193]}
                label="Pedidos subiram 4% em 7 dias, de 171 para 193 por dia"
              />
            }
          />
        </CardBody>
      </Card>
      <Card>
        <CardHeader eyebrow="Atendimento" title="Últimos 7 dias" headingLevel={4} />
        <CardBody>
          <Stat
            label="Cancelamentos"
            value="2,4%"
            delta="0,6 p.p."
            trend="decrease"
            deltaTone="positive"
            help={
              <Sparkline
                data={[3.0, 2.9, 2.8, 2.8, 2.6, 2.5, 2.4]}
                label="Cancelamentos caíram de 3% para 2,4% em 7 dias"
              />
            }
          />
        </CardBody>
      </Card>
    </div>
  )
}
