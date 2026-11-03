import { Icon, useRovingFocus, type IconName } from '@orange/ui'
import { useRef, useState } from 'react'

const ferramentas: { id: string; rotulo: string; icone: IconName }[] = [
  { id: 'lista', rotulo: 'Lista', icone: 'list' },
  { id: 'grade', rotulo: 'Grade', icone: 'grid' },
  { id: 'calendario', rotulo: 'Calendário', icone: 'calendar' },
  { id: 'grafico', rotulo: 'Gráfico', icone: 'chart-bar' },
]

export default function AlternarVisualizacao() {
  const grupo = useRef<HTMLDivElement>(null)
  const onKeyDown = useRovingFocus(grupo, { orientation: 'horizontal' })
  const [ativo, setAtivo] = useState('lista')
  return (
    <div ref={grupo} role="toolbar" aria-label="Visualização" onKeyDown={onKeyDown} className="guide-toolbar-demo">
      {ferramentas.map((f, i) => (
        <button
          key={f.id}
          type="button"
          data-roving-item
          tabIndex={i === 0 ? 0 : -1}
          aria-pressed={ativo === f.id}
          onClick={() => setAtivo(f.id)}
        >
          <Icon name={f.icone} size="sm" />
          {f.rotulo}
        </button>
      ))}
    </div>
  )
}
