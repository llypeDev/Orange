import { useScrollDirection } from '@orange/ui'

export default function CabecalhoQueSeEsconde() {
  const { direction, pastThreshold } = useScrollDirection({ threshold: 160 })
  const escondido = direction === 'down' && pastThreshold
  return (
    <div className="guide-stack">
      <div className="guide-header-mock">
        {/* translateY(-100%) com --or-ease-in-out; volta ao rolar para cima */}
        <div className="guide-header-mock__bar" data-hidden={escondido || undefined}>
          <span className="guide-header-mock__logo" aria-hidden="true" />
          Minha loja
        </div>
      </div>
      <p className="guide-live" role="status">
        direction: <strong>{direction}</strong> · pastThreshold: <strong>{String(pastThreshold)}</strong>
      </p>
    </div>
  )
}
