import {
  ActionBar,
  Button,
  CheckboxGroup,
  Dropdown,
  DropdownItem,
  Icon,
  IconButton,
} from '@orangesys/ui'
import { useState } from 'react'

const tasks = [
  { value: 'onboarding', label: 'Revisar fluxo de onboarding', points: 5 },
  { value: 'cupom', label: 'Corrigir cupom no checkout', points: 3 },
  { value: 'relatorio', label: 'Relatório mensal de vendas', points: 2 },
  { value: 'auditoria', label: 'Auditoria de acessibilidade', points: 8 },
]

export default function LabelAndPlacement() {
  const [selected, setSelected] = useState<string[]>(['onboarding', 'auditoria'])
  const points = tasks
    .filter((task) => selected.includes(task.value))
    .reduce((sum, task) => sum + task.points, 0)
  const noun = selected.length === 1 ? 'tarefa' : 'tarefas'

  return (
    // placement="top": a barra flutua no topo do contêiner; o padding reserva o espaço.
    <div style={{ position: 'relative', width: '100%', minHeight: 280, paddingTop: 128 }}>
      <CheckboxGroup
        label="Backlog da sprint"
        value={selected}
        onChange={setSelected}
        options={tasks.map(({ value, label, points }) => ({
          value,
          label,
          description: `${points} pontos`,
        }))}
      />
      <ActionBar
        open={selected.length > 0}
        count={selected.length}
        label={`${selected.length} ${noun} · ${points} pontos`}
        placement="top"
        onDismiss={() => setSelected([])}
        portal={false}
      >
        <IconButton icon="user" label="Atribuir responsável" />
        {/* O gatilho Button de um Dropdown filho direto também entra nas setas. */}
        <Dropdown trigger={<Button endIcon={<Icon name="chevron-down" />}>Mover para</Button>}>
          <DropdownItem>Em andamento</DropdownItem>
          <DropdownItem>Em revisão</DropdownItem>
          <DropdownItem>Concluído</DropdownItem>
        </Dropdown>
      </ActionBar>
    </div>
  )
}
