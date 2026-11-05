import { Button, EmptyState } from '@orangesys/ui'

export default function Filtered() {
  return (
    <EmptyState
      icon="filter"
      title="Nenhum pedido com esses filtros"
      description={
        <>
          Você filtrou por <strong>Status: Cancelado</strong> e{' '}
          <strong>Período: últimos 7 dias</strong>.
        </>
      }
      action={<Button variant="outline">Remover filtros</Button>}
      secondaryAction={<Button variant="ghost">Ver todos os pedidos</Button>}
    />
  )
}
