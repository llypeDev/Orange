import { Radio, RadioGroup } from '@orange/ui'

export default function WithDescriptions() {
  return (
    <RadioGroup
      label="Forma de entrega"
      description="O prazo começa a contar após a confirmação do pagamento."
      defaultValue="padrao"
    >
      <Radio value="padrao" label="Padrão — grátis" description="5 a 8 dias úteis" />
      <Radio value="expressa" label="Expressa — R$ 24,90" description="1 a 2 dias úteis" />
      <Radio value="retirada" label="Retirar na loja" description="Indisponível para o seu CEP" disabled />
    </RadioGroup>
  )
}
