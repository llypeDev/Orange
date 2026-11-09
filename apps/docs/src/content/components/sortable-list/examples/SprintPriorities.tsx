import { SortableList, Stack } from '@orangesys/ui'
import { useState } from 'react'

interface Task {
  id: string
  title: string
  points: number
}

const backlog: Task[] = [
  { id: 'checkout', title: 'Revisar fluxo de checkout', points: 5 },
  { id: 'busca', title: 'Corrigir filtro de busca por categoria', points: 3 },
  { id: 'cupom', title: 'Aplicar cupom no carrinho', points: 8 },
  { id: 'deps', title: 'Atualizar dependências do app', points: 2 },
  { id: 'api', title: 'Documentar API de pedidos', points: 3 },
]

export default function SprintPriorities() {
  const [tasks, setTasks] = useState(backlog)

  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <SortableList
        label="Prioridades da sprint"
        items={tasks}
        onReorder={setTasks}
        renderItem={(task, { index }) => (
          <Stack gap={3} direction="horizontal" align="baseline">
            <span
              style={{
                minWidth: '2ch',
                fontFamily: 'var(--or-font-display)',
                fontWeight: 600,
                fontVariantNumeric: 'tabular-nums',
                color: 'var(--or-color-accent-text)',
              }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>{task.title}</span>
            <span style={{ color: 'var(--or-color-text-muted)', whiteSpace: 'nowrap' }}>{task.points} pts</span>
          </Stack>
        )}
      />
    </div>
  )
}
