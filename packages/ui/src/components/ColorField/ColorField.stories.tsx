import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { ColorField } from './ColorField'

const brand = [
  { value: '#f58549', label: 'Laranja Orange' },
  { value: '#0f0f12', label: 'Carbono' },
  { value: '#f0ebdb', label: 'Papel' },
  { value: '#7fb236', label: 'Verde' },
  { value: '#4a66d4', label: 'Azul' },
  { value: '#e8c15a', label: 'Âmbar' },
  { value: '#ef6a5a', label: 'Vermelho' },
]

const meta = {
  title: 'Componentes/ColorField',
  component: ColorField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Seletor de cor nativo (`<input type="color">`) sincronizado com um campo hexadecimal validado (`#rrggbb`) e uma paleta opcional de cores sugeridas em `radiogroup`.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    onChange: { action: 'change' },
  },
  args: {
    label: 'Cor da marca',
    defaultValue: '#f58549',
    size: 'md',
  },
} satisfies Meta<typeof ColorField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithSwatches: Story = {
  args: {
    label: 'Cor da etiqueta',
    description: 'Escolha uma cor da paleta ou digite um hexadecimal.',
    swatches: brand,
  },
}

export const Controlled: Story = {
  render: function Render(args) {
    const [color, setColor] = useState('#4a66d4')
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <ColorField {...args} value={color} onChange={setColor} swatches={brand} />
        <div
          style={{ width: 120, height: 32, background: color, border: '1px solid currentColor' }}
        />
      </div>
    )
  },
}

export const Empty: Story = {
  args: { defaultValue: '', label: 'Cor de destaque', optional: true },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <ColorField {...args} size="sm" label="Pequeno" />
      <ColorField {...args} size="md" label="Médio" />
      <ColorField {...args} size="lg" label="Grande" />
    </div>
  ),
}

export const States: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <ColorField {...args} label="Com erro" error="Contraste insuficiente com o fundo" />
      <ColorField {...args} label="Desabilitado" disabled swatches={brand.slice(0, 3)} />
      <ColorField {...args} label="Somente leitura" readOnly />
    </div>
  ),
}
