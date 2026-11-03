import { Button, ButtonGroup } from '@orange/ui'

export default function GroupProps() {
  return (
    <div style={{ display: 'grid', gap: 20, justifyItems: 'start' }}>
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
    </div>
  )
}
