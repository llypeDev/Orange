import { NavigationMenu } from '@orangesys/ui'
import type { AnchorHTMLAttributes } from 'react'

// Em um app real:
// import { Link as RouterLink, useLocation } from 'react-router-dom'
function RouterLink({ to, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  return <a href={`#${to}`} {...props} />
}

export default function WithRouter() {
  const pathname = '/financeiro/conciliacao' // useLocation().pathname
  return (
    <NavigationMenu
      aria-label="Áreas do sistema"
      currentHref={pathname}
      renderLink={({ href, ...props }) => <RouterLink to={href} {...props} />}
      items={[
        { label: 'Início', href: '/', icon: 'home' },
        {
          id: 'vendas',
          label: 'Vendas',
          items: [
            { label: 'Pedidos', href: '/vendas/pedidos' },
            { label: 'Clientes', href: '/vendas/clientes' },
            { label: 'Cupons', href: '/vendas/cupons' },
          ],
        },
        {
          id: 'financeiro',
          label: 'Financeiro',
          items: [
            { label: 'Recebimentos', href: '/financeiro/recebimentos' },
            { label: 'Conciliação', href: '/financeiro/conciliacao' },
            { label: 'Notas fiscais', href: '/financeiro/notas' },
          ],
        },
      ]}
    />
  )
}
