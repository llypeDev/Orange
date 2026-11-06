import { Picker } from '@orangesys/ui'

const regioes = [
  {
    label: 'América do Sul',
    options: [
      { value: 'sa-east-1', label: 'São Paulo', description: 'Menor latência para o Brasil' },
      {
        value: 'sa-west-1',
        label: 'Santiago',
        description: 'Em manutenção até 18/11',
        disabled: true,
      },
    ],
  },
  {
    label: 'América do Norte',
    options: [
      { value: 'us-east-1', label: 'Virgínia' },
      { value: 'us-west-2', label: 'Oregon' },
      { value: 'ca-central-1', label: 'Montreal' },
    ],
  },
  {
    label: 'Europa',
    options: [
      { value: 'eu-west-1', label: 'Irlanda' },
      { value: 'eu-central-1', label: 'Frankfurt' },
      { value: 'eu-south-1', label: 'Milão' },
    ],
  },
  {
    label: 'Ásia e Oceania',
    options: [
      { value: 'ap-northeast-1', label: 'Tóquio' },
      { value: 'ap-southeast-1', label: 'Singapura' },
      { value: 'ap-southeast-2', label: 'Sydney' },
    ],
  },
]

export default function Groups() {
  return (
    <div style={{ width: '100%', maxWidth: 380 }}>
      <Picker
        label="Região dos dados"
        description="Onde o banco do projeto fica hospedado. Não pode ser alterada depois."
        placeholder="Escolha uma região"
        options={regioes}
        required
      />
    </div>
  )
}
