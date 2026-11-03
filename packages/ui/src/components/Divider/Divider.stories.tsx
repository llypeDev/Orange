import type { Meta, StoryObj } from '@storybook/react-vite'
import { Divider } from './Divider'

const meta = {
  title: 'Componentes/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Separa visualmente grupos de conteúdo. Usa `<hr>` ou `role="separator"`; marque como `decorative` quando a separação for apenas estética.',
      },
    },
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    tone: { control: 'inline-radio', options: ['subtle', 'default', 'strong', 'accent'] },
    thickness: { control: 'inline-radio', options: ['thin', 'thick'] },
    spacing: { control: 'select', options: [0, 1, 2, 3, 4, 6, 8] },
    labelPosition: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    label: { control: 'text' },
    decorative: { control: 'boolean' },
  },
  args: {
    orientation: 'horizontal',
    tone: 'default',
    thickness: 'thin',
    spacing: 4,
  },
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <p>Dados da conta</p>
      <Divider {...args} />
      <p>Preferências de notificação</p>
    </div>
  ),
}

export const Tones: Story = {
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      {(['subtle', 'default', 'strong', 'accent'] as const).map((tone) => (
        <Divider key={tone} {...args} tone={tone} label={tone} />
      ))}
    </div>
  ),
}

export const WithLabel: Story = {
  args: { label: 'ou continue com' },
  render: (args) => (
    <div style={{ maxWidth: 400 }}>
      <Divider {...args} />
    </div>
  ),
}

export const LabelPositions: Story = {
  render: (args) => (
    <div style={{ maxWidth: 480 }}>
      <Divider {...args} label="Início" labelPosition="start" />
      <Divider {...args} label="Centro" labelPosition="center" />
      <Divider {...args} label="Fim" labelPosition="end" />
    </div>
  ),
}

export const Vertical: Story = {
  args: { orientation: 'vertical', spacing: 3 },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', height: 24 }}>
      <span>Editar</span>
      <Divider {...args} />
      <span>Duplicar</span>
      <Divider {...args} />
      <span>Arquivar</span>
    </div>
  ),
}

export const Decorative: Story = {
  args: { decorative: true, tone: 'accent', thickness: 'thick' },
  render: (args) => (
    <div style={{ maxWidth: 120 }}>
      <Divider {...args} />
    </div>
  ),
}
