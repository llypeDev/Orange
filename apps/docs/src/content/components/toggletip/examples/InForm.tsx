import { Field, Toggletip } from '@orangesys/ui'

export default function InForm() {
  return (
    <div style={{ width: '100%', maxWidth: 360 }}>
      <Field
        label="Limite de requisições"
        controlId="limite-api"
        labelAside={
          <Toggletip
            label="Sobre o limite de requisições"
            placement="right"
            content={
              <>
                Quantidade máxima de chamadas por minuto, por chave de API. Acima disso, a API
                responde com <strong>429</strong>.
              </>
            }
          />
        }
      >
        <input id="limite-api" type="number" className="or-control" defaultValue={600} />
      </Field>
    </div>
  )
}
