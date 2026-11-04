import { Rating } from '@orange/ui'

export default function Sizes() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Rating label="Pequeno (sm)" size="sm" defaultValue={3} />
      <Rating label="Médio (md)" size="md" defaultValue={4} />
      <Rating label="Grande (lg)" size="lg" defaultValue={5} />
      <Rating label="Nota de 1 a 10" max={10} size="sm" defaultValue={8} />
      <Rating label="Desabilitado" disabled defaultValue={2} />
    </div>
  )
}
