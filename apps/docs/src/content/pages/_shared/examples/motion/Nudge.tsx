import { Icon } from '@orangesys/ui'

export default function SetaQueEmpurra() {
  return (
    <div className="guide-row">
      {/* or-nudge no alvo + or-nudge__icon no ícone: a seta desliza 4px no hover e no foco */}
      <a href="#empurrar" className="guide-link or-nudge">
        Ver todos os pedidos
        <Icon name="arrow-right" size="sm" className="or-nudge__icon" />
      </a>
      <a href="#empurrar" className="guide-link or-nudge">
        Documentação da API
        <Icon name="arrow-up-right" size="sm" className="or-nudge__icon" />
      </a>
    </div>
  )
}
