import { useState } from 'react'

const periodos = ['Dia', 'Semana', 'Mês', 'Ano']

export default function IndicadorDeslizante() {
  const [ativo, setAtivo] = useState(1)
  return (
    <div className="guide-seg" role="group" aria-label="Período do relatório">
      {/* O indicador desliza com transform e --or-ease-spring; não é medido em JS */}
      <span
        className="guide-seg__indicator"
        aria-hidden="true"
        style={{ transform: `translateX(${ativo * 100}%)`, width: `${100 / periodos.length}%` }}
      />
      {periodos.map((periodo, i) => (
        <button key={periodo} type="button" aria-pressed={ativo === i} onClick={() => setAtivo(i)}>
          {periodo}
        </button>
      ))}
    </div>
  )
}
