import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Spinner } from './Spinner'

const meta = {
  title: 'Componentes/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Indicador circular para esperas curtas de duração desconhecida. Anuncia `role="status"` com o rótulo `Carregando…` (ou `label`). Use `decorative` quando um texto visível já informa o carregamento.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    tone: { control: 'inline-radio', options: ['accent', 'neutral', 'current'] },
    label: { control: 'text' },
    decorative: { control: 'boolean' },
  },
  args: {
    size: 'md',
    tone: 'accent',
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Spinner {...args} size="sm" />
      <Spinner {...args} size="md" />
      <Spinner {...args} size="lg" />
    </div>
  ),
}

export const Tones: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Spinner {...args} tone="accent" />
      <Spinner {...args} tone="neutral" />
      <span style={{ color: 'var(--or-color-info-text)' }}>
        <Spinner {...args} tone="current" />
      </span>
    </div>
  ),
}

export const WithVisibleText: Story = {
  render: (args) => (
    <p role="status" style={{ display: 'flex', gap: 8, alignItems: 'center', margin: 0 }}>
      <Spinner {...args} size="sm" decorative />
      Sincronizando contatos…
    </p>
  ),
}

export const InsideButton: Story = {
  render: () => (
    <Button
      variant="outline"
      startIcon={<Spinner size="sm" tone="current" decorative />}
      aria-busy="true"
    >
      Gerando relatório
    </Button>
  ),
}
