import { IconButton } from '@orangesys/ui'

export default function Variants() {
  return (
    <>
      <IconButton icon="plus" label="Novo projeto" variant="primary" />
      <IconButton icon="edit" label="Editar perfil" variant="secondary" />
      <IconButton icon="download" label="Baixar fatura" variant="outline" />
      <IconButton icon="more-horizontal" label="Mais ações" />
      <IconButton icon="trash" label="Excluir projeto" variant="danger" />
    </>
  )
}
