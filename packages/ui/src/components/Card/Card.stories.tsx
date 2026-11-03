import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '../../icons'
import { Button } from '../Button'
import { Card, CardBody, CardFooter, CardHeader, CardMedia } from './Card'

const cover =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180"><rect width="320" height="180" fill="#1c1c21"/><rect x="24" y="96" width="40" height="60" fill="#f58549"/><rect x="76" y="64" width="40" height="92" fill="#3a3a42"/><rect x="128" y="40" width="40" height="116" fill="#3a3a42"/><rect x="180" y="80" width="40" height="76" fill="#3a3a42"/><rect x="232" y="24" width="40" height="132" fill="#f58549"/></svg>',
  )

const meta = {
  title: 'Componentes/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Agrupa conteúdo relacionado com `CardHeader`, `CardBody`, `CardFooter` e `CardMedia`. Com `interactive`, o cartão inteiro vira clicável através do link do título (padrão "stretched link").',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['outline', 'raised', 'accent'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    interactive: { control: 'boolean' },
  },
  args: {
    variant: 'outline',
    size: 'md',
    interactive: false,
  },
  render: (args) => (
    <Card {...args} style={{ maxWidth: 360 }}>
      <CardHeader eyebrow="Plano" title="Profissional" description="Para equipes em crescimento" />
      <CardBody>Até 20 usuários, 100 GB de armazenamento e suporte prioritário por chat.</CardBody>
      <CardFooter>
        <Button>Assinar plano</Button>
        <Button variant="ghost">Comparar</Button>
      </CardFooter>
    </Card>
  ),
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
      {(['outline', 'raised', 'accent'] as const).map((variant) => (
        <Card key={variant} {...args} variant={variant}>
          <CardHeader eyebrow={variant} title="Receita recorrente" />
          <CardBody>Crescimento de 12% em relação ao trimestre anterior.</CardBody>
        </Card>
      ))}
    </div>
  ),
}

export const Interactive: Story = {
  render: (args) => (
    <Card {...args} as="article" interactive style={{ maxWidth: 360 }}>
      <CardMedia src={cover} alt="" />
      <CardHeader
        eyebrow="Relatório"
        title="Vendas do 3º trimestre"
        href="#vendas"
        actions={
          <Button variant="ghost" size="sm" iconOnly aria-label="Mais ações" startIcon={<Icon name="more-horizontal" />} />
        }
      />
      <CardBody>Atualizado há 2 horas · 14 páginas</CardBody>
    </Card>
  ),
}

export const WithDividerFooter: Story = {
  render: (args) => (
    <Card {...args} style={{ maxWidth: 360 }}>
      <CardHeader title="Integração com o ERP" description="Sincroniza pedidos a cada 15 minutos" />
      <CardBody>Última sincronização concluída às 14:32 com 128 pedidos.</CardBody>
      <CardFooter divider>
        <Button variant="outline" size="sm">
          Configurar
        </Button>
        <Button variant="ghost" size="sm">
          Ver logs
        </Button>
      </CardFooter>
    </Card>
  ),
}
