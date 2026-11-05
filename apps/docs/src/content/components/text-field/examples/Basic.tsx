import { TextField } from '@orangesys/ui'

export default function Basic() {
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 420 }}>
      <TextField label="Nome completo" autoComplete="name" required />
      <TextField
        label="E-mail de trabalho"
        type="email"
        autoComplete="email"
        description="Enviaremos o convite e os recibos para este endereço."
        placeholder="voce@empresa.com"
      />
      <TextField label="Cargo" optional />
    </div>
  )
}
