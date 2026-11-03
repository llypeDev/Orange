import { AppHeader, Button, Icon } from '@orange/ui'

function UserBadge() {
  return (
    <span
      title="Ana Ribeiro"
      style={{
        display: 'inline-grid',
        placeItems: 'center',
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: 'var(--or-color-accent)',
        color: 'var(--or-color-text-on-accent)',
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      <span aria-hidden="true">AR</span>
      <span className="or-visually-hidden">Conta de Ana Ribeiro</span>
    </span>
  )
}

export default function Basic() {
  return (
    <AppHeader
      collapseBelow="sm"
      navLabel="Navegação do Analytics"
      brand={
        <a href="#inicio" aria-label="Orange Analytics — início">
          <Icon name="chart-bar" /> Analytics
        </a>
      }
      items={[
        { label: 'Painel', href: '#painel' },
        { label: 'Campanhas', href: '#campanhas' },
        { label: 'Público', href: '#publico' },
        { label: 'Relatórios', href: '#relatorios' },
      ]}
      currentHref="#campanhas"
      actions={
        <>
          <Button variant="ghost" iconOnly aria-label="Buscar" startIcon={<Icon name="search" />} />
          <Button variant="ghost" iconOnly aria-label="Notificações" startIcon={<Icon name="bell" />} />
          <UserBadge />
        </>
      }
    />
  )
}
