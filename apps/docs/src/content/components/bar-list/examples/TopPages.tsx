import { useId } from 'react'
import { BarList } from '@orangesys/ui'

const paginas = [
  { label: 'Página inicial', value: 12480, href: '#/' },
  { label: '/produtos', value: 8930, href: '#/produtos' },
  { label: '/blog/como-emitir-nota-fiscal', value: 5210, href: '#/blog/como-emitir-nota-fiscal' },
  { label: '/precos', value: 3120, href: '#/precos' },
  { label: '/contato', value: 1460, href: '#/contato' },
  { label: '/carreiras', value: 980, href: '#/carreiras' },
  { label: '/ajuda/trocas-e-devolucoes', value: 640, href: '#/ajuda/trocas-e-devolucoes' },
]

export default function TopPages() {
  const titleId = useId()
  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <h3 id={titleId} className="or-eyebrow">
        Páginas mais visitadas · últimos 30 dias
      </h3>
      <BarList aria-labelledby={titleId} data={paginas} limit={5} />
    </div>
  )
}
