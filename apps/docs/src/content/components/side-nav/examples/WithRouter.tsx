import { Icon, SideNav, SideNavItem } from '@orangesys/ui'
import type { AnchorHTMLAttributes } from 'react'

// Em um app real:
// import { Link as RouterLink, useLocation } from 'react-router-dom'
function RouterLink({ to, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  return <a href={`#${to}`} {...props} />
}

export default function WithRouter() {
  const pathname = '/agenda' // useLocation().pathname
  return (
    <div style={{ height: 260, display: 'flex', border: '1px solid var(--or-color-border)' }}>
      <SideNav
        aria-label="Navegação da clínica"
        currentHref={pathname}
        renderLink={({ href, ...props }) => <RouterLink to={href} {...props} />}
      >
        <SideNavItem href="/agenda" icon={<Icon name="calendar" />}>
          Agenda
        </SideNavItem>
        <SideNavItem href="/pacientes" icon={<Icon name="users" />}>
          Pacientes
        </SideNavItem>
        <SideNavItem href="/financeiro" icon={<Icon name="chart-bar" />}>
          Financeiro
        </SideNavItem>
      </SideNav>
    </div>
  )
}
