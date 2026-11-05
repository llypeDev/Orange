import { List, ListItem } from '@orangesys/ui'

export default function Divided() {
  return (
    <List variant="divided" aria-label="Membros da equipe" style={{ width: '100%', maxWidth: 420 }}>
      <ListItem description="Administradora · último acesso há 2 horas">Ana Souza</ListItem>
      <ListItem description="Financeiro · último acesso ontem">Bruno Lima</ListItem>
      <ListItem description="Leitura · convite pendente">Carla Mendes</ListItem>
    </List>
  )
}
