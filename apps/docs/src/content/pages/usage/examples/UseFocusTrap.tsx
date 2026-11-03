import { Button, Icon, useClickOutside, useEscapeKey, useFocusTrap } from '@orange/ui'
import { useRef, useState } from 'react'

export default function ConfirmarExclusao() {
  const [aberto, setAberto] = useState(false)
  const painel = useRef<HTMLDivElement>(null)
  const fechar = () => setAberto(false)

  useFocusTrap(painel, aberto) // prende o Tab e devolve o foco ao fechar
  useEscapeKey(fechar, aberto) // Esc fecha
  useClickOutside(painel, fechar, aberto) // clique fora fecha

  return (
    <div className="guide-stack">
      <div>
        <Button variant="danger" startIcon={<Icon name="trash" size="sm" />} onClick={() => setAberto(true)}>
          Excluir projeto
        </Button>
      </div>
      {aberto && (
        <div
          ref={painel}
          role="dialog"
          aria-labelledby="confirmar-titulo"
          className="guide-panel guide-dialog"
        >
          <p id="confirmar-titulo" className="guide-dialog__title">
            Excluir “Loja Centro”?
          </p>
          <p>O projeto e os 32 pedidos ligados a ele serão removidos.</p>
          <div className="guide-row">
            <Button size="sm" variant="outline" onClick={fechar}>
              Cancelar
            </Button>
            <Button size="sm" variant="danger" onClick={fechar}>
              Excluir
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
