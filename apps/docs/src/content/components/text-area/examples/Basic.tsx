import { TextArea } from '@orangesys/ui'

export default function Basic() {
  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <TextArea
        label="Observações para a entrega"
        description="Ex.: ponto de referência, horário preferido, portaria."
        rows={4}
        optional
      />
    </div>
  )
}
