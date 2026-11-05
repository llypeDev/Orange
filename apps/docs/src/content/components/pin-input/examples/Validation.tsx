import { Button, PinInput } from '@orangesys/ui'
import { useState } from 'react'

const CODIGO_CORRETO = '274913'

export default function Validation() {
  const [codigo, setCodigo] = useState('')
  const [erro, setErro] = useState<string>()
  const [tentativas, setTentativas] = useState(3)

  const verificar = (valor: string) => {
    if (valor === CODIGO_CORRETO) {
      setErro(undefined)
      return
    }
    const restantes = tentativas - 1
    setTentativas(restantes)
    setErro(
      restantes > 0
        ? `Código incorreto. ${restantes === 1 ? 'Resta 1 tentativa' : `Restam ${restantes} tentativas`}.`
        : 'Código bloqueado. Peça um novo código.',
    )
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <PinInput
        label="Confirme o código"
        description={`Para testar, use ${CODIGO_CORRETO}.`}
        size="lg"
        value={codigo}
        onChange={(valor) => {
          setCodigo(valor)
          if (valor.length < 6) setErro(undefined)
        }}
        onComplete={verificar}
        error={erro}
        disabled={tentativas === 0}
      />
      <p role="status" style={{ margin: 0, fontSize: 13, color: 'var(--or-color-success-text)' }}>
        {codigo === CODIGO_CORRETO ? 'Telefone confirmado!' : ''}
      </p>
      <div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setCodigo('')
            setErro(undefined)
            setTentativas(3)
          }}
        >
          Reenviar código
        </Button>
      </div>
    </div>
  )
}
