import { DatePicker } from '@orangesys/ui'

export default function Basic() {
  return (
    <DatePicker
      label="Data de entrega"
      description="Digite a data ou escolha no calendário."
      defaultValue={new Date()}
    />
  )
}
