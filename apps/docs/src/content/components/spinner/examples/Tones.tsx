import { Spinner, Stack } from '@orangesys/ui'

export default function Tones() {
  return (
    <Stack gap={8} direction="horizontal" align="center">
      <Spinner tone="accent" label="Carregando pedidos" />
      <Spinner tone="neutral" label="Carregando clientes" />
      {/* current herda a cor do texto ao redor */}
      <span style={{ color: 'var(--or-color-info-text)' }}>
        <Spinner tone="current" label="Carregando agenda" />
      </span>
    </Stack>
  )
}
