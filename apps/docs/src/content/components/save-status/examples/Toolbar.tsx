import { Button, Icon, SaveStatus } from '@orangesys/ui'

const salvoEm = new Date(Date.now() - 12 * 60_000)

export default function Toolbar() {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        maxWidth: 640,
        padding: '12px 16px',
        border: '1px solid var(--or-color-border)',
      }}
    >
      <div style={{ display: 'grid', gap: 2, minWidth: 0, flex: '1 1 14rem' }}>
        <strong style={{ fontFamily: 'var(--or-font-display)' }}>
          Proposta comercial — Acme Distribuidora
        </strong>
        <SaveStatus size="sm" status="saved" savedAt={salvoEm} />
      </div>
      <Button variant="outline" size="sm" startIcon={<Icon name="send" />}>
        Enviar para aprovação
      </Button>
    </div>
  )
}
