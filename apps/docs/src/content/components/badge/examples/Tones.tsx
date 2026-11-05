import { Badge } from '@orangesys/ui'

const tones = ['accent', 'neutral', 'success', 'warning', 'danger', 'info'] as const

export default function Tones() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {tones.map((tone) => (
          <Badge key={tone} tone={tone} count={8} />
        ))}
        <Badge count={1500} />
        <Badge count={42} max={9} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {tones.map((tone) => (
          <Badge key={tone} tone={tone} count={8} size="sm" />
        ))}
        {tones.map((tone) => (
          <Badge key={`dot-${tone}`} tone={tone} dot />
        ))}
      </div>
    </div>
  )
}
