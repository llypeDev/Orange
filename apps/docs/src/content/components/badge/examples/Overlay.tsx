import { Badge, Button, Icon } from '@orange/ui'

export default function Overlay() {
  return (
    <>
      <Badge count={3} label="3 notificações não lidas">
        <Button variant="outline" iconOnly aria-label="Notificações" startIcon={<Icon name="bell" />} />
      </Badge>
      <Badge count={128} label="128 itens no carrinho" tone="neutral">
        <Button variant="outline" iconOnly aria-label="Carrinho" startIcon={<Icon name="inbox" />} />
      </Badge>
      <Badge dot label="Há mensagens novas" tone="info">
        <Button variant="ghost" iconOnly aria-label="Mensagens" startIcon={<Icon name="mail" />} />
      </Badge>
    </>
  )
}
