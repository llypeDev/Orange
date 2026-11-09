# ErrorSummary

Resumo dos erros de um formulário, com links que levam a cada campo e foco automático para ser anunciado.

- Categoria: Formulários · Status: estável
- Importação: `import { ErrorSummary } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/error-summary (em inglês: https://orange.llypedev.com.br/en/components/error-summary)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-errorsummary--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/ErrorSummary

## Boas práticas

- Mostre o resumo no topo do formulário depois de uma tentativa de envio — não enquanto a pessoa ainda está preenchendo.
- Use as mesmas mensagens exibidas junto aos campos, na mesma ordem do formulário.
- O `id` de cada erro é o `id` do campo. Para grupos (RadioGroup, CheckboxGroup), use o id do grupo: o link foca a opção marcada ou a primeira.
- Para focar de novo a cada envio, mude a `key` do componente (ou chame `ref.current.focus()`). O foco não é movido enquanto a lista diminui, para não interromper a correção.

## Exemplos

### Básico

Clique em um erro para ir até o campo.

```tsx
import { ErrorSummary, TextField } from '@orangesys/ui'

export default function Basic() {
  return (
    <div style={{ display: 'grid', gap: 24, width: '100%', maxWidth: 520 }}>
      <ErrorSummary
        autoFocus={false}
        errors={[
          { id: 'basico-nome', message: 'Informe seu nome completo.' },
          { id: 'basico-email', message: 'Informe um e-mail no formato nome@empresa.com.' },
        ]}
      />
      <TextField id="basico-nome" label="Nome completo" error="Informe seu nome completo." />
      <TextField id="basico-email" label="E-mail" type="email" defaultValue="ana@" error="Informe um e-mail no formato nome@empresa.com." />
    </div>
  )
}
```

### Formulário com validação

Envie o formulário vazio: o resumo aparece, recebe o foco e é anunciado.

```tsx
import { Button, Checkbox, ErrorSummary, RadioGroup, TextField, type ErrorSummaryItem } from '@orangesys/ui'
import { useState, type FormEvent } from 'react'

export default function SignUpForm() {
  const [errors, setErrors] = useState<ErrorSummaryItem[]>([])
  const [attempt, setAttempt] = useState(0)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const next: ErrorSummaryItem[] = []
    if (!String(data.get('empresa') ?? '').trim()) next.push({ id: 'cadastro-empresa', message: 'Informe o nome da empresa.' })
    if (!/^\S+@\S+\.\S+$/.test(String(data.get('email') ?? ''))) next.push({ id: 'cadastro-email', message: 'Informe um e-mail válido, como nome@empresa.com.' })
    if (!data.get('porte')) next.push({ id: 'cadastro-porte', message: 'Escolha o porte da empresa.' })
    if (!data.get('termos')) next.push({ id: 'cadastro-termos', message: 'Aceite os termos de uso para continuar.' })
    setErrors(next)
    setAttempt((n) => n + 1)
  }

  const errorFor = (id: string) => errors.find((e) => e.id === id)?.message

  return (
    <form onSubmit={onSubmit} noValidate style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 520 }}>
      {/* A key muda a cada envio: o resumo é remontado e recebe o foco de novo. */}
      <ErrorSummary key={attempt} errors={errors} />
      <TextField id="cadastro-empresa" name="empresa" label="Nome da empresa" error={errorFor('cadastro-empresa')} />
      <TextField id="cadastro-email" name="email" type="email" label="E-mail de trabalho" error={errorFor('cadastro-email')} />
      <RadioGroup
        id="cadastro-porte"
        name="porte"
        label="Porte da empresa"
        orientation="horizontal"
        error={errorFor('cadastro-porte')}
        options={[
          { value: '1-10', label: '1–10 pessoas' },
          { value: '11-50', label: '11–50' },
          { value: '51+', label: '51 ou mais' },
        ]}
      />
      <Checkbox id="cadastro-termos" name="termos" label="Li e aceito os Termos de uso" error={errorFor('cadastro-termos')} />
      <div>
        <Button type="submit">Criar conta</Button>
      </div>
    </form>
  )
}
```

### Título e descrição

```tsx
import { ErrorSummary } from '@orangesys/ui'

export default function Custom() {
  return (
    <div style={{ width: '100%', maxWidth: 520 }}>
      <ErrorSummary
        autoFocus={false}
        headingLevel={3}
        title="Não foi possível emitir a nota fiscal"
        description={<p>Corrija os dados abaixo e tente novamente. Nada foi cobrado.</p>}
        errors={[
          { id: 'nf-cnpj', message: 'O CNPJ do destinatário está incompleto.' },
          { id: 'nf-valor', message: 'O valor total precisa ser maior que R$ 0,00.' },
        ]}
      />
    </div>
  )
}
```

## Props

### `ErrorSummary`

Resumo de erros de um formulário: título, lista de links para os campos
inválidos e foco automático ao aparecer. Coloque-o no topo do formulário e
mostre-o após uma tentativa de envio.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `errors` (obrigatória) | `ErrorSummaryItem[]` | — | Lista de erros. Com a lista vazia, nada é renderizado. |
| `autoFocus` | `boolean` | `true` | Move o foco para o painel quando ele aparece, para que leitores de tela o anunciem. Sem foco automático, o painel usa `role="alert"`. Padrão: `true`. |
| `description` | `ReactNode` | — | Texto opcional entre o título e a lista. |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` | `2` | Nível do título (h2–h6). Padrão: 2. |
| `onItemClick` | `((item: ErrorSummaryItem, event: MouseEvent<HTMLAnchorElement, MouseEvent>) => void)` | — | Chamado ao clicar em um erro (antes de focar o campo). |
| `title` | `ReactNode` | — | Título do painel. Padrão: "Corrija os seguintes erros". |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`ErrorSummaryItem`:

```ts
export interface ErrorSummaryItem {
  /** Id do campo com erro. O link aponta para `#id` e foca esse campo. */
  id: string
  /** Mensagem de erro — de preferência a mesma exibida junto ao campo. */
  message: ReactNode
}
```

## Movimento

Interações rápidas e geométricas, só com tokens de duração e curva. Com `prefers-reduced-motion`, as durações vão a zero e os estados mudam na hora — o movimento nunca é a única pista de estado.

- **Aparecer** — O painel desce deslizando (or-slide-down-in, 250ms, --or-ease-out) e os erros entram em sequência, 40ms entre itens (metade de --or-stagger).
- **Sumir** — Quando a lista fica vazia, fade de 160ms (--or-ease-in-out) via usePresence — mais curto que a entrada.
- **Links** — Cor e espessura do sublinhado mudam em 160ms no hover e no foco.

## Acessibilidade

Um `<section>` nomeado pelo título, com `tabIndex=-1`: ao aparecer, recebe o foco e o leitor de tela lê o título e a lista. Cada erro é um link `href="#id"`; ao ativá-lo, a página rola até o rótulo (ou legenda) e o foco vai para o campo, sem depender do comportamento de âncoras do navegador.

| Teclas | Ação |
| --- | --- |
| `Tab` | Percorre os links de erro. |
| `Enter` | Vai até o campo do erro e o foca. |

- **2.4.3** — Foco movido para o resumo e dele para o campo, em ordem lógica.
- **3.3.1** — Erros identificados e descritos em texto.
- **3.3.3** — Mensagens sugerem como corrigir.
- **4.1.3** — Sem foco automático, o resumo usa `role="alert"`.
