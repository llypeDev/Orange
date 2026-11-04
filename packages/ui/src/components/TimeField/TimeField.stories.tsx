import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { TimeField } from './TimeField'

const meta = {
  title: 'Componentes/TimeField',
  component: TimeField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Campo de horário baseado no `<input type="time">` nativo, com a aparência do Orange. Valor em string `HH:mm`; `min`, `max` e `step` (em segundos) seguem o atributo nativo.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    onChange: { action: 'change' },
  },
  args: {
    label: 'Horário de início',
    size: 'md',
  },
} satisfies Meta<typeof TimeField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithValue: Story = {
  args: { defaultValue: '09:30', description: 'Horário de Brasília (UTC−3).' },
}

export const BusinessHours: Story = {
  args: {
    label: 'Horário da reunião',
    description: 'Entre 08:00 e 18:00, em intervalos de 15 minutos.',
    min: '08:00',
    max: '18:00',
    step: 900,
    defaultValue: '10:15',
  },
}

export const Controlled: Story = {
  render: function Render(args) {
    const [time, setTime] = useState('14:00')
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <TimeField {...args} value={time} onChange={setTime} />
        <small>Valor: {time || 'vazio'}</small>
      </div>
    )
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <TimeField {...args} size="sm" label="Pequeno" defaultValue="08:00" />
      <TimeField {...args} size="md" label="Médio" defaultValue="12:30" />
      <TimeField {...args} size="lg" label="Grande" defaultValue="18:45" />
    </div>
  ),
}

export const States: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <TimeField {...args} label="Obrigatório" required />
      <TimeField
        {...args}
        label="Com erro"
        defaultValue="22:00"
        error="Fora do horário comercial"
      />
      <TimeField {...args} label="Desabilitado" defaultValue="09:00" disabled />
      <TimeField {...args} label="Somente leitura" defaultValue="09:00" readOnly />
    </div>
  ),
}
