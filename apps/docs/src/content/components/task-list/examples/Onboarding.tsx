import { TaskList, TaskListItem } from '@orangesys/ui'

export default function Onboarding() {
  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <TaskList title="Configure sua loja" headingLevel={4}>
        <TaskListItem
          href="#/configuracoes/empresa"
          status="complete"
          description="Razão social, endereço e logotipo"
        >
          Dados da empresa
        </TaskListItem>
        <TaskListItem
          href="#/configuracoes/pagamentos"
          status="in-progress"
          description="Pix, boleto e cartão de crédito"
        >
          Formas de pagamento
        </TaskListItem>
        <TaskListItem
          href="#/configuracoes/frete"
          status="not-started"
          description="Tabelas de frete e retirada na loja"
        >
          Frete e entrega
        </TaskListItem>
        <TaskListItem href="#/catalogo" status="error" description="2 produtos estão sem preço">
          Catálogo de produtos
        </TaskListItem>
        <TaskListItem status="cannot-start" statusLabel="Disponível após o frete">
          Domínio próprio
        </TaskListItem>
      </TaskList>
    </div>
  )
}
