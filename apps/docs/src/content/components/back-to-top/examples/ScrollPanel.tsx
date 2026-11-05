import { BackToTop } from '@orangesys/ui'
import { useRef } from 'react'

const transactions = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  date: `${String(30 - i).padStart(2, '0')}/10`,
  description: ['Assinatura Orange Pro', 'Reembolso de frete', 'Pagamento via Pix', 'Compra no cartão'][i % 4],
  amount: ((i % 4 === 1 ? 1 : -1) * (19.9 + i * 13.4)).toFixed(2),
}))

export default function ScrollPanel() {
  const panelRef = useRef<HTMLDivElement>(null)
  return (
    <div
      ref={panelRef}
      tabIndex={0}
      role="region"
      aria-label="Extrato de outubro"
      style={{ width: '100%', height: 320, overflow: 'auto', border: '1px solid var(--or-color-border)', padding: '0 16px 16px' }}
    >
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {transactions.map((t) => (
          <li
            key={t.id}
            style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: '1px solid var(--or-color-border-subtle)', fontSize: 14 }}
          >
            <span style={{ color: 'var(--or-color-text-subtle)', fontVariantNumeric: 'tabular-nums' }}>{t.date}</span>
            <span style={{ flex: 1 }}>{t.description}</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>R$ {t.amount}</span>
          </li>
        ))}
      </ul>
      <BackToTop scrollContainer={panelRef} position="sticky" threshold={160} />
    </div>
  )
}
