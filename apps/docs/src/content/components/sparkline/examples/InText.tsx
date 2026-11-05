import { Sparkline } from '@orange/ui'

const produtos = [
  { nome: 'Fone sem fio', vendas: [42, 38, 51, 47, 55, 61, 66], resumo: 'subiu 57% na semana' },
  { nome: 'Garrafa térmica', vendas: [31, 33, 30, 29, 27, 26, 24], resumo: 'caiu 23% na semana' },
  { nome: 'Mochila urbana', vendas: [18, 19, 18, 20, 19, 18, 19], resumo: 'estável na semana' },
]

export default function InText() {
  return (
    <ul style={{ display: 'grid', gap: 12, margin: 0, padding: 0, listStyle: 'none' }}>
      {produtos.map((p) => (
        <li key={p.nome} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ minWidth: 140 }}>{p.nome}</span>
          <Sparkline data={p.vendas} label={`Vendas de ${p.nome}: ${p.resumo}`} width={80} height={24} />
          <span style={{ color: 'var(--or-color-text-subtle)', fontSize: 'var(--or-text-sm)' }}>
            {p.resumo}
          </span>
        </li>
      ))}
    </ul>
  )
}
