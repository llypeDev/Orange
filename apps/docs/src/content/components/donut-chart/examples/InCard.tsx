import type { CSSProperties } from 'react'
import { Card, CardBody, CardHeader, DonutChart } from '@orangesys/ui'

export default function InCard() {
  return (
    <Card
      variant="raised"
      style={
        { maxWidth: 440, '--or-chart-surface': 'var(--or-color-surface-raised)' } as CSSProperties
      }
    >
      <CardHeader title="Pedidos por forma de pagamento" description="Outubro de 2026" />
      <CardBody>
        <DonutChart
          title="Pedidos por forma de pagamento"
          hideCaption
          variant="plain"
          height={160}
          categoryLabel="Forma de pagamento"
          centerLabel="pedidos"
          data={[
            { label: 'Pix', value: 1478 },
            { label: 'Cartão de crédito', value: 996 },
            { label: 'Boleto', value: 386 },
            { label: 'Cartão de débito', value: 225 },
            { label: 'Outros', value: 129, color: 'var(--or-color-viz-other)' },
          ]}
        />
      </CardBody>
    </Card>
  )
}
