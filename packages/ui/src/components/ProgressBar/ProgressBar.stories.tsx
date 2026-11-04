import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { ProgressBar } from './ProgressBar'

const meta = {
  title: 'Componentes/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Barra de progresso linear (`role="progressbar"`) com rótulo visível associado, valor formatado (`aria-valuetext`) e modo indeterminado quando `value` não é informado.',
      },
    },
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    tone: {
      control: 'inline-radio',
      options: ['accent', 'neutral', 'info', 'success', 'warning', 'danger'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    showValue: { control: 'boolean' },
  },
  args: {
    label: 'Enviando arquivos',
    value: 45,
    tone: 'accent',
    size: 'md',
    showValue: true,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Indeterminate: Story = {
  args: { value: undefined, label: 'Preparando exportação' },
}

export const WithDescription: Story = {
  args: {
    label: 'Backup do banco de dados',
    value: 72,
    description: 'Cerca de 2 minutos restantes',
  },
}

export const CustomFormat: Story = {
  args: {
    label: 'Importando contatos',
    value: 320,
    max: 800,
    formatValue: (value: number, { max }: { max: number }) => `${value} de ${max}`,
  },
}

export const Tones: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 20 }}>
      {(['accent', 'neutral', 'info', 'success', 'warning', 'danger'] as const).map((tone) => (
        <ProgressBar key={tone} {...args} tone={tone} label={tone} />
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 20 }}>
      <ProgressBar {...args} size="sm" label="Pequena (4px)" />
      <ProgressBar {...args} size="md" label="Média (8px)" />
    </div>
  ),
}

export const Animated: Story = {
  render: function AnimatedStory(args) {
    const [value, setValue] = useState(0)
    useEffect(() => {
      const timer = setInterval(() => setValue((v) => (v >= 100 ? 0 : v + 5)), 400)
      return () => clearInterval(timer)
    }, [])
    return <ProgressBar {...args} value={value} label="Processando pedidos" />
  },
}
