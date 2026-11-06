import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '../../icons'
import { ToggleButton } from './ToggleButton'
import { ToggleButtonGroup } from './ToggleButtonGroup'

const meta = {
  title: 'Componentes/ToggleButtonGroup',
  component: ToggleButtonGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Agrupa ToggleButtons (`role="group"`). `selectionMode="single"` permite no máximo um pressionado (clicar no pressionado solta); `selectionMode="multiple"`, qualquer combinação. Para escolha exclusiva obrigatória, use SegmentedControl.',
      },
    },
  },
  argTypes: {
    selectionMode: { control: 'inline-radio', options: ['single', 'multiple'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['outline', 'ghost'] },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    attached: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onChange: { action: 'change' },
  },
  args: {
    selectionMode: 'multiple',
    'aria-label': 'Modalidade da vaga',
    defaultValue: ['remote'],
  },
  render: (args) => (
    <ToggleButtonGroup {...args}>
      <ToggleButton value="remote">Remoto</ToggleButton>
      <ToggleButton value="hybrid">Híbrido</ToggleButton>
      <ToggleButton value="onsite">Presencial</ToggleButton>
    </ToggleButtonGroup>
  ),
} satisfies Meta<typeof ToggleButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Multiple: Story = {}

export const Single: Story = {
  args: {
    selectionMode: 'single',
    defaultValue: 'left',
    attached: true,
    'aria-label': 'Alinhamento do texto',
  },
  render: (args) => (
    <ToggleButtonGroup {...args}>
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
  ),
}

export const AttachedGhost: Story = {
  args: {
    attached: true,
    variant: 'ghost',
    'aria-label': 'Estilo do texto',
    defaultValue: ['bold'],
  },
  render: (args) => (
    <ToggleButtonGroup {...args}>
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
  ),
}

export const Vertical: Story = {
  args: { orientation: 'vertical', attached: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}
