import { PasswordField } from '@orange/ui'

export default function States() {
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 420 }}>
      <PasswordField size="sm" label="Pequeno (sm)" defaultValue="laranja2025" />
      <PasswordField label="Visível por padrão" defaultVisible defaultValue="laranja2025" />
      <PasswordField label="Senha do Wi-Fi" disabled defaultValue="convidados" description="Peça ao administrador para alterar." />
    </div>
  )
}
