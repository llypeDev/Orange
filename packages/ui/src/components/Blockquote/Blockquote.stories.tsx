import type { Meta, StoryObj } from '@storybook/react-vite'
import { Blockquote } from './Blockquote'

const meta = {
  title: 'Componentes/Blockquote',
  component: Blockquote,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Citação com barra de acento à esquerda e fonte opcional. Com `source`, renderiza `<figure><blockquote cite /><figcaption>— fonte</figcaption></figure>`; sem ela, só o `<blockquote>`. Use `as="div"` para texto em destaque (inset text) que não é citação.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    as: { control: 'inline-radio', options: ['blockquote', 'div'] },
    cite: { control: 'text' },
    source: { control: 'text' },
  },
  args: {
    size: 'md',
    cite: 'https://exemplo.com.br/relatorios/atendimento-2026',
    children:
      'Automatizar a triagem dos chamados liberou a equipe para os casos que exigem conversa. O primeiro contato agora acontece no mesmo dia.',
  },
} satisfies Meta<typeof Blockquote>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 560 }}>
      <Blockquote
        {...args}
        source={
          <>
            Ana Lima, <cite>Relatório de Atendimento 2026</cite>
          </>
        }
      />
    </div>
  ),
}

export const WithoutSource: Story = {
  render: (args) => (
    <div style={{ maxWidth: 560 }}>
      <Blockquote {...args} />
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 32, maxWidth: 560 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Blockquote key={size} {...args} size={size} source={`Tamanho ${size}`}>
          Levamos uma tarde para importar dois anos de pedidos.
        </Blockquote>
      ))}
    </div>
  ),
}

export const MultipleParagraphs: Story = {
  render: (args) => (
    <div style={{ maxWidth: 560 }}>
      <Blockquote
        {...args}
        source={
          <>
            Cláusula 7.2, <cite>Termos de uso</cite>
          </>
        }
      >
        <p>
          O cancelamento pode ser solicitado a qualquer momento, pelo painel ou pela central de
          ajuda.
        </p>
        <p>
          Os dados do espaço de trabalho ficam disponíveis para exportação por 30 dias após o
          cancelamento.
        </p>
      </Blockquote>
    </div>
  ),
}

/** Texto em destaque (inset text): não é citação, então usa `as="div"` e não leva `cite`. */
export const InsetText: Story = {
  args: { as: 'div', cite: undefined },
  render: (args) => (
    <div style={{ maxWidth: 560 }}>
      <Blockquote {...args}>
        A emissão de notas fiscais fica indisponível no domingo, 15 de novembro, das 2h às 6h, para
        manutenção programada.
      </Blockquote>
    </div>
  ),
}
