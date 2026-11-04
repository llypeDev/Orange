import { Button, Skeleton, SkeletonText } from '@orange/ui'
import { useEffect, useState } from 'react'

export default function Swap() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (loaded) return
    const timer = setTimeout(() => setLoaded(true), 1800)
    return () => clearTimeout(timer)
  }, [loaded])

  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 420 }}>
      <article style={{ display: 'grid', gap: 12, padding: 20, border: '1px solid var(--or-color-border)' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {/* loaded: crossfade do placeholder para o conteúdo real */}
          <Skeleton variant="circle" width={40} loaded={loaded}>
            <span
              aria-hidden="true"
              style={{
                display: 'grid',
                placeItems: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'var(--or-color-accent)',
                color: 'var(--or-color-text-on-accent)',
                fontWeight: 700,
              }}
            >
              AS
            </span>
          </Skeleton>
          <Skeleton width="50%" loaded={loaded} style={{ flex: 1 }}>
            <strong>Ana Souza</strong>
            <span style={{ display: 'block', fontSize: 13, color: 'var(--or-color-text-subtle)' }}>
              Gerente de contas
            </span>
          </Skeleton>
        </div>
        <SkeletonText lines={2} loaded={loaded}>
          <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
            Atende 42 clientes no Sudeste. Última visita: Padaria Pão Dourado, ontem às 15h.
          </p>
        </SkeletonText>
      </article>
      <div>
        <Button size="sm" variant="outline" onClick={() => setLoaded(false)}>
          Recarregar perfil
        </Button>
      </div>
    </div>
  )
}
