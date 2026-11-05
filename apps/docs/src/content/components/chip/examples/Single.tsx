import { Chip, ChipGroup } from '@orangesys/ui'

export default function Single() {
  return (
    <ChipGroup type="single" label="Período" defaultValue="30d" size="sm">
      <Chip value="hoje">Hoje</Chip>
      <Chip value="7d">7 dias</Chip>
      <Chip value="30d">30 dias</Chip>
      <Chip value="90d">90 dias</Chip>
      <Chip value="12m">12 meses</Chip>
    </ChipGroup>
  )
}
