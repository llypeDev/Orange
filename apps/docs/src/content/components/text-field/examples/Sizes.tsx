import { Stack, TextField } from '@orangesys/ui'

export default function Sizes() {
  return (
    <Stack gap={5} style={{ width: '100%', maxWidth: 420 }}>
      <TextField size="sm" label="Pequeno (sm · 32px)" placeholder="Filtros e tabelas densas" />
      <TextField size="md" label="Médio (md · 40px)" placeholder="Padrão para formulários" />
      <TextField size="lg" label="Grande (lg · 48px)" placeholder="Telas de destaque e mobile" />
    </Stack>
  )
}
