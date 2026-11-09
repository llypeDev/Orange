import { Badge, Stack } from '@orangesys/ui'

const tones = ['accent', 'neutral', 'success', 'warning', 'danger', 'info'] as const

export default function Tones() {
  return (
    <Stack gap={4}>
      <Stack gap={3} direction="horizontal" align="center" wrap>
        {tones.map((tone) => (
          <Badge key={tone} tone={tone} count={8} />
        ))}
        <Badge count={1500} />
        <Badge count={42} max={9} />
      </Stack>
      <Stack gap={3} direction="horizontal" align="center" wrap>
        {tones.map((tone) => (
          <Badge key={tone} tone={tone} count={8} size="sm" />
        ))}
        {tones.map((tone) => (
          <Badge key={`dot-${tone}`} tone={tone} dot />
        ))}
      </Stack>
    </Stack>
  )
}
