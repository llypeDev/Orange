import { Image } from '@orange/ui'
import vitrine from './media/vitrine.svg'

export default function Caption() {
  return (
    <Image
      src={vitrine}
      alt="Prateleiras da loja com mochilas, garrafas e acessórios organizados por cor"
      ratio="16/9"
      bordered
      caption="Nova vitrine da loja do centro, organizada por categoria."
      style={{ maxWidth: 520 }}
    />
  )
}
