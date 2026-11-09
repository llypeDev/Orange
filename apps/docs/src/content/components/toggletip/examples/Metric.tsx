import { Stack, Toggletip } from '@orangesys/ui'

export default function Metric() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 4,
        padding: '16px 20px',
        border: '1px solid var(--or-color-border)',
        minWidth: 240,
      }}
    >
      <Stack gap={1} direction="horizontal" align="center">
        <span className="or-eyebrow">Taxa de conversão</span>
        <Toggletip
          label="Sobre a taxa de conversão"
          content="Pedidos concluídos divididos pelo total de visitantes no período. Visitas de robôs são descartadas."
        />
      </Stack>
      <strong style={{ fontFamily: 'var(--or-font-display)', fontSize: 32, lineHeight: 1.1 }}>
        3,8%
      </strong>
      <span style={{ fontSize: 13, color: 'var(--or-color-text-subtle)' }}>Últimos 30 dias</span>
    </div>
  )
}
