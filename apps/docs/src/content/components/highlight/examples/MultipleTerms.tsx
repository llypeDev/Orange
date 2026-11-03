import { Highlight } from '@orange/ui'

const busca = 'nota fiscal cancelar'
const termos = busca.split(/\s+/)

const artigos = [
  {
    titulo: 'Como cancelar uma nota fiscal emitida',
    trecho: 'O cancelamento pode ser feito em até 24 horas após a emissão, direto pelo painel de notas.',
  },
  {
    titulo: 'Corrigir dados de uma nota fiscal',
    trecho: 'Use a carta de correção quando o erro não altera valores nem impostos.',
  },
]

export default function MultipleTerms() {
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 520 }}>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-muted)' }}>
        Resultados para <strong>“{busca}”</strong>
      </p>
      {artigos.map((artigo) => (
        <article key={artigo.titulo}>
          <h3 style={{ margin: '0 0 4px', fontSize: 16 }}>
            <Highlight query={termos}>{artigo.titulo}</Highlight>
          </h3>
          <Highlight as="p" query={termos} style={{ margin: 0, color: 'var(--or-color-text-muted)', fontSize: 14 }}>
            {artigo.trecho}
          </Highlight>
        </article>
      ))}
    </div>
  )
}
