import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentType } from 'react'
import { Slider, type SliderProps, type SliderSingleProps } from './Slider'

/** Args "achatados": o Storybook não lida bem com a união single | range das props. */
type SliderStoryArgs = Omit<SliderSingleProps, 'range' | 'value' | 'defaultValue' | 'onChange' | 'onChangeEnd'> & {
  range?: boolean
  defaultValue?: number | [number, number]
  onChange?: (value: number | [number, number]) => void
  minDistance?: number
}

const StorySlider = Slider as unknown as ComponentType<SliderStoryArgs>
const renderSlider = (args: SliderStoryArgs) => <Slider {...(args as SliderProps)} />

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

const meta = {
  title: 'Componentes/Slider',
  component: StorySlider,
  render: renderSlider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Controle deslizante baseado no `<input type="range">` nativo. Use `range` para dois polegares (mínimo e máximo), `marks` para marcas e `formatValue` para exibir e anunciar o valor formatado.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
    showValue: { control: 'boolean' },
    onChange: { action: 'change' },
  },
  args: {
    label: 'Volume',
    defaultValue: 60,
    size: 'md',
  },
  decorators: [(Story) => <div style={{ maxWidth: 420 }}>{Story()}</div>],
} satisfies Meta<SliderStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Range: Story = {
  args: {
    range: true,
    label: 'Faixa de preço',
    min: 0,
    max: 5000,
    step: 100,
    defaultValue: [800, 3200] as [number, number],
    formatValue: brl,
  },
}

export const WithMarks: Story = {
  args: {
    label: 'Tamanho da equipe',
    min: 1,
    max: 50,
    defaultValue: 10,
    marks: [
      { value: 1, label: '1' },
      { value: 10, label: '10' },
      { value: 25, label: '25' },
      { value: 50, label: '50+' },
    ],
  },
}

export const Steps: Story = {
  args: {
    label: 'Opacidade',
    min: 0,
    max: 100,
    step: 10,
    defaultValue: 70,
    marks: true,
    formatValue: (v: number) => `${v}%`,
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 24 }}>
      {renderSlider({ ...args, size: 'sm', label: 'Pequeno' })}
      {renderSlider({ ...args, size: 'md', label: 'Médio' })}
      {renderSlider({ ...args, size: 'lg', label: 'Grande' })}
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true, description: 'Disponível no plano Pro.' },
}
