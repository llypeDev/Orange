import { Icon, useScrollDirection } from '@orangesys/ui'

export default function DirecaoDaRolagem() {
  const { direction, pastThreshold } = useScrollDirection({ threshold: 120, tolerance: 6 })
  return (
    <dl className="guide-kv">
      <dt>direction</dt>
      <dd>
        <Icon name={direction === 'down' ? 'arrow-down' : 'arrow-up'} size="sm" /> {direction}
      </dd>
      <dt>pastThreshold</dt>
      <dd>{String(pastThreshold)}</dd>
      <dt>esconder cabeçalho?</dt>
      <dd>{direction === 'down' && pastThreshold ? 'sim' : 'não'}</dd>
    </dl>
  )
}
