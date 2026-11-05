import { Chip, Icon } from '@orangesys/ui'
import { useState } from 'react'

export default function Standalone() {
  const [freeShipping, setFreeShipping] = useState(true)

  return (
    <>
      <Chip selected={freeShipping} onSelectedChange={setFreeShipping} icon={<Icon name="zap" />}>
        Frete grátis
      </Chip>
      <Chip>Somente em estoque</Chip>
      <Chip disabled>Retirar na loja</Chip>
    </>
  )
}
