# Fieldset

Agrupa campos relacionados com fieldset e legend nativos, com descrição, erro do grupo e desabilitação em bloco.

- Categoria: Formulários · Status: estável
- Importação: `import { Fieldset } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/fieldset (em inglês: https://orange.llypedev.com.br/en/components/fieldset)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-fieldset--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Fieldset

## Boas práticas

- Agrupe campos que respondem a uma mesma pergunta ou formam um dado composto: endereço, período, dados de contato.
- A legenda deve fazer sentido antes de cada rótulo — leitores de tela anunciam "Endereço de entrega, grupo" ao entrar no primeiro campo.
- Use `disabled` para bloquear o grupo inteiro de uma vez (comportamento nativo do fieldset).
- Evite aninhar fieldsets mais de um nível: a leitura fica repetitiva.
- Para grupos de opções use CheckboxGroup e RadioGroup — eles já são fieldsets com legenda no estilo de rótulo.

## Exemplos

### Endereço

```tsx
import { Fieldset, TextField } from '@orangesys/ui'

export default function Address() {
  return (
    <div style={{ width: '100%', maxWidth: 520 }}>
      <Fieldset legend="Endereço de entrega" description="Enviaremos o pedido para este endereço.">
        <TextField label="CEP" inputMode="numeric" autoComplete="postal-code" style={{ maxWidth: 180 }} />
        <TextField label="Rua" autoComplete="address-line1" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
          <TextField label="Número" />
          <TextField label="Complemento" optional autoComplete="address-line2" />
        </div>
      </Fieldset>
    </div>
  )
}
```

### Desabilitar o grupo

Desmarque a caixa para liberar o endereço de cobrança.

```tsx
import { Checkbox, Fieldset, TextField } from '@orangesys/ui'
import { useState } from 'react'

export default function DisabledGroup() {
  const [sameAddress, setSameAddress] = useState(true)

  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 520 }}>
      <Checkbox
        label="Usar o endereço de entrega para a cobrança"
        checked={sameAddress}
        onCheckedChange={setSameAddress}
      />
      <Fieldset legend="Endereço de cobrança" disabled={sameAddress} gap="sm">
        <TextField label="CEP" inputMode="numeric" style={{ maxWidth: 180 }} />
        <TextField label="Rua e número" />
      </Fieldset>
    </div>
  )
}
```

### Erro do grupo

Para regras que envolvem vários campos. Envie vazio para ver o erro.

```tsx
import { Button, Fieldset, TextField } from '@orangesys/ui'
import { useState, type FormEvent } from 'react'

export default function GroupError() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const missing = submitted && !email.trim() && !phone.trim()

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <form onSubmit={onSubmit} noValidate style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 520 }}>
      <Fieldset
        legend="Contato"
        description="Informe pelo menos um meio de contato."
        error={missing ? 'Preencha o e-mail ou o telefone.' : undefined}
      >
        <TextField label="E-mail" type="email" value={email} onValueChange={setEmail} invalid={missing} />
        <TextField label="Telefone" type="tel" value={phone} onValueChange={setPhone} invalid={missing} />
      </Fieldset>
      <div>
        <Button type="submit">Salvar contato</Button>
      </div>
    </form>
  )
}
```

### Seções e espaçamento

`gap`: sm (12px), md (20px, padrão) e lg (32px).

```tsx
import { Fieldset, RadioGroup, Switch, TextField } from '@orangesys/ui'

export default function Sections() {
  return (
    <div style={{ display: 'grid', gap: 40, width: '100%', maxWidth: 520 }}>
      <Fieldset legend="Dados da equipe" gap="sm">
        <TextField label="Nome da equipe" defaultValue="Design de produto" />
        <TextField label="Identificador" prefix="orange.app/" defaultValue="design" />
      </Fieldset>
      <Fieldset legend="Privacidade" gap="lg">
        <RadioGroup
          label="Quem pode ver os projetos?"
          defaultValue="equipe"
          options={[
            { value: 'equipe', label: 'Somente a equipe' },
            { value: 'org', label: 'Toda a organização' },
            { value: 'publico', label: 'Qualquer pessoa com o link' },
          ]}
        />
        <Switch label="Permitir convites de pessoas de fora" />
      </Fieldset>
    </div>
  )
}
```

## Props

### `Fieldset`

Agrupa campos relacionados com `<fieldset>` e `<legend>` nativos — por
exemplo, "Endereço de entrega". `disabled` desabilita todos os controles
internos de uma vez.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `legend` (obrigatória) | `ReactNode` | — | Título do grupo, renderizado como `<legend>`. Leitores de tela o anunciam ao entrar no grupo. |
| `description` | `ReactNode` | — | Texto de ajuda do grupo, ligado por `aria-describedby`. |
| `disabled` | `boolean` | — | Desabilita nativamente todos os controles internos. |
| `error` | `ReactNode` | — | Erro que vale para o grupo inteiro (ex.: "Informe ao menos um telefone"). |
| `gap` | `"sm" \| "md" \| "lg"` | `md` | Espaçamento entre os campos: `sm` 12px, `md` 20px, `lg` 32px. Padrão: `md`. |
| `hideLegend` | `boolean` | — | Oculta a legenda visualmente (continua acessível). |

Repassa também os atributos nativos (`FieldsetHTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Movimento

Interações rápidas e geométricas, só com tokens de duração e curva. Com `prefers-reduced-motion`, as durações vão a zero e os estados mudam na hora — o movimento nunca é a única pista de estado.

- **Habilitar/desabilitar** — Legenda, descrição, rótulos e molduras internos mudam de cor em 160ms.
- **Erro do grupo** — A barra vermelha cresce de cima para baixo (scaleY, 400ms, --or-ease-out) e a mensagem desliza 4px com fade (250ms).
- **Seções × grupos de opções** — Fieldset não treme (são vários campos); CheckboxGroup e RadioGroup tremem uma vez quando o erro surge.

## Acessibilidade

Um `<fieldset>` com `<legend>` nativos (papel `group`, nomeado pela legenda). Descrição e erro entram em `aria-describedby` do fieldset. Com `disabled`, o navegador desabilita todos os controles internos e os retira da ordem de tabulação.

| Teclas | Ação |
| --- | --- |
| `Tab` | Move entre os campos do grupo; o grupo em si não recebe foco. |

- **1.3.1** — Relação entre campos expressa por fieldset/legend.
- **2.4.6** — Legendas descritivas organizam o formulário.
- **3.3.1** — Erros do grupo descritos em texto e associados.
- **3.3.2** — Instruções do grupo na descrição.
