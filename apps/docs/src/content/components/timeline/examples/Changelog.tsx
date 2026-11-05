import { Icon, Timeline, TimelineItem } from '@orangesys/ui'

export default function Changelog() {
  return (
    <Timeline aria-label="Atividade do repositório" dateFormat={{ dateStyle: 'medium', timeStyle: 'short' }}>
      <TimelineItem
        date={new Date(2026, 9, 28, 14, 5)}
        title="v3.2.0 publicada"
        tone="accent"
        icon={<Icon name="rocket" />}
        description="Novo componente TreeView e melhorias de acessibilidade no Combobox."
      />
      <TimelineItem
        date={new Date(2026, 9, 27, 18, 40)}
        title="Testes de regressão aprovados"
        tone="success"
        icon={<Icon name="check" />}
      />
      <TimelineItem
        date={new Date(2026, 9, 27, 11, 2)}
        title="Falha no build de documentação"
        tone="danger"
        icon={<Icon name="alert-triangle" />}
        description="Corrigida no commit seguinte."
      />
      <TimelineItem date={new Date(2026, 9, 26, 9, 12)} title="Revisão solicitada" icon={<Icon name="users" />} />
    </Timeline>
  )
}
