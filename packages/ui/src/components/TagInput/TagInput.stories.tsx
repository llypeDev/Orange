import type { Meta, StoryObj } from '@storybook/react-vite'
import { TagInput } from './TagInput'

const meta = {
  title: 'Componentes/TagInput',
  component: TagInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Campo para várias palavras-chave: Enter ou vírgula cria a tag, Backspace com o campo vazio remove a última e colar texto separado por vírgulas cria várias de uma vez. Duplicadas são recusadas.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    maxTags: { control: 'number' },
    allowDuplicates: { control: 'boolean' },
    addOnBlur: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onChange: { action: 'change' },
  },
  args: {
    label: 'Palavras-chave',
    description: 'Pressione Enter ou vírgula para adicionar.',
    placeholder: 'Ex.: design, acessibilidade',
    size: 'md',
  },
  decorators: [(Story) => <div style={{ maxWidth: 440 }}>{Story()}</div>],
} satisfies Meta<typeof TagInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithTags: Story = {
  args: { defaultValue: ['design system', 'react', 'acessibilidade'] },
}

export const MaxTags: Story = {
  args: { maxTags: 5, defaultValue: ['vendas', 'marketing'] },
}

export const EmailValidation: Story = {
  args: {
    label: 'Convidar pessoas',
    description: 'Cole uma lista de e-mails separados por vírgula.',
    placeholder: 'nome@empresa.com',
    separators: ['Enter', ',', 'Tab', ' '],
    validate: (tag: string) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tag) ? true : `"${tag}" não é um e-mail válido`),
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <TagInput {...args} size="sm" label="Pequeno" defaultValue={['ux', 'ui']} />
      <TagInput {...args} size="md" label="Médio" defaultValue={['ux', 'ui']} />
      <TagInput {...args} size="lg" label="Grande" defaultValue={['ux', 'ui']} />
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: ['bloqueado'] },
}
