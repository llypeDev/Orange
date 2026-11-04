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
