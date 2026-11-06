import { DescriptionList, Disclosure } from '@orangesys/ui'

export default function OrderDetails() {
  return (
    <Disclosure
      label="Ver detalhes do pedido"
      variant="outline"
      headingLevel={3}
      defaultOpen
      style={{ width: '100%' }}
    >
      <DescriptionList
        size="sm"
        items={[
          { term: 'Pedido', description: '#48213' },
          { term: 'Itens', description: ['2× Cadeira ergonômica', '1× Apoio para os pés'] },
          { term: 'Frete', description: 'Grátis — Entrega Expressa Sul' },
          { term: 'Total', description: 'R$ 1.489,90 no Pix' },
        ]}
      />
    </Disclosure>
  )
}
