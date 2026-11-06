import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '../../icons'
import { Button } from '../Button'
import { AppHeader } from './AppHeader'

const meta = {
  title: 'Componentes/AppHeader',
  component: AppHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Cabeçalho da aplicação (`<header>`): marca, navegação principal com item atual (`aria-current="page"` e sublinhado laranja) e ações. Abaixo de `collapseBelow`, a navegação vai para um painel aberto pelo botão de menu (`aria-expanded`, `aria-controls`).',
      },
    },
  },
  argTypes: {
    sticky: { control: 'boolean' },
    hideOnScroll: { control: 'boolean' },
    collapseBelow: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    onMenuOpenChange: { action: 'menuOpenChange' },
  },
  args: {
    brand: (
      <a href="#inicio">
        <Icon name="sparkle" /> Orange
      </a>
    ),
    items: [
      { label: 'Painel', href: '#painel' },
      { label: 'Projetos', href: '#projetos' },
      { label: 'Relatórios', href: '#relatorios' },
      { label: 'Equipe', href: '#equipe' },
    ],
    currentHref: '#projetos',
    actions: (
      <>
        <Button variant="ghost" iconOnly aria-label="Buscar" startIcon={<Icon name="search" />} />
        <Button variant="ghost" iconOnly aria-label="Notificações" startIcon={<Icon name="bell" />} />
      </>
    ),
    collapseBelow: 'md',
    sticky: false,
  },
} satisfies Meta<typeof AppHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const MobileMenuOpen: Story = {
  args: { defaultMenuOpen: true, menuFooter: <Button block>Novo projeto</Button> },
  decorators: [
    (Story) => (
      <div style={{ width: 375, minHeight: 420 }}>
        <Story />
      </div>
    ),
  ],
}

export const Sticky: Story = {
  args: { sticky: true },
  render: (args) => (
    <div>
      <AppHeader {...args} />
      <div style={{ height: 1600, padding: 24 }}>Role a página: o cabeçalho continua no topo.</div>
    </div>
  ),
}

export const WithSubmenus: Story = {
  args: {
    items: [
      {
        label: 'Produtos',
        href: '#produtos',
        columns: 2,
        items: [
          { label: 'Loja virtual', href: '#loja-virtual', description: 'Catálogo, carrinho e checkout.', icon: 'tag' },
          { label: 'Pagamentos', href: '#pagamentos', description: 'Pix, cartão e boleto.', icon: 'zap' },
          { label: 'Estoque', href: '#estoque', description: 'Saldo por depósito e reposição.', icon: 'layers' },
          { label: 'Relatórios', href: '#relatorios', description: 'Vendas e margem por canal.', icon: 'chart-bar' },
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
    ],
    currentHref: '#pagamentos',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Itens com `items` viram botões que abrem um submenu (padrão Disclosure Navigation Menu do APG, o mesmo do `NavigationMenu`): painel flutuante encostado na borda do cabeçalho em telas largas; abaixo de `collapseBelow`, seções expansíveis dentro do painel do menu, com a seção da página atual já aberta.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 420 }}>
        <Story />
      </div>
    ),
  ],
}

export const HideOnScroll: Story = {
  args: { hideOnScroll: true },
  parameters: {
    docs: {
      description: {
        story:
          'Role para baixo: depois de 120px o cabeçalho sobe (translateY(-110%), 250ms, ease-in-out); ao rolar para cima ele volta. Com foco dentro dele (Tab) ou com o menu aberto, não some.',
      },
    },
  },
  render: (args) => (
    <div>
      <AppHeader {...args} />
      <div style={{ height: 2400, padding: 24, display: 'grid', alignContent: 'start', gap: 16 }}>
        {Array.from({ length: 12 }, (_, i) => (
          <p key={i} style={{ margin: 0 }}>
            Seção {i + 1}: role para baixo para esconder o cabeçalho e para cima para trazê-lo de volta.
          </p>
        ))}
      </div>
    </div>
  ),
}
