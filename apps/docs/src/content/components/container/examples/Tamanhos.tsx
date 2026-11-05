import { Container, Paper, Stack, Text } from '@orange/ui'

const tamanhos = [
  { size: 'sm', uso: '640px — formulários e textos longos' },
  { size: 'md', uso: '768px — artigos e configurações' },
  { size: 'lg', uso: '1024px — listas e tabelas' },
  { size: 'xl', uso: '1200px (padrão) — páginas do produto' },
] as const

export default function Tamanhos() {
  return (
    <Stack gap={3}>
      {tamanhos.map((t) => (
        <Container key={t.size} size={t.size}>
          <Paper tone="subtle" padding={3}>
            <Text size="sm">
              <strong>size="{t.size}"</strong> · {t.uso}
            </Text>
          </Paper>
        </Container>
      ))}
    </Stack>
  )
}
