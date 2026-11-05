import { Badge, Button, Icon, SegmentedControl, Stat, StatGroup, Tour, type TourStep } from '@orange/ui'
import { useRef, useState } from 'react'

export default function PainelPedidos() {
  const [aberto, setAberto] = useState(false)
  const [status, setStatus] = useState('abertos')
  // Os alvos são elementos deste próprio painel (refs), nunca o resto da página.
  const aoVivoRef = useRef<HTMLSpanElement>(null)
  const filtrosRef = useRef<HTMLDivElement>(null)
  const indicadoresRef = useRef<HTMLDListElement>(null)
  const exportarRef = useRef<HTMLButtonElement>(null)

  const passos: TourStep[] = [
    {
      target: aoVivoRef,
      title: 'Pedidos em tempo real',
      content: 'O painel agora se atualiza sozinho: novos pedidos entram na lista sem recarregar a página.',
    },
    {
      target: filtrosRef,
      title: 'Filtre por status',
      content: 'Alterne entre pedidos em aberto, em separação e enviados com um clique.',
    },
    {
      target: indicadoresRef,
      title: 'Indicadores do dia',
      content: 'Volume, separação e atrasos ficam no topo da lista — sem abrir outro relatório.',
      placement: 'top',
    },
    {
      target: exportarRef,
      title: 'Exporte em planilha',
      content: 'Baixe os pedidos filtrados para conciliar com o financeiro.',
      placement: 'left',
    },
  ]

  return (
    <div style={{ display: 'grid', gap: 16, width: '100%' }}>
      <div>
        <Button startIcon={<Icon name="sparkle" />} onClick={() => setAberto(true)}>
          Conheça o novo painel de pedidos
        </Button>
      </div>

      <section
        aria-label="Painel de pedidos (demonstração)"
        style={{
          display: 'grid',
          gap: 16,
          padding: 20,
          border: '1px solid var(--or-color-border)',
          background: 'var(--or-color-surface)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <strong style={{ fontFamily: 'var(--or-font-display)', fontSize: 'var(--or-text-lg)' }}>Pedidos</strong>
            <span
              ref={aoVivoRef}
              className="or-eyebrow"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '2px 0' }}
            >
              <Badge dot pulse tone="success" />
              Ao vivo
            </span>
          </div>
          <Button ref={exportarRef} variant="outline" size="sm" startIcon={<Icon name="download" />}>
            Exportar
          </Button>
        </div>

        <div ref={filtrosRef} style={{ justifySelf: 'start', maxWidth: '100%' }}>
          <SegmentedControl
            label="Status dos pedidos"
            hideLabel
            size="sm"
            value={status}
            onChange={setStatus}
            options={[
              { value: 'abertos', label: 'Em aberto' },
              { value: 'separacao', label: 'Em separação' },
              { value: 'enviados', label: 'Enviados' },
            ]}
          />
        </div>

        <StatGroup ref={indicadoresRef} size="sm">
          <Stat label="Pedidos hoje" value={128} delta="12%" trend="increase" help="vs. ontem" />
          <Stat label="Em separação" value={23} help="7 aguardando estoque" />
          <Stat label="Atrasados" value={4} delta="2" trend="decrease" deltaTone="positive" help="vs. ontem" />
        </StatGroup>
      </section>

      <Tour label="Novidades do painel" steps={passos} open={aberto} onOpenChange={setAberto} />
    </div>
  )
}
