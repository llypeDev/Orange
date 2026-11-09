import { List, ListItem, Stack } from '@orangesys/ui'

export default function Inline() {
  return (
    <Stack gap={4}>
      <List variant="inline" size="sm" aria-label="Detalhes do arquivo" style={{ color: 'var(--or-color-text-muted)' }}>
        <ListItem>PDF</ListItem>
        <ListItem>2,4 MB</ListItem>
        <ListItem>Atualizado em 28 de out.</ListItem>
      </List>
      <nav aria-label="Rodapé">
        <List variant="inline" size="sm">
          <ListItem>
            <a href="#termos">Termos de uso</a>
          </ListItem>
          <ListItem>
            <a href="#privacidade">Privacidade</a>
          </ListItem>
          <ListItem>
            <a href="#status">Status do serviço</a>
          </ListItem>
        </List>
      </nav>
    </Stack>
  )
}
