import { AppHeader, Button, Icon } from '@orangesys/ui'

export default function Submenus() {
  return (
    <AppHeader
      collapseBelow="sm"
      navLabel="Navegação do site"
      brand={
        <a href="#inicio" aria-label="Vitrine — início">
          <Icon name="sparkle" /> Vitrine
        </a>
      }
      currentHref="#pagamentos"
      items={[
        {
          label: 'Produtos',
          href: '#produtos',
          columns: 2,
          items: [
            {
              label: 'Loja virtual',
              href: '#loja-virtual',
              description: 'Catálogo, carrinho e checkout.',
              icon: 'tag',
            },
            {
              label: 'Pagamentos',
              href: '#pagamentos',
              description: 'Pix, cartão e boleto.',
              icon: 'zap',
            },
            {
              label: 'Estoque',
              href: '#estoque',
              description: 'Saldo por depósito e reposição.',
              icon: 'layers',
            },
            {
              label: 'Relatórios',
              href: '#relatorios',
              description: 'Vendas e margem por canal.',
              icon: 'chart-bar',
            },
          ],
        },
        {
          label: 'Soluções',
          href: '#solucoes',
          items: [
            {
              label: 'Por setor',
              items: [
                { label: 'Varejo', href: '#varejo' },
                { label: 'Alimentação', href: '#alimentacao' },
                { label: 'Educação', href: '#educacao' },
              ],
            },
            {
              label: 'Por porte',
              items: [
                { label: 'Pequenas empresas', href: '#pequenas-empresas' },
                { label: 'Grandes contas', href: '#grandes-contas' },
              ],
            },
          ],
        },
        {
          label: 'Recursos',
          href: '#recursos',
          items: [
            { label: 'Central de ajuda', href: '#ajuda' },
            { label: 'Blog', href: '#blog' },
            { label: 'Webinars', href: '#webinars' },
          ],
        },
        { label: 'Preços', href: '#precos' },
      ]}
      actions={
        <Button variant="ghost" iconOnly aria-label="Buscar" startIcon={<Icon name="search" />} />
      }
      menuFooter={
        <Button block variant="outline">
          Entrar
        </Button>
      }
    />
  )
}
