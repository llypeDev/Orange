import { Button, Heading, Stack, Switch, Text } from '@orangesys/ui'

const preferencias = [
  {
    id: 'resumo',
    label: 'Resumo semanal de vendas',
    description: 'Toda segunda-feira, às 8h.',
    ligado: true,
  },
  {
    id: 'estoque',
    label: 'Alerta de estoque baixo',
    description: 'Quando um produto tiver menos de 5 unidades.',
    ligado: true,
  },
  {
    id: 'avaliacoes',
    label: 'Novas avaliações',
    description: 'Assim que um cliente avaliar um pedido.',
    ligado: false,
  },
]

export default function Configuracoes() {
  return (
    <Stack as="section" gap={6} aria-labelledby="titulo-notificacoes" style={{ maxWidth: 560 }}>
      <Stack gap={1}>
        <Heading level={4} id="titulo-notificacoes">
          Notificações por e-mail
        </Heading>
        <Text size="sm" tone="muted">
          Escolha o que a equipe da loja recebe na caixa de entrada.
        </Text>
      </Stack>

      {/* as="ul" mantém a lista; separator desenha a linha de 1px entre os itens */}
      <Stack as="ul" separator gap={4} aria-label="Preferências de notificação">
        {preferencias.map((p) => (
          <li key={p.id}>
            <Switch
              labelPosition="start"
              label={p.label}
              description={p.description}
              defaultChecked={p.ligado}
            />
          </li>
        ))}
      </Stack>

      <Stack direction="horizontal" justify="end" gap={3}>
        <Button variant="outline">Cancelar</Button>
        <Button>Salvar preferências</Button>
      </Stack>
    </Stack>
  )
}
