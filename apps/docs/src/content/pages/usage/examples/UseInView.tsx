import { Icon, useInView } from '@orange/ui'

function Linha({ rotulo }: { rotulo: string }) {
  // once: false → volta a false quando sai da área visível
  const [ref, visivel] = useInView<HTMLLIElement>({ once: false, threshold: 0.5 })
  return (
    <li ref={ref} className="guide-inview-row" data-visible={visivel || undefined}>
      <span>{rotulo}</span>
      <strong>{visivel ? 'na tela' : 'fora da tela'}</strong>
    </li>
  )
}

export default function Observador() {
  return (
    <div className="guide-stage guide-stage--short" tabIndex={0} role="region" aria-label="Área rolável: useInView">
      <p className="guide-stage__hint">
        Role dentro da caixa <Icon name="arrow-down" size="sm" />
      </p>
      <ul className="guide-inview-list">
        {['Pedido #4821', 'Pedido #4822', 'Pedido #4823', 'Pedido #4824', 'Pedido #4825', 'Pedido #4826'].map((p) => (
          <Linha key={p} rotulo={p} />
        ))}
      </ul>
    </div>
  )
}
