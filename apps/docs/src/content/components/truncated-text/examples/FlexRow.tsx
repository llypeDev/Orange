import { TruncatedText } from '@orangesys/ui'

const conversas = [
  { nome: 'Equipe financeira', mensagem: 'Ana: O fechamento de outubro está pronto para revisão, falta só a conciliação bancária.', hora: '14:05' },
  { nome: 'Bruno Lima', mensagem: 'Combinado, envio o relatório amanhã cedo.', hora: '11:32' },
]

export default function FlexRow() {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', width: '100%', maxWidth: 380 }}>
      {conversas.map((c) => (
        <li key={c.nome} style={{ display: 'flex', gap: 12, alignItems: 'baseline', padding: '10px 0', borderBottom: '1px solid var(--or-color-border)' }}>
          {/* min-width: 0 permite que o item flex encolha e o texto seja cortado */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <TruncatedText style={{ fontWeight: 600 }}>{c.nome}</TruncatedText>
            <TruncatedText showTitle style={{ color: 'var(--or-color-text-muted)', fontSize: 14 }}>
              {c.mensagem}
            </TruncatedText>
          </div>
          <span style={{ flexShrink: 0, fontSize: 12, color: 'var(--or-color-text-subtle)' }}>{c.hora}</span>
        </li>
      ))}
    </ul>
  )
}
