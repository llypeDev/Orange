import { SortableList } from '@orangesys/ui'
import { useState } from 'react'

interface Step {
  id: string
  name: string
  owner: string
  disabled?: boolean
}

const steps: Step[] = [
  { id: 'recebido', name: 'Pedido recebido', owner: 'Automático', disabled: true },
  { id: 'pagamento', name: 'Conferência do pagamento', owner: 'Financeiro' },
  { id: 'separacao', name: 'Separação no estoque', owner: 'Logística' },
  { id: 'embalagem', name: 'Embalagem', owner: 'Logística' },
  { id: 'nota', name: 'Emissão da nota fiscal', owner: 'Financeiro' },
  { id: 'expedicao', name: 'Expedição', owner: 'Automático', disabled: true },
]

export default function ProcessSteps() {
  const [lastChange, setLastChange] = useState('Nenhuma alteração ainda.')

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 520 }}>
      <SortableList
        label="Etapas do processo de pedido"
        defaultItems={steps}
        getItemLabel={(step) => step.name}
        onReorder={(_, { item, from, to }) =>
          setLastChange(`${item.name}: etapa ${from + 1} → etapa ${to + 1}`)
        }
        renderItem={(step, { index }) => (
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
            <span>
              <span style={{ color: 'var(--or-color-text-muted)' }}>Etapa {index + 1} · </span>
              {step.name}
            </span>
            <span style={{ fontSize: 'var(--or-text-xs)', color: 'var(--or-color-text-muted)', whiteSpace: 'nowrap' }}>
              {step.owner}
            </span>
          </div>
        )}
      />
      <p style={{ margin: 0, fontSize: 'var(--or-text-sm)', color: 'var(--or-color-text-muted)' }}>
        Última alteração: {lastChange}
      </p>
    </div>
  )
}
