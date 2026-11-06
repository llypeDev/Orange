import { BarList, Card, CardBody, CardHeader } from '@orangesys/ui'

export default function TopProducts() {
  return (
    <Card style={{ width: '100%', maxWidth: 440 }}>
      <CardHeader title="Produtos mais vendidos" description="Receita · outubro de 2026" />
      <CardBody>
        <BarList
          aria-label="Produtos mais vendidos"
          size="sm"
          valueFormat={{ style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }}
          data={[
            { label: 'Mochila urbana 22 L', value: 51900 },
            { label: 'Tênis de corrida Leve 3', value: 84200 },
            { label: 'Jaqueta corta-vento', value: 27100 },
            { label: 'Garrafa térmica 1 L', value: 38400 },
            { label: 'Meias de compressão (par)', value: 12800 },
          ]}
        />
      </CardBody>
    </Card>
  )
}
