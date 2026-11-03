import { Button, Field, Modal, ModalBody, ModalFooter } from '@orange/ui'
import { useRef, useState } from 'react'

export default function Controlled() {
  const [open, setOpen] = useState(false)
  const [nome, setNome] = useState('Site institucional')
  const [rascunho, setRascunho] = useState(nome)
  const inputRef = useRef<HTMLInputElement>(null)

  const abrir = () => {
    setRascunho(nome)
    setOpen(true)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <span>
        Projeto: <strong>{nome}</strong>
      </span>
      <Button variant="outline" onClick={abrir}>
        Renomear
      </Button>
      <Modal title="Renomear projeto" size="sm" open={open} onOpenChange={setOpen} initialFocus={inputRef}>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            setNome(rascunho.trim() || nome)
            setOpen(false)
          }}
        >
          <ModalBody>
            <Field label="Nome do projeto" controlId="renomear-projeto" required>
              <input
                ref={inputRef}
                id="renomear-projeto"
                className="or-control"
                value={rascunho}
                onChange={(event) => setRascunho(event.target.value)}
                required
              />
            </Field>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar nome</Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  )
}
