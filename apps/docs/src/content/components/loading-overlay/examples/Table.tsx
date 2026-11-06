import { Button, LoadingOverlay } from '@orangesys/ui'
import { useState } from 'react'

const regions = [
  ['Sudeste', 'R$ 1.284.300', '+12%'],
  ['Sul', 'R$ 642.900', '+4%'],
  ['Nordeste', 'R$ 518.200', '+18%'],
  ['Centro-Oeste', 'R$ 301.750', '−3%'],
]

const cell = {
  padding: '10px 16px',
  borderTop: '1px solid var(--or-color-border)',
  textAlign: 'left',
} as const

export default function Table() {
  const [loading, setLoading] = useState(false)

  const refresh = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div style={{ width: '100%', maxWidth: 560, border: '1px solid var(--or-color-border)' }}>
      <LoadingOverlay open={loading} message="Atualizando relatório…">
        {/* Em telas muito estreitas a tabela rola na horizontal em vez de alargar a página. */}
        <div
          role="region"
          aria-label="Vendas por região"
          tabIndex={0}
          style={{ overflowX: 'auto' }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <caption style={{ ...cell, borderTop: 0, fontWeight: 700 }}>
              Vendas por região — outubro
            </caption>
            <thead>
              <tr>
                <th scope="col" style={cell}>
                  Região
                </th>
                <th scope="col" style={cell}>
                  Receita
                </th>
                <th scope="col" style={cell}>
                  Variação
                </th>
              </tr>
            </thead>
            <tbody>
              {regions.map(([region, revenue, change]) => (
                <tr key={region}>
                  <td style={cell}>{region}</td>
                  <td style={cell}>{revenue}</td>
                  <td style={cell}>{change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: 16, borderTop: '1px solid var(--or-color-border)' }}>
          <Button size="sm" variant="outline" onClick={refresh}>
            Atualizar dados
          </Button>
        </div>
      </LoadingOverlay>
    </div>
  )
}
