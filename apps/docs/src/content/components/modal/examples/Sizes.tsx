import { Button, Modal, ModalBody, ModalFooter, type ModalSize } from '@orange/ui'

const sizes: { size: ModalSize; label: string }[] = [
  { size: 'sm', label: 'Pequeno (400px)' },
  { size: 'md', label: 'Médio (560px)' },
  { size: 'lg', label: 'Grande (800px)' },
  { size: 'full', label: 'Tela inteira' },
]

export default function Sizes() {
  return (
    <>
      {sizes.map(({ size, label }) => (
        <Modal
          key={size}
          size={size}
          title={label}
          description="A largura acompanha a quantidade de conteúdo."
          trigger={<Button variant="outline">{label}</Button>}
        >
          {({ close }) => (
            <>
              <ModalBody>
                <p>
                  Use <strong>sm</strong> para confirmações curtas, <strong>md</strong> para
                  formulários simples, <strong>lg</strong> para tabelas e prévias e{' '}
                  <strong>full</strong> para editores e fluxos longos.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button onClick={close}>Entendi</Button>
              </ModalFooter>
            </>
          )}
        </Modal>
      ))}
    </>
  )
}
