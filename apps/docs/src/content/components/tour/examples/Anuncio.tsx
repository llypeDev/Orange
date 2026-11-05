import { Button, Icon, Tour } from '@orange/ui'
import { useState } from 'react'

/** Ilustração geométrica: semana com a segunda-feira em destaque. */
function SemanaIlustracao() {
  const dias = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']
  return (
    <svg viewBox="0 0 360 140" role="img" aria-label="Semana com a segunda-feira destacada em laranja">
      <rect width="360" height="140" fill="var(--or-color-bg-subtle)" />
      {dias.map((dia, i) => (
        <g key={i} transform={`translate(${26 + i * 46} 34)`}>
          <rect
            width="38"
            height="64"
            fill={i === 0 ? 'var(--or-color-accent)' : 'var(--or-color-surface-raised)'}
            stroke={i === 0 ? 'var(--or-color-accent)' : 'var(--or-color-border-strong)'}
          />
          <text
            x="19"
            y="38"
            textAnchor="middle"
            fontFamily="var(--or-font-display)"
            fontSize="14"
            fill={i === 0 ? 'var(--or-color-text-on-accent)' : 'var(--or-color-text-muted)'}
          >
            {dia}
          </text>
        </g>
      ))}
      <rect x="26" y="108" width="38" height="4" fill="var(--or-color-accent)" />
    </svg>
  )
}

export default function Anuncio() {
  const [aberto, setAberto] = useState(false)

  return (
    <>
      <Button variant="outline" startIcon={<Icon name="bell" />} onClick={() => setAberto(true)}>
        Ver novidade
      </Button>
      {/* Um passo sem alvo: aparece centralizado, sem recorte, e o botão vira "Concluir". */}
      <Tour
        label="Novidade"
        open={aberto}
        onOpenChange={setAberto}
        steps={[
          {
            title: 'Relatórios agendados chegaram',
            content: (
              <p>
                Programe o resumo de vendas para chegar toda segunda-feira, às 8h, no e-mail da equipe. Configure em{' '}
                <strong>Relatórios → Agendamentos</strong>.
              </p>
            ),
            media: <SemanaIlustracao />,
          },
        ]}
      />
    </>
  )
}
