import { Stat } from '@orangesys/ui'

export default function Single() {
  return (
    <Stat
      label="Receita recorrente mensal"
      value="R$ 48,2 mil"
      delta="12%"
      trend="increase"
      help="vs. outubro"
    />
  )
}
