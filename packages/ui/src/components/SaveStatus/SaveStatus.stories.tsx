import { useEffect, useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextArea } from '../TextArea'
import { SaveStatus, type SaveStatusState } from './SaveStatus'

/**
 * Data fixa: a regressão visual congela o relógio em 2026-11-12T12:00-03:00,
 * então a story Default mostra sempre "Salvo há 2 min.".
 */
const SAVED_AT = new Date('2026-11-12T11:58:00-03:00')

const meta = {
  title: 'Componentes/SaveStatus',
  component: SaveStatus,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Indicador de salvamento automático para editores e formulários: "Salvando…" (Spinner), "Salvo há 2 min." (check + `RelativeTime`) e "Erro ao salvar · Tentar de novo" (alerta + botão com `onRetry`). Sempre ícone + texto. Uma região viva própria anuncia o resultado uma vez por transição — "Salvo" de forma educada e o erro com `role="alert"` —, nunca o tempo relativo que se atualiza sozinho. A troca de estado é um crossfade curto.',
      },
    },
  },
  argTypes: {
    status: { control: 'inline-radio', options: ['idle', 'saving', 'saved', 'error'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    savedAt: { control: 'date' },
    onRetry: { action: 'retry' },
  },
  args: {
    status: 'saved',
    savedAt: SAVED_AT,
    size: 'md',
  },
} satisfies Meta<typeof SaveStatus>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const States: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <SaveStatus {...args} status="idle" labels={{ idle: 'Salvamento automático ativado' }} />
      <SaveStatus {...args} status="saving" />
      <SaveStatus {...args} status="saved" />
      <SaveStatus {...args} status="saved" savedAt={undefined} />
      <SaveStatus {...args} status="error" onRetry={() => {}} />
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <SaveStatus {...args} size="sm" />
      <SaveStatus {...args} size="md" />
      <SaveStatus {...args} size="sm" status="error" onRetry={() => {}} />
      <SaveStatus {...args} size="md" status="error" onRetry={() => {}} />
    </div>
  ),
}

/** Digite no campo: salva 1s depois da última tecla. Uma em cada três tentativas falha. */
export const Autosave: Story = {
  args: { status: 'idle', savedAt: undefined },
  render: function Render(args) {
    const [status, setStatus] = useState<SaveStatusState>('idle')
    const [savedAt, setSavedAt] = useState<Date>()
    const [text, setText] = useState('')
    const attempts = useRef(0)
    const timers = useRef<number[]>([])
    useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

    const save = () => {
      setStatus('saving')
      timers.current.push(
        window.setTimeout(() => {
          attempts.current += 1
          if (attempts.current % 3 === 0) {
            setStatus('error')
          } else {
            setSavedAt(new Date())
            setStatus('saved')
          }
        }, 900),
      )
    }
    const onChange = (value: string) => {
      setText(value)
      timers.current.forEach((t) => window.clearTimeout(t))
      timers.current = [window.setTimeout(save, 1000)]
    }

    return (
      <div style={{ display: 'grid', gap: 8, maxWidth: 480 }}>
        <TextArea
          label="Nota interna do pedido"
          rows={4}
          value={text}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Ex.: cliente pediu embalagem para presente"
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <SaveStatus {...args} status={status} savedAt={savedAt} onRetry={save} />
        </div>
      </div>
    )
  },
}
