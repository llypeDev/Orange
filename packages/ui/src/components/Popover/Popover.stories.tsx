import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '../../icons'
import { Button } from '../Button'
import { Popover } from './Popover'

const meta = {
  title: 'Componentes/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Painel não modal (`role="dialog"`) ancorado a um gatilho, que recebe `aria-haspopup="dialog"`, `aria-expanded` e `aria-controls`. O foco vai para o conteúdo ao abrir; Escape e clique fora fecham e devolvem o foco. Posicionado com floating-ui (flip/shift automáticos).',
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
    arrow: { control: 'boolean' },
    offset: { control: { type: 'number', min: 0, max: 24 } },
    onOpenChange: { action: 'openChange' },
  },
  args: {
    trigger: <Button variant="outline">Compartilhar</Button>,
    title: 'Compartilhar projeto',
    placement: 'bottom',
    arrow: true,
    offset: 10,
    showCloseButton: true,
  },
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div style={{ padding: '48px 0' }}>
      <Popover {...args}>
        {({ close }) => (
          <div style={{ display: 'grid', gap: 12 }}>
            <span>Qualquer pessoa com o link pode ver este projeto.</span>
            <Button size="sm" startIcon={<Icon name="link" />} onClick={close}>
              Copiar link
            </Button>
          </div>
        )}
      </Popover>
    </div>
  ),
}

export const Placements: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, padding: '96px 0', justifyContent: 'center' }}>
      {(['top', 'right', 'bottom', 'left'] as const).map((placement) => (
        <Popover
          {...args}
          key={placement}
          placement={placement}
          title={undefined}
          showCloseButton={false}
          trigger={<Button variant="outline">{placement}</Button>}
        >
          Abre em <strong>{placement}</strong>.
        </Popover>
      ))}
    </div>
  ),
}

export const WithoutTitle: Story = {
  args: {
    title: undefined,
    showCloseButton: false,
    trigger: (
      <Button
        variant="ghost"
        iconOnly
        aria-label="Sobre o plano Pro"
        startIcon={<Icon name="help-circle" />}
      />
    ),
  },
  render: (args) => (
    <Popover {...args}>
      O plano Pro inclui 10 projetos, domínios próprios e suporte prioritário.
    </Popover>
  ),
}
