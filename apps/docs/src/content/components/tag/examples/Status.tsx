import { Tag } from '@orange/ui'

export default function Status() {
  return (
    <>
      <Tag>Rascunho</Tag>
      <Tag tone="info">Em separação</Tag>
      <Tag tone="accent">Enviado</Tag>
      <Tag tone="success">Entregue</Tag>
      <Tag tone="warning">Pagamento pendente</Tag>
      <Tag tone="danger">Devolvido</Tag>
    </>
  )
}
