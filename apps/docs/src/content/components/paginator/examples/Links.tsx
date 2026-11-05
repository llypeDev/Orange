import { Paginator } from '@orangesys/ui'
import type { AnchorHTMLAttributes } from 'react'

// Em um app real: import { Link as RouterLink } from 'react-router-dom'
function RouterLink({ to, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  return <a href={`#${to}`} {...props} />
}

export default function Links() {
  return (
    <Paginator
      aria-label="Paginação dos artigos"
      totalPages={8}
      defaultPage={2}
      getPageHref={(page) => `/blog?pagina=${page}`}
      renderLink={({ href, ...props }) => <RouterLink to={href} {...props} />}
    />
  )
}
