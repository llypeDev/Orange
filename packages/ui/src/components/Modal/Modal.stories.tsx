import type { Meta, StoryObj } from '@storybook/react-vite'
import { useRef, useState } from 'react'
import { Button } from '../Button'
import { Modal, ModalBody, ModalFooter } from './Modal'

const meta = {
  title: 'Componentes/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Diálogo modal (`role="dialog"` + `aria-modal`). Prende o foco, devolve-o ao gatilho ao fechar, bloqueia o scroll da página e fecha com Escape ou clique no fundo. Monte o conteúdo com `ModalBody` (rola internamente) e `ModalFooter` (ações à direita).',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'full'] },
    closeOnOverlayClick: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
    hideCloseButton: { control: 'boolean' },
    onOpenChange: { action: 'openChange' },
  },
  args: {
    title: 'Convidar pessoas',
    description: 'Elas receberão um e-mail com acesso ao projeto.',
    size: 'md',
    closeOnOverlayClick: true,
    closeOnEscape: true,
    hideCloseButton: false,
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Modal {...args} trigger={<Button>Convidar pessoas</Button>}>
      {({ close }) => (
        <>
          <ModalBody>
            <label htmlFor="sb-modal-email" style={{ display: 'block', marginBottom: 6 }}>
              E-mail
            </label>
            <input id="sb-modal-email" type="email" placeholder="nome@empresa.com" style={{ width: '100%', padding: 8 }} />
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
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12 }}>
      {(['sm', 'md', 'lg', 'full'] as const).map((size) => (
        <Modal key={size} {...args} size={size} title={`Tamanho ${size}`} trigger={<Button variant="outline">{size}</Button>}>
          <ModalBody>Conteúdo do diálogo no tamanho {size}.</ModalBody>
        </Modal>
      ))}
    </div>
  ),
}

export const ScrollingBody: Story = {
  args: { title: 'Termos de uso', description: 'Versão de março de 2026.' },
  render: (args) => (
    <Modal {...args} trigger={<Button variant="outline">Ler termos</Button>}>
      {({ close }) => (
        <>
          <ModalBody>
            {Array.from({ length: 14 }, (_, i) => (
              <p key={i}>
                {i + 1}. O serviço é fornecido como está. Ao continuar, você concorda com as condições de uso,
                privacidade e retenção de dados descritas nesta seção.
              </p>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={close}>
              Recusar
            </Button>
            <Button onClick={close}>Aceitar</Button>
          </ModalFooter>
        </>
      )}
    </Modal>
  ),
}

export const Controlled: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false)
    const confirmRef = useRef<HTMLButtonElement>(null)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Publicar alterações</Button>
        <Modal {...args} title="Publicar alterações?" description="O site será atualizado para todos os visitantes." open={open} onOpenChange={setOpen} initialFocus={confirmRef} size="sm">
          <ModalFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Agora não
            </Button>
            <Button ref={confirmRef} onClick={() => setOpen(false)}>
              Publicar
            </Button>
          </ModalFooter>
        </Modal>
      </>
    )
  },
}
