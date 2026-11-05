import { Sparkline } from '@orange/ui'

const visitas = [1820, 1764, 1953, 2018, 1889, 2146, 2213, 2198, 2324, 2411, 2302, 2559]

export default function Variants() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 32 }}>
      <Sparkline data={visitas} label="Visitas subiram 41% em 12 semanas" />
      <Sparkline
        data={visitas}
        label="Visitas subiram 41% em 12 semanas; mínima na semana 2, máxima na semana 12"
        width={160}
        height={40}
        showMinMax
      />
      <Sparkline
        data={visitas}
        label="Visitas subiram 41% em 12 semanas"
        width={160}
        height={40}
        area
        color="var(--or-color-viz-2)"
      />
    </div>
  )
}
