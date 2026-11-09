# Checkbox

Caixas de seleção para aceites, preferências e escolhas múltiplas — sozinhas ou em um CheckboxGroup.

- Categoria: Formulários · Status: estável
- Importação: `import { Checkbox, CheckboxGroup } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/checkbox (em inglês: https://orange.llypedev.com.br/en/components/checkbox)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-checkbox--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Checkbox

## Boas práticas

- Use checkbox quando a escolha só vale ao enviar o formulário. Para ligar algo na hora, use Switch.
- Escreva rótulos afirmativos ("Receber novidades"), nunca negativos ("Não quero receber novidades").
- Agrupe opções relacionadas em um **CheckboxGroup**: a legenda é anunciada ao entrar no grupo.
- A variante `card` do CheckboxGroup funciona bem quando cada opção tem uma descrição relevante, como módulos e complementos de um plano — é o mesmo cartão do RadioGroup.
- Use `indeterminate` apenas para "selecionar todos" quando parte dos itens está marcada.

- Faça: Checkbox para escolhas confirmadas no envio.
- Evite: Switch para aceites que dependem de enviar o formulário.

## Exemplos

### Básico

```tsx
import { Checkbox } from '@orangesys/ui'

export default function Basic() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Checkbox label="Lembrar de mim neste dispositivo" defaultChecked />
      <Checkbox
        label="Receber o resumo semanal por e-mail"
        description="Um e-mail toda segunda-feira com a atividade dos seus projetos."
      />
    </div>
  )
}
```

### Grupo

Com `options` ou filhos `<Checkbox value>`. O valor é um `string[]`.

```tsx
import { CheckboxGroup } from '@orangesys/ui'

export default function Group() {
  return (
    <CheckboxGroup
      label="Como prefere ser avisado?"
      description="Você pode mudar isso depois em Configurações."
      name="canais"
      defaultValue={['email']}
      options={[
        { value: 'email', label: 'E-mail' },
        { value: 'sms', label: 'SMS', description: 'Pode haver cobrança da sua operadora.' },
        { value: 'push', label: 'Notificação no aplicativo' },
        { value: 'whatsapp', label: 'WhatsApp', description: 'Em breve.', disabled: true },
      ]}
    />
  )
}
```

### Cartões

Com `variant="card"`, o cartão inteiro é clicável; a borda fica laranja nas opções marcadas.

```tsx
import { CheckboxGroup } from '@orangesys/ui'

export default function Cards() {
  return (
    <div style={{ width: '100%' }}>
      <CheckboxGroup
        label="Escolha os módulos do plano"
        description="Cada módulo adiciona R$ 39/mês à assinatura."
        name="modulos"
        variant="card"
        orientation="horizontal"
        defaultValue={['financeiro']}
        options={[
          {
            value: 'financeiro',
            label: 'Financeiro',
            description: 'Contas a pagar e a receber e conciliação bancária.',
          },
          {
            value: 'estoque',
            label: 'Estoque',
            description: 'Inventário, lotes e transferências entre depósitos.',
          },
          {
            value: 'fiscal',
            label: 'Fiscal',
            description: 'Emissão de NF-e e NFS-e com envio automático.',
          },
        ]}
      />
    </div>
  )
}
```

### Selecionar todos

```tsx
import { Checkbox, CheckboxGroup } from '@orangesys/ui'
import { useState } from 'react'

const permissions = [
  { value: 'ver', label: 'Ver projetos' },
  { value: 'editar', label: 'Editar projetos' },
  { value: 'convidar', label: 'Convidar pessoas' },
  { value: 'faturamento', label: 'Gerenciar faturamento' },
]

export default function SelectAll() {
  const [selected, setSelected] = useState<string[]>(['ver', 'editar'])
  const all = selected.length === permissions.length

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Checkbox
        label="Todas as permissões"
        checked={all}
        indeterminate={selected.length > 0 && !all}
        onCheckedChange={(checked) => setSelected(checked ? permissions.map((p) => p.value) : [])}
      />
      <div style={{ paddingLeft: 36 }}>
        <CheckboxGroup label="Permissões do papel Editor" hideLabel value={selected} onChange={setSelected} options={permissions} />
      </div>
    </div>
  )
}
```

### Horizontal

```tsx
import { Checkbox, CheckboxGroup } from '@orangesys/ui'

export default function Horizontal() {
  return (
    <CheckboxGroup label="Dias de entrega" orientation="horizontal" defaultValue={['seg', 'qua', 'sex']}>
      <Checkbox value="seg" label="Seg" />
      <Checkbox value="ter" label="Ter" />
      <Checkbox value="qua" label="Qua" />
      <Checkbox value="qui" label="Qui" />
      <Checkbox value="sex" label="Sex" />
      <Checkbox value="sab" label="Sáb" />
    </CheckboxGroup>
  )
}
```

### Validação e estados

Envie sem marcar nada para ver os erros.

```tsx
import { Button, Checkbox, CheckboxGroup } from '@orangesys/ui'
import { useState, type FormEvent } from 'react'

export default function Validation() {
  const [accepted, setAccepted] = useState(false)
  const [topics, setTopics] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <form onSubmit={onSubmit} noValidate style={{ display: 'grid', gap: 24 }}>
      <CheckboxGroup
        label="Assuntos de interesse"
        required
        value={topics}
        onChange={setTopics}
        error={submitted && topics.length === 0 ? 'Escolha pelo menos um assunto.' : undefined}
        options={[
          { value: 'design', label: 'Design' },
          { value: 'engenharia', label: 'Engenharia' },
          { value: 'produto', label: 'Produto' },
        ]}
      />
      <Checkbox
        label="Li e aceito os Termos de uso"
        required
        checked={accepted}
        onCheckedChange={setAccepted}
        error={submitted && !accepted ? 'Você precisa aceitar os termos para continuar.' : undefined}
      />
      <Checkbox label="Opção indisponível" disabled />
      <div>
        <Button type="submit">Criar conta</Button>
      </div>
    </form>
  )
}
```

## Props

### `Checkbox`

Caixa de seleção nativa estilizada. Use sozinha (aceite de termos) ou dentro
de um `CheckboxGroup`. A `ref` e as props nativas vão para o `<input>`;
`className` e `style` vão para o contêiner. Num `CheckboxGroup` com
`variant="card"`, o contêiner é um `<label>`: o cartão inteiro é clicável.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `description` | `ReactNode` | — | Texto de ajuda abaixo do rótulo, ligado por `aria-describedby`. |
| `error` | `ReactNode` | — | Mensagem de erro. Quando presente, a caixa fica inválida. |
| `indeterminate` | `boolean` | `false` | Estado misto (ex.: "selecionar todos" com parte dos itens marcada). |
| `invalid` | `boolean` | `false` | Força o estado inválido sem exibir mensagem. |
| `label` | `ReactNode` | — | Rótulo clicável ao lado da caixa. Sem rótulo visível, informe `aria-label`. |
| `onCheckedChange` | `((checked: boolean) => void)` | — | Chamado com o novo estado marcado (atalho para `onChange`). |

Repassa também os atributos nativos (`InputHTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

### `CheckboxGroup`

Grupo de caixas de seleção para escolhas múltiplas, com `<fieldset>` e
`<legend>` nativos. Recebe `options` ou `<Checkbox value="…">` como filhos.
A variante `card` mostra cada opção em um cartão clicável, como no RadioGroup.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `label` (obrigatória) | `ReactNode` | — | Pergunta ou título do grupo, renderizado como `<legend>`. |
| `defaultValue` | `string[]` | `[]` | Valores marcados inicialmente (não controlado). |
| `description` | `ReactNode` | — | Texto de ajuda do grupo, ligado por `aria-describedby`. |
| `disabled` | `boolean` | `false` | Desabilita nativamente todas as opções. |
| `error` | `ReactNode` | — | Mensagem de erro do grupo. |
| `hideLabel` | `boolean` | — | Oculta a legenda visualmente (continua acessível). |
| `invalid` | `boolean` | `false` | Força o estado inválido sem exibir mensagem (ex.: erro mostrado em um ErrorSummary). |
| `name` | `string` | — | `name` aplicado a todas as caixas (envio de formulário). |
| `onChange` | `((value: string[]) => void)` | — | Chamado com a lista de valores marcados. |
| `optional` | `boolean` | — | Mostra "(opcional)" ao lado da legenda. |
| `options` | `CheckboxGroupOption[]` | — | Opções geradas automaticamente. Alternativa a passar `<Checkbox>` como filhos. |
| `orientation` | `"horizontal" \| "vertical"` | `vertical` | Disposição das opções. Padrão: `vertical`. |
| `required` | `boolean` | — | Mostra `*` e anuncia "obrigatório" na legenda. A validação fica com o formulário. |
| `value` | `string[]` | — | Valores marcados (controlado). |
| `variant` | `"default" \| "card"` | `default` | `card` mostra cada opção em um cartão com borda (laranja quando marcado). |

Repassa também os atributos nativos (`FieldsetHTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Movimento

Interações rápidas e geométricas, só com tokens de duração e curva. Com `prefers-reduced-motion`, as durações vão a zero e os estados mudam na hora — o movimento nunca é a única pista de estado.

- **Hover e foco** — Borda mais forte e anel laranja suave — 160ms, --or-ease-out.
- **Marcar** — A caixa fica laranja em 160ms e o check entra desenhando o traço (or-draw, 250ms, --or-ease-bounce).
- **Indeterminado** — O traço cresce do centro em scaleX (250ms, --or-ease-bounce).
- **Desmarcar** — O ícone some em 160ms (--or-ease-in-out) — saída mais curta que a entrada.
- **Pressionar** — Na caixa ou no rótulo, a caixa afunda 1px e encolhe (scale 0.92) em 90ms.
- **Cartões (variant="card")** — Borda em 160ms; fundo e anel laranja em 250ms; o cartão afunda translateY(1px) scale(0.985) em 90ms ao clicar.
- **Erro surge** — A caixa (ou as opções do CheckboxGroup) treme uma vez e a mensagem desliza 4px com fade.

## Acessibilidade

Cada opção é um `<input type="checkbox">` nativo (invisível) sobre a caixa desenhada, com área de clique de 24×24px e rótulo clicável. O grupo usa `<fieldset>`/`<legend>`; descrição e erro entram em `aria-describedby`. `indeterminate` é aplicado como propriedade do DOM e lido como "misto". Na variante `card`, o `<label>` é o cartão inteiro e o nome da caixa vem só do rótulo (`aria-labelledby`), com a descrição em `aria-describedby`.

| Teclas | Ação |
| --- | --- |
| `Tab` | Move o foco para a próxima caixa. |
| `Shift` + `Tab` | Move o foco para a caixa anterior. |
| `Space` | Marca ou desmarca. |

- **1.3.1** — Grupo com fieldset/legend; rótulos associados.
- **1.4.11** — Borda da caixa com contraste mínimo de 3:1.
- **2.5.8** — Área de toque de 24×24px, ampliada pelo rótulo; na variante card, o cartão todo.
- **3.3.1** — Erros em texto ligados à caixa ou ao grupo.
- **4.1.2** — Estados marcado, desmarcado e misto expostos nativamente.
