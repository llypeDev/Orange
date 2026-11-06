import type { Meta, StoryObj } from '@storybook/react-vite'
import { Disclosure } from './Disclosure'

const meta = {
  title: 'Componentes/Disclosure',
  component: Disclosure,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Uma única área que se mostra e se esconde, fora de um Accordion (padrão disclosure do WAI-ARIA): `<button>` com `aria-expanded` e `aria-controls`, conteúdo logo abaixo. `inline` tem cara de link (como o GOV.UK Details); `outline` é uma caixa com borda, como um item de Accordion. O conteúdo fechado fica `inert` durante a saída e `hidden` ao fim da transição.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['inline', 'outline'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    headingLevel: { control: 'select', options: [2, 3, 4, 5, 6] },
    disabled: { control: 'boolean' },
    onOpenChange: { action: 'openChange' },
  },
  args: {
    label: 'Opções avançadas',
    variant: 'inline',
    size: 'md',
    disabled: false,
    children:
      'O projeto é criado na região São Paulo (sa-east-1), com backups diários mantidos por 30 dias. Altere apenas se a sua empresa exigir outra região.',
  },
  render: (args) => (
    <div style={{ maxWidth: 560 }}>
      <Disclosure {...args} />
    </div>
  ),
} satisfies Meta<typeof Disclosure>

export default meta
type Story = StoryObj<typeof meta>

/** Aberto para a baseline visual capturar o conteúdo. */
export const Default: Story = {
  args: { defaultOpen: true },
}

export const Closed: Story = {}

export const Outline: Story = {
  args: {
    variant: 'outline',
    label: 'Ver detalhes do pedido',
    defaultOpen: true,
    headingLevel: 3,
    children: (
      <>
        <p>Pedido 48213 · 3 itens · Frete grátis</p>
        <p>Total de R$ 489,90 no Pix, com entrega prevista para 12 de novembro.</p>
      </>
    ),
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 24, maxWidth: 560 }}>
      <Disclosure {...args} size="sm" label="Por que pedimos isso?" defaultOpen>
        Usamos o setor de atuação para sugerir modelos de relatório e integrações. Essa informação
        não é compartilhada.
      </Disclosure>
      <Disclosure {...args} size="md" defaultOpen />
      <Disclosure {...args} variant="outline" size="sm" label="Por que pedimos isso?" defaultOpen>
        Usamos o setor de atuação para sugerir modelos de relatório e integrações.
      </Disclosure>
      <Disclosure {...args} variant="outline" size="md" defaultOpen />
    </div>
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 24, maxWidth: 560 }}>
      <Disclosure {...args} disabled label="Histórico de alterações">
        Nenhuma alteração neste projeto.
      </Disclosure>
      <Disclosure {...args} disabled variant="outline" label="Histórico de alterações">
        Nenhuma alteração neste projeto.
      </Disclosure>
    </div>
  ),
}

export const Nested: Story = {
  render: (args) => (
    <div style={{ maxWidth: 560 }}>
      <Disclosure {...args} variant="outline" label="Configurar notificações" defaultOpen>
        <p>Enviamos um resumo semanal toda segunda-feira, às 9h.</p>
        <Disclosure size="sm" label="Por que o resumo é semanal?">
          Equipes que recebem um resumo por semana abrem 3 vezes mais os relatórios do que as que
          recebem um por dia.
        </Disclosure>
      </Disclosure>
    </div>
  ),
}
