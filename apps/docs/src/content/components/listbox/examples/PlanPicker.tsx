import { Listbox, ListboxOption } from '@orange/ui'
import { useState } from 'react'

const planos = [
  { value: 'gratuito', nome: 'Gratuito', detalhe: '1 usuário, 3 projetos e 1 GB · R$ 0' },
  { value: 'essencial', nome: 'Essencial', detalhe: 'Até 5 usuários, projetos ilimitados e 50 GB · R$ 49/mês' },
  { value: 'profissional', nome: 'Profissional', detalhe: 'Até 25 usuários, relatórios avançados e 500 GB · R$ 149/mês' },
  { value: 'empresarial', nome: 'Empresarial', detalhe: 'Usuários ilimitados, SSO e suporte dedicado · sob consulta' },
]

export default function PlanPicker() {
  const [plano, setPlano] = useState<string | null>('essencial')
  const escolhido = planos.find((p) => p.value === plano)

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 460 }}>
      <Listbox
        label="Plano"
        description="Cobrança mensal. Você pode trocar de plano quando quiser."
        value={plano}
        onChange={setPlano}
      >
        {planos.map((p) => (
          <ListboxOption key={p.value} value={p.value} description={p.detalhe}>
            {p.nome}
          </ListboxOption>
        ))}
      </Listbox>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-subtle)' }}>
        Plano escolhido: <strong style={{ color: 'var(--or-color-text)' }}>{escolhido?.nome ?? 'nenhum'}</strong>
      </p>
    </div>
  )
}
