import { Icon, VisuallyHidden } from '@orangesys/ui'

export default function IconLabel() {
  return (
    <a
      href="#carrinho"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'inherit' }}
    >
      <Icon name="inbox" />
      <span aria-hidden="true">3</span>
      <VisuallyHidden>Carrinho com 3 itens</VisuallyHidden>
    </a>
  )
}
