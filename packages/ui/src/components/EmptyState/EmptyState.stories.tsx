import type { Meta, StoryObj } from '@storybook/react-vite'
import { iconNames } from '../../icons'
import { Button } from '../Button'
import { EmptyState } from './EmptyState'

const meta = {
  title: 'Componentes/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Estado vazio com ilustração geométrica, título (nível de heading configurável), descrição e ações primária/secundária. A variante `compact` é horizontal, para painéis e listas.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'compact'] },
    headingLevel: { control: 'inline-radio', options: [2, 3, 4, 5, 6] },
    icon: { control: 'select', options: iconNames },
  },
  args: {
    title: 'Nenhum projeto ainda',
    description:
      'Projetos reúnem tarefas, arquivos e pessoas. Crie o primeiro para convidar o seu time.',
    icon: 'folder',
    headingLevel: 3,
    variant: 'default',
    action: <Button>Criar projeto</Button>,
    secondaryAction: <Button variant="ghost">Ver modelos</Button>,
  },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const NoResults: Story = {
  args: {
    icon: 'search',
    title: 'Nenhum resultado para “boleto vencido”',
    description: 'Confira a grafia ou tente termos mais gerais.',
    action: <Button variant="outline">Limpar busca</Button>,
    secondaryAction: undefined,
  },
}

export const Compact: Story = {
  args: {
    variant: 'compact',
    icon: 'users',
    title: 'Ninguém foi convidado',
    description: 'Convide colegas para colaborar neste projeto.',
    action: (
      <Button size="sm" variant="outline">
        Convidar pessoas
      </Button>
    ),
    secondaryAction: undefined,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480, border: '1px solid var(--or-color-border)' }}>
        <Story />
      </div>
    ),
  ],
}

export const WithoutIllustration: Story = {
  args: { illustration: false },
}
