# PasswordField

Campo de senha com botão para mostrar/ocultar e lista opcional de requisitos com estado acessível.

- Categoria: Formulários · Status: estável
- Importação: `import { PasswordField } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/password-field (em inglês: https://orange.llypedev.com.br/en/components/password-field)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-passwordfield--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/PasswordField

## Boas práticas

- Sempre permita mostrar a senha: reduz erros de digitação, principalmente no celular.
- Mostre os requisitos antes da pessoa digitar e atualize-os em tempo real — não esconda as regras até o envio.
- Use `autoComplete="current-password"` no login e `"new-password"` no cadastro para que gerenciadores de senha funcionem (o padrão já segue isso).
- Não bloqueie colar no campo: isso atrapalha quem usa gerenciadores de senha.

- Faça: Diga as regras antes do erro.
- Evite: Erros genéricos que não explicam o que corrigir.

## Exemplos

### Login

Clique no olho: o foco e o cursor continuam no campo.

```tsx
import { Button, Icon, PasswordField, TextField } from '@orangesys/ui'

export default function SignIn() {
  return (
    <form style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 380 }} onSubmit={(event) => event.preventDefault()}>
      <TextField label="E-mail" type="email" autoComplete="username" />
      <PasswordField
        label="Senha"
        startIcon={<Icon name="lock" />}
        labelAside={<a href="#recuperar-senha">Esqueceu a senha?</a>}
      />
      <Button type="submit" block>
        Entrar
      </Button>
    </form>
  )
}
```

### Requisitos de senha

Cada item informa "atendido" ou "não atendido" a leitores de tela; o progresso é anunciado após uma pausa na digitação.

```tsx
import { PasswordField } from '@orangesys/ui'
import { useState } from 'react'

export default function Requirements() {
  const [password, setPassword] = useState('')

  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <PasswordField
        label="Crie uma senha"
        required
        value={password}
        onValueChange={setPassword}
        requirements={[
          { label: 'Pelo menos 8 caracteres', met: password.length >= 8 },
          { label: 'Uma letra maiúscula', met: /[A-Z]/.test(password) },
          { label: 'Um número', met: /\d/.test(password) },
          { label: 'Um símbolo (!@#$…)', met: /[^A-Za-z0-9]/.test(password) },
        ]}
      />
    </div>
  )
}
```

### Confirmação

```tsx
import { Button, PasswordField } from '@orangesys/ui'
import { useState, type FormEvent } from 'react'

export default function Confirm() {
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const mismatch = submitted && password !== confirmation

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <form style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 420 }} onSubmit={onSubmit} noValidate>
      <PasswordField label="Nova senha" autoComplete="new-password" value={password} onValueChange={setPassword} />
      <PasswordField
        label="Confirme a nova senha"
        autoComplete="new-password"
        value={confirmation}
        onValueChange={setConfirmation}
        error={mismatch ? 'As senhas não coincidem. Digite a mesma senha nos dois campos.' : undefined}
      />
      <div>
        <Button type="submit">Alterar senha</Button>
      </div>
    </form>
  )
}
```

### Tamanhos e estados

```tsx
import { PasswordField } from '@orangesys/ui'

export default function States() {
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 420 }}>
      <PasswordField size="sm" label="Pequeno (sm)" defaultValue="laranja2025" />
      <PasswordField label="Visível por padrão" defaultVisible defaultValue="laranja2025" />
      <PasswordField label="Senha do Wi-Fi" disabled defaultValue="convidados" description="Peça ao administrador para alterar." />
    </div>
  )
}
```

## Props

### `PasswordField`

Campo de senha com botão para mostrar/ocultar o valor e lista opcional de
requisitos. O botão usa `aria-pressed` e, quando clicado com o mouse ou
toque, mantém o foco e o cursor no campo.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `defaultVisible` | `boolean` | `false` | Senha visível inicialmente (não controlado). Padrão: `false`. |
| `description` | `ReactNode` | — | Texto de ajuda exibido abaixo do rótulo e ligado por `aria-describedby`. |
| `error` | `ReactNode` | — | Mensagem de erro. Quando presente, o campo fica inválido. |
| `hideLabel` | `boolean` | — | Oculta o rótulo visualmente (continua acessível). |
| `invalid` | `boolean` | — | Força o estado inválido sem exibir mensagem (ex.: erro mostrado em um ErrorSummary). |
| `label` | `ReactNode` | — | Rótulo visível do campo. Sempre informe um rótulo — use `hideLabel` para ocultá-lo. |
| `labelAside` | `ReactNode` | — | Elemento à direita do rótulo (ex.: link "Esqueceu a senha?"). |
| `onValueChange` | `((value: string) => void)` | — | Chamado com o novo texto a cada alteração (atalho para `onChange`). |
| `onVisibleChange` | `((visible: boolean) => void)` | — | Chamado quando a visibilidade muda. |
| `optional` | `boolean` | — | Mostra "(opcional)" ao lado do rótulo. |
| `required` | `boolean` | — | Campo obrigatório: mostra `*` no rótulo e aplica `required`. |
| `requirements` | `PasswordRequirement[]` | — | Lista de requisitos exibida abaixo do campo, com estado atendido/não atendido. |
| `requirementsLabel` | `ReactNode` | — | Título da lista de requisitos. Padrão: "Requisitos da senha". |
| `size` | `"sm" \| "md" \| "lg"` | `md` | Altura do controle: `sm` 32px, `md` 40px, `lg` 48px. |
| `startIcon` | `ReactNode` | — | Ícone decorativo no início do campo (ex.: cadeado). |
| `visible` | `boolean` | — | Senha visível (controlado). |

Repassa também os atributos nativos (`InputHTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Movimento

Interações rápidas e geométricas, só com tokens de duração e curva. Com `prefers-reduced-motion`, as durações vão a zero e os estados mudam na hora — o movimento nunca é a única pista de estado.

- **Hover e foco** — Borda e anel de foco mudam de cor juntos — 160ms (--or-duration-fast), --or-ease-out.
- **Mostrar/ocultar** — Olho e olho cortado trocam com crossfade e escala: o ícone que entra usa 250ms e --or-ease-bounce; o que sai, 160ms e --or-ease-in-out.
- **Pressionar o botão** — O ícone afunda 1px e encolhe (scale 0.9) em 90ms (--or-duration-press).
- **Requisito atendido** — O check faz um "pop" (250ms, --or-ease-bounce) enquanto o traço é desenhado (or-draw); o quadrado sai em 160ms.
- **Erro surge** — A mensagem entra com fade e desliza 4px (250ms, --or-ease-out); o controle treme uma vez (or-shake, 400ms) só na passagem de válido para inválido.

## Acessibilidade

O botão é um `<button>` de alternância com `aria-pressed` e `aria-controls`. Seguindo o WAI-ARIA, o nome acessível ("Mostrar senha") não muda; o estado pressionado indica que a senha está visível. Com mouse ou toque, o foco e a seleção permanecem no campo; pelo teclado, o foco fica no botão para permitir alternar de novo. A lista de requisitos entra em `aria-describedby` e cada item inclui "atendido"/"não atendido" em texto oculto.

| Teclas | Ação |
| --- | --- |
| `Tab` | Move o foco do campo para o botão mostrar/ocultar. |
| `Enter` | No botão: mostra ou oculta a senha. |
| `Space` | No botão: mostra ou oculta a senha. |

- **1.3.1** — Requisitos associados ao campo por aria-describedby.
- **1.4.1** — Requisito atendido indicado por ícone (✓) além da cor.
- **3.3.7** — Compatível com gerenciadores de senha (`autoComplete`, colar permitido).
- **3.3.8** — Mostrar a senha evita testes de memória na autenticação.
- **4.1.2** — Botão com nome, papel e estado (aria-pressed).
- **4.1.3** — Progresso dos requisitos anunciado como status.
