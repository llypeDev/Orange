import type { Meta, StoryObj } from '@storybook/react-vite'
import { TruncatedText } from './TruncatedText'

const meta = {
  title: 'Componentes/TruncatedText',
  component: TruncatedText,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Corta textos longos em `lines` linhas com reticências, mantendo o texto completo no DOM (acessível a leitores de tela). `showTitle` adiciona a dica nativa quando há corte.',
      },
    },
  },
  argTypes: {
    lines: { control: { type: 'number', min: 1, max: 6 } },
    showTitle: { control: 'boolean' },
    as: { control: 'select', options: ['span', 'p', 'div', 'h3'] },
    onTruncatedChange: { action: 'truncatedChange' },
  },
  args: {
    lines: 1,
    showTitle: true,
    children:
      'Proposta comercial — Implantação do módulo de conciliação bancária para as filiais de Campinas, Ribeirão Preto e Sorocaba',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TruncatedText>

export default meta
type Story = StoryObj<typeof meta>

export const SingleLine: Story = {}

export const MultiLine: Story = {
  args: {
    as: 'p',
    lines: 3,
    children:
      'A nova versão do aplicativo traz sincronização offline, exportação de relatórios em PDF, integração com o calendário da equipe e um painel de indicadores que mostra o desempenho de cada projeto em tempo real.',
  },
}

export const FitsWithoutCut: Story = {
  args: { children: 'Contrato assinado' },
}
