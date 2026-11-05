import { MonthPaginator } from '@orangesys/ui'

const hoje = new Date()

export default function Limits() {
  return (
    <MonthPaginator
      aria-label="Mês da fatura"
      defaultValue={{ year: hoje.getFullYear(), month: hoje.getMonth() }}
      min={{ year: hoje.getFullYear() - 1, month: hoje.getMonth() }}
      max={{ year: hoje.getFullYear(), month: hoje.getMonth() }}
    />
  )
}
