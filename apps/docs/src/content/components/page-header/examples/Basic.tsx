import { Button, Icon, PageHeader } from '@orange/ui'

export default function Basic() {
  return (
    <PageHeader
      headingLevel={2}
      eyebrow="Vendas"
      title="Pedidos"
      description="Acompanhe pagamentos, envios e devoluções de todas as lojas."
      divider
      actions={
        <>
          <Button variant="outline" startIcon={<Icon name="download" />}>
            Exportar
          </Button>
          <Button startIcon={<Icon name="plus" />}>Novo pedido</Button>
        </>
      }
    />
  )
}
