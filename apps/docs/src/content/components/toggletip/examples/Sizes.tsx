import { Stack, Toggletip } from '@orangesys/ui'

export default function Sizes() {
  return (
    <Stack gap={6} direction="horizontal" align="center">
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        Pequeno (24px)
        <Toggletip
          size="sm"
          label="Sobre o tamanho pequeno"
          content="Ideal ao lado de rótulos e textos de corpo."
        />
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        Médio (32px)
        <Toggletip
          size="md"
          icon="help-circle"
          placement="bottom"
          label="Sobre o tamanho médio"
          content="Use ao lado de títulos ou em áreas de toque."
        />
      </span>
    </Stack>
  )
}
