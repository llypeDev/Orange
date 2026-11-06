import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Icon } from '../../icons'
import { Chip, ChipGroup } from './Chip'

const meta = {
  title: 'Componentes/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Chip selecionável para filtros: um `<button>` com `aria-pressed` e check quando selecionado. Use `ChipGroup` (`role="group"` rotulado) para seleção única ou múltipla.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    children: 'Frete grátis',
    size: 'md',
  },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithIconAndCount: Story = {
  args: { icon: <Icon name="zap" />, count: 18, children: 'Entrega rápida' },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Chip {...args} size="sm" />
      <Chip {...args} size="md" />
      <Chip {...args} size="sm" defaultSelected />
      <Chip {...args} size="md" defaultSelected />
    </div>
  ),
}

export const MultipleGroup: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['eletronicos'])
    return (
      <ChipGroup label="Categorias" value={value} onChange={setValue}>
        <Chip value="eletronicos" count={128}>
          Eletrônicos
        </Chip>
        <Chip value="casa" count={86}>
          Casa
        </Chip>
        <Chip value="moda" count={240}>
          Moda
        </Chip>
        <Chip value="esporte" count={0} disabled>
          Esporte
        </Chip>
      </ChipGroup>
    )
  },
}

export const SingleGroup: Story = {
  render: () => (
    <ChipGroup selectionMode="single" label="Período" defaultValue="30d">
      <Chip value="7d">7 dias</Chip>
      <Chip value="30d">30 dias</Chip>
      <Chip value="90d">90 dias</Chip>
      <Chip value="12m">12 meses</Chip>
    </ChipGroup>
  ),
}
