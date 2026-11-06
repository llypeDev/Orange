import { DateTimePicker } from '@orangesys/ui'

export default function States() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <DateTimePicker
        label="Abertura das inscrições"
        description="Definida pela coordenação."
        defaultValue={new Date(2026, 10, 3, 9, 0)}
        readOnly
      />
      <DateTimePicker
        label="Encerramento das inscrições"
        defaultValue={new Date(2026, 10, 1, 18, 0)}
        error="O encerramento deve ser depois da abertura."
      />
      <DateTimePicker label="Divulgação do resultado" size="sm" disabled />
    </div>
  )
}
