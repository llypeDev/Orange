import { Stepper } from '@orangesys/ui'
import { useState } from 'react'

const steps = [
  { label: 'Empresa', description: 'Razão social e CNPJ' },
  { label: 'Responsável', description: 'Quem assina o contrato' },
  { label: 'Plano', description: 'Mensal ou anual' },
  { label: 'Contrato', description: 'Assinatura digital' },
]

export default function Clickable() {
  const [active, setActive] = useState(3)
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%' }}>
      <Stepper steps={steps} activeStep={active} onStepClick={setActive} aria-label="Cadastro da empresa" />
      <p style={{ margin: 0, fontSize: 14, color: 'var(--or-color-text-muted)' }}>
        Editando: <strong style={{ color: 'var(--or-color-text)' }}>{steps[active].label}</strong>. Clique em uma etapa concluída
        para revisá-la.
      </p>
    </div>
  )
}
