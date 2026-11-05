import { Button, Spinner } from '@orangesys/ui'
import { useState } from 'react'

const comments = [
  'Aprovado pelo financeiro.',
  'Enviar a versão final até sexta.',
  'Revisar o item 4 do contrato.',
]

export default function Panel() {
  const [loading, setLoading] = useState(false)

  const reload = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1800)
  }

  return (
    <section
      aria-labelledby="comentarios"
      style={{
        width: '100%',
        maxWidth: 420,
        border: '1px solid var(--or-color-border)',
        padding: 20,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 id="comentarios" style={{ margin: 0, fontFamily: 'var(--or-font-display)' }}>
          Comentários
        </h3>
        {/* não desabilite o botão durante o carregamento: o foco se perderia */}
        <Button size="sm" variant="ghost" onClick={() => !loading && reload()}>
          Recarregar
        </Button>
      </div>
      <div
        style={{
          minHeight: 112,
          display: 'grid',
          placeItems: loading ? 'center' : 'stretch',
          marginTop: 12,
        }}
      >
        {loading ? (
          <Spinner label="Carregando comentários" />
        ) : (
          <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--or-color-text-muted)' }}>
            {comments.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
