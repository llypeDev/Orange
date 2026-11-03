import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { InlineEdit } from './InlineEdit'

const meta = {
  title: 'Componentes/InlineEdit',
  component: InlineEdit,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Edição no lugar: o valor aparece como botão ("Editar <rótulo>: <valor>") e vira um campo ao ser ativado. Enter ou sair do campo salva, Escape cancela e devolve o foco. `onSave` pode ser assíncrono e `validate` bloqueia valores inválidos.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    onSave: { action: 'save' },
    onCancel: { action: 'cancel' },
  },
  args: {
    label: 'Nome do projeto',
    defaultValue: 'Orange Pay',
    size: 'md',
  },
} satisfies Meta<typeof InlineEdit>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithLabel: Story = {
  args: { showLabel: true },
}

export const WithButtons: Story = {
  args: { showLabel: true, showButtons: true },
}

export const Placeholder: Story = {
  args: { label: 'Descrição', defaultValue: '', placeholder: 'Adicionar descrição' },
}

export const AsyncSave: Story = {
  render: function Render(args) {
    const [name, setName] = useState('Orange Pay')
    return (
      <InlineEdit
        {...args}
        showLabel
        value={name}
        onSave={(next) =>
          new Promise<void>((resolve, reject) =>
            setTimeout(() => {
              if (next.toLowerCase().includes('erro')) reject(new Error('Esse nome já está em uso'))
              else {
                setName(next)
                resolve()
              }
            }, 1200),
          )
        }
      />
    )
  },
}

export const Validation: Story = {
  args: {
    label: 'E-mail de cobrança',
    defaultValue: 'financeiro@orange.dev',
    showLabel: true,
    validate: (value: string) =>
      /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value) ? null : 'Informe um e-mail válido',
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <InlineEdit {...args} size="sm" />
      <InlineEdit {...args} size="md" />
      <InlineEdit {...args} size="lg" />
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true, showLabel: true },
}
