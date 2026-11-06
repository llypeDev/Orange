import { CheckboxGroup } from '@orangesys/ui'

export default function Cards() {
  return (
    <div style={{ width: '100%' }}>
      <CheckboxGroup
        label="Escolha os módulos do plano"
        description="Cada módulo adiciona R$ 39/mês à assinatura."
        name="modulos"
        variant="card"
        orientation="horizontal"
        defaultValue={['financeiro']}
        options={[
          {
            value: 'financeiro',
            label: 'Financeiro',
            description: 'Contas a pagar e a receber e conciliação bancária.',
          },
          {
            value: 'estoque',
            label: 'Estoque',
            description: 'Inventário, lotes e transferências entre depósitos.',
          },
          {
            value: 'fiscal',
            label: 'Fiscal',
            description: 'Emissão de NF-e e NFS-e com envio automático.',
          },
        ]}
      />
    </div>
  )
}
