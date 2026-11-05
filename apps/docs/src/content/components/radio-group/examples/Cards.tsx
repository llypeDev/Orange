import { RadioGroup } from '@orangesys/ui'

export default function Cards() {
  return (
    <div style={{ width: '100%' }}>
      <RadioGroup
        label="Escolha um plano"
        variant="card"
        orientation="horizontal"
        defaultValue="pro"
        options={[
          { value: 'gratis', label: 'Gratuito', description: 'Até 3 projetos e 1 GB de armazenamento.' },
          { value: 'pro', label: 'Pro — R$ 49/mês', description: 'Projetos ilimitados, 100 GB e histórico de versões.' },
          { value: 'empresa', label: 'Empresa', description: 'SSO, auditoria e suporte dedicado.' },
        ]}
      />
    </div>
  )
}
