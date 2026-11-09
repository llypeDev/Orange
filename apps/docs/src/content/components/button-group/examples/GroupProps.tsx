import { Button, ButtonGroup, Stack } from '@orangesys/ui'

export default function GroupProps() {
  return (
    <Stack gap={5} align="start">
      {/* Todos os botões herdam size e variant do grupo… */}
      <ButtonGroup aria-label="Rodapé do formulário" size="sm" variant="outline">
        <Button>Cancelar</Button>
        <Button>Salvar rascunho</Button>
        {/* …exceto quando definem os próprios. */}
        <Button variant="primary">Publicar artigo</Button>
      </ButtonGroup>

      <ButtonGroup aria-label="Ações em lote" size="lg" variant="ghost" disabled>
        <Button>Marcar como lidas</Button>
        <Button>Mover</Button>
        <Button>Excluir</Button>
      </ButtonGroup>
    </Stack>
  )
}
