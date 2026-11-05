import { Breadcrumb, Button, IconButton, PageHeader, Tag } from '@orange/ui'

export default function Detail() {
  return (
    <PageHeader
      headingLevel={2}
      breadcrumbs={
        <Breadcrumb
          items={[
            { label: 'Início', href: '#inicio' },
            { label: 'Pedidos', href: '#pedidos' },
            { label: 'Pedido #4821' },
          ]}
        />
      }
      title="Pedido #4821"
      meta={
        <>
          <Tag tone="success">Pago</Tag>
          <Tag tone="warning">Aguardando envio</Tag>
        </>
      }
      description="Criado em 12 de março às 14:32 · Mercearia Bom Grão · 6 itens"
      divider
      actions={
        <>
          <IconButton icon="more-horizontal" label="Mais ações do pedido" variant="outline" />
          <Button variant="outline">Imprimir etiqueta</Button>
          <Button>Marcar como enviado</Button>
        </>
      }
    />
  )
}
