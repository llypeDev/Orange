import { Breadcrumb } from '@orange/ui'
import type { AnchorHTMLAttributes } from 'react'

// Em um app real:
// import { Link as RouterLink } from 'react-router-dom'
function RouterLink({ to, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  return <a href={`#${to}`} {...props} />
}

export default function WithRouter() {
  return (
    <Breadcrumb
      items={[
        { label: 'Clientes', href: '/clientes' },
        { label: 'Mercado Bom Preço', href: '/clientes/482' },
        { label: 'Contratos' },
      ]}
      renderLink={({ href, ...props }) => <RouterLink to={href} {...props} />}
    />
  )
}
