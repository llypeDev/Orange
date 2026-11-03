import { Button, ButtonGroup, Icon } from '@orange/ui'

export default function Vertical() {
  return (
    <div style={{ width: 240 }}>
      <ButtonGroup
        aria-label="Ações do arquivo"
        orientation="vertical"
        attached
        variant="outline"
        style={{ width: '100%' }}
      >
        <Button startIcon={<Icon name="edit" />}>Renomear</Button>
        <Button startIcon={<Icon name="copy" />}>Duplicar</Button>
        <Button startIcon={<Icon name="folder" />}>Mover para…</Button>
        <Button startIcon={<Icon name="trash" />}>Excluir</Button>
      </ButtonGroup>
    </div>
  )
}
