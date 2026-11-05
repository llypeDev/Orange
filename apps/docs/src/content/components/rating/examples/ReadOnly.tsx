import { Rating, Text } from '@orangesys/ui'

const produtos = [
  { nome: 'Fone Orange Studio', nota: 4.5, avaliacoes: 128 },
  { nome: 'Teclado Mecânico TKL', nota: 4, avaliacoes: 52 },
  { nome: 'Mouse sem fio Slim', nota: 3.5, avaliacoes: 17 },
]

export default function ReadOnly() {
  return (
    <ul
      style={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'grid',
        gap: 12,
        width: '100%',
        maxWidth: 420,
      }}
    >
      {produtos.map((produto) => (
        <li
          key={produto.nome}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <Text weight="medium">{produto.nome}</Text>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Rating readOnly value={produto.nota} size="sm" />
            <Text as="span" size="sm" tone="subtle">
              ({produto.avaliacoes})
            </Text>
          </span>
        </li>
      ))}
    </ul>
  )
}
