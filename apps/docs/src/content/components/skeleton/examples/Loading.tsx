import { Button, Skeleton, VisuallyHidden } from '@orange/ui'
import { useEffect, useState } from 'react'

const orders = [
  { id: '#4821', customer: 'Padaria Pão Dourado', total: 'R$ 1.240,00' },
  { id: '#4820', customer: 'Mercado Bom Preço', total: 'R$ 3.875,50' },
  { id: '#4819', customer: 'Café Central', total: 'R$ 642,90' },
]

export default function Loading() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!loading) return
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [loading])

  return (
    <div style={{ width: '100%', maxWidth: 520 }}>
      {/* anúncio fora do contêiner ocupado */}
      <VisuallyHidden role="status">
        {loading ? 'Carregando pedidos…' : 'Pedidos carregados'}
      </VisuallyHidden>
      <section
        aria-labelledby="pedidos"
        aria-busy={loading}
        style={{ border: '1px solid var(--or-color-border)' }}
      >
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
          }}
        >
          <h3 id="pedidos" style={{ margin: 0, fontFamily: 'var(--or-font-display)' }}>
            Últimos pedidos
          </h3>
          <Button size="sm" variant="ghost" onClick={() => setLoading(true)}>
            Recarregar
          </Button>
        </header>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {(loading ? [0, 1, 2] : orders).map((order, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                gap: 16,
                alignItems: 'center',
                padding: '12px 16px',
                borderTop: '1px solid var(--or-color-border)',
              }}
            >
              {typeof order === 'number' ? (
                <>
                  <Skeleton width={48} />
                  <Skeleton width="45%" />
                  <Skeleton width={80} style={{ marginLeft: 'auto' }} />
                </>
              ) : (
                <>
                  <span
                    style={{
                      fontFamily: 'var(--or-font-mono)',
                      color: 'var(--or-color-text-subtle)',
                    }}
                  >
                    {order.id}
                  </span>
                  <span>{order.customer}</span>
                  <strong style={{ marginLeft: 'auto' }}>{order.total}</strong>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
