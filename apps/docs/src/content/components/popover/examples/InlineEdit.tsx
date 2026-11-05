import { Button, Field, Popover } from '@orangesys/ui'
import { useRef, useState } from 'react'

export default function InlineEdit() {
  const [meta, setMeta] = useState(120)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span>
        Meta mensal: <strong>{meta} vendas</strong>
      </span>
      <Popover
        title="Editar meta"
        placement="bottom-start"
        initialFocus={inputRef}
        trigger={
          <Button size="sm" variant="ghost">
            Editar
          </Button>
        }
      >
        {({ close }) => (
          <form
            style={{ display: 'grid', gap: 12, width: 240 }}
            onSubmit={(event) => {
              event.preventDefault()
              const valor = Number(new FormData(event.currentTarget).get('meta'))
              if (valor > 0) setMeta(valor)
              close()
            }}
          >
            <Field label="Vendas por mês" controlId="meta-mensal">
              <input
                ref={inputRef}
                id="meta-mensal"
                name="meta"
                type="number"
                min={1}
                defaultValue={meta}
                className="or-control"
              />
            </Field>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button size="sm" variant="outline" onClick={close}>
                Cancelar
              </Button>
              <Button size="sm" type="submit">
                Salvar
              </Button>
            </div>
          </form>
        )}
      </Popover>
    </div>
  )
}
