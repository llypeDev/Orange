# TextField

Campo de texto de uma linha com rótulo, ajuda, erro, ícones, prefixo/sufixo e contador de caracteres.

- Categoria: Formulários · Status: estável
- Importação: `import { TextField } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/text-field (em inglês: https://orange.llypedev.com.br/en/components/text-field)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-textfield--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/TextField

## Boas práticas

- Todo campo tem um rótulo visível e curto. O placeholder é só um exemplo de formato — ele some ao digitar e tem pouco contraste.
- Use o `type` certo (`email`, `tel`, `url`) e `autoComplete`: o teclado do celular e o preenchimento automático ajudam a pessoa.
- A largura do campo sugere o tamanho da resposta: CEP e número curtos, nome e endereço largos.
- Mensagens de erro dizem como corrigir ("Informe um e-mail no formato nome@empresa.com"), não apenas que algo deu errado.

- Faça: Rótulo visível e placeholder apenas como exemplo de formato.
- Evite: Usar o placeholder no lugar do rótulo.

## Anatomia

- **Rótulo** — Obrigatório. Em Space Grotesk; * para obrigatório ou "(opcional)".
- **Descrição** — Ajuda curta sobre o formato ou o uso do dado.
- **Moldura** — Borda de 1px, cantos retos; fica laranja no foco e vermelha no erro.
- **Ícones e prefixo/sufixo** — Ícones decorativos e textos fixos como "https://" ou "kg".
- **Contador** — "x de y caracteres" quando há limite; muda de cor perto do limite.
- **Erro** — Mensagem com ícone abaixo do campo, ligada por aria-describedby.

## Exemplos

### Básico

```tsx
import { Stack, TextField } from '@orangesys/ui'

export default function Basic() {
  return (
    <Stack gap={5} style={{ width: '100%', maxWidth: 420 }}>
      <TextField label="Nome completo" autoComplete="name" required />
      <TextField
        label="E-mail de trabalho"
        type="email"
        autoComplete="email"
        description="Enviaremos o convite e os recibos para este endereço."
        placeholder="voce@empresa.com"
      />
      <TextField label="Cargo" optional />
    </Stack>
  )
}
```

### Tamanhos

sm (32px), md (40px, padrão) e lg (48px) — as mesmas alturas dos botões.

```tsx
import { Stack, TextField } from '@orangesys/ui'

export default function Sizes() {
  return (
    <Stack gap={5} style={{ width: '100%', maxWidth: 420 }}>
      <TextField size="sm" label="Pequeno (sm · 32px)" placeholder="Filtros e tabelas densas" />
      <TextField size="md" label="Médio (md · 40px)" placeholder="Padrão para formulários" />
      <TextField size="lg" label="Grande (lg · 48px)" placeholder="Telas de destaque e mobile" />
    </Stack>
  )
}
```

### Ícones, prefixo e sufixo

Clicar em qualquer parte da moldura foca o campo. Prefixo e sufixo de texto também são lidos por leitores de tela.

```tsx
import { Icon, Stack, TextField } from '@orangesys/ui'

export default function Adornments() {
  return (
    <Stack gap={5} style={{ width: '100%', maxWidth: 420 }}>
      <TextField
        label="Buscar pedidos"
        type="search"
        startIcon={<Icon name="search" />}
        placeholder="Número do pedido ou nome do cliente"
      />
      <TextField label="Site da empresa" type="url" prefix="https://" placeholder="laranja.com.br" />
      <TextField label="Subdomínio" prefix="https://" suffix=".orange.app" defaultValue="minha-loja" />
      <TextField label="Peso do pacote" inputMode="decimal" suffix="kg" style={{ maxWidth: 200 }} />
      <TextField label="E-mail para contato" type="email" endIcon={<Icon name="mail" />} placeholder="contato@empresa.com" />
    </Stack>
  )
}
```

### Contador de caracteres

Com `maxLength` e `showCount`. O contador é anunciado só quando a pessoa pausa a digitação.

```tsx
import { Stack, TextField } from '@orangesys/ui'

export default function CharacterCount() {
  return (
    <Stack gap={5} style={{ width: '100%', maxWidth: 420 }}>
      <TextField
        label="Título do anúncio"
        description="Seja direto: tipo do imóvel, quartos e bairro."
        maxLength={60}
        showCount
        defaultValue="Apartamento com 2 quartos na Vila Madalena"
      />
    </Stack>
  )
}
```

### Validação e estados

Campo controlado validado ao sair, somente leitura e desabilitado.

```tsx
import { Stack, TextField } from '@orangesys/ui'
import { useState } from 'react'

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export default function Validation() {
  const [email, setEmail] = useState('ana@')
  const [touched, setTouched] = useState(true)
  const error = touched && !isEmail(email) ? 'Informe um e-mail no formato nome@empresa.com.' : undefined

  return (
    <Stack gap={5} style={{ width: '100%', maxWidth: 420 }}>
      <TextField
        label="E-mail"
        type="email"
        required
        value={email}
        onValueChange={setEmail}
        onBlur={() => setTouched(true)}
        error={error}
      />
      <TextField label="Código da organização" readOnly defaultValue="ORG-2931" description="Gerado automaticamente." />
      <TextField label="Plano" disabled defaultValue="Gratuito" />
    </Stack>
  )
}
```

## Props

### `TextField`

Campo de texto de uma linha com rótulo, ajuda, erro, ícones, prefixo/sufixo
e contador de caracteres. A `ref` e as props nativas vão para o `<input>`;
`className` e `style` vão para o contêiner do campo.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `description` | `ReactNode` | — | Texto de ajuda exibido abaixo do rótulo e ligado por `aria-describedby`. |
| `endIcon` | `ReactNode` | — | Ícone decorativo no fim do campo. |
| `error` | `ReactNode` | — | Mensagem de erro. Quando presente, o campo fica inválido. |
| `hideLabel` | `boolean` | — | Oculta o rótulo visualmente (continua acessível). |
| `invalid` | `boolean` | — | Força o estado inválido sem exibir mensagem (ex.: erro mostrado em um ErrorSummary). |
| `label` | `ReactNode` | — | Rótulo visível do campo. Sempre informe um rótulo — use `hideLabel` para ocultá-lo. |
| `labelAside` | `ReactNode` | — | Elemento à direita do rótulo (ex.: link "Esqueceu a senha?"). |
| `onValueChange` | `((value: string) => void)` | — | Chamado com o novo texto a cada alteração (atalho para `onChange`). |
| `optional` | `boolean` | — | Mostra "(opcional)" ao lado do rótulo. |
| `prefix` | `ReactNode` | — | Texto fixo antes do valor (ex.: `https://`, `R$`). É lido junto com a descrição. |
| `required` | `boolean` | — | Campo obrigatório: mostra `*` no rótulo e aplica `required`. |
| `showCount` | `boolean` | `false` | Mostra o contador "x de y caracteres". Requer `maxLength`. |
| `size` | `"sm" \| "md" \| "lg"` | `md` | Altura do controle: `sm` 32px, `md` 40px, `lg` 48px. |
| `startIcon` | `ReactNode` | — | Ícone decorativo no início do campo. |
| `suffix` | `ReactNode` | — | Texto fixo depois do valor (ex.: `kg`, `.com.br`). É lido junto com a descrição. |
| `type` | `"search" \| "text" \| "tel" \| "url" \| "email"` | `text` | Tipo do campo. Para senhas use `PasswordField`; para números, `NumberField`. |

Repassa também os atributos nativos (`InputHTMLAttributes`) do `<input>`, como `name`, `required`, `disabled`, `readOnly`, `autoComplete`, `placeholder` e `onBlur`, além de `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`TextFieldSize`:

```ts
export type TextFieldSize = ControlSize
```

`TextFieldType`:

```ts
export type TextFieldType = 'text' | 'email' | 'url' | 'tel' | 'search'
```

## Movimento

Interações rápidas e geométricas, só com tokens de duração e curva. Com `prefers-reduced-motion`, as durações vão a zero e os estados mudam na hora — o movimento nunca é a única pista de estado.

- **Hover e foco** — Borda e anel de foco mudam de cor juntos — 160ms (--or-duration-fast), --or-ease-out.
- **Ícones e prefixo** — Ícones e textos fixos acompanham o foco com transição de cor (160ms).
- **Contador** — A cor muda suavemente perto do limite (250ms); ao atingir o limite, um toque de escala com --or-ease-bounce.
- **Erro surge** — A mensagem entra com fade e desliza 4px (250ms, --or-ease-out); o controle treme uma vez (or-shake, 400ms) só na passagem de válido para inválido.

## Acessibilidade

Um `<input>` nativo ligado ao `<label>` por `for`. Descrição, prefixo/sufixo, contador e erro entram em `aria-describedby`; o erro também aplica `aria-invalid`. O contador usa uma região `aria-live="polite"` separada, atualizada só após uma pausa na digitação.

| Teclas | Ação |
| --- | --- |
| `Tab` | Move o foco para o campo. |
| `Shift` + `Tab` | Move o foco para o elemento anterior. |
| `Esc` | Em `type="search"`, limpa o texto (nativo). |

- **1.3.1** — Rótulo, descrição e erro associados programaticamente.
- **1.3.5** — Suporte a `autoComplete` para identificar o propósito do campo.
- **2.4.7** — Foco visível: moldura laranja com 2px.
- **3.3.1** — Erros identificados em texto, com ícone e aria-invalid.
- **3.3.2** — Rótulo sempre presente; obrigatoriedade indicada.
- **4.1.3** — Contador anunciado como mensagem de status, sem roubar o foco.
