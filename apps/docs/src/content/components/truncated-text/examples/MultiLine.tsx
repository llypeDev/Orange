import { TruncatedText } from '@orange/ui'

const produtos = [
  {
    nome: 'Cadeira ergonômica Pro',
    descricao:
      'Encosto em tela respirável, apoio lombar ajustável, braços 4D e base em alumínio. Garantia de 5 anos e montagem inclusa para entregas nas capitais.',
  },
  {
    nome: 'Mesa elevatória elétrica',
    descricao: 'Tampo de 140 × 70 cm, dois motores silenciosos e quatro alturas memorizadas.',
  },
]

export default function MultiLine() {
  return (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 260px))', width: '100%' }}>
      {produtos.map((produto) => (
        <article key={produto.nome} style={{ padding: 16, border: '1px solid var(--or-color-border)' }}>
          <h3 style={{ margin: '0 0 6px', fontSize: 16 }}>{produto.nome}</h3>
          <TruncatedText as="p" lines={2} style={{ margin: 0, color: 'var(--or-color-text-muted)', fontSize: 14 }}>
            {produto.descricao}
          </TruncatedText>
        </article>
      ))}
    </div>
  )
}
