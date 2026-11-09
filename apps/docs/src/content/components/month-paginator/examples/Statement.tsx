import { MonthPaginator, Stack, Text, type YearMonth } from '@orangesys/ui'
import { useState } from 'react'

// Dados de exemplo: entradas e saídas por mês (chave "ano-mês").
const resumo: Record<string, { entradas: number; saidas: number }> = {
  '2026-8': { entradas: 18400, saidas: 12950 },
  '2026-9': { entradas: 21300, saidas: 15720 },
  '2026-10': { entradas: 19850, saidas: 9310 },
}

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Statement() {
  const [mes, setMes] = useState<YearMonth>({ year: 2026, month: 10 })
  const dados = resumo[`${mes.year}-${mes.month}`]

  return (
    <Stack gap={4} style={{ width: '100%', maxWidth: 420 }}>
      <MonthPaginator
        aria-label="Mês do resumo"
        value={mes}
        onChange={setMes}
        min={{ year: 2026, month: 8 }}
        max={{ year: 2026, month: 10 }}
      />
      {dados ? (
        <dl
          style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px 24px', margin: 0 }}
        >
          <dt>Entradas</dt>
          <dd style={{ margin: 0, textAlign: 'right' }}>{moeda.format(dados.entradas)}</dd>
          <dt>Saídas</dt>
          <dd style={{ margin: 0, textAlign: 'right' }}>{moeda.format(dados.saidas)}</dd>
          <dt>
            <strong>Saldo do mês</strong>
          </dt>
          <dd style={{ margin: 0, textAlign: 'right' }}>
            <strong>{moeda.format(dados.entradas - dados.saidas)}</strong>
          </dd>
        </dl>
      ) : (
        <Text tone="muted">Sem movimentações neste mês.</Text>
      )}
    </Stack>
  )
}
