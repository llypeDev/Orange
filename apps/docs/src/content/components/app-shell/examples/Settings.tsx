import {
  AppShell,
  AppShellNavToggle,
  Button,
  Footer,
  PageHeader,
  SideNav,
  SideNavItem,
  SideNavSection,
  Switch,
  useAppShell,
} from '@orangesys/ui'

/** Cabeçalho próprio: o botão de menu só aparece quando a navegação vai para o painel. */
function SettingsHeader() {
  const { isCompact } = useAppShell()
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 56, padding: '0 16px' }}
    >
      {isCompact && <AppShellNavToggle />}
      <strong style={{ fontFamily: 'var(--or-font-display)' }}>Configurações da loja</strong>
    </div>
  )
}

export default function Settings() {
  return (
    <div style={{ height: 560, border: '1px solid var(--or-color-border)' }}>
      <AppShell
        mainElement="div"
        fullHeight={false}
        navDrawerBelow="md"
        header={<SettingsHeader />}
        navLabel="Seções das configurações"
        navTitle="Configurações"
        navigation={
          <SideNav currentHref="#notificacoes">
            <SideNavSection title="Loja">
              <SideNavItem href="#geral">Geral</SideNavItem>
              <SideNavItem href="#pagamentos">Pagamentos</SideNavItem>
              <SideNavItem href="#entregas">Entregas</SideNavItem>
            </SideNavSection>
            <SideNavSection title="Conta">
              <SideNavItem href="#equipe">Equipe</SideNavItem>
              <SideNavItem href="#notificacoes">Notificações</SideNavItem>
            </SideNavSection>
          </SideNav>
        }
        footer={<Footer bottom={<span>Alterações são salvas para todas as unidades.</span>} />}
      >
        <PageHeader
          headingLevel={2}
          title="Notificações"
          description="Escolha quando a equipe recebe avisos por e-mail."
          divider
          actions={<Button>Salvar</Button>}
        />
        <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
          <Switch label="Novo pedido recebido" defaultChecked />
          <Switch label="Estoque abaixo do mínimo" defaultChecked />
          <Switch label="Resumo semanal de vendas" />
        </div>
      </AppShell>
    </div>
  )
}
