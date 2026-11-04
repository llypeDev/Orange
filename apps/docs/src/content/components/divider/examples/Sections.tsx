import { Divider } from '@orange/ui'

export default function Sections() {
  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <p style={{ margin: 0, fontWeight: 600 }}>Dados da conta</p>
      <p style={{ margin: '4px 0 0', color: 'var(--or-color-text-muted)' }}>Nome, e-mail e foto do perfil.</p>
      <Divider spacing={6} />
      <p style={{ margin: 0, fontWeight: 600 }}>Notificações</p>
      <p style={{ margin: '4px 0 0', color: 'var(--or-color-text-muted)' }}>Escolha o que chega por e-mail.</p>
      <Divider spacing={6} />
      <p style={{ margin: 0, fontWeight: 600 }}>Segurança</p>
      <p style={{ margin: '4px 0 0', color: 'var(--or-color-text-muted)' }}>Senha e verificação em duas etapas.</p>
    </div>
  )
}
