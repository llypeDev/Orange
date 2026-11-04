import { Icon, List, ListItem } from '@orange/ui'

export default function WithIcons() {
  return (
    <List variant="icon" icon={<Icon name="check" />}>
      <ListItem>Backups diários com retenção de 30 dias</ListItem>
      <ListItem>Login único (SSO) com Google e Microsoft</ListItem>
      <ListItem icon={<Icon name="lock" />}>Dados criptografados em repouso e em trânsito</ListItem>
      <ListItem icon={<Icon name="globe" />}>Servidores no Brasil</ListItem>
    </List>
  )
}
