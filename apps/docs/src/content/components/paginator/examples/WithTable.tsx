import { Paginator } from '@orangesys/ui'
import { useState } from 'react'

const customers = Array.from({ length: 87 }, (_, i) => ({
  id: 1001 + i,
  name: ['Mercado Bom Preço', 'Padaria Aurora', 'Farmácia Vida', 'Livraria Página 1', 'Pet Shop Amigo'][i % 5],
  city: ['Recife', 'Curitiba', 'Belém', 'Porto Alegre', 'Salvador'][i % 5],
}))

export default function WithTable() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const rows = customers.slice((page - 1) * pageSize, page * pageSize)
  const cell = { padding: '10px 12px', borderBottom: '1px solid var(--or-color-border)', textAlign: 'left' as const }

  return (
    <div style={{ display: 'grid', gap: 16, width: '100%' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <caption className="or-visually-hidden">Clientes</caption>
        <thead>
          <tr>
            <th style={cell}>Código</th>
            <th style={cell}>Cliente</th>
            <th style={cell}>Cidade</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id}>
              <td style={{ ...cell, fontVariantNumeric: 'tabular-nums' }}>{c.id}</td>
              <td style={cell}>{c.name}</td>
              <td style={cell}>{c.city}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Paginator
        aria-label="Paginação de clientes"
        totalItems={customers.length}
        page={page}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        pageSizeOptions={[5, 10, 25]}
        size="sm"
      />
    </div>
  )
}
