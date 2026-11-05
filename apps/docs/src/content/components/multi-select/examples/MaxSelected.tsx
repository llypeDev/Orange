import { MultiSelect } from '@orangesys/ui'

const interesses = [
  { value: 'produto', label: 'Gestão de produto' },
  { value: 'design', label: 'Design de interfaces' },
  { value: 'dados', label: 'Ciência de dados' },
  { value: 'devops', label: 'DevOps e infraestrutura' },
  { value: 'mobile', label: 'Desenvolvimento mobile' },
  { value: 'seguranca', label: 'Segurança da informação' },
  { value: 'ia', label: 'Inteligência artificial' },
]

export default function MaxSelected() {
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <MultiSelect
        label="Trilhas de interesse"
        description="Escolha até 3 trilhas para o seu plano de estudos."
        options={interesses}
        maxSelected={3}
        defaultValue={['produto', 'design']}
      />
    </div>
  )
}
