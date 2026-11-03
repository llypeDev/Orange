import { Slider } from '@orange/ui'

export default function Sizes() {
  return (
    <div style={{ display: 'grid', gap: 24, width: '100%', maxWidth: 420 }}>
      <Slider size="sm" label="Brilho (sm)" defaultValue={30} />
      <Slider size="md" label="Brilho (md)" defaultValue={55} />
      <Slider size="lg" label="Brilho (lg)" defaultValue={80} />
      <Slider
        label="Qualidade do vídeo"
        description="Disponível no plano Pro."
        defaultValue={50}
        disabled
      />
    </div>
  )
}
