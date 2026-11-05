import { Button, Icon } from '@orangesys/ui'

export default function Pressionar() {
  return (
    <div className="guide-row">
      {/* or-press: o alvo afunda 1px e encolhe 1,5% em --or-duration-press (90ms) */}
      <button type="button" className="guide-tile or-press">
        <Icon name="zap" size="lg" />
        Pressione e segure
      </button>
      {/* O Button do Orange já faz o mesmo no :active */}
      <Button>Salvar alterações</Button>
    </div>
  )
}
