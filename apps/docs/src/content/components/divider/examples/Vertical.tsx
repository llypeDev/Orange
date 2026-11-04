import { Button, Divider, Icon } from '@orange/ui'

export default function Vertical() {
  return (
    <div role="group" aria-label="Ações do documento" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', rowGap: 8, minHeight: 40 }}>
      <Button variant="ghost" size="sm" startIcon={<Icon name="edit" />}>
        Editar
      </Button>
      <Button variant="ghost" size="sm" startIcon={<Icon name="copy" />}>
        Duplicar
      </Button>
      <Divider orientation="vertical" spacing={2} />
      <Button variant="ghost" size="sm" startIcon={<Icon name="download" />}>
        Exportar
      </Button>
      <Divider orientation="vertical" spacing={2} />
      <Button variant="ghost" size="sm" startIcon={<Icon name="trash" />}>
        Excluir
      </Button>
    </div>
  )
}
