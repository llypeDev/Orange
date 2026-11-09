import { Button, Stack } from '@orangesys/ui'

export default function Sizes() {
  return (
    <Stack gap={4} style={{ width: '100%' }}>
      <Stack gap={4} direction="horizontal" align="end" wrap>
        <Button size="lg">Large</Button>
        <Button size="md">Medium</Button>
        <Button size="sm">Small</Button>
      </Stack>
      <Button block>Block button</Button>
    </Stack>
  )
}
