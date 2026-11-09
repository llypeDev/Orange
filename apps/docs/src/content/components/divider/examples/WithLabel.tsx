import { Button, Divider, Stack } from '@orangesys/ui'

export default function WithLabel() {
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 360 }}>
      <Button block>Entrar com e-mail</Button>
      <Divider label="ou continue com" spacing={2} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Button variant="outline">Google</Button>
        <Button variant="outline">Microsoft</Button>
      </div>
    </Stack>
  )
}
