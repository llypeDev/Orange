import { Button, Icon, Reveal } from '@orange/ui'

export default function Sequencia() {
  return (
    <div className="guide-stack">
      {/* Elementos que não são irmãos: index soma 80ms por posição; delay adiciona um atraso fixo */}
      <Reveal index={0}>
        <span className="or-eyebrow">Plano Pro</span>
      </Reveal>
      <Reveal index={1}>
        <h4 className="guide-reveal-title">Tudo o que sua loja precisa para crescer</h4>
      </Reveal>
      <Reveal index={2}>
        <p className="guide-reveal-text">Até 10 lojas, relatórios diários e suporte em português.</p>
      </Reveal>
      <Reveal index={3} delay={120} variant="fade">
        <Button endIcon={<Icon name="arrow-right" />}>Assinar o Pro</Button>
      </Reveal>
    </div>
  )
}
