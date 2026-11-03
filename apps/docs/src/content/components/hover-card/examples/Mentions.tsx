import { HoverCard } from '@orange/ui'

const pessoas = [
  { usuario: 'bruno', nome: 'Bruno Lima', cargo: 'Engenharia · Plataforma', status: 'Disponível' },
  { usuario: 'carla', nome: 'Carla Mendes', cargo: 'Dados · Growth', status: 'Em reunião até 15h' },
]

export default function Mentions() {
  return (
    <p style={{ margin: 0 }}>
      {pessoas.map((pessoa, i) => (
        <span key={pessoa.usuario}>
          {i > 0 && ' e '}
          <HoverCard
            openDelay={300}
            closeDelay={200}
            trigger={<a href={`#${pessoa.usuario}`}>@{pessoa.usuario}</a>}
          >
            <div style={{ display: 'grid', gap: 4 }}>
              <strong style={{ fontFamily: 'var(--or-font-display)' }}>{pessoa.nome}</strong>
              <span style={{ color: 'var(--or-color-text-muted)' }}>{pessoa.cargo}</span>
              <span style={{ fontSize: 12, color: 'var(--or-color-text-subtle)' }}>{pessoa.status}</span>
            </div>
          </HoverCard>
        </span>
      ))}{' '}
      comentaram nesta tarefa.
    </p>
  )
}
