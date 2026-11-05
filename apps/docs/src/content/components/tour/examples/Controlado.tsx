import { Button, Icon, Search, Tour, type TourStep } from '@orangesys/ui'
import { useRef, useState } from 'react'

export default function Controlado() {
  const [aberto, setAberto] = useState(false)
  const [passo, setPasso] = useState(0)
  const [evento, setEvento] = useState('Tour ainda não iniciado.')
  const buscaRef = useRef<HTMLDivElement>(null)
  const novoRef = useRef<HTMLButtonElement>(null)
  const ajudaRef = useRef<HTMLButtonElement>(null)

  const passos: TourStep[] = [
    {
      target: buscaRef,
      title: 'Encontre qualquer pedido',
      content: 'Busque pelo número do pedido ou pelo nome da loja.',
    },
    {
      target: novoRef,
      title: 'Lance pedidos manuais',
      content: 'Para vendas por telefone ou no balcão, cadastre o pedido aqui.',
    },
    {
      target: ajudaRef,
      title: 'Reveja quando quiser',
      content: 'Este tour fica disponível no menu Ajuda.',
    },
  ]

  const iniciar = (indice: number) => {
    setPasso(indice)
    setAberto(true)
    setEvento(`Tour iniciado no passo ${indice + 1}.`)
  }

  return (
    <div style={{ display: 'grid', gap: 16, width: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
          padding: 12,
          border: '1px solid var(--or-color-border)',
          background: 'var(--or-color-surface)',
        }}
      >
        <div ref={buscaRef} style={{ flex: '1 1 220px', maxWidth: 320 }}>
          <Search label="Buscar pedidos" hideLabel placeholder="Buscar pedidos" size="sm" />
        </div>
        <Button ref={novoRef} size="sm" startIcon={<Icon name="plus" />}>
          Novo pedido
        </Button>
        <Button ref={ajudaRef} size="sm" variant="ghost" startIcon={<Icon name="help-circle" />}>
          Ajuda
        </Button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Button variant="secondary" onClick={() => iniciar(0)}>
          Começar tour
        </Button>
        <Button variant="ghost" onClick={() => iniciar(2)}>
          Ir direto para “Ajuda”
        </Button>
      </div>
      <p style={{ margin: 0, fontSize: 'var(--or-text-sm)', color: 'var(--or-color-text-muted)' }}>
        Último evento: {evento}
      </p>

      <Tour
        label="Primeiros passos"
        steps={passos}
        open={aberto}
        onOpenChange={setAberto}
        step={passo}
        onStepChange={(proximo) => {
          setPasso(proximo)
          setEvento(`Passo ${proximo + 1} de ${passos.length}.`)
        }}
        onFinish={() => setEvento('Tour concluído.')}
        onSkip={(atual) => setEvento(`Tour pulado no passo ${atual + 1}.`)}
      />
    </div>
  )
}
