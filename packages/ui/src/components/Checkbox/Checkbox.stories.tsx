import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Checkbox } from './Checkbox'
import { CheckboxGroup } from './CheckboxGroup'

const meta = {
  title: 'Componentes/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Caixa de seleção nativa estilizada (quadrada, preenchimento laranja). Use sozinha para aceites e preferências, ou dentro de `CheckboxGroup` (fieldset/legend) para escolhas múltiplas.',
      },
    },
  },
  argTypes: {
    onChange: { action: 'change' },
  },
  args: {
    label: 'Receber o resumo semanal por e-mail',
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithDescription: Story = {
  args: {
    label: 'Tornar o projeto público',
    description: 'Qualquer pessoa com o link poderá ver, mas não editar.',
  },
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Checkbox label="Desmarcado" />
      <Checkbox label="Marcado" defaultChecked />
      <Checkbox label="Misto (indeterminate)" indeterminate />
      <Checkbox label="Obrigatório" required />
      <Checkbox label="Aceito os termos" error="Você precisa aceitar os termos para continuar." />
      <Checkbox label="Desabilitado" disabled />
      <Checkbox label="Desabilitado marcado" disabled defaultChecked />
    </div>
  ),
}

const team = ['Ana', 'Bruno', 'Carla']

function SelectAllDemo() {
  const [selected, setSelected] = useState<string[]>(['Ana'])
  const all = selected.length === team.length
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <Checkbox
        label="Selecionar toda a equipe"
        checked={all}
        indeterminate={selected.length > 0 && !all}
        onCheckedChange={(checked) => setSelected(checked ? team : [])}
      />
      <div style={{ paddingLeft: 36 }}>
        <CheckboxGroup label="Equipe" hideLabel value={selected} onChange={setSelected} options={team.map((n) => ({ value: n, label: n }))} />
      </div>
    </div>
  )
}

export const SelectAll: Story = {
  render: () => <SelectAllDemo />,
}

export const Group: Story = {
  render: () => (
    <CheckboxGroup
      label="Como prefere ser avisado?"
      description="Você pode mudar isso depois em Configurações."
      defaultValue={['email']}
      options={[
        { value: 'email', label: 'E-mail' },
        { value: 'sms', label: 'SMS', description: 'Pode haver cobrança da operadora.' },
        { value: 'push', label: 'Notificação no app' },
        { value: 'whatsapp', label: 'WhatsApp', disabled: true },
      ]}
    />
  ),
}

export const GroupHorizontal: Story = {
  render: () => (
    <CheckboxGroup
      label="Dias de entrega"
      orientation="horizontal"
      required
      error="Escolha pelo menos um dia."
      options={['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].map((d) => ({ value: d.toLowerCase(), label: d }))}
    />
  ),
}
