import { BottomNavigation, Icon } from '@orange/ui'
import type { AnchorHTMLAttributes } from 'react'

// Em um app real: import { Link as RouterLink, useLocation } from 'react-router-dom'
function RouterLink({ to, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  return <a href={`#${to}`} {...props} />
}

export default function WithRouter() {
  const pathname = '/agenda' // useLocation().pathname
  const items = [
    { value: '/agenda', href: '/agenda', label: 'Agenda', icon: <Icon name="calendar" /> },
    { value: '/pacientes', href: '/pacientes', label: 'Pacientes', icon: <Icon name="users" /> },
    { value: '/alertas', href: '/alertas', label: 'Alertas', icon: <Icon name="bell" />, badge: 2, badgeLabel: '2 novos' },
  ]
  return (
    <div style={{ width: 360, maxWidth: '100%', border: '1px solid var(--or-color-border-strong)' }}>
      <BottomNavigation
        aria-label="Navegação da clínica"
        value={pathname}
        items={items}
        renderLink={({ href, ...props }) => <RouterLink to={href} {...props} />}
      />
    </div>
  )
}
