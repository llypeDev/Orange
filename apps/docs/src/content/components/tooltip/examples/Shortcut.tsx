import { Button, Icon, Tooltip } from '@orangesys/ui'

export default function Shortcut() {
  return (
    <>
      <Tooltip
        content={
          <>
            Salvar rascunho <kbd>Ctrl S</kbd>
          </>
        }
      >
        <Button variant="outline" startIcon={<Icon name="file" />}>
          Salvar
        </Button>
      </Tooltip>
      <Tooltip content="Publica para todos os leitores" placement="bottom" delay={0}>
        <Button startIcon={<Icon name="send" />}>Publicar</Button>
      </Tooltip>
    </>
  )
}
