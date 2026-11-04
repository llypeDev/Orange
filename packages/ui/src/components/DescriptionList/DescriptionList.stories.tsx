import type { Meta, StoryObj } from '@storybook/react-vite'
import { DescriptionDetails, DescriptionGroup, DescriptionList, DescriptionTerm } from './DescriptionList'

const items = [
  { term: 'Plano', description: 'Pro anual' },
  { term: 'Usuários', description: '24 de 30 licenças' },
  { term: 'Próxima cobrança', description: '12 de março de 2027' },
  { term: 'Responsáveis', description: ['Ana Souza', 'Bruno Lima'] },
  { term: 'Região dos dados', description: 'São Paulo (sa-east-1)' },
  { term: 'Status', description: 'Ativo' },
]

const meta = {
  title: 'Componentes/DescriptionList',
  component: DescriptionList,
  subcomponents: { DescriptionGroup, DescriptionTerm, DescriptionDetails },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Pares termo/descrição em um `<dl>`, para metadados, especificações e resumos. Layouts horizontal, vertical e em grade com bordas de 1px.',
      },
    },
  },
  argTypes: {
    layout: { control: 'inline-radio', options: ['horizontal', 'vertical', 'grid'] },
    termVariant: { control: 'inline-radio', options: ['eyebrow', 'strong'] },
    columns: { control: 'select', options: [1, 2, 3, 4, 5, 6] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    divided: { control: 'boolean' },
    termWidth: { control: 'text' },
  },
  args: {
    items,
    layout: 'horizontal',
    termVariant: 'eyebrow',
    divided: true,
    size: 'md',
  },
} satisfies Meta<typeof DescriptionList>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {}

export const Vertical: Story = {
  args: { layout: 'vertical', items: items.slice(0, 3) },
}

export const Grid: Story = {
  args: { layout: 'grid', columns: 3 },
}

export const StrongTerms: Story = {
  args: { termVariant: 'strong', divided: false, size: 'sm' },
}

export const Composed: Story = {
  args: { items: undefined, layout: 'grid', columns: 2 },
  render: (args) => (
    <DescriptionList {...args}>
      <DescriptionGroup>
        <DescriptionTerm>Tempo de resposta</DescriptionTerm>
        <DescriptionDetails>1h 12min</DescriptionDetails>
      </DescriptionGroup>
      <DescriptionGroup>
        <DescriptionTerm>Satisfação</DescriptionTerm>
        <DescriptionDetails>94%</DescriptionDetails>
      </DescriptionGroup>
    </DescriptionList>
  ),
}
