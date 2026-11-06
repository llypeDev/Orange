import { Picker } from '@orangesys/ui'

const visibilidade = [
  {
    value: 'privado',
    label: 'Privado',
    icon: 'lock',
    description: 'Só você e as pessoas que você convidar',
  },
  {
    value: 'equipe',
    label: 'Equipe',
    icon: 'users',
    description: 'Todos da equipe Produto podem ver e comentar',
  },
  {
    value: 'organizacao',
    label: 'Organização',
    icon: 'home',
    description: 'Disponível no plano Empresarial',
    disabled: true,
  },
  {
    value: 'publico',
    label: 'Público',
    icon: 'globe',
    description: 'Qualquer pessoa com o link, sem login',
  },
]

export default function Basic() {
  return (
    <div style={{ width: '100%', maxWidth: 380 }}>
      <Picker
        label="Visibilidade do projeto"
        description="Você pode mudar depois nas configurações."
        options={visibilidade}
        defaultValue="equipe"
        name="visibilidade"
      />
    </div>
  )
}
