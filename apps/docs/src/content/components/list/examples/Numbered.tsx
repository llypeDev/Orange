import { List, ListItem } from '@orangesys/ui'

export default function Numbered() {
  return (
    <List variant="numbered" size="lg" style={{ maxWidth: 480 }}>
      <ListItem description="Use o e-mail corporativo da sua empresa.">Crie sua conta</ListItem>
      <ListItem description="Adicione quem vai aprovar pagamentos e emitir notas.">Convide a equipe</ListItem>
      <ListItem description="A integração com o banco leva menos de 2 minutos.">Conecte sua conta bancária</ListItem>
    </List>
  )
}
