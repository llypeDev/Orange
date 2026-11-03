import { Select } from '@orange/ui'

const estados = [
  { value: 'ba', label: 'Bahia' },
  { value: 'mg', label: 'Minas Gerais' },
  { value: 'pr', label: 'Paraná' },
  { value: 'pe', label: 'Pernambuco' },
  { value: 'rj', label: 'Rio de Janeiro' },
  { value: 'rs', label: 'Rio Grande do Sul' },
  { value: 'sp', label: 'São Paulo' },
]

export default function Basic() {
  return (
    <div style={{ width: '100%', maxWidth: 360 }}>
      <Select
        label="Estado"
        description="Usado para calcular o frete e os impostos."
        placeholder="Selecione um estado"
        options={estados}
        name="estado"
      />
    </div>
  )
}
