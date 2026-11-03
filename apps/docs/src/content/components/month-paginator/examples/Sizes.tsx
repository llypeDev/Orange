import { MonthPaginator } from '@orange/ui'

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
      <MonthPaginator size="lg" defaultValue={{ year: 2026, month: 2 }} aria-label="Mês (grande)" />
      <MonthPaginator
        disabled
        defaultValue={{ year: 2026, month: 2 }}
        aria-label="Mês (desabilitado)"
      />
    </div>
  )
}
