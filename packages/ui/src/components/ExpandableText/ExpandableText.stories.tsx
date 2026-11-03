import type { Meta, StoryObj } from '@storybook/react-vite'
import { ExpandableText } from './ExpandableText'

const review =
  'Comprei para o escritório e a equipe se adaptou rápido. A bateria dura o dia inteiro, o teclado é silencioso e a tela tem ótimo brilho mesmo perto da janela. O único ponto negativo é o carregador, que esquenta bastante depois de algumas horas de uso contínuo. Ainda assim, recomendo para quem trabalha em trânsito e precisa de um equipamento leve.'

const meta = {
  title: 'Componentes/ExpandableText',
  component: ExpandableText,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Texto longo recolhido em `lines` linhas com botão "Mostrar mais"/"Mostrar menos" (`aria-expanded` + `aria-controls`). O botão só aparece quando o conteúdo transborda.',
      },
    },
  },
  argTypes: {
    lines: { control: { type: 'number', min: 1, max: 8 } },
    defaultExpanded: { control: 'boolean' },
    showMoreLabel: { control: 'text' },
    showLessLabel: { control: 'text' },
    onExpandedChange: { action: 'expandedChange' },
  },
  args: {
    lines: 3,
    children: review,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ExpandableText>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const TwoLines: Story = {
  args: { lines: 2, showMoreLabel: 'Ler avaliação completa', showLessLabel: 'Recolher avaliação' },
}

export const MultipleParagraphs: Story = {
  args: {
    lines: 4,
    children: (
      <>
        <p>
          O Plano Pro inclui usuários ilimitados, armazenamento de 1 TB e suporte prioritário em até 2 horas úteis.
        </p>
        <p>
          A cobrança é anual e pode ser cancelada a qualquer momento — o valor proporcional não utilizado é devolvido
          como crédito para a próxima fatura.
        </p>
      </>
    ),
  },
}

export const ShortText: Story = {
  args: { children: 'Entrega em até 2 dias úteis.' },
}
