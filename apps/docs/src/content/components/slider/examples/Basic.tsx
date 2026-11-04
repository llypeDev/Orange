import { Slider } from '@orange/ui'

export default function Basic() {
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <Slider
        label="Volume das notificações"
        description="Afeta apenas os alertas sonoros deste dispositivo."
        defaultValue={60}
        formatValue={(v) => `${v}%`}
      />
    </div>
  )
}
