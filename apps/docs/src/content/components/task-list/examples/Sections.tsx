import { useId } from 'react'
import { TaskList, TaskListItem } from '@orangesys/ui'

export default function Sections() {
  const planejamento = useId()
  const conteudo = useId()
  const revisao = useId()
  return (
    <div style={{ display: 'grid', gap: 28, width: '100%', maxWidth: 640 }}>
      <section aria-labelledby={planejamento}>
        <h4 id={planejamento} className="or-eyebrow" style={{ margin: '0 0 12px' }}>
          1. Planejamento
        </h4>
        <TaskList aria-labelledby={planejamento}>
          <TaskListItem href="#/campanha/publico" status="complete">
            Público e segmentação
          </TaskListItem>
          <TaskListItem href="#/campanha/orcamento" status="complete">
            Orçamento de mídia
          </TaskListItem>
        </TaskList>
      </section>
      <section aria-labelledby={conteudo}>
        <h4 id={conteudo} className="or-eyebrow" style={{ margin: '0 0 12px' }}>
          2. Conteúdo
        </h4>
        <TaskList aria-labelledby={conteudo}>
          <TaskListItem
            href="#/campanha/banners"
            status="in-progress"
            description="3 de 6 formatos enviados"
          >
            Banners da Black Friday
          </TaskListItem>
          <TaskListItem href="#/campanha/email" status="not-started">
            E-mail de lançamento
          </TaskListItem>
        </TaskList>
      </section>
      <section aria-labelledby={revisao}>
        <h4 id={revisao} className="or-eyebrow" style={{ margin: '0 0 12px' }}>
          3. Revisão
        </h4>
        <TaskList aria-labelledby={revisao}>
          <TaskListItem status="cannot-start" statusLabel="Disponível após o conteúdo">
            Aprovação do jurídico
          </TaskListItem>
        </TaskList>
      </section>
    </div>
  )
}
