const servicos = [
  { nome: 'API de pedidos', estado: 'Operacional', cor: 'var(--or-color-success)', vivo: true },
  { nome: 'Sincronização com ERP', estado: 'Lenta', cor: 'var(--or-color-warning)', vivo: true },
  { nome: 'Relatórios', estado: 'Em manutenção', cor: 'var(--or-color-text-subtle)', vivo: false },
]

export default function StatusAoVivo() {
  return (
    <ul className="guide-status-list">
      {servicos.map((s) => (
        <li key={s.nome}>
          {/* or-pulse: anel em box-shadow a cada --or-duration-loop (2,4s); a cor vem de --_pulse-color */}
          <span
            className={s.vivo ? 'guide-dot or-pulse' : 'guide-dot'}
            style={{ background: s.cor, ['--_pulse-color' as string]: s.cor }}
            aria-hidden="true"
          />
          <span>{s.nome}</span>
          <strong>{s.estado}</strong>
        </li>
      ))}
    </ul>
  )
}
