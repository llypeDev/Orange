import { Button, ButtonGroup, Icon } from '@orangesys/ui'

export default function Basic() {
  return (
    <ButtonGroup aria-label="Ações do relatório" variant="outline">
      <Button startIcon={<Icon name="download" />}>Exportar</Button>
      <Button startIcon={<Icon name="link" />}>Compartilhar</Button>
      <Button startIcon={<Icon name="folder" />}>Arquivar</Button>
    </ButtonGroup>
  )
}
