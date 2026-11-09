import { ProgressCircle, Stack } from '@orangesys/ui'

export default function Sizes() {
  return (
    <Stack gap={8} direction="horizontal" align="center">
      <ProgressCircle size="sm" value={68} label="Perfil completo" />
      <ProgressCircle size="md" value={68} showValue label="Perfil completo" />
      <ProgressCircle size="lg" value={68} showValue label="Perfil completo" />
    </Stack>
  )
}
