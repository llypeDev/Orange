import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Rating } from './Rating'

const meta = {
  title: 'Componentes/Rating',
  component: Rating,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Avaliação por estrelas feita com rádios nativos visualmente ocultos — as setas do teclado funcionam como em qualquer grupo de rádios. Em `readOnly`, vira uma imagem (`role="img"`) com a nota por extenso e aceita frações.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    max: { control: { type: 'number', min: 1, max: 10 } },
    onChange: { action: 'change' },
  },
  args: {
    label: 'Avalie o atendimento',
    max: 5,
    size: 'md',
  },
} satisfies Meta<typeof Rating>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithLabels: Story = {
  args: {
    label: 'Como foi a entrega?',
    labels: ['Péssima', 'Ruim', 'Regular', 'Boa', 'Excelente'],
    defaultValue: 4,
  },
}

export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<number | null>(3)
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <Rating {...args} value={value} onChange={setValue} />
        <small>Nota: {value ?? 'nenhuma'}</small>
      </div>
    )
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Rating {...args} size="sm" label="Pequeno" defaultValue={3} />
      <Rating {...args} size="md" label="Médio" defaultValue={3} />
      <Rating {...args} size="lg" label="Grande" defaultValue={3} />
    </div>
  ),
}

export const ReadOnly: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Rating readOnly value={4.5} />
      <Rating readOnly value={3} size="sm" />
      <Rating readOnly value={7.5} max={10} size="lg" />
    </div>
  ),
}

export const States: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Rating {...args} label="Obrigatório" required description="De 1 a 5 estrelas." />
      <Rating {...args} label="Com erro" error="Dê uma nota antes de enviar" />
      <Rating {...args} label="Desabilitado" disabled defaultValue={2} />
    </div>
  ),
}
