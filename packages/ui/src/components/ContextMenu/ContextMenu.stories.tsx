import type { Meta, StoryObj } from '@storybook/react-vite'
import { DropdownItem, DropdownSeparator } from '../Dropdown/Menu'
import { ContextMenu } from './ContextMenu'

const meta = {
  title: 'Componentes/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Menu aberto com o botão direito sobre uma área, posicionado no ponteiro. Pelo teclado, Shift+F10 ou a tecla Menu abrem o menu quando a área (ou algo dentro dela) está focada. Usa as mesmas partes e a mesma navegação do Dropdown.',
      },
    },
  },
  args: {
    children: <div />,
    content: null,
  },
} satisfies Meta<typeof ContextMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <ContextMenu
      {...args}
      content={
        <>
          <DropdownItem icon="external-link">Abrir</DropdownItem>
          <DropdownItem icon="edit" shortcut="F2">
            Renomear
          </DropdownItem>
          <DropdownItem icon="copy">Duplicar</DropdownItem>
          <DropdownItem icon="download">Baixar</DropdownItem>
          <DropdownSeparator />
          <DropdownItem icon="trash" tone="danger" shortcut="Del">
            Excluir
          </DropdownItem>
        </>
      }
    >
      <div
        tabIndex={0}
        style={{
          display: 'grid',
          placeItems: 'center',
          width: 420,
          height: 200,
          border: '1px dashed var(--or-color-border-strong)',
          color: 'var(--or-color-text-muted)',
        }}
      >
        Clique com o botão direito (ou Shift+F10)
      </div>
    </ContextMenu>
  ),
}
