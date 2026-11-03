import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Toast } from './Toast'
import { ToastProvider, useToast } from './ToastProvider'

const meta = {
  title: 'Componentes/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Notificações breves e não bloqueantes. Envolva a aplicação com `ToastProvider` e chame `useToast().toast({ title, description, tone, action, duration })`. A pilha pausa ao passar o mouse ou focar, `F8` leva o foco ao toast mais recente e `Escape` fecha o toast focado. `Toast` é o visual, exportado para composições próprias.',
      },
    },
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['neutral', 'info', 'success', 'warning', 'danger'] },
    title: { control: 'text' },
    description: { control: 'text' },
    onClose: { action: 'close' },
  },
  args: {
    tone: 'success',
    title: 'Pedido enviado',
    description: 'O cliente receberá o código de rastreio por e-mail.',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Tones: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Toast {...args} tone="neutral" title="Link copiado" description={undefined} />
      <Toast
        {...args}
        tone="info"
        title="Nova versão disponível"
        description="Recarregue a página para atualizar."
      />
      <Toast {...args} tone="success" />
      <Toast {...args} tone="warning" title="Conexão instável" description="Tentando reconectar…" />
      <Toast
        {...args}
        tone="danger"
        title="Falha ao salvar"
        description="Verifique sua conexão e tente novamente."
      />
    </div>
  ),
}

export const WithAction: Story = {
  args: {
    tone: 'neutral',
    title: '3 conversas arquivadas',
    description: undefined,
    action: (
      <Button size="sm" variant="outline">
        Desfazer
      </Button>
    ),
  },
}

function Demo() {
  const { toast, dismissAll } = useToast()
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Button onClick={() => toast({ title: 'Alterações salvas', tone: 'success' })}>Salvar</Button>
      <Button
        variant="outline"
        onClick={() =>
          toast({
            title: 'Não foi possível enviar',
            description: 'O arquivo excede 25 MB.',
            tone: 'danger',
          })
        }
      >
        Erro
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast({
            title: 'Conversa arquivada',
            action: { label: 'Desfazer', onClick: () => toast({ title: 'Conversa restaurada' }) },
          })
        }
      >
        Com ação
      </Button>
      <Button variant="ghost" onClick={dismissAll}>
        Fechar todos
      </Button>
    </div>
  )
}

export const Interactive: Story = {
  render: () => (
    <ToastProvider>
      <Demo />
    </ToastProvider>
  ),
}

export const TopCenter: Story = {
  render: () => (
    <ToastProvider position="top-center" limit={2}>
      <Demo />
    </ToastProvider>
  ),
}
