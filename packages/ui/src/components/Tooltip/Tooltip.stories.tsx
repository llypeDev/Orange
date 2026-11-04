import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '../../icons'
import { Button } from '../Button'
import { Tooltip } from './Tooltip'

const meta = {
  title: 'Componentes/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Rótulo curto (`role="tooltip"`) ligado ao gatilho por `aria-describedby`. Abre no hover (com atraso) e no foco por teclado, continua aberto com o ponteiro sobre ele e fecha com Escape (WCAG 1.4.13). Sem conteúdo interativo.',
      },
    },
  },
  argTypes: {
    placement: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'right',
      ],
    },
    delay: { control: { type: 'number', min: 0, step: 100 } },
    closeDelay: { control: { type: 'number', min: 0, step: 50 } },
    arrow: { control: 'boolean' },
  },
  args: {
    content: 'Copiar link público',
    placement: 'top',
    delay: 400,
    closeDelay: 150,
    arrow: true,
    children: (
      <Button
        variant="outline"
        iconOnly
        aria-label="Copiar link"
        startIcon={<Icon name="link" />}
      />
    ),
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div style={{ padding: '48px 0' }}>
      <Tooltip {...args} />
    </div>
  ),
}

export const Toolbar: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 4, padding: '48px 0' }}>
      {(
        [
          ['edit', 'Editar'],
          ['copy', 'Duplicar'],
          ['download', 'Baixar'],
          ['trash', 'Excluir'],
        ] as const
      ).map(([icon, label]) => (
        <Tooltip {...args} key={icon} content={label}>
          <Button variant="ghost" iconOnly aria-label={label} startIcon={<Icon name={icon} />} />
        </Tooltip>
      ))}
    </div>
  ),
}

export const Placements: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, padding: '64px 0', justifyContent: 'center' }}>
      {(['top', 'right', 'bottom', 'left'] as const).map((placement) => (
        <Tooltip
          {...args}
          key={placement}
          placement={placement}
          content={`Tooltip em ${placement}`}
        >
          <Button variant="outline">{placement}</Button>
        </Tooltip>
      ))}
    </div>
  ),
}
