import { InlineEdit } from '@orange/ui'

export default function Sizes() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <InlineEdit label="Título (lg)" size="lg" defaultValue="Relatório trimestral" />
      <InlineEdit label="Subtítulo (md)" size="md" defaultValue="Resultados de julho a setembro" />
      <InlineEdit label="Nota (sm)" size="sm" defaultValue="" placeholder="Adicionar uma nota" />
      <InlineEdit label="Código do projeto" disabled defaultValue="ORG-2026-114" />
    </div>
  )
}
