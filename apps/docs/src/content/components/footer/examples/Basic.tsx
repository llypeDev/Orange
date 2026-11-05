import { Footer, Icon } from '@orangesys/ui'

export default function Basic() {
  return (
    <Footer
      brand={
        <a href="#inicio" aria-label="Aurora Commerce — início">
          <Icon name="layers" /> Aurora
        </a>
      }
      navLabel="Mapa do site da Aurora"
      description="Gestão de pedidos, estoque e entregas para lojas independentes."
      columns={[
        {
          title: 'Produto',
          links: [
            { label: 'Pedidos', href: '#pedidos' },
            { label: 'Catálogo', href: '#catalogo' },
            { label: 'Estoque', href: '#estoque' },
            { label: 'Relatórios', href: '#relatorios' },
          ],
        },
        {
          title: 'Para lojistas',
          links: [
            { label: 'Planos e preços', href: '#planos' },
            { label: 'Integrações', href: '#integracoes' },
            { label: 'Casos de sucesso', href: '#casos' },
          ],
        },
        {
          title: 'Ajuda',
          links: [
            { label: 'Central de ajuda', href: '#ajuda' },
            { label: 'Fale com o suporte', href: '#suporte' },
            { label: 'Status do serviço', href: 'https://status.example.com', external: true },
          ],
        },
        {
          title: 'Empresa',
          links: [
            { label: 'Sobre', href: '#sobre' },
            { label: 'Carreiras', href: '#carreiras' },
            { label: 'Imprensa', href: '#imprensa' },
          ],
        },
        {
          title: 'Desenvolvedores',
          links: [
            { label: 'Documentação da API', href: 'https://docs.example.com', external: true },
            {
              label: 'Webhooks de pedidos',
              href: 'https://docs.example.com/webhooks',
              external: true,
            },
          ],
        },
      ]}
      bottom={
        <>
          <span>© 2026 Aurora Commerce</span>
          <span>
            <a href="#termos">Termos de uso</a> · <a href="#privacidade">Privacidade</a>
          </span>
        </>
      }
    />
  )
}
