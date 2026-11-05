import { Meter } from '@orangesys/ui'

const gb = (value: number, { max }: { max: number }) => `${value} GB de ${max} GB`

export default function Storage() {
  return (
    <div style={{ display: 'grid', gap: 28, width: '100%', maxWidth: 480 }}>
      {/* valores baixos são bons: optimum abaixo de low */}
      <Meter label="Fotos" value={38} max={128} low={90} high={115} optimum={0} formatValue={gb} />
      <Meter
        label="Backups"
        value={102}
        max={128}
        low={90}
        high={115}
        optimum={0}
        formatValue={gb}
      />
      <Meter
        label="Vídeos"
        value={124}
        max={128}
        low={90}
        high={115}
        optimum={0}
        formatValue={gb}
        description="Quase sem espaço: novos uploads serão bloqueados em 4 GB."
      />
    </div>
  )
}
