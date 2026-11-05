import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@orangesys/ui'

export default function Flush() {
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <Accordion variant="flush" type="multiple" headingLevel={4} defaultValue={['conta']}>
        <AccordionItem value="conta">
          <AccordionTrigger>Conta</AccordionTrigger>
          <AccordionContent>Nome, e-mail de acesso, idioma e fuso horário.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="seguranca">
          <AccordionTrigger>Segurança</AccordionTrigger>
          <AccordionContent>Senha, verificação em duas etapas e sessões ativas.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="sso" disabled>
          <AccordionTrigger>Login único (SSO) — plano Empresa</AccordionTrigger>
          <AccordionContent>Configure SAML ou OIDC com o provedor de identidade da sua empresa.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
