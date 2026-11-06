import { AppHeader, Button, Icon } from '@orangesys/ui'

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
      // Uma ação: menu + marca + ação cabem na prévia estreita (celular de 320px).
      actions={<Button variant="ghost" iconOnly aria-label="Buscar" startIcon={<Icon name="search" />} />}
    />
  )
}
