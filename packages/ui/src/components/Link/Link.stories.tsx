import type { Meta, StoryObj } from '@storybook/react-vite'
import { Link } from './Link'

const meta = {
  title: 'Componentes/Link',
  component: Link,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Links levam a outra página ou a outra seção. Variantes `default` (em texto corrido), `subtle` (rodapés, metadados) e `standalone` (isolado, com seta). `external` abre em nova aba e avisa leitores de tela. Polimórfico via `as` para integrar com roteadores.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'subtle', 'standalone'] },
    external: { control: 'boolean' },
  },
  args: {
    href: '#',
    children: 'Ver todos os planos',
    variant: 'default',
    external: false,
  },
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <p style={{ margin: 0 }}>
        Consulte a{' '}
        <Link {...args} variant="default">
          documentação da API
        </Link>{' '}
        antes de integrar.
      </p>
      <p style={{ margin: 0 }}>
        <Link {...args} variant="subtle">
          Termos de uso
        </Link>
      </p>
      <Link {...args} variant="standalone">
        Ver todos os planos
      </Link>
    </div>
  ),
}

export const External: Story = {
  args: { href: 'https://www.w3.org/WAI/ARIA/apg/', external: true, children: 'WAI-ARIA Authoring Practices' },
}

export const StandaloneExternal: Story = {
  args: { href: 'https://github.com', variant: 'standalone', external: true, children: 'Ver no GitHub' },
}
