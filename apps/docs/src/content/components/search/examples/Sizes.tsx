import { Search } from '@orange/ui'

export default function Sizes() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 420 }}>
      <Search size="sm" label="Filtrar tabela" placeholder="Filtrar (sm)" />
      <Search size="md" label="Buscar documentos" placeholder="Buscar (md)" />
      <Search size="lg" label="Buscar no site" placeholder="O que você procura? (lg)" />
      <Search label="Busca indisponível" placeholder="Busca desabilitada" disabled />
    </div>
  )
}
