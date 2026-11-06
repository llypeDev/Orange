import { useState } from 'react'
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  TaskList,
  TaskListItem,
  type TaskListStatus,
} from '@orangesys/ui'

interface Tarefa {
  nome: string
  descricao: string
  status: TaskListStatus
}

const inicial: Tarefa[] = [
  { nome: 'Importar produtos', descricao: 'Planilha com 248 itens', status: 'complete' },
  { nome: 'Conectar o ERP', descricao: 'Sincroniza estoque a cada 15 min', status: 'in-progress' },
  {
    nome: 'Configurar notificações',
    descricao: 'Pedidos novos e estoque baixo',
    status: 'not-started',
  },
]

export default function WithButtons() {
  const [tarefas, setTarefas] = useState(inicial)
  const [aberta, setAberta] = useState<number | null>(null)
  const atual = aberta === null ? null : tarefas[aberta]

  const concluir = () => {
    setTarefas((lista) => lista.map((t, i) => (i === aberta ? { ...t, status: 'complete' } : t)))
    setAberta(null)
  }

  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <TaskList title="Primeiros passos" headingLevel={4}>
        {tarefas.map((tarefa, i) => (
          <TaskListItem
            key={tarefa.nome}
            status={tarefa.status}
            description={tarefa.descricao}
            onClick={() => setAberta(i)}
          >
            {tarefa.nome}
          </TaskListItem>
        ))}
      </TaskList>
      <Modal
        open={atual !== null}
        onOpenChange={(open) => !open && setAberta(null)}
        title={atual?.nome ?? ''}
        description={atual?.descricao}
      >
        <ModalBody>
          <p style={{ margin: 0 }}>
            Revise as configurações e marque a tarefa como concluída para atualizar o progresso.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setAberta(null)}>
            Agora não
          </Button>
          <Button onClick={concluir}>Marcar como concluída</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}
