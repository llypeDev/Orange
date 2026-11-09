import {
  AppHeader,
  AppShell,
  AppShellNavToggle,
  Icon,
  PageHeader,
  SideNav,
  SideNavItem,
  SideNavSection, Stack,
} from '@orangesys/ui'
import { useState } from 'react'

export default function Collapsible() {
  // Controlado: guarde a preferência (ex.: no localStorage) e restaure na próxima visita.
  const [collapsed, setCollapsed] = useState(true)
  return (
    <Stack gap={3} style={{ width: '100%' }}>
      <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
        Barra lateral: <strong>{collapsed ? 'recolhida' : 'expandida'}</strong>
      </p>
      <div style={{ height: 440, border: '1px solid var(--or-color-border)' }}>
        <AppShell
          mainElement="div"
          fullHeight={false}
          navCollapsed={collapsed}
          onNavCollapsedChange={setCollapsed}
          header={
            <AppHeader
              brand={
                <>
                  <AppShellNavToggle />
                  <a href="#inicio">Aurora</a>
                </>
              }
            />
          }
          navLabel="Navegação dos relatórios"
          navigation={
            <SideNav currentHref="#relatorios" collapsible>
              <SideNavItem href="#inicio" icon={<Icon name="home" />}>
                Início
              </SideNavItem>
              <SideNavItem href="#pedidos" icon={<Icon name="inbox" />}>
                Pedidos
              </SideNavItem>
              <SideNavItem href="#relatorios" icon={<Icon name="chart-bar" />}>
                Relatórios
              </SideNavItem>
              <SideNavSection title="Loja">
                <SideNavItem href="#configuracoes" icon={<Icon name="sliders" />}>
                  Configurações
                </SideNavItem>
              </SideNavSection>
            </SideNav>
          }
        >
          <PageHeader
            headingLevel={2}
            title="Relatórios"
            description="Use o botão do cabeçalho ou o do rodapé da barra: os dois comandam o mesmo estado."
          />
        </AppShell>
      </div>
    </Stack>
  )
}
