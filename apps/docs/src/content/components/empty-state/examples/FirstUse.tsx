import { Button, EmptyState, Icon } from '@orangesys/ui'

export default function FirstUse() {
  return (
    <EmptyState
      icon="folder"
      title="Nenhum projeto ainda"
      description="Projetos reúnem tarefas, arquivos e pessoas. Crie o primeiro para convidar o seu time."
      action={<Button startIcon={<Icon name="plus" />}>Criar projeto</Button>}
      secondaryAction={<Button variant="ghost">Ver modelos</Button>}
    />
  )
}
