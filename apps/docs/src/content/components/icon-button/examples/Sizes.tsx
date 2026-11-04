import { IconButton } from '@orange/ui'

export default function Sizes() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <IconButton icon="search" label="Buscar" variant="outline" size="lg" />
      <IconButton icon="search" label="Buscar" variant="outline" size="md" />
      <IconButton icon="search" label="Buscar" variant="outline" size="sm" />
    </div>
  )
}
