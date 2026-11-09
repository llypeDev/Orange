import { PasswordField, Stack } from '@orangesys/ui'

export default function States() {
  return (
    <Stack gap={5} style={{ width: '100%', maxWidth: 420 }}>
      <PasswordField size="sm" label="Pequeno (sm)" defaultValue="laranja2025" />
      <PasswordField label="Visível por padrão" defaultVisible defaultValue="laranja2025" />
      <PasswordField label="Senha do Wi-Fi" disabled defaultValue="convidados" description="Peça ao administrador para alterar." />
    </Stack>
  )
}
