import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { SplitButton } from './SplitButton'

const meta = {
  title: 'Componentes/SplitButton',
  component: SplitButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Ação principal + seta que abre um menu de ações relacionadas (padrão menu button do WAI-ARIA). A seta tem `aria-haspopup="menu"`, `aria-expanded` e o rótulo "Mais ações". O menu responde a ↑/↓, Home/End, Enter/Espaço, Escape e busca por letra.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'outline'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    placement: { control: 'inline-radio', options: ['bottom-end', 'bottom-start'] },
    disabled: { control: 'boolean' },
    onClick: { action: 'click' },
    onOpenChange: { action: 'openChange' },
  },
  args: {
    children: 'Publicar',
    variant: 'primary',
    size: 'md',
    actions: [
      { label: 'Salvar como rascunho', icon: 'file', onSelect: fn() },
      { label: 'Agendar publicação', icon: 'calendar', onSelect: fn() },
      { label: 'Enviar para revisão', icon: 'send', onSelect: fn() },
      { label: 'Publicar em todos os canais', icon: 'globe', onSelect: fn(), disabled: true },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 240 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SplitButton>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const Outline: Story = {
  args: { variant: 'outline', children: 'Exportar CSV' },
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Mesclar' },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
      <SplitButton {...args} size="sm" />
      <SplitButton {...args} size="md" />
      <SplitButton {...args} size="lg" />
    </div>
  ),
}

export const Open: Story = {
  args: { defaultOpen: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}

/** Muitas ações: o menu para em 24rem (como o do Dropdown) e rola. */
export const ManyActions: Story = {
  args: {
    children: 'Exportar',
    actions: [
      'PDF',
      'CSV',
      'XLSX',
      'JSON',
      'XML',
      'Markdown',
      'HTML',
      'Imagem PNG',
      'Imagem SVG',
      'Texto puro',
      'Planilha ODS',
      'Documento ODT',
      'Arquivo ZIP',
      'Pacote do projeto',
    ].map((format) => ({ label: `Exportar como ${format}`, onSelect: fn() })),
  },
}
