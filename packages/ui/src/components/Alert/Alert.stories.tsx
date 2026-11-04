import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Icon } from '../../icons'
import { Button } from '../Button'
import { Alert } from './Alert'

const meta = {
  title: 'Componentes/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Mensagem inline ligada a uma parte da página. Estática por padrão (sem papel ARIA); use `live` quando a mensagem aparecer dinamicamente — `role="alert"` em `danger`/`warning`, `role="status"` nos demais tons.',
      },
    },
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['neutral', 'info', 'success', 'warning', 'danger'] },
    title: { control: 'text' },
    dismissible: { control: 'boolean' },
    live: { control: 'boolean' },
    onDismiss: { action: 'dismiss' },
  },
  args: {
    tone: 'info',
    title: 'Nova política de senhas',
    children: 'A partir de 1º de dezembro, senhas precisam ter pelo menos 12 caracteres.',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Tones: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Alert {...args} tone="neutral" title="Rascunho">
        Este documento ainda não foi publicado.
      </Alert>
      <Alert {...args} tone="info" title="Manutenção programada">
        O painel ficará indisponível no sábado, das 2h às 4h.
      </Alert>
      <Alert {...args} tone="success" title="Pagamento confirmado">
        O recibo foi enviado para financeiro@empresa.com.br.
      </Alert>
      <Alert {...args} tone="warning" title="Seu plano vence em 3 dias">
        Atualize a forma de pagamento para não perder o acesso.
      </Alert>
      <Alert {...args} tone="danger" title="Não foi possível importar a planilha">
        A coluna “CNPJ” está vazia em 14 linhas.
      </Alert>
    </div>
  ),
}

export const WithAction: Story = {
  args: {
    tone: 'warning',
    title: 'Seu plano vence em 3 dias',
    children: 'Atualize a forma de pagamento para não perder o acesso.',
    action: (
      <>
        <Button size="sm">Atualizar pagamento</Button>
        <Button size="sm" variant="ghost">
          Lembrar depois
        </Button>
      </>
    ),
  },
}

export const Dismissible: Story = {
  args: {
    dismissible: true,
    tone: 'success',
    title: 'Convite enviado',
    children: 'A Ana receberá um e-mail em instantes.',
  },
}

export const WithoutTitle: Story = {
  args: {
    title: undefined,
    tone: 'neutral',
    children: 'As alterações são salvas automaticamente.',
  },
}

export const CustomIcon: Story = {
  args: {
    tone: 'info',
    icon: <Icon name="sparkle" />,
    title: 'Novo: relatórios agendados',
    children: 'Receba o resumo de vendas toda segunda-feira por e-mail.',
  },
}

export const LiveRegion: Story = {
  render: function LiveRegionStory(args) {
    const [error, setError] = useState(false)
    return (
      <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
        <Button variant="outline" onClick={() => setError(true)}>
          Enviar formulário
        </Button>
        {error && (
          <Alert
            {...args}
            live
            tone="danger"
            title="Não foi possível enviar"
            dismissible
            onDismiss={() => setError(false)}
          >
            Verifique sua conexão e tente novamente.
          </Alert>
        )}
      </div>
    )
  },
}
