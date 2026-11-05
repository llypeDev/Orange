import { Button, Modal, ModalBody, ModalFooter } from '@orangesys/ui'

const clausulas = [
  'Coletamos apenas os dados necessários para operar sua conta: nome, e-mail e informações de uso.',
  'Os projetos ficam armazenados em servidores no Brasil e são copiados diariamente.',
  'Você pode exportar ou excluir seus dados a qualquer momento em Configurações → Privacidade.',
  'Integrações de terceiros só acessam os dados que você autorizar explicitamente.',
  'Avisaremos por e-mail com 30 dias de antecedência sobre mudanças nestes termos.',
  'Contas inativas por mais de 24 meses podem ser arquivadas após aviso prévio.',
  'O uso da API está sujeito aos limites do seu plano.',
  'Conteúdo publicado continua sendo seu; concedemos apenas a licença necessária para exibi-lo.',
]

export default function Scrolling() {
  return (
    <Modal
      title="Termos de uso"
      description="Versão de março de 2026"
      closeOnOverlayClick={false}
      trigger={<Button variant="outline">Revisar termos</Button>}
    >
      {({ close }) => (
        <>
          <ModalBody>
            <ol style={{ display: 'grid', gap: 12, paddingLeft: 20, margin: 0 }}>
              {[...clausulas, ...clausulas].map((texto, i) => (
                <li key={i}>{texto}</li>
              ))}
            </ol>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={close}>
              Recusar
            </Button>
            <Button onClick={close}>Aceitar termos</Button>
          </ModalFooter>
        </>
      )}
    </Modal>
  )
}
