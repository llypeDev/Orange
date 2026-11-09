# RadioGroup

Escolha única entre poucas opções, com radios nativos, setas do teclado e variante em cartões.

- Categoria: Formulários · Status: estável
- Importação: `import { RadioGroup, Radio } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/radio-group (em inglês: https://orange.llypedev.com.br/en/components/radio-group)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-radiogroup--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/RadioGroup

## Boas práticas

- Use radios para até ~6 opções mutuamente exclusivas que a pessoa precisa comparar. Com muitas opções, use Select.
- Ordene as opções de forma lógica (do menor para o maior, do mais comum para o menos comum).
- Pré-selecione uma opção apenas quando houver um padrão seguro; em decisões importantes (pagamento, plano), deixe sem seleção.
- A variante `card` funciona bem quando cada opção tem descrição relevante, como planos e fretes.

## Exemplos

### Básico

```tsx
import { RadioGroup } from '@orangesys/ui'

export default function Basic() {
  return (
    <RadioGroup
      label="Com que frequência quer receber relatórios?"
      name="frequencia"
      defaultValue="semanal"
      options={[
        { value: 'diario', label: 'Diariamente' },
        { value: 'semanal', label: 'Semanalmente' },
        { value: 'mensal', label: 'Mensalmente' },
        { value: 'nunca', label: 'Não quero receber' },
      ]}
    />
  )
}
```

### Com descrições

Usando filhos `<Radio>`. A descrição de cada opção é ligada por `aria-describedby`.

```tsx
import { Radio, RadioGroup } from '@orangesys/ui'

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
```

### Cartões

O cartão inteiro é clicável; a borda fica laranja na opção selecionada.

```tsx
import { RadioGroup } from '@orangesys/ui'

export default function Cards() {
  return (
    <div style={{ width: '100%' }}>
      <RadioGroup
        label="Escolha um plano"
        variant="card"
        orientation="horizontal"
        defaultValue="pro"
        options={[
          { value: 'gratis', label: 'Gratuito', description: 'Até 3 projetos e 1 GB de armazenamento.' },
          { value: 'pro', label: 'Pro — R$ 49/mês', description: 'Projetos ilimitados, 100 GB e histórico de versões.' },
          { value: 'empresa', label: 'Empresa', description: 'SSO, auditoria e suporte dedicado.' },
        ]}
      />
    </div>
  )
}
```

### Horizontal e controlado

```tsx
import { RadioGroup, Stack } from '@orangesys/ui'
import { useState } from 'react'

export default function Horizontal() {
  const [size, setSize] = useState<string | null>('m')

  return (
    <Stack gap={3}>
      <RadioGroup
        label="Tamanho"
        orientation="horizontal"
        value={size}
        onChange={setSize}
        options={['PP', 'P', 'M', 'G', 'GG'].map((s) => ({ value: s.toLowerCase(), label: s }))}
      />
      <p style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-subtle)' }}>Selecionado: {size?.toUpperCase()}</p>
    </Stack>
  )
}
```

### Validação

Envie sem escolher para ver o erro do grupo.

```tsx
import { Button, RadioGroup } from '@orangesys/ui'
import { useState, type FormEvent } from 'react'

export default function Validation() {
  const [payment, setPayment] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <form onSubmit={onSubmit} noValidate style={{ display: 'grid', gap: 20 }}>
      <RadioGroup
        label="Forma de pagamento"
        required
        value={payment}
        onChange={setPayment}
        error={submitted && !payment ? 'Escolha uma forma de pagamento.' : undefined}
        options={[
          { value: 'pix', label: 'Pix', description: 'Aprovação na hora.' },
          { value: 'cartao', label: 'Cartão de crédito', description: 'Em até 12x.' },
          { value: 'boleto', label: 'Boleto', description: 'Compensa em até 3 dias úteis.' },
        ]}
      />
      <div>
        <Button type="submit">Finalizar compra</Button>
      </div>
    </form>
  )
}
```

## Props

### `RadioGroup`

Grupo de botões de opção para uma escolha única entre poucas alternativas,
com `<fieldset>`/`<legend>` e radios nativos — Tab entra no grupo e as setas
mudam a seleção.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `label` (obrigatória) | `ReactNode` | — | Pergunta ou título do grupo, renderizado como `<legend>`. |
| `defaultValue` | `string \| null` | `null` | Valor selecionado inicialmente (não controlado). |
| `description` | `ReactNode` | — | Texto de ajuda do grupo, ligado por `aria-describedby`. |
| `disabled` | `boolean` | `false` | Desabilita nativamente todas as opções. |
| `error` | `ReactNode` | — | Mensagem de erro do grupo. |
| `hideLabel` | `boolean` | — | Oculta a legenda visualmente (continua acessível). |
| `invalid` | `boolean` | — | Força o estado inválido sem exibir mensagem (ex.: erro mostrado em um ErrorSummary). |
| `name` | `string` | — | `name` compartilhado pelas opções. Gerado automaticamente se omitido. |
| `onChange` | `((value: string) => void)` | — | Chamado com o valor da opção escolhida. |
| `optional` | `boolean` | — | Mostra "(opcional)" ao lado da legenda. |
| `options` | `RadioGroupOption[]` | — | Opções geradas automaticamente. Alternativa a passar `<Radio>` como filhos. |
| `orientation` | `"horizontal" \| "vertical"` | `vertical` | Disposição das opções. Padrão: `vertical`. |
| `required` | `boolean` | `false` | Exige uma escolha: aplica `required` nativo a todas as opções. |
| `value` | `string \| null` | — | Valor selecionado (controlado). `null` = nenhum. |
| `variant` | `"default" \| "card"` | `default` | `card` mostra cada opção em um cartão com borda (laranja quando selecionado). |

Repassa também os atributos nativos (`FieldsetHTMLAttributes`) do `<fieldset>`, como `name`, `form` e `disabled`, além de `className`, `style`, `aria-*`, `data-*` e eventos.

### `Radio`

Opção de um `RadioGroup`: `<input type="radio">` nativo estilizado. As setas
do teclado movem a seleção entre as opções (comportamento nativo).
A `ref` e as props nativas vão para o `<input>`; `className` e `style`, para o contêiner.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `label` (obrigatória) | `ReactNode` | — | Rótulo da opção (clicável). |
| `value` (obrigatória) | `string` | — | Valor enviado quando esta opção está selecionada. |
| `description` | `ReactNode` | — | Texto de apoio da opção, ligado por `aria-describedby`. |

Repassa também os atributos nativos (`InputHTMLAttributes`) do `<input>`, como `name`, `required`, `disabled`, `readOnly`, `autoComplete`, `placeholder` e `onBlur`, além de `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`RadioGroupOption`:

```ts
export interface RadioGroupOption {
  value: string
  label: ReactNode
  description?: ReactNode
  disabled?: boolean
}
```

`RadioGroupVariant`:

```ts
export type RadioGroupVariant = 'default' | 'card'
```

## Movimento

Interações rápidas e geométricas, só com tokens de duração e curva. Com `prefers-reduced-motion`, as durações vão a zero e os estados mudam na hora — o movimento nunca é a única pista de estado.

- **Hover e foco** — Borda mais forte e anel laranja suave — 160ms, --or-ease-out.
- **Selecionar** — O ponto entra com or-scale-in (250ms, --or-ease-bounce); o ponto anterior sai em 160ms (--or-ease-in-out).
- **Pressionar** — O indicador afunda 1px (scale 0.92) em 90ms.
- **Cartões (variant="card")** — Borda em 160ms; fundo e anel laranja em 250ms; o cartão afunda translateY(1px) scale(0.985) em 90ms ao clicar.
- **Erro surge** — As opções tremem uma vez e a mensagem do grupo desliza 4px com fade.

## Acessibilidade

Radios nativos com o mesmo `name` dentro de `<fieldset>`/`<legend>`: o navegador já implementa o padrão **Radio Group** do WAI-ARIA — Tab entra no grupo pela opção selecionada e as setas movem e selecionam. Cada opção é nomeada pelo rótulo e descrita pela descrição; o erro do grupo fica em `aria-describedby` do fieldset.

| Teclas | Ação |
| --- | --- |
| `Tab` | Entra no grupo pela opção selecionada (ou a primeira). |
| `↓ / →` | Seleciona a próxima opção (volta ao início no fim). |
| `↑ / ←` | Seleciona a opção anterior. |
| `Space` | Seleciona a opção focada, se ainda não estiver. |

- **1.3.1** — Pergunta em <legend>; opções com rótulos associados.
- **1.4.1** — Seleção indicada pelo ponto interno, não só pela cor.
- **2.1.1** — Navegação completa por teclado (nativa).
- **2.5.8** — Alvo de 24×24px; na variante card, o cartão todo.
- **3.3.2** — required nativo anunciado em cada opção.
