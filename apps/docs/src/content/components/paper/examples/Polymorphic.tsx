import { Paper } from '@orange/ui'

const artigos = [
  { titulo: 'Como organizar o fechamento do mês', tempo: '6 min de leitura' },
  { titulo: 'Boas práticas para aprovar despesas', tempo: '4 min de leitura' },
  { titulo: 'Relatórios que a diretoria realmente lê', tempo: '8 min de leitura' },
]

export default function Polymorphic() {
  return (
    <ul style={{ display: 'grid', gap: 12, margin: 0, padding: 0, listStyle: 'none', width: '100%', maxWidth: 480 }}>
      {artigos.map((artigo) => (
        <Paper as="li" key={artigo.titulo} padding={4} border="accent-left">
          <h3 style={{ margin: 0, fontSize: 16 }}>{artigo.titulo}</h3>
          <p style={{ margin: '4px 0 0', color: 'var(--or-color-text-muted)', fontSize: 13 }}>{artigo.tempo}</p>
        </Paper>
      ))}
    </ul>
  )
}
