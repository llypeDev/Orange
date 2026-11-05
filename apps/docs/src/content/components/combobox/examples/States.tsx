import { Combobox } from '@orangesys/ui'

const bancos = [
  { value: '001', label: '001 — Banco do Brasil' },
  { value: '033', label: '033 — Santander' },
  { value: '104', label: '104 — Caixa Econômica Federal' },
  { value: '237', label: '237 — Bradesco' },
  { value: '260', label: '260 — Nu Pagamentos' },
  { value: '341', label: '341 — Itaú Unibanco' },
]

export default function States() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 380 }}>
      <Combobox size="sm" label="Banco (sm)" options={bancos} placeholder="Código ou nome" />
      <Combobox
        label="Banco"
        options={bancos}
        required
        error="Escolha um banco da lista."
        placeholder="Código ou nome"
      />
      <Combobox
        size="lg"
        label="Banco (lg, desabilitado)"
        options={bancos}
        defaultValue="341"
        disabled
      />
    </div>
  )
}
