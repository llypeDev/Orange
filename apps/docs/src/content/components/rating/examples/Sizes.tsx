import { Rating, Stack } from '@orangesys/ui'

export default function Sizes() {
  return (
    <Stack gap={4}>
      <Rating label="Pequeno (sm)" size="sm" defaultValue={3} />
      <Rating label="Médio (md)" size="md" defaultValue={4} />
      <Rating label="Grande (lg)" size="lg" defaultValue={5} />
      <Rating label="Nota de 1 a 10" max={10} size="sm" defaultValue={8} />
      <Rating label="Desabilitado" disabled defaultValue={2} />
    </Stack>
  )
}
