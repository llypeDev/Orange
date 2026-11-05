import { Button, Field, Modal, ModalBody, ModalFooter } from '@orangesys/ui'

export default function Basic() {
  return (
    <Modal
      title="Convidar pessoas"
      description="Elas receberão um e-mail com acesso ao projeto Site 2026."
      trigger={<Button>Convidar pessoas</Button>}
    >
      {({ close }) => (
        <>
          <ModalBody>
            <div style={{ display: 'grid', gap: 16 }}>
              <Field
                label="E-mail"
                controlId="convite-email"
                description="Separe vários endereços com vírgula."
              >
                <input
                  id="convite-email"
                  className="or-control"
                  type="email"
                  placeholder="nome@empresa.com"
                />
              </Field>
              <Field label="Permissão" controlId="convite-permissao">
                <select id="convite-permissao" className="or-control" defaultValue="editar">
                  <option value="ver">Pode ver</option>
                  <option value="comentar">Pode comentar</option>
                  <option value="editar">Pode editar</option>
                </select>
              </Field>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={close}>
              Cancelar
            </Button>
            <Button onClick={close}>Enviar convite</Button>
          </ModalFooter>
        </>
      )}
    </Modal>
  )
}
