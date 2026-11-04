import { Button, Field, useFieldControlProps } from '@orange/ui'
import { useState } from 'react'

function CampoCupom({ valor, onChange }: { valor: string; onChange: (v: string) => void }) {
  const props = useFieldControlProps()
  return (
    <input {...props} className="or-control" value={valor} onChange={(e) => onChange(e.target.value)} placeholder="LARANJA10" />
  )
}

export default function TremorDeErro() {
  const [cupom, setCupom] = useState('')
  const [erro, setErro] = useState<string>()
  const [tremer, setTremer] = useState(false)
  return (
    <form
      className="guide-form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        const valido = cupom.trim().toUpperCase() === 'LARANJA10'
        setErro(valido ? undefined : 'Cupom inválido. Confira as letras e os números.')
        setTremer(!valido)
      }}
    >
      {/* or-shake roda uma vez; a classe sai no fim para poder tremer de novo no próximo erro */}
      <div
        className={tremer ? 'or-shake' : undefined}
        onAnimationEnd={(e) => e.target === e.currentTarget && setTremer(false)}
      >
        <Field label="Cupom de desconto" description="Experimente enviar vazio e depois LARANJA10." error={erro}>
          <CampoCupom valor={cupom} onChange={setCupom} />
        </Field>
      </div>
      <div>
        <Button type="submit">Aplicar cupom</Button>
      </div>
    </form>
  )
}
