import type { Meta, StoryObj } from '@storybook/react-vite'
import { Switch } from './Switch'

const meta = {
  title: 'Componentes/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Liga/desliga uma configuração com efeito imediato. `<button role="switch">` com `aria-checked`, trilho e polegar quadrados, laranja quando ligado.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    labelPosition: { control: 'inline-radio', options: ['end', 'start'] },
    onCheckedChange: { action: 'checkedChange' },
  },
  args: {
    label: 'Notificações por e-mail',
    size: 'md',
    labelPosition: 'end',
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = {
  args: { defaultChecked: true },
}

export const WithDescription: Story = {
  args: {
    label: 'Backup automático',
    description: 'Salvamos uma cópia dos seus arquivos todos os dias às 3h.',
    defaultChecked: true,
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Switch {...args} size="sm" label="Pequeno (sm)" defaultChecked />
      <Switch {...args} size="md" label="Médio (md)" defaultChecked />
    </div>
  ),
}

export const SettingsList: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 20, maxWidth: 420 }}>
      <Switch labelPosition="start" label="Comentários" description="Avise quando alguém comentar nos meus projetos." defaultChecked />
      <Switch labelPosition="start" label="Menções" description="Avise quando alguém me mencionar." defaultChecked />
      <Switch labelPosition="start" label="Resumo semanal" description="Um e-mail toda segunda-feira." />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Switch label="Desabilitado" disabled />
      <Switch label="Desabilitado ligado" disabled defaultChecked />
    </div>
  ),
}
