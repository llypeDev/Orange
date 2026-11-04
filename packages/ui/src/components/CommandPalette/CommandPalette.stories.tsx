import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '../../icons'
import { Button } from '../Button'
import { CommandPalette, type CommandGroup } from './CommandPalette'

const groups: CommandGroup[] = [
  {
    label: 'Navegação',
    items: [
      { id: 'inicio', label: 'Ir para o início', icon: 'home', shortcut: 'G I' },
      { id: 'projetos', label: 'Ir para projetos', icon: 'folder', shortcut: 'G P' },
      {
        id: 'config',
        label: 'Abrir configurações',
        description: 'Conta, notificações e segurança',
        icon: 'sliders',
      },
    ],
  },
  {
    label: 'Criar',
    items: [
      { id: 'novo-projeto', label: 'Criar projeto', icon: 'plus', shortcut: '⌘ N' },
      { id: 'convidar', label: 'Convidar pessoas', icon: 'users', keywords: ['equipe', 'membros'] },
      {
        id: 'importar',
        label: 'Importar dados',
        description: 'CSV ou planilha',
        icon: 'upload',
        disabled: true,
      },
    ],
  },
  {
    label: 'Preferências',
    items: [
      {
        id: 'tema',
        label: 'Alternar tema claro/escuro',
        icon: 'moon',
        keywords: ['dark', 'light', 'aparência'],
      },
      { id: 'atalhos', label: 'Ver atalhos de teclado', icon: 'keyboard', shortcut: '?' },
    ],
  },
]

const meta = {
  title: 'Componentes/CommandPalette',
  component: CommandPalette,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Diálogo modal com busca (`role="combobox"`) e lista de comandos agrupados (`role="listbox"`), navegada com ↑/↓ e `aria-activedescendant`. A filtragem ignora acentos e também busca na descrição e em `keywords`. `hotkey="mod+k"` abre a paleta com ⌘K / Ctrl+K.',
      },
    },
  },
  argTypes: {
    onSelect: { action: 'select' },
    onOpenChange: { action: 'openChange' },
  },
  args: {
    groups,
    hotkey: 'mod+k',
  },
} satisfies Meta<typeof CommandPalette>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <CommandPalette
      {...args}
      trigger={
        <Button variant="outline" startIcon={<Icon name="search" />}>
          Buscar comandos{' '}
          <kbd style={{ marginLeft: 8, fontFamily: 'var(--or-font-mono)', fontSize: 11 }}>
            Ctrl K
          </kbd>
        </Button>
      }
    />
  ),
}

export const CustomEmptyMessage: Story = {
  args: {
    emptyMessage: 'Nenhum comando com esse nome. Tente "projeto" ou "tema".',
    placeholder: 'O que você quer fazer?',
  },
  render: (args) => (
    <CommandPalette
      {...args}
      hotkey={undefined}
      trigger={<Button variant="outline">Abrir paleta</Button>}
    />
  ),
}
