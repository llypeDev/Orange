import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '../Button'
import { ConfirmDialog, useConfirm } from './ConfirmDialog'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const meta = {
  title: 'Componentes/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Diálogo de alerta (`role="alertdialog"`) para confirmar ações importantes. `tone="danger"` usa botão vermelho e foca Cancelar. Se `onConfirm` retornar uma Promise, o botão fica em loading até ela resolver. Para uso imperativo, `useConfirm()` retorna `[confirm, dialog]` e `await confirm({...})` resolve `true` ou `false`.',
      },
    },
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['neutral', 'danger'] },
    onConfirm: { action: 'confirm' },
    onCancel: { action: 'cancel' },
  },
  args: {
    title: 'Publicar alterações?',
    description: 'O site será atualizado para todos os visitantes.',
    confirmLabel: 'Publicar',
    tone: 'neutral',
  },
} satisfies Meta<typeof ConfirmDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Neutral: Story = {
  render: (args) => <ConfirmDialog {...args} trigger={<Button>Publicar</Button>} />,
}

export const Danger: Story = {
  args: {
    tone: 'danger',
    title: 'Excluir projeto?',
    description: 'O projeto "Site 2026" e seus 12 arquivos serão removidos para sempre.',
    confirmLabel: 'Excluir projeto',
  },
  render: (args) => (
    <ConfirmDialog {...args} trigger={<Button variant="danger">Excluir projeto</Button>} />
  ),
}

export const AsyncConfirm: Story = {
  args: {
    tone: 'danger',
    title: 'Encerrar sessões?',
    description: 'Todos os dispositivos conectados precisarão entrar de novo.',
    confirmLabel: 'Encerrar sessões',
    loadingText: 'Encerrando sessões',
  },
  render: (args) => (
    <ConfirmDialog
      {...args}
      onConfirm={() => wait(1500)}
      trigger={<Button variant="outline">Encerrar sessões</Button>}
    />
  ),
}

export const WithHook: Story = {
  render: function Render() {
    const [confirm, confirmDialog] = useConfirm()
    const [status, setStatus] = useState('Nenhuma ação ainda')
    return (
      <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
        <Button
          variant="outline"
          onClick={async () => {
            const ok = await confirm({
              title: 'Arquivar 3 conversas?',
              description: 'Elas saem da caixa de entrada, mas continuam na busca.',
              confirmLabel: 'Arquivar',
            })
            setStatus(ok ? 'Conversas arquivadas' : 'Ação cancelada')
          }}
        >
          Arquivar selecionadas
        </Button>
        <span>{status}</span>
        {confirmDialog}
      </div>
    )
  },
}
