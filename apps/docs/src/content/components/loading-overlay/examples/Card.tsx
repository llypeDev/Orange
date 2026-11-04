import { LoadingOverlay } from '@orange/ui'

export default function Card() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      <LoadingOverlay visible spinnerSize="sm" style={{ width: 260 }}>
        <article style={{ padding: 20, border: '1px solid var(--or-color-border)' }}>
          <p className="or-eyebrow" style={{ margin: 0 }}>
            Saldo disponível
          </p>
          <p
            style={{
              margin: '8px 0 0',
              fontFamily: 'var(--or-font-display)',
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            R$ 48.210,90
          </p>
          <p style={{ margin: '4px 0 0', color: 'var(--or-color-text-subtle)', fontSize: 13 }}>
            Atualizado às 14h32
          </p>
        </article>
      </LoadingOverlay>
      <LoadingOverlay visible message="Recalculando frete…" style={{ width: 260 }}>
        <article style={{ padding: 20, border: '1px solid var(--or-color-border)' }}>
          <p className="or-eyebrow" style={{ margin: 0 }}>
            Resumo do pedido
          </p>
          <p style={{ margin: '8px 0 0' }}>3 itens · R$ 389,70</p>
          <p style={{ margin: '4px 0 0', color: 'var(--or-color-text-subtle)', fontSize: 13 }}>
            Frete: calculando
          </p>
        </article>
      </LoadingOverlay>
    </div>
  )
}
