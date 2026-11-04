import { Icon, SideNav, SideNavGroup, SideNavItem, SideNavSection } from '@orange/ui'
import { useState, type MouseEvent } from 'react'

export default function Dashboard() {
  const [current, setCurrent] = useState('#checkout')
  // Em um app real, currentHref vem da rota atual (useLocation().pathname).
  const go = (event: MouseEvent<HTMLElement>) => {
    const href = event.currentTarget.getAttribute('href')
    if (href) {
      event.preventDefault()
      setCurrent(href)
    }
  }
  return (
    <div style={{ height: 540, display: 'flex', border: '1px solid var(--or-color-border)' }}>
      <SideNav
        aria-label="Navegação do painel"
        currentHref={current}
        header={<strong style={{ fontFamily: 'var(--or-font-display)' }}>Orange Labs</strong>}
        footer={
          <SideNavItem href="#perfil" icon={<Icon name="user" />} onClick={go}>
            Ana Ribeiro
          </SideNavItem>
        }
      >
        <SideNavItem href="#inicio" icon={<Icon name="home" />} onClick={go}>
          Início
        </SideNavItem>
        <SideNavItem href="#caixa" icon={<Icon name="inbox" />} badge={12} onClick={go}>
          Caixa de entrada
        </SideNavItem>
        <SideNavGroup label="Projetos" icon={<Icon name="folder" />}>
          <SideNavItem href="#checkout" onClick={go}>
            Checkout 2.0
          </SideNavItem>
          <SideNavItem href="#app" onClick={go}>
            App mobile
          </SideNavItem>
          <SideNavItem href="#site" onClick={go}>
            Site institucional
          </SideNavItem>
        </SideNavGroup>
        <SideNavGroup label="Relatórios" icon={<Icon name="chart-bar" />}>
          <SideNavItem href="#vendas" onClick={go}>
            Vendas
          </SideNavItem>
          <SideNavItem href="#funil" onClick={go}>
            Funil de conversão
          </SideNavItem>
        </SideNavGroup>
        <SideNavSection title="Configurações">
          <SideNavItem href="#equipe" icon={<Icon name="users" />} onClick={go}>
            Equipe
          </SideNavItem>
          <SideNavItem href="#integracoes" icon={<Icon name="layers" />} disabled>
            Integrações
          </SideNavItem>
        </SideNavSection>
      </SideNav>
      {/* minWidth 0 + overflowWrap: no celular, "#checkout" vazava da caixa do exemplo. */}
      <div style={{ flex: 1, minWidth: 0, padding: 24, color: 'var(--or-color-text-muted)', overflowWrap: 'anywhere' }}>
        Página atual: {current}
      </div>
    </div>
  )
}
