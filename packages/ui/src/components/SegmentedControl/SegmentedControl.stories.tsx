import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { SegmentedControl } from './SegmentedControl'

const meta = {
  title: 'Componentes/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Escolha exclusiva entre 2 a 5 opções sempre visíveis. É um `radiogroup` de radios nativos: Tab entra pela opção selecionada e as setas mudam a seleção. O rótulo do grupo é obrigatório.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    fullWidth: { control: 'boolean' },
    iconOnly: { control: 'boolean' },
    hideLabel: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onChange: { action: 'change' },
  },
  args: {
    label: 'Período do relatório',
    defaultValue: 'week',
    size: 'md',
    options: [
      { value: 'day', label: 'Dia' },
      { value: 'week', label: 'Semana' },
      { value: 'month', label: 'Mês' },
      { value: 'year', label: 'Ano' },
    ],
  },
} satisfies Meta<typeof SegmentedControl>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithIcons: Story = {
  args: {
    label: 'Tema',
    defaultValue: 'dark',
    options: [
      { value: 'light', label: 'Claro', icon: 'sun' },
      { value: 'dark', label: 'Escuro', icon: 'moon' },
      { value: 'system', label: 'Sistema', icon: 'monitor' },
    ],
  },
}

export const IconOnly: Story = {
  args: {
    label: 'Visualização',
    hideLabel: true,
    iconOnly: true,
    defaultValue: 'grid',
    options: [
      { value: 'list', label: 'Lista', icon: 'list' },
      { value: 'grid', label: 'Grade', icon: 'grid' },
    ],
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 24 }}>
      <SegmentedControl {...args} size="sm" label="Small" />
      <SegmentedControl {...args} size="md" label="Medium" />
      <SegmentedControl {...args} size="lg" label="Large" />
    </div>
  ),
}

export const FullWidth: Story = {
  args: { fullWidth: true, description: 'Os dados são agregados no fuso horário da conta.' },
}

export const DisabledOption: Story = {
  args: {
    label: 'Cobrança',
    defaultValue: 'monthly',
    options: [
      { value: 'monthly', label: 'Mensal' },
      { value: 'yearly', label: 'Anual' },
      { value: 'lifetime', label: 'Vitalício', disabled: true },
    ],
  },
}

export const Disabled: Story = {
  args: { disabled: true },
}

const cycle = ['day', 'week', 'month', 'year']

function MotionDemo(args: Parameters<typeof SegmentedControl>[0]) {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % cycle.length), 1200)
    return () => clearInterval(timer)
  }, [])
  return (
    <SegmentedControl
      {...args}
      value={cycle[index]}
      onChange={(value) => setIndex(cycle.indexOf(value))}
    />
  )
}

/** Troca a seleção a cada 1,2s para mostrar o indicador deslizando com spring. */
export const Motion: Story = {
  parameters: {
    docs: { description: { story: 'Troca a seleção sozinho para inspecionar o indicador.' } },
  },
  render: (args) => <MotionDemo {...args} />,
}
