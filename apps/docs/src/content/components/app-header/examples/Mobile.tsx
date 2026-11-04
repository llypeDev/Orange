import { AppHeader, Button, Icon } from '@orange/ui'

export default function Mobile() {
  return (
    // Largura de celular: a navegação vai para o painel do botão "Menu".
    <div style={{ width: 360, maxWidth: '100%', minHeight: 380, border: '1px solid var(--or-color-border)' }}>
      <AppHeader
        defaultMenuOpen
        navLabel="Navegação da loja"
        brand={<a href="#loja">Aurora</a>}
        items={[
          { label: 'Novidades', href: '#novidades' },
          { label: 'Feminino', href: '#feminino' },
          { label: 'Masculino', href: '#masculino' },
          { label: 'Ofertas', href: '#ofertas' },
        ]}
        currentHref="#novidades"
        actions={<Button variant="ghost" iconOnly aria-label="Sacola, 2 itens" startIcon={<Icon name="tag" />} />}
        menuFooter={
          <Button block variant="outline">
            Entrar
          </Button>
        }
      />
    </div>
  )
}
