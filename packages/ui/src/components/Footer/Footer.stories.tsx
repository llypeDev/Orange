import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '../../icons'
import { Footer, type FooterColumn } from './Footer'

const columns: FooterColumn[] = [
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
      { label: 'Webhooks de pedidos', href: 'https://docs.example.com/webhooks', external: true },
      { label: 'Changelog', href: '#changelog' },
    ],
  },
]

const meta = {
  title: 'Componentes/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Rodapé do site no formato do zop.dev: marca e frase, mapa do site em colunas com títulos em caixa alta (dentro de um `<nav>` nomeado) e barra inferior. Links externos abrem em nova aba e mantêm o ↗ colado à última palavra; `renderLink` integra o roteador.',
      },
    },
  },
  argTypes: {
    headingLevel: { control: 'inline-radio', options: [2, 3, 4] },
  },
  args: {
    brand: (
      <a href="#inicio" aria-label="Aurora Commerce — início">
        <Icon name="layers" /> Aurora
      </a>
    ),
    description: 'Gestão de pedidos, estoque e entregas para lojas independentes.',
    columns,
    bottom: (
      <>
        <span>© 2026 Aurora Commerce</span>
        <span>
          <a href="#termos">Termos de uso</a> · <a href="#privacidade">Privacidade</a>
        </span>
      </>
    ),
  },
} satisfies Meta<typeof Footer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FewColumns: Story = {
  args: { columns: columns.slice(0, 2) },
}

export const BottomOnly: Story = {
  args: { brand: undefined, description: undefined, columns: undefined },
}

export const WithRouter: Story = {
  args: {
    // Em um app real: renderLink={({ href, ...props }) => <RouterLink to={href} {...props} />}
    renderLink: ({ href, ...props }) => <a href={`#/app${href.replace('#', '/')}`} {...props} />,
  },
}
