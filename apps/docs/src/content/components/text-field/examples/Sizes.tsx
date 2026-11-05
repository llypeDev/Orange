import { TextField } from '@orangesys/ui'

export default function Sizes() {
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 420 }}>
      <TextField size="sm" label="Pequeno (sm · 32px)" placeholder="Filtros e tabelas densas" />
      <TextField size="md" label="Médio (md · 40px)" placeholder="Padrão para formulários" />
      <TextField size="lg" label="Grande (lg · 48px)" placeholder="Telas de destaque e mobile" />
    </div>
  )
}
