import { AppHeader } from '@orange/ui'
import type { AnchorHTMLAttributes } from 'react'

// Em um app real:
// import { Link as RouterLink, useLocation } from 'react-router-dom'
function RouterLink({ to, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  return <a href={`#${to}`} {...props} />
}

export default function WithRouter() {
  const pathname = '/clientes' // useLocation().pathname
  return (
    <AppHeader
      collapseBelow="sm"
      navLabel="Navegação do CRM"
      brand={<RouterLink to="/">CRM</RouterLink>}
      items={[
        { label: 'Clientes', href: '/clientes' },
        { label: 'Negócios', href: '/negocios' },
        { label: 'Tarefas', href: '/tarefas' },
      ]}
      currentHref={pathname}
      renderLink={({ href, ...props }) => <RouterLink to={href} {...props} />}
    />
  )
}
