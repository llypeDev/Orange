import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextArea } from './TextArea'

const meta = {
  title: 'Componentes/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Campo de texto multilinha para comentários, descrições e mensagens. Pode crescer com o conteúdo (`autoResize`) e mostrar contador de caracteres (`maxLength` + `showCount`).',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    rows: { control: { type: 'number', min: 1, max: 12 } },
    onChange: { action: 'change' },
  },
  args: {
    label: 'Descrição do projeto',
    placeholder: 'Conte em poucas linhas o objetivo do projeto.',
    rows: 3,
    size: 'md',
  },
  decorators: [(Story) => <div style={{ maxWidth: 480 }}>{Story()}</div>],
} satisfies Meta<typeof TextArea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithCount: Story = {
  args: {
    label: 'Bio',
    description: 'Aparece no seu perfil público.',
    maxLength: 160,
    showCount: true,
  },
}

export const AutoResize: Story = {
  args: {
    label: 'Mensagem',
    autoResize: true,
    rows: 2,
    maxRows: 8,
    defaultValue: 'Olá, equipe!\nSegue o resumo da reunião de hoje.',
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <TextArea {...args} size="sm" label="Pequeno (sm)" />
      <TextArea {...args} size="md" label="Médio (md)" />
      <TextArea {...args} size="lg" label="Grande (lg)" />
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <TextArea label="Motivo do cancelamento" required error="Conte o motivo para continuarmos." />
      <TextArea label="Somente leitura" readOnly defaultValue="Contrato assinado em 12/03/2025." />
      <TextArea label="Desabilitado" disabled defaultValue="Edição bloqueada durante a revisão." />
    </div>
  ),
}
