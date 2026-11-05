import { ToggleButton } from '@orangesys/ui'

export default function Basic() {
  return (
    <>
      <ToggleButton defaultPressed>Somente remotas</ToggleButton>
      <ToggleButton>Com salário informado</ToggleButton>
      <ToggleButton variant="ghost">Candidatura simplificada</ToggleButton>
    </>
  )
}
