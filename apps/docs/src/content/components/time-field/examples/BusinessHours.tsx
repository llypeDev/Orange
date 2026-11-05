import { TimeField } from '@orangesys/ui'

export default function BusinessHours() {
  return (
    <TimeField
      label="Horário da reunião"
      description="Entre 08:00 e 18:00, em intervalos de 15 minutos."
      min="08:00"
      max="18:00"
      step={900}
      defaultValue="10:15"
    />
  )
}
