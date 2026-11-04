import { Select } from '@orange/ui'

export default function Groups() {
  return (
    <div style={{ width: '100%', maxWidth: 360 }}>
      <Select
        label="Plano"
        placeholder="Escolha um plano"
        options={[
          {
            label: 'Cobrança mensal',
            options: [
              { value: 'starter-m', label: 'Starter — R$ 49/mês' },
              { value: 'pro-m', label: 'Pro — R$ 129/mês' },
            ],
          },
          {
            label: 'Cobrança anual (2 meses grátis)',
            options: [
              { value: 'starter-a', label: 'Starter — R$ 490/ano' },
              { value: 'pro-a', label: 'Pro — R$ 1.290/ano' },
              { value: 'enterprise', label: 'Enterprise — fale com vendas', disabled: true },
            ],
          },
        ]}
      />
    </div>
  )
}
