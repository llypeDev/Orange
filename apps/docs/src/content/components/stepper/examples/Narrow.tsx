import { Stepper } from '@orangesys/ui'

export default function Narrow() {
  return (
    <div style={{ width: 320, padding: 16, border: '1px solid var(--or-color-border)' }}>
      <Stepper
        aria-label="Abertura de conta"
        step={2}
        steps={[
          { label: 'Conta', description: 'E-mail e senha' },
          { label: 'Perfil', description: 'Nome e telefone' },
          { label: 'Endereço', description: 'Para entrega do cartão' },
          { label: 'Pronto', description: 'Conta ativa' },
        ]}
      />
    </div>
  )
}
