import { useId } from 'react'
import { BarList } from '@orangesys/ui'

export default function ResponseTime() {
  const titleId = useId()
  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <h3 id={titleId} className="or-eyebrow">
        Tempo médio de primeira resposta · outubro de 2026
      </h3>
      {/* Aqui menor é melhor: sort="asc" põe as equipes mais rápidas no topo. */}
      <BarList
        aria-labelledby={titleId}
        sort="asc"
        color="var(--or-color-viz-2)"
        valueFormat={(minutos) => `${minutos} min`}
        data={[
          { label: 'Financeiro', value: 42 },
          { label: 'Suporte técnico', value: 18 },
          { label: 'Comercial', value: 9 },
          { label: 'Logística', value: 27 },
        ]}
      />
    </div>
  )
}
