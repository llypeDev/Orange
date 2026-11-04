import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { ProgressCircle } from './ProgressCircle'

const meta = {
  title: 'Componentes/ProgressCircle',
  component: ProgressCircle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Progresso circular em SVG (`role="progressbar"`), determinado ou indeterminado, com valor central opcional e traço de terminação quadrada.',
      },
    },
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    tone: {
      control: 'inline-radio',
      options: ['accent', 'neutral', 'info', 'success', 'warning', 'danger'],
    },
    showValue: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    value: 62,
    size: 'md',
    tone: 'accent',
    showValue: true,
    label: 'Enviando contrato',
  },
} satisfies Meta<typeof ProgressCircle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Indeterminate: Story = {
  args: { value: undefined, label: 'Sincronizando agenda' },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <ProgressCircle {...args} size="sm" />
      <ProgressCircle {...args} size="md" />
      <ProgressCircle {...args} size="lg" />
    </div>
  ),
}

export const Tones: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      {(['accent', 'neutral', 'info', 'success', 'warning', 'danger'] as const).map((tone) => (
        <ProgressCircle key={tone} {...args} tone={tone} label={tone} />
      ))}
    </div>
  ),
}

export const Animated: Story = {
  render: function AnimatedStory(args) {
    const [value, setValue] = useState(0)
    useEffect(() => {
      const timer = setInterval(() => setValue((v) => (v >= 100 ? 0 : v + 4)), 300)
      return () => clearInterval(timer)
    }, [])
    return <ProgressCircle {...args} size="lg" value={value} />
  },
}
