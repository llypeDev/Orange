import type { Meta, StoryObj } from '@storybook/react-vite'
import { useRef, useState, type CSSProperties } from 'react'
import { Button } from '../Button'
import { Tour, type TourStep } from './Tour'

const meta = {
  title: 'Componentes/Tour',
  component: Tour,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Tour guiado com spotlight: apresenta novidades passo a passo, escurecendo a página e recortando o elemento em destaque. Cada passo é um diálogo modal (`role="dialog"` + `aria-modal`): o foco fica preso, vai para o título a cada passo e volta para onde estava ao fechar. O alvo destacado não recebe cliques enquanto o tour está aberto. Passos sem alvo (ou com alvo ausente) aparecem centralizados; em telas estreitas o diálogo vira uma folha inferior.',
      },
    },
  },
  argTypes: {
    dismissible: { control: 'boolean' },
    spotlightPadding: { control: { type: 'number', min: 0, max: 24 } },
    label: { control: 'text' },
    onOpenChange: { action: 'openChange' },
    onStepChange: { action: 'stepChange' },
    onFinish: { action: 'finish' },
    onSkip: { action: 'skip' },
  },
  args: {
    steps: [],
    label: 'Novidades do painel',
    dismissible: true,
    spotlightPadding: 8,
  },
} satisfies Meta<typeof Tour>

export default meta
type Story = StoryObj<typeof meta>

const panel: CSSProperties = {
  display: 'grid',
  gap: 16,
  padding: 20,
  border: '1px solid var(--or-color-border)',
  background: 'var(--or-color-surface)',
  maxWidth: 640,
}
const row: CSSProperties = { display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }
const stat: CSSProperties = {
  flex: '1 1 140px',
  padding: 12,
  border: '1px solid var(--or-color-border)',
}

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    const filtersRef = useRef<HTMLDivElement>(null)
    const statsRef = useRef<HTMLDivElement>(null)
    const exportRef = useRef<HTMLButtonElement>(null)
    const steps: TourStep[] = [
      {
        target: filtersRef,
        title: 'Filtre por status',
        content: 'Separe os pedidos em aberto, em separação e enviados com um clique.',
      },
      {
        target: statsRef,
        title: 'Indicadores do dia',
        content: 'Os números se atualizam sozinhos conforme os pedidos chegam.',
        placement: 'top',
      },
      {
        target: exportRef,
        title: 'Exporte em planilha',
        content: 'Baixe os pedidos filtrados para conciliar com o financeiro.',
        placement: 'left',
      },
    ]
    return (
      <div style={{ display: 'grid', gap: 16 }}>
        <div>
          <Button onClick={() => setOpen(true)}>Iniciar tour</Button>
        </div>
        <section style={panel} aria-label="Painel de pedidos">
          <div style={{ ...row, justifyContent: 'space-between' }}>
            <div ref={filtersRef} style={row}>
              <Button size="sm" variant="secondary">
                Em aberto
              </Button>
              <Button size="sm" variant="ghost">
                Em separação
              </Button>
              <Button size="sm" variant="ghost">
                Enviados
              </Button>
            </div>
            <Button ref={exportRef} size="sm" variant="outline">
              Exportar
            </Button>
          </div>
          <div ref={statsRef} style={row}>
            <div style={stat}>
              <div className="or-eyebrow">Pedidos hoje</div>
              <strong>128</strong>
            </div>
            <div style={stat}>
              <div className="or-eyebrow">Em separação</div>
              <strong>23</strong>
            </div>
            <div style={stat}>
              <div className="or-eyebrow">Atrasados</div>
              <strong>4</strong>
            </div>
          </div>
        </section>
        <Tour {...args} steps={steps} open={open} onOpenChange={setOpen} />
      </div>
    )
  },
}

export const Centered: Story = {
  name: 'Sem alvo (centralizado)',
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Ver novidade
        </Button>
        <Tour
          {...args}
          label="Novidade"
          open={open}
          onOpenChange={setOpen}
          steps={[
            {
              title: 'Relatórios agendados',
              content: 'Agora você pode receber o resumo de vendas toda segunda-feira, às 8h, no seu e-mail.',
              media: (
                <svg viewBox="0 0 320 120" role="img" aria-label="Calendário com a segunda-feira destacada">
                  <rect width="320" height="120" fill="var(--or-color-bg-subtle)" />
                  {Array.from({ length: 7 }, (_, i) => (
                    <rect
                      key={i}
                      x={28 + i * 40}
                      y={36}
                      width={32}
                      height={48}
                      fill={i === 0 ? 'var(--or-color-accent)' : 'none'}
                      stroke="var(--or-color-border-strong)"
                    />
                  ))}
                </svg>
              ),
            },
          ]}
        />
      </>
    )
  },
}

export const Controlled: Story = {
  name: 'Controlado',
  render: (args) => {
    const [open, setOpen] = useState(false)
    const [step, setStep] = useState(0)
    const searchRef = useRef<HTMLInputElement>(null)
    const helpRef = useRef<HTMLButtonElement>(null)
    return (
      <div style={{ display: 'grid', gap: 16 }}>
        <div style={row}>
          <input
            ref={searchRef}
            aria-label="Buscar pedido"
            placeholder="Buscar pedido"
            className="or-control"
            style={{ maxWidth: 240 }}
          />
          <Button ref={helpRef} variant="ghost">
            Ajuda
          </Button>
          <Button
            onClick={() => {
              setStep(0)
              setOpen(true)
            }}
          >
            Começar tour
          </Button>
        </div>
        <p style={{ margin: 0 }}>
          Passo atual: {step + 1} · {open ? 'aberto' : 'fechado'}
        </p>
        <Tour
          {...args}
          open={open}
          onOpenChange={setOpen}
          step={step}
          onStepChange={setStep}
          steps={[
            { target: searchRef, title: 'Busca de pedidos', content: 'Digite o número do pedido ou o nome da loja.' },
            { target: helpRef, title: 'Ajuda sempre à mão', content: 'Você pode rever este tour a qualquer momento por aqui.' },
          ]}
        />
      </div>
    )
  },
}

export const NotDismissible: Story = {
  name: 'Sem saída antecipada',
  args: { dismissible: false },
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Abrir</Button>
        <Tour
          {...args}
          label="Antes de começar"
          open={open}
          onOpenChange={setOpen}
          steps={[
            { title: 'Termos atualizados', content: 'Revisamos como tratamos os dados dos pedidos.' },
            { title: 'Tudo certo', content: 'Conclua para continuar usando o painel.' },
          ]}
        />
      </>
    )
  },
}
