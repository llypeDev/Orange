import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Drawer } from './Drawer'

const meta = {
  title: 'Componentes/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Painel modal que desliza de uma borda (`left`, `right`, `bottom`). Mesmo comportamento do Modal: foco preso e devolvido, Escape, clique no fundo e scroll lock. Use `footer` para ações fixas.',
      },
    },
  },
  argTypes: {
    placement: { control: 'inline-radio', options: ['left', 'right', 'bottom'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'full'] },
    onOpenChange: { action: 'openChange' },
  },
  args: {
    title: 'Filtrar pedidos',
    description: 'Refine a lista por status e período.',
    placement: 'right',
    size: 'md',
  },
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Drawer
      {...args}
      trigger={<Button variant="outline">Abrir filtros</Button>}
      footer={({ close }) => (
        <>
          <Button variant="outline" onClick={close}>
            Limpar
          </Button>
          <Button onClick={close}>Aplicar</Button>
        </>
      )}
    >
      <p>Status, período, responsável e valor do pedido.</p>
    </Drawer>
  ),
}

export const Placements: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12 }}>
      {(['left', 'right', 'bottom'] as const).map((placement) => (
        <Drawer
          key={placement}
          {...args}
          placement={placement}
          title={`Painel ${placement}`}
          trigger={<Button variant="outline">{placement}</Button>}
        >
          <p>Conteúdo do painel.</p>
        </Drawer>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12 }}>
      {(['sm', 'md', 'lg', 'full'] as const).map((size) => (
        <Drawer
          key={size}
          {...args}
          size={size}
          title={`Tamanho ${size}`}
          trigger={<Button variant="outline">{size}</Button>}
        >
          <p>Conteúdo do painel.</p>
        </Drawer>
      ))}
    </div>
  ),
}
