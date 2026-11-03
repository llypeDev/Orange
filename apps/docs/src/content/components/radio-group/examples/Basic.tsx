import { RadioGroup } from '@orange/ui'

export default function Basic() {
  return (
    <RadioGroup
      label="Com que frequência quer receber relatórios?"
      name="frequencia"
      defaultValue="semanal"
      options={[
        { value: 'diario', label: 'Diariamente' },
        { value: 'semanal', label: 'Semanalmente' },
        { value: 'mensal', label: 'Mensalmente' },
        { value: 'nunca', label: 'Não quero receber' },
      ]}
    />
  )
}
