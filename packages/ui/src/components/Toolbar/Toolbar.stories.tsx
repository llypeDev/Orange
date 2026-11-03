import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '../../icons'
import { Button } from '../Button'
import { IconButton } from '../IconButton/IconButton'
import { ToggleButton } from '../ToggleButton/ToggleButton'
import { ToggleButtonGroup } from '../ToggleButton/ToggleButtonGroup'
import { Toolbar, ToolbarGroup, ToolbarSeparator } from './Toolbar'

const meta = {
  title: 'Componentes/Toolbar',
  component: Toolbar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Barra de ferramentas (`role="toolbar"`) com roving tabindex: a barra é uma única parada de Tab e ←/→ (ou ↑/↓ na vertical), Home e End movem o foco. Use ToolbarGroup e ToolbarSeparator para organizar os itens.',
      },
    },
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    loop: { control: 'boolean' },
    bordered: { control: 'boolean' },
  },
  args: {
    'aria-label': 'Formatação de texto',
    orientation: 'horizontal',
    size: 'sm',
    loop: true,
    bordered: true,
  },
  render: (args) => (
    <Toolbar {...args}>
      <ToolbarGroup aria-label="Histórico">
        <IconButton icon="undo" label="Desfazer" />
        <IconButton icon="redo" label="Refazer" disabled />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToggleButtonGroup type="multiple" aria-label="Estilo" defaultValue={['bold']}>
        <ToggleButton value="bold" iconOnly aria-label="Negrito" startIcon={<Icon name="bold" />} />
        <ToggleButton
          value="italic"
          iconOnly
          aria-label="Itálico"
          startIcon={<Icon name="italic" />}
        />
        <ToggleButton
          value="underline"
          iconOnly
          aria-label="Sublinhado"
          startIcon={<Icon name="underline" />}
        />
      </ToggleButtonGroup>
      <ToolbarSeparator />
      <ToggleButtonGroup type="single" aria-label="Alinhamento" defaultValue="left">
        <ToggleButton
          value="left"
          iconOnly
          aria-label="Alinhar à esquerda"
          startIcon={<Icon name="align-left" />}
        />
        <ToggleButton
          value="center"
          iconOnly
          aria-label="Centralizar"
          startIcon={<Icon name="align-center" />}
        />
        <ToggleButton
          value="right"
          iconOnly
          aria-label="Alinhar à direita"
          startIcon={<Icon name="align-right" />}
        />
      </ToggleButtonGroup>
      <ToolbarSeparator />
      <IconButton icon="link" label="Inserir link" />
      <IconButton icon="image" label="Inserir imagem" />
    </Toolbar>
  ),
} satisfies Meta<typeof Toolbar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Vertical: Story = {
  args: { orientation: 'vertical', 'aria-label': 'Ferramentas de desenho' },
  render: (args) => (
    <Toolbar {...args}>
      <ToggleButtonGroup type="single" aria-label="Ferramenta" defaultValue="select">
        <ToggleButton
          value="select"
          iconOnly
          aria-label="Selecionar"
          startIcon={<Icon name="arrow-up-right" />}
        />
        <ToggleButton value="text" iconOnly aria-label="Texto" startIcon={<Icon name="type" />} />
        <ToggleButton
          value="shape"
          iconOnly
          aria-label="Retângulo"
          startIcon={<Icon name="square" />}
        />
      </ToggleButtonGroup>
      <ToolbarSeparator />
      <IconButton icon="image" label="Inserir imagem" />
      <IconButton icon="trash" label="Excluir seleção" />
    </Toolbar>
  ),
}

export const WithTextButtons: Story = {
  args: { 'aria-label': 'Ações da tabela', size: 'md' },
  render: (args) => (
    <Toolbar {...args}>
      <Button data-roving-item="">Filtrar</Button>
      <Button data-roving-item="">Ordenar</Button>
      <ToolbarSeparator />
      <Button data-roving-item="">Exportar</Button>
    </Toolbar>
  ),
}
