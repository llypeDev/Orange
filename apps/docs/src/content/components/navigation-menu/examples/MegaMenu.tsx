import { NavigationMenu } from '@orangesys/ui'

export default function MegaMenu() {
  return (
    <NavigationMenu
      aria-label="Navegação do site"
      items={[
        {
          id: 'solucoes',
          label: 'Soluções',
          description: 'Configurações prontas para o seu negócio, do primeiro pedido à expansão.',
          items: [
            {
              label: 'Por setor',
              items: [
                { label: 'Varejo', href: '/solucoes/varejo' },
                { label: 'Alimentação', href: '/solucoes/alimentacao' },
                { label: 'Educação', href: '/solucoes/educacao' },
                { label: 'Serviços', href: '/solucoes/servicos' },
              ],
            },
            {
              label: 'Por porte',
              items: [
                { label: 'Pequenas empresas', href: '/solucoes/pequenas-empresas' },
                { label: 'Médias empresas', href: '/solucoes/medias-empresas' },
                { label: 'Grandes contas', href: '/solucoes/grandes-contas' },
              ],
            },
            {
              label: 'Por canal',
              items: [
                { label: 'Loja física', href: '/solucoes/loja-fisica' },
                { label: 'Marketplaces', href: '/solucoes/marketplaces' },
                { label: 'Vendas pelo WhatsApp', href: '/solucoes/whatsapp' },
              ],
            },
          ],
        },
        {
          id: 'integracoes',
          label: 'Integrações',
          columns: 2,
          items: [
            {
              label: 'ERP',
              href: '/integracoes/erp',
              description: 'Pedidos e notas fiscais sincronizados.',
            },
            {
              label: 'Transportadoras',
              href: '/integracoes/frete',
              description: 'Cotação e etiqueta no pedido.',
            },
            {
              label: 'Contabilidade',
              href: '/integracoes/contabilidade',
              description: 'Exportação mensal automática.',
            },
            {
              label: 'API e webhooks',
              href: '/integracoes/api',
              description: 'Para times de desenvolvimento.',
            },
          ],
        },
        { label: 'Preços', href: '/precos' },
      ]}
    />
  )
}
