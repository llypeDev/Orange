# Accordion

Lista de seções que se expandem e recolhem, para revelar conteúdo sob demanda.

- Categoria: Exibição de dados · Status: estável
- Importação: `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/accordion (em inglês: https://orange.llypedev.com.br/en/components/accordion)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-accordion--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Accordion

## Boas práticas

- Use para conteúdo secundário que nem todos precisam ler: perguntas frequentes, detalhes de produto, configurações avançadas.
- Não esconda informação essencial para concluir a tarefa. Se o usuário precisa ver tudo, mostre tudo.
- Escreva cabeçalhos curtos e específicos, que antecipem o conteúdo. Ajuste `headingLevel` à hierarquia da página.
- Prefira `type="single"` quando os itens forem alternativas; `multiple` quando o usuário precisar comparar seções.

- Faça: Cabeçalho que descreve o conteúdo.
- Evite: Cabeçalhos genéricos como "Mais informações".

## Anatomia

- **Accordion** — Contêiner: controla quais itens estão abertos e a navegação por setas.
- **AccordionItem** — Agrupa um cabeçalho e um painel; recebe um value único.
- **AccordionTrigger** — Botão dentro de um heading, com o ícone quadrado "+"/"−".
- **AccordionContent** — Painel com role="region" rotulado pelo cabeçalho.

## Exemplos

### Perguntas frequentes

O padrão é type="single" e recolhível: abrir um item fecha o anterior, e clicar no aberto o fecha.

```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@orangesys/ui'

const questions = [
  {
    id: 'cobranca',
    question: 'Quando a cobrança é feita?',
    answer: 'A assinatura é cobrada no dia da contratação e renovada automaticamente a cada mês, no mesmo dia.',
  },
  {
    id: 'cancelar',
    question: 'Posso cancelar a qualquer momento?',
    answer: 'Sim. O cancelamento é imediato e você mantém o acesso até o fim do período já pago, sem multa.',
  },
  {
    id: 'nota',
    question: 'Como recebo a nota fiscal?',
    answer: 'A NFS-e é emitida em até 2 dias úteis após o pagamento e enviada para o e-mail de cobrança.',
  },
  {
    id: 'plano',
    question: 'Consigo mudar de plano depois?',
    answer: 'Pode trocar quando quiser. No upgrade, cobramos só a diferença proporcional aos dias restantes.',
  },
]

export default function Faq() {
  return (
    <Accordion headingLevel={4} defaultValue="cobranca" style={{ width: '100%' }}>
      {questions.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
```

### Vários abertos

Com type="multiple", cada item abre e fecha de forma independente.

```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@orangesys/ui'

export default function Multiple() {
  return (
    <Accordion type="multiple" headingLevel={4} defaultValue={['entrega', 'garantia']} style={{ width: '100%' }}>
      <AccordionItem value="descricao">
        <AccordionTrigger>Descrição</AccordionTrigger>
        <AccordionContent>
          Cadeira ergonômica com encosto em tela, apoio lombar regulável e braços 3D. Suporta até 120 kg.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="entrega">
        <AccordionTrigger>Entrega e montagem</AccordionTrigger>
        <AccordionContent>
          Entrega em até 7 dias úteis para capitais. A montagem leva cerca de 20 minutos e as ferramentas vão na caixa.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="garantia">
        <AccordionTrigger>Garantia</AccordionTrigger>
        <AccordionContent>
          12 meses contra defeitos de fabricação, estendidos para 24 meses no mecanismo de inclinação.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
```

### Controlado e não recolhível

Etapas de checkout: sempre há uma seção aberta (collapsible={false}) e o botão Continuar avança via value/onChange.

```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button } from '@orangesys/ui'
import { useState } from 'react'

const steps = [
  { id: 'entrega', title: '1. Endereço de entrega', body: 'Rua das Laranjeiras, 120 — Botafogo, Rio de Janeiro/RJ' },
  { id: 'pagamento', title: '2. Pagamento', body: 'Pix com 5% de desconto. O código expira em 30 minutos.' },
  { id: 'revisao', title: '3. Revisão do pedido', body: '3 itens · Frete grátis · Total de R$ 489,90' },
]

export default function Checkout() {
  const [step, setStep] = useState<string | null>('entrega')

  return (
    <Accordion
      headingLevel={4}
      collapsible={false}
      value={step}
      onChange={setStep}
      style={{ width: '100%' }}
    >
      {steps.map((item, index) => {
        const next = steps[index + 1]
        return (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>
              <p>{item.body}</p>
              {next ? (
                <Button size="sm" onClick={() => setStep(next.id)}>
                  Continuar
                </Button>
              ) : (
                <Button size="sm">Finalizar compra</Button>
              )}
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
```

### Sem moldura e item desabilitado

variant="flush" remove a caixa e mantém só as divisórias — bom para painéis laterais.

```tsx
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
```

## Movimento

- **Abrir** — Altura via grid-template-rows 0fr → 1fr em --or-duration-slow (400ms), --or-ease-out; o conteúdo entra com fade e 4px de deslocamento.
- **Fechar** — Mais curto: --or-duration-medium (250ms), --or-ease-in-out. O painel só recebe hidden quando a transição termina.
- **Ícone +/−** — A caixa gira 180° e a barra vertical deita, formando "−"; borda e fundo laranja. 250ms, --or-ease-spring.
- **Cabeçalho aberto e hover** — Texto do cabeçalho aberto em laranja; fundo de hover. --or-duration-fast (160ms).
- **Pressionar** — O ícone encolhe 12% em --or-duration-press (90ms).

## Props

### `Accordion`

Lista de seções que se expandem e recolhem (padrão "accordion" do WAI-ARIA).
Use com `AccordionItem`, `AccordionTrigger` e `AccordionContent`.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `collapsible` | `boolean` | — | Permite fechar o item aberto, deixando todos fechados. Padrão: `true`. |
| `defaultValue` | `string \| string[] \| null` | — | Item aberto inicialmente (não controlado). Itens abertos inicialmente (não controlado). |
| `disabled` | `boolean` | `false` | Desabilita todos os itens. |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | — | Nível semântico dos cabeçalhos (`h2`–`h6`). Padrão: 3. |
| `onChange` | `((value: string \| null) => void) \| ((value: string[]) => void)` | — | — |
| `type` | `"single" \| "multiple"` | — | `single`: apenas um item aberto por vez. `multiple`: vários itens podem ficar abertos ao mesmo tempo. |
| `value` | `string \| string[] \| null` | — | Item aberto (controlado). `null` fecha todos. Itens abertos (controlado). |
| `variant` | `"outline" \| "flush"` | — | `outline` (caixa com borda, padrão) ou `flush` (apenas divisórias). |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

### `AccordionContent`

Painel do item (`role="region"` rotulado pelo cabeçalho). Expande com
`grid-template-rows: 0fr → 1fr`, fica `inert` assim que fecha e só recebe `hidden` quando a
transição de saída termina (`usePresence`). Sem movimento em `prefers-reduced-motion`.

Sem props próprias.

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

### `AccordionItem`

Um item do Accordion: agrupa um `AccordionTrigger` e um `AccordionContent`.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `value` (obrigatória) | `string` | — | Identificador único do item dentro do Accordion. |
| `disabled` | `boolean` | `false` | Desabilita o item. |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

### `AccordionTrigger`

Cabeçalho do item: um `<button>` com `aria-expanded` dentro de um heading.
O ícone de caixa quadrada mostra "+" fechado e "−" aberto.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | — | Sobrescreve o nível do cabeçalho definido no Accordion. |

Repassa também os atributos nativos (`ButtonHTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

Segue o padrão **Accordion** do WAI-ARIA APG: cada cabeçalho é um `<button>` dentro de um heading, com `aria-expanded` e `aria-controls`; o painel tem `role="region"` e `aria-labelledby`. Painéis fechados ficam com `hidden`, fora da ordem de tabulação. No modo single não recolhível, o cabeçalho aberto recebe `aria-disabled="true"`.

| Teclas | Ação |
| --- | --- |
| `Enter` | Abre ou fecha o item focado. |
| `Space` | Abre ou fecha o item focado. |
| `Tab` | Move para o próximo elemento focável (cabeçalhos e conteúdo aberto). |
| `↓` | Foca o próximo cabeçalho (volta ao primeiro no fim). |
| `↑` | Foca o cabeçalho anterior (vai ao último no início). |
| `Home` | Foca o primeiro cabeçalho. |
| `End` | Foca o último cabeçalho. |

- **1.3.1** — Botões dentro de headings preservam a estrutura do documento.
- **2.1.1** — Todas as ações disponíveis pelo teclado, com setas, Home e End.
- **2.3.3** — A animação de altura é desativada com prefers-reduced-motion.
- **2.4.7** — Foco visível com contorno de 2px.
- **4.1.2** — Estado exposto com `aria-expanded`; painel ligado por `aria-controls`.
