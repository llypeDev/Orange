import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '../Button'
import { Modal, ModalBody, ModalFooter } from '../Modal'
import { TimeField } from './TimeField'

const meta = {
  title: 'Componentes/TimeField',
  component: TimeField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Campo de horário em segmentos (hora, minuto, segundo, AM/PM) com a aparência do Orange, igual em todos os navegadores. O formato (12 ou 24 horas) segue o idioma do `OrangeProvider`; o valor é sempre a string `HH:mm`. As setas respeitam `step` (em segundos), `min` e `max`, e o botão do relógio abre uma lista de horários.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    hourCycle: { control: 'inline-radio', options: [undefined, 12, 24] },
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

/** `hourCycle` força o relógio; sem ele, vale o do idioma (12 horas em inglês americano). */
export const HourCycle: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <TimeField {...args} label="Relógio de 24 horas" hourCycle={24} defaultValue="14:30" />
      <TimeField {...args} label="Relógio de 12 horas" hourCycle={12} defaultValue="14:30" />
    </div>
  ),
}

/** Passo menor que um minuto: aparece o segmento de segundos. */
export const WithSeconds: Story = {
  args: { label: 'Marca de tempo', step: 1, defaultValue: '10:15:30', listStep: false },
}

/** `listStep` muda o intervalo da lista; `false` tira o botão do relógio. */
export const ListStep: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <TimeField {...args} label="Lista de hora em hora" listStep={3600} defaultValue="09:00" />
      <TimeField {...args} label="Sem lista" listStep={false} defaultValue="09:00" />
    </div>
  ),
}

/** Com `min` depois de `max`, o intervalo atravessa a meia-noite. */
export const Overnight: Story = {
  args: {
    label: 'Início do plantão',
    description: 'Entre 22:00 e 06:00.',
    min: '22:00',
    max: '06:00',
    step: 1800,
    defaultValue: '23:30',
  },
}

/** Dentro de um Modal: a lista abre por cima do diálogo e o Escape fecha só a lista. */
export const InsideModal: Story = {
  render: (args) => (
    <Modal title="Agendar reunião" trigger={<Button>Agendar reunião</Button>}>
      {({ close }) => (
        <>
          <ModalBody>
            <TimeField {...args} label="Horário" defaultValue="09:30" />
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={close}>
              Cancelar
            </Button>
            <Button onClick={close}>Agendar</Button>
          </ModalFooter>
        </>
      )}
    </Modal>
  ),
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
      <TimeField
        {...args}
        label="Aviso do próprio campo"
        defaultValue="19:10"
        min="08:00"
        max="18:00"
      />
      <TimeField {...args} label="Desabilitado" defaultValue="09:00" disabled />
      <TimeField {...args} label="Somente leitura" defaultValue="09:00" readOnly />
    </div>
  ),
}
