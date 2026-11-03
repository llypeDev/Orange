import { Slider } from '@orange/ui'

const planos: Record<number, string> = {
  1: 'Individual',
  10: 'Equipe',
  50: 'Empresa',
  100: 'Corporativo',
}

export default function Marks() {
  return (
    <div style={{ display: 'grid', gap: 32, width: '100%', maxWidth: 420 }}>
      <Slider
        label="Pessoas na equipe"
        min={1}
        max={100}
        defaultValue={10}
        marks={[
          { value: 1, label: '1' },
          { value: 10, label: '10' },
          { value: 50, label: '50' },
          { value: 100, label: '100' },
        ]}
        formatValue={(v) => {
          const faixa =
            Object.keys(planos)
              .map(Number)
              .filter((n) => n <= v)
              .pop() ?? 1
          return `${v} ${v === 1 ? 'pessoa' : 'pessoas'} · plano ${planos[faixa]}`
        }}
      />
      <Slider
        label="Intensidade do filtro"
        min={0}
        max={100}
        step={10}
        defaultValue={40}
        marks
        formatValue={(v) => `${v}%`}
      />
    </div>
  )
}
