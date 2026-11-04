import { TimeField } from '@orange/ui'

export default function Basic() {
  return (
    <TimeField
      label="Horário de retirada"
      description="Horário de Brasília (UTC−3)."
      defaultValue="09:30"
    />
  )
}
