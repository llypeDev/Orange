import { MonthPaginator } from '@orangesys/ui'

export default function Sizes() {
  return (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      <MonthPaginator
        size="sm"
        monthFormat="short"
        defaultValue={{ year: 2026, month: 2 }}
        aria-label="Mês (pequeno)"
      />
      <MonthPaginator size="md" defaultValue={{ year: 2026, month: 2 }} aria-label="Mês (médio)" />
      {/* O lg tem ~285px: numa prévia estreita (celular de 320px) ele rola na horizontal. */}
      <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
        <MonthPaginator
          size="lg"
          defaultValue={{ year: 2026, month: 2 }}
          aria-label="Mês (grande)"
        />
      </div>
      <MonthPaginator
        disabled
        defaultValue={{ year: 2026, month: 2 }}
        aria-label="Mês (desabilitado)"
      />
    </div>
  )
}
