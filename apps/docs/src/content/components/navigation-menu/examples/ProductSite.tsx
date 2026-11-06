import { NavigationMenu } from '@orangesys/ui'

export default function ProductSite() {
  return (
    <NavigationMenu
      aria-label="Navegação do site"
      currentHref="/precos"
      items={[
        {
          id: 'produtos',
          label: 'Produtos',
          items: [
            {
              label: 'Loja virtual',
              href: '/produtos/loja-virtual',
              description: 'Catálogo, carrinho e checkout em um só lugar.',
              icon: 'tag',
            },
            {
              label: 'Pagamentos',
              href: '/produtos/pagamentos',
              description: 'Pix, cartão e boleto com conciliação automática.',
              icon: 'zap',
            },
            {
              label: 'Estoque',
              href: '/produtos/estoque',
              description: 'Saldo por depósito e alertas de reposição.',
              icon: 'layers',
            },
          ],
        },
        {
          id: 'recursos',
          label: 'Recursos',
          items: [
            { label: 'Central de ajuda', href: '/recursos/ajuda' },
            { label: 'Blog', href: '/recursos/blog' },
            { label: 'Webinars', href: '/recursos/webinars' },
            { label: 'Status dos serviços', href: '/recursos/status' },
          ],
        },
        { label: 'Clientes', href: '/clientes' },
        { label: 'Preços', href: '/precos' },
      ]}
    />
  )
}
