import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { NavigationMenu, type NavigationMenuItem } from './NavigationMenu'

const siteItems: NavigationMenuItem[] = [
  {
    id: 'produtos',
    label: 'Produtos',
    description: 'Tudo o que sua empresa precisa para vender online e na loja física.',
    columns: 2,
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
      {
        label: 'Relatórios',
        href: '/produtos/relatorios',
        description: 'Vendas, margem e ticket médio por canal.',
        icon: 'chart-bar',
      },
    ],
  },
  {
    id: 'solucoes',
    label: 'Soluções',
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
    ],
  },
  {
    id: 'recursos',
    label: 'Recursos',
    items: [
      {
        label: 'Central de ajuda',
        href: '/recursos/ajuda',
        description: 'Guias passo a passo e perguntas frequentes.',
      },
      {
        label: 'Blog',
        href: '/recursos/blog',
        description: 'Novidades do produto e casos de clientes.',
      },
      {
        label: 'Webinars',
        href: '/recursos/webinars',
        description: 'Aulas ao vivo toda quinta-feira.',
      },
      { label: 'Status dos serviços', href: '/recursos/status' },
    ],
  },
  { label: 'Preços', href: '/precos' },
]

const meta = {
  title: 'Componentes/NavigationMenu',
  component: NavigationMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Navegação de site/aplicação com painéis de links (submenus e pequenos mega-menus), no padrão **Disclosure Navigation Menu** do WAI-ARIA APG — não é o menu/menubar. Uma `<nav>` rotulada com lista: links do topo (`aria-current="page"`) e botões com `aria-expanded`/`aria-controls` que mostram um painel de links (com descrição, ícone e grupos em colunas). Um painel por vez; Esc fecha e devolve o foco ao botão; clique ou foco fora fecham; ←/→ entre itens, ↓ entra no painel, ↑/↓ e Home/End nos links. O painel fica logo depois do botão no DOM (ordem de Tab do APG) e é posicionado com Floating UI abaixo dele. Abre só por clique/Enter/Espaço — sem hover.',
      },
    },
  },
  argTypes: {
    currentHref: { control: 'text' },
    defaultOpenItem: { control: 'inline-radio', options: ['produtos', 'solucoes', 'recursos'] },
    onOpenItemChange: { action: 'openItemChange' },
  },
  args: {
    items: siteItems,
    currentHref: '/produtos/pagamentos',
    'aria-label': 'Navegação do site',
  },
  decorators: [
    // Reserva espaço para o painel aberto (ele fica por cima da página).
    (Story) => (
      <div style={{ minHeight: 440 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NavigationMenu>

export default meta
type Story = StoryObj<typeof meta>

/** Painel "Produtos" aberto para a baseline visual (duas colunas, ícones e descrições). */
export const Default: Story = {
  args: { defaultOpenItem: 'produtos' },
}

export const Closed: Story = {}

/** Grupos com título viram colunas; cada lista é rotulada pelo título do grupo. */
export const Groups: Story = {
  args: { defaultOpenItem: 'solucoes', currentHref: '/solucoes/varejo' },
}

/** `openItem` + `onOpenItemChange`: o painel aberto vem do estado da aplicação. */
export const Controlled: Story = {
  render: (args) => {
    const [openItem, setOpenItem] = useState<string | null>('recursos')
    return (
      <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
        <p style={{ margin: 0 }}>
          Painel aberto: <strong>{openItem ?? 'nenhum'}</strong>
        </p>
        <NavigationMenu {...args} openItem={openItem} onOpenItemChange={setOpenItem} />
      </div>
    )
  },
}
