import { Select } from '@orange/ui'

const ordenacao = [
  { value: 'relevancia', label: 'Mais relevantes' },
  { value: 'recentes', label: 'Mais recentes' },
  { value: 'preco-asc', label: 'Menor preço' },
  { value: 'preco-desc', label: 'Maior preço' },
]

export default function Sizes() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 360 }}>
      <Select size="sm" label="Ordenar por (sm)" options={ordenacao} />
      <Select size="md" label="Ordenar por (md)" options={ordenacao} />
      <Select size="lg" label="Ordenar por (lg)" options={ordenacao} />
    </div>
  )
}
