import { Combobox } from '@orange/ui'

const cidades = [
  { value: 'bel', label: 'Belém', description: 'Pará' },
  { value: 'bh', label: 'Belo Horizonte', description: 'Minas Gerais' },
  { value: 'bsb', label: 'Brasília', description: 'Distrito Federal' },
  { value: 'cwb', label: 'Curitiba', description: 'Paraná' },
  { value: 'fln', label: 'Florianópolis', description: 'Santa Catarina' },
  { value: 'for', label: 'Fortaleza', description: 'Ceará' },
  { value: 'gyn', label: 'Goiânia', description: 'Goiás' },
  { value: 'mao', label: 'Manaus', description: 'Amazonas' },
  { value: 'poa', label: 'Porto Alegre', description: 'Rio Grande do Sul' },
  { value: 'rec', label: 'Recife', description: 'Pernambuco' },
  { value: 'rio', label: 'Rio de Janeiro', description: 'Rio de Janeiro' },
  { value: 'ssa', label: 'Salvador', description: 'Bahia' },
  { value: 'sp', label: 'São Paulo', description: 'São Paulo' },
]

export default function Basic() {
  return (
    <div style={{ width: '100%', maxWidth: 380 }}>
      <Combobox
        label="Cidade de entrega"
        description="Digite para filtrar — acentos são ignorados (tente “sao”)."
        placeholder="Buscar cidade"
        options={cidades}
        name="cidade"
      />
    </div>
  )
}
