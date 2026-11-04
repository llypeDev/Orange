import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Icon } from '../../icons'
import { Button } from '../Button'
import { Banner } from './Banner'

const meta = {
  title: 'Componentes/Banner',
  component: Banner,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Faixa de largura total para avisos do sistema ou da página (manutenção, instabilidade, prazos). A variante `accent` vira uma chamada com borda laranja e título grande.',
      },
    },
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['neutral', 'info', 'success', 'warning', 'danger'] },
    variant: { control: 'inline-radio', options: ['default', 'accent'] },
    dismissible: { control: 'boolean' },
    live: { control: 'boolean' },
    onDismiss: { action: 'dismiss' },
  },
  args: {
    tone: 'info',
    variant: 'default',
    title: 'Manutenção programada',
    children: 'O painel ficará indisponível no domingo, das 2h às 4h (horário de Brasília).',
    action: <a href="#status">Ver detalhes</a>,
  },
} satisfies Meta<typeof Banner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Tones: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Banner {...args} tone="neutral" title="Modo somente leitura">
        Você está vendo a versão publicada em 12/10.
      </Banner>
      <Banner {...args} tone="info" />
      <Banner {...args} tone="success" title="Integração concluída">
        Seus pedidos já estão sincronizando com o ERP.
      </Banner>
      <Banner {...args} tone="warning" title="Instabilidade no Pix">
        Alguns pagamentos podem levar até 30 minutos para compensar.
      </Banner>
      <Banner {...args} tone="danger" title="Falha na emissão de notas">
        Nenhuma NF-e foi emitida desde 14h. Nossa equipe já está atuando.
      </Banner>
    </div>
  ),
}

export const Dismissible: Story = {
  args: { dismissible: true },
}

export const WithButton: Story = {
  args: {
    tone: 'warning',
    title: 'Seu teste termina em 2 dias',
    children: 'Escolha um plano para manter seus projetos.',
    action: (
      <Button size="sm" variant="secondary">
        Ver planos
      </Button>
    ),
    dismissible: true,
  },
}

export const Accent: Story = {
  args: {
    variant: 'accent',
    headingLevel: 2,
    title: 'Leve o Orange para o seu time',
    children: 'Componentes acessíveis, tokens e documentação bilíngue — prontos para produção.',
    action: (
      <>
        <Button endIcon={<Icon name="arrow-right" />}>Começar agora</Button>
        <Button variant="outline">Falar com vendas</Button>
      </>
    ),
  },
}

export const AccentDismissible: Story = {
  args: {
    ...Accent.args,
    dismissible: true,
  },
}

/** Situação em andamento: o anel pulsa em volta do ícone (or-pulse, 2.4s). */
export const LivePulse: Story = {
  args: {
    tone: 'danger',
    live: true,
    pulse: true,
    title: 'Incidente em andamento',
    children: 'A emissão de NF-e está instável desde 14h. Atualizamos a cada 15 minutos.',
    action: <a href="#status">Acompanhar status</a>,
  },
}

/** Feche e reabra para ver a saída (recolhe a altura) e a entrada (desce 8px). */
export const EnterAndExit: Story = {
  render: function EnterAndExitStory(args) {
    const [open, setOpen] = useState(true)
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <Banner {...args} open={open} dismissible onDismiss={() => setOpen(false)} />
        <p style={{ margin: 0, padding: '0 16px' }}>Conteúdo da página logo abaixo do aviso.</p>
        <div style={{ padding: '0 16px' }}>
          <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
            Mostrar aviso
          </Button>
        </div>
      </div>
    )
  },
}
