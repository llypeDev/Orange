import { Chip, ChipGroup, Icon } from '@orange/ui'

export default function WithIcons() {
  return (
    <ChipGroup label="Formas de pagamento" hideLabel defaultValue={['pix']}>
      <Chip value="pix" icon={<Icon name="zap" />}>
        Pix
      </Chip>
      <Chip value="cartao" icon={<Icon name="layers" />}>
        Cartão de crédito
      </Chip>
      <Chip value="boleto" icon={<Icon name="file" />}>
        Boleto
      </Chip>
    </ChipGroup>
  )
}
