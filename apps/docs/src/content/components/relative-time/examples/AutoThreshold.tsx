import { RelativeTime } from '@orange/ui'

const dias = (n: number) => new Date(Date.now() - n * 86_400_000)

export default function AutoThreshold() {
  return (
    <table style={{ borderCollapse: 'collapse', fontSize: 14 }}>
      <caption style={{ textAlign: 'left', paddingBottom: 8, color: 'var(--or-color-text-muted)' }}>
        Comentários do chamado (relativo até 7 dias)
      </caption>
      <tbody>
        {[0.1, 2, 6, 15, 120].map((n) => (
          <tr key={n} style={{ borderTop: '1px solid var(--or-color-border)' }}>
            <th scope="row" style={{ padding: '8px 24px 8px 0', textAlign: 'left', fontWeight: 500 }}>
              Comentário de {n < 1 ? 'hoje' : `${n} dias atrás`}
            </th>
            <td style={{ padding: '8px 0' }}>
              <RelativeTime date={dias(n)} threshold={7} absoluteFormat={{ dateStyle: 'medium' }} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
