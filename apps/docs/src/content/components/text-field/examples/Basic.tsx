import { Stack, TextField } from '@orangesys/ui'

export default function Basic() {
  return (
    <Stack gap={5} style={{ width: '100%', maxWidth: 420 }}>
      <TextField label="Nome completo" autoComplete="name" required />
      <TextField
        label="E-mail de trabalho"
        type="email"
        autoComplete="email"
        description="Enviaremos o convite e os recibos para este endereço."
        placeholder="voce@empresa.com"
      />
      <TextField label="Cargo" optional />
    </Stack>
  )
}
