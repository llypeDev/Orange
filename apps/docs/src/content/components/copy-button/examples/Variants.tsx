import { CopyButton, Stack } from '@orangesys/ui'

const pedido = 'PED-2026-048213'

export default function Variants() {
  return (
    <Stack gap={3} direction="horizontal" align="center" wrap>
      <CopyButton value={pedido} size="sm" variant="outline" />
      <CopyButton value={pedido} variant="outline" />
      <CopyButton value={pedido} size="lg" variant="outline" />
      <CopyButton value={pedido} size="sm" variant="ghost">
        Copiar número do pedido
      </CopyButton>
      <CopyButton value={pedido} variant="secondary">
        Copiar
      </CopyButton>
    </Stack>
  )
}
