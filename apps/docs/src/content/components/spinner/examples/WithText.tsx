import { Spinner } from '@orange/ui'

export default function WithText() {
  return (
    // o texto visível é o anúncio; o spinner fica decorativo para não repetir "Carregando"
    <p role="status" style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
      <Spinner size="sm" decorative />
      Sincronizando 248 contatos…
    </p>
  )
}
