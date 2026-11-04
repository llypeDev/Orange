import { useId } from '@orange/ui'

function CampoCep() {
  const id = useId('cep')
  return (
    <div className="guide-stack" style={{ maxWidth: '18rem' }}>
      <label htmlFor={id} className="guide-label">
        CEP
      </label>
      <input
        id={id}
        className="or-control"
        inputMode="numeric"
        autoComplete="postal-code"
        aria-describedby={`${id}-dica`}
        placeholder="00000-000"
      />
      <p id={`${id}-dica`} className="guide-live">
        Usamos o CEP para calcular o frete. id gerado: <strong>{id}</strong>
      </p>
    </div>
  )
}

export default function DoisCampos() {
  return (
    <>
      <CampoCep />
      <CampoCep />
    </>
  )
}
