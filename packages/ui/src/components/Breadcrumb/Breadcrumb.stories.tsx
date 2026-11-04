import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '../../icons'
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb'

const items = [
  { label: 'Início', href: '#', icon: <Icon name="home" /> },
  { label: 'Loja', href: '#' },
  { label: 'Eletrônicos', href: '#' },
  { label: 'Notebooks', href: '#' },
  { label: 'Ultrafinos', href: '#' },
  { label: 'Orange Book Air 14"' },
]

const meta = {
  title: 'Componentes/Breadcrumb',
  component: Breadcrumb,
  subcomponents: { BreadcrumbItem } as Record<string, React.ComponentType<unknown>>,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Trilha de navegação: mostra a posição da página na hierarquia. `<nav>` rotulada com `<ol>`, separadores decorativos e o último item com `aria-current="page"`. `maxItems` recolhe os níveis do meio em um botão "…".',
      },
    },
  },
  argTypes: {
    maxItems: { control: { type: 'number', min: 2, max: 8 } },
    itemsBeforeCollapse: { control: { type: 'number', min: 1 } },
    itemsAfterCollapse: { control: { type: 'number', min: 1 } },
  },
  args: {
    items,
  },
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { items: items.slice(0, 4) },
}

export const Collapsed: Story = {
  args: { maxItems: 4 },
}

export const ChevronSeparator: Story = {
  args: { items: items.slice(0, 4), separator: <Icon name="chevron-right" /> },
}

export const WithChildren: Story = {
  args: { items: undefined },
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbItem href="#">Início</BreadcrumbItem>
      <BreadcrumbItem href="#">Central de ajuda</BreadcrumbItem>
      <BreadcrumbItem>Trocas e devoluções</BreadcrumbItem>
    </Breadcrumb>
  ),
}
