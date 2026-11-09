import { Stack, Switch } from '@orangesys/ui'

export default function SizesStates() {
  return (
    <Stack gap={4}>
      <Switch size="sm" label="Pequeno (sm)" defaultChecked />
      <Switch size="md" label="Médio (md)" defaultChecked />
      <Switch label="Desabilitado" disabled />
      <Switch label="Desabilitado e ligado" disabled defaultChecked />
    </Stack>
  )
}
