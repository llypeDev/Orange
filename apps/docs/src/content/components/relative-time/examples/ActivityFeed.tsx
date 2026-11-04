import { RelativeTime } from '@orange/ui'

const minutos = (n: number) => new Date(Date.now() - n * 60_000)

const atividades = [
  { quem: 'Ana Souza', acao: 'aprovou o pagamento de fornecedores', quando: minutos(0.2) },
  { quem: 'Bruno Lima', acao: 'comentou em "Fechamento de outubro"', quando: minutos(12) },
  { quem: 'Carla Mendes', acao: 'enviou 3 notas fiscais', quando: minutos(60 * 5) },
  { quem: 'Diego Rocha', acao: 'criou o projeto "Expansão Sul"', quando: minutos(60 * 26) },
]

export default function ActivityFeed() {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', width: '100%', maxWidth: 460 }}>
      {atividades.map((item) => (
        <li
          key={item.quem}
          style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '10px 0', borderBottom: '1px solid var(--or-color-border)' }}
        >
          <span>
            <strong>{item.quem}</strong> {item.acao}
          </span>
          <RelativeTime date={item.quando} style={{ flexShrink: 0, color: 'var(--or-color-text-subtle)', fontSize: 13 }} />
        </li>
      ))}
    </ul>
  )
}
