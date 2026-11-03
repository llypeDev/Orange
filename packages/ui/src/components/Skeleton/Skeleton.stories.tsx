import type { Meta, StoryObj } from '@storybook/react-vite'
import { VisuallyHidden } from '../VisuallyHidden'
import { Skeleton, SkeletonText } from './Skeleton'

const meta = {
  title: 'Componentes/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Espaço reservado com a forma do conteúdo em carregamento. É decorativo (`aria-hidden`): marque o contêiner com `aria-busy="true"` e anuncie o carregamento com uma região `role="status"` fora dele. O brilho é desligado com movimento reduzido.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['text', 'rect', 'circle'] },
    width: { control: 'text' },
    height: { control: 'text' },
    animated: { control: 'boolean' },
  },
  args: {
    variant: 'text',
    animated: true,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Skeleton {...args} variant="text" />
      <Skeleton {...args} variant="rect" height={96} />
      <Skeleton {...args} variant="circle" width={48} />
    </div>
  ),
}

export const Text: Story = {
  render: (args) => <SkeletonText lines={4} animated={args.animated} />,
}

export const Card: Story = {
  render: (args) => (
    <>
      {/* o anúncio fica fora do contêiner ocupado: leitores podem ignorar mudanças dentro de aria-busy */}
      <VisuallyHidden role="status">Carregando perfil…</VisuallyHidden>
      <section
        aria-busy="true"
        aria-label="Perfil do cliente"
        style={{ display: 'grid', gap: 16, padding: 24, border: '1px solid var(--or-color-border)' }}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Skeleton {...args} variant="circle" width={48} />
          <div style={{ flex: 1 }}>
            <Skeleton {...args} width="45%" />
            <Skeleton {...args} width="30%" />
          </div>
        </div>
        <Skeleton {...args} variant="rect" height={140} />
        <SkeletonText lines={3} animated={args.animated} />
      </section>
    </>
  ),
}

export const Static: Story = {
  args: { animated: false },
  render: Card.render,
}
