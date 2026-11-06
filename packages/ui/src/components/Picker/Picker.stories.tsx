import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Picker, type PickerGroup, type PickerOption } from './Picker'

const visibilidade: PickerOption[] = [
  { value: 'privado', label: 'Privado', icon: 'lock', description: 'Só você e quem você convidar' },
  { value: 'equipe', label: 'Equipe', icon: 'users', description: 'Todos da equipe Produto' },
  {
    value: 'organizacao',
    label: 'Organização',
    icon: 'home',
    description: 'Disponível no plano Empresarial',
    disabled: true,
  },
  { value: 'publico', label: 'Público', icon: 'globe', description: 'Qualquer pessoa com o link' },
]

const regioes: PickerGroup[] = [
  {
    label: 'América do Sul',
    options: [
      { value: 'sa-east-1', label: 'São Paulo', description: 'Menor latência no Brasil' },
      {
        value: 'sa-west-1',
        label: 'Santiago',
        description: 'Em manutenção até 18/11',
        disabled: true,
      },
    ],
  },
  {
    label: 'América do Norte',
    options: [
      { value: 'us-east-1', label: 'Virgínia' },
      { value: 'us-west-2', label: 'Oregon' },
      { value: 'ca-central-1', label: 'Montreal' },
    ],
  },
  {
    label: 'Europa',
    options: [
      { value: 'eu-west-1', label: 'Irlanda' },
      { value: 'eu-central-1', label: 'Frankfurt' },
      { value: 'eu-south-1', label: 'Milão' },
    ],
  },
]

const prioridades: PickerOption[] = [
  { value: 'urgente', label: 'Urgente', icon: 'zap' },
  { value: 'alta', label: 'Alta', icon: 'arrow-up' },
  { value: 'media', label: 'Média', icon: 'minus' },
  { value: 'baixa', label: 'Baixa', icon: 'arrow-down' },
]

const meta = {
  title: 'Componentes/Picker',
  component: Picker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Lista suspensa personalizada, só de seleção (padrão WAI-ARIA "Select-Only Combobox"): o gatilho tem a aparência dos campos e abre uma lista cujas opções podem ter ícone, descrição, estar desabilitadas e agrupadas. Setas, Home/End, PageUp/PageDown e busca por digitação; Enter, Espaço ou Tab escolhem.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    hideLabel: { control: 'boolean' },
    placeholder: { control: 'text' },
    onChange: { action: 'change' },
    onOpenChange: { action: 'openChange' },
  },
  args: {
    label: 'Visibilidade do projeto',
    options: visibilidade,
    defaultValue: 'equipe',
    size: 'md',
  },
  decorators: [(Story) => <div style={{ maxWidth: 380, minHeight: 320 }}>{Story()}</div>],
} satisfies Meta<typeof Picker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Placeholder: Story = {
  args: {
    defaultValue: undefined,
    placeholder: 'Quem pode ver',
    description: 'Você pode mudar depois nas configurações.',
  },
}

export const Groups: Story = {
  args: {
    label: 'Região dos dados',
    options: regioes,
    defaultValue: 'sa-east-1',
    description: 'Onde o banco do projeto fica hospedado.',
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Picker {...args} size="sm" label="Prioridade (sm)" options={prioridades} />
      <Picker {...args} size="md" label="Prioridade (md)" options={prioridades} />
      <Picker {...args} size="lg" label="Prioridade (lg)" options={prioridades} />
    </div>
  ),
  args: { defaultValue: 'alta' },
}

export const Controlled: Story = {
  render: function ControlledStory(args) {
    const [value, setValue] = useState<string | null>('media')
    return (
      <div style={{ display: 'grid', gap: 8 }}>
        <Picker
          {...args}
          label="Prioridade"
          options={prioridades}
          value={value}
          onChange={setValue}
        />
        <span style={{ fontSize: 14 }}>Valor: {value ?? '—'}</span>
      </div>
    )
  },
}

export const Invalid: Story = {
  args: {
    defaultValue: undefined,
    required: true,
    error: 'Escolha quem pode ver o projeto.',
  },
}

export const Disabled: Story = {
  args: { disabled: true },
}
