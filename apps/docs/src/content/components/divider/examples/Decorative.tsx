import { Divider } from '@orangesys/ui'

export default function Decorative() {
  return (
    <div style={{ maxWidth: 480 }}>
      <p className="or-eyebrow" style={{ margin: 0 }}>
        Relatório anual
      </p>
      <h3 style={{ margin: '8px 0 0', fontSize: 28 }}>Resultados de 2026</h3>
      <div style={{ width: 48 }}>
        <Divider decorative tone="accent" thickness="thick" spacing={4} />
      </div>
      <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
        Crescemos 38% em receita recorrente e chegamos a 12 mil clientes ativos.
      </p>
    </div>
  )
}
