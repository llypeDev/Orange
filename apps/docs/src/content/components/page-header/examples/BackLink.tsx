import { Button, PageHeader, Tag } from '@orangesys/ui'
import type { AnchorHTMLAttributes } from 'react'

// Em um app real:
// import { Link as RouterLink } from 'react-router-dom'
function RouterLink({ to, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  return <a href={`#${to}`} {...props} />
}

export default function BackLink() {
  return (
    <PageHeader
      headingLevel={2}
      back={{ href: '/devolucoes', label: 'Devoluções' }}
      renderLink={({ href, ...props }) => <RouterLink to={href} {...props} />}
      title="Devolução #219"
      meta={<Tag tone="info">Em análise</Tag>}
      description="Solicitada em 3 de abril · Motivo: tamanho errado"
      actions={
        <>
          <Button variant="outline">Recusar</Button>
          <Button>Aprovar devolução</Button>
        </>
      }
    />
  )
}
