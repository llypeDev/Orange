import type { Meta, StoryObj } from '@storybook/react-vite'
import { MultiSelect, type MultiSelectOption } from './MultiSelect'

const habilidades: MultiSelectOption[] = [
  { value: 'react', label: 'React' },
  { value: 'ts', label: 'TypeScript' },
  { value: 'node', label: 'Node.js' },
  { value: 'css', label: 'CSS' },
  { value: 'a11y', label: 'Acessibilidade', description: 'WCAG, WAI-ARIA, leitores de tela' },
  { value: 'testes', label: 'Testes automatizados' },
  { value: 'figma', label: 'Figma' },
  { value: 'sql', label: 'SQL' },
  { value: 'go', label: 'Go', disabled: true, description: 'Sem vagas no momento' },
]

const meta = {
  title: 'Componentes/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Combobox de seleção múltipla: a lista fica aberta enquanto se escolhe e os itens aparecem como chips removíveis. Backspace com o campo vazio remove o último.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    maxSelected: { control: 'number' },
    disabled: { control: 'boolean' },
    onChange: { action: 'change' },
  },
  args: {
    label: 'Habilidades',
    placeholder: 'Buscar habilidades',
    options: habilidades,
    size: 'md',
  },
  decorators: [(Story) => <div style={{ maxWidth: 420, minHeight: 380 }}>{Story()}</div>],
} satisfies Meta<typeof MultiSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithValues: Story = {
  args: { defaultValue: ['react', 'ts', 'a11y'] },
}

export const MaxSelected: Story = {
  args: { maxSelected: 3, description: 'Escolha até 3 habilidades principais.', defaultValue: ['react', 'css'] },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <MultiSelect {...args} size="sm" label="Pequeno" defaultValue={['react', 'ts']} />
      <MultiSelect {...args} size="md" label="Médio" defaultValue={['react', 'ts']} />
      <MultiSelect {...args} size="lg" label="Grande" defaultValue={['react', 'ts']} />
    </div>
  ),
}

export const Invalid: Story = {
  args: { required: true, error: 'Escolha ao menos uma habilidade.' },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: ['node', 'sql'] },
}
