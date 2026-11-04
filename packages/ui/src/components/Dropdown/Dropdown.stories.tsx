import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Icon } from '../../icons'
import { Button } from '../Button'
import { Dropdown } from './Dropdown'
import {
  DropdownCheckboxItem,
  DropdownItem,
  DropdownLabel,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownSeparator,
} from './Menu'

const meta = {
  title: 'Componentes/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Menu button do WAI-ARIA: gatilho com `aria-haspopup="menu"`/`aria-expanded` e `role="menu"` com `DropdownItem`, `DropdownCheckboxItem`, `DropdownRadioGroup`/`DropdownRadioItem`, `DropdownSeparator` e `DropdownLabel`. ↑/↓ circulam, Home/End, letras buscam, Enter/Espaço ativam, Escape e Tab fecham devolvendo o foco.',
      },
    },
  },
  argTypes: {
    placement: {
      control: 'select',
      options: ['bottom-start', 'bottom-end', 'top-start', 'top-end', 'right-start'],
    },
    onOpenChange: { action: 'openChange' },
  },
  args: {
    trigger: (
      <Button variant="outline" endIcon={<Icon name="chevron-down" />}>
        Ações
      </Button>
    ),
    placement: 'bottom-start',
    children: null,
  },
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div style={{ paddingBottom: 280 }}>
      <Dropdown {...args}>
        <DropdownLabel>Projeto</DropdownLabel>
        <DropdownItem icon="edit" shortcut="⌘E">
          Renomear
        </DropdownItem>
        <DropdownItem icon="copy" shortcut="⌘D">
          Duplicar
        </DropdownItem>
        <DropdownItem icon="download" disabled>
          Exportar
        </DropdownItem>
        <DropdownSeparator />
        <DropdownItem icon="trash" tone="danger">
          Excluir
        </DropdownItem>
      </Dropdown>
    </div>
  ),
}

export const CheckboxAndRadio: Story = {
  render: function Render(args) {
    const [sort, setSort] = useState('recent')
    const [done, setDone] = useState(true)
    return (
      <div style={{ paddingBottom: 280 }}>
        <Dropdown
          {...args}
          trigger={
            <Button variant="outline" startIcon={<Icon name="sliders" />}>
              Exibir
            </Button>
          }
        >
          <DropdownCheckboxItem checked={done} onCheckedChange={setDone}>
            Mostrar concluídas
          </DropdownCheckboxItem>
          <DropdownCheckboxItem>Mostrar arquivadas</DropdownCheckboxItem>
          <DropdownSeparator />
          <DropdownRadioGroup label="Ordenar por" value={sort} onValueChange={setSort}>
            <DropdownRadioItem value="recent">Mais recentes</DropdownRadioItem>
            <DropdownRadioItem value="name">Nome</DropdownRadioItem>
            <DropdownRadioItem value="due">Prazo</DropdownRadioItem>
          </DropdownRadioGroup>
        </Dropdown>
      </div>
    )
  },
}

export const IconTrigger: Story = {
  render: (args) => (
    <div style={{ paddingBottom: 200, display: 'flex', justifyContent: 'flex-end', width: 320 }}>
      <Dropdown
        {...args}
        placement="bottom-end"
        trigger={
          <Button
            variant="ghost"
            iconOnly
            aria-label="Mais ações"
            startIcon={<Icon name="more-horizontal" />}
          />
        }
      >
        <DropdownItem icon="external-link">Abrir em nova aba</DropdownItem>
        <DropdownItem icon="link">Copiar link</DropdownItem>
        <DropdownSeparator />
        <DropdownItem icon="trash" tone="danger">
          Remover
        </DropdownItem>
      </Dropdown>
    </div>
  ),
}
