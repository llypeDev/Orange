import { Button, Icon, useClipboard } from '@orangesys/ui'

export default function Cupom() {
  const { copy, copied } = useClipboard(2000)
  const codigo = 'LARANJA10'
  return (
    <div className="guide-row">
      <code className="guide-coupon">{codigo}</code>
      <Button
        variant="outline"
        startIcon={<Icon name={copied ? 'check' : 'copy'} size="sm" />}
        onClick={() => copy(codigo)}
      >
        {copied ? 'Copiado' : 'Copiar cupom'}
      </Button>
      <span role="status" className="or-visually-hidden">
        {copied ? 'Cupom copiado para a área de transferência' : ''}
      </span>
    </div>
  )
}
