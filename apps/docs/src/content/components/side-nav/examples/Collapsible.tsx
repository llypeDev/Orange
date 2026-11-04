import { Icon, SideNav, SideNavGroup, SideNavItem, SideNavSection } from '@orange/ui'
import { useState } from 'react'

export default function Collapsible() {
  const [collapsed, setCollapsed] = useState(true)
  return (
    <div style={{ height: 480, display: 'flex', border: '1px solid var(--or-color-border)' }}>
      <SideNav
        aria-label="Navegação da loja"
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        collapsible
        currentHref="#pedidos"
        header={({ collapsed }) => (
          <strong style={{ fontFamily: 'var(--or-font-display)' }}>{collapsed ? 'L' : 'Loja Aurora'}</strong>
        )}
      >
        <SideNavItem href="#resumo" icon={<Icon name="grid" />}>
          Resumo
        </SideNavItem>
        <SideNavItem href="#pedidos" icon={<Icon name="inbox" />} badge={4}>
          Pedidos
        </SideNavItem>
        <SideNavGroup label="Catálogo" icon={<Icon name="tag" />}>
          <SideNavItem href="#produtos">Produtos</SideNavItem>
          <SideNavItem href="#categorias">Categorias</SideNavItem>
          <SideNavItem href="#estoque">Estoque</SideNavItem>
        </SideNavGroup>
        <SideNavItem href="#clientes" icon={<Icon name="users" />}>
          Clientes
        </SideNavItem>
        <SideNavSection title="Loja">
          <SideNavItem href="#ajustes" icon={<Icon name="sliders" />}>
            Ajustes
          </SideNavItem>
        </SideNavSection>
      </SideNav>
      <div style={{ flex: 1, padding: 24, color: 'var(--or-color-text-muted)' }}>
        Passe o mouse ou use Tab nos ícones para ver os rótulos. "Catálogo" abre em um painel.
      </div>
    </div>
  )
}
