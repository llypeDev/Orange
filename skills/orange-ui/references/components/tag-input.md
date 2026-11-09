# TagInput

Campo que transforma o texto digitado em tags removíveis — palavras-chave, e-mails, códigos.

- Categoria: Formulários · Status: estável
- Importação: `import { TagInput } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/tag-input (em inglês: https://orange.llypedev.com.br/en/components/tag-input)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-taginput--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/TagInput

## Boas práticas

- Use para valores livres que o usuário digita (palavras-chave, e-mails, códigos). Para escolher de uma lista fechada, use **MultiSelect**.
- Diga na descrição como adicionar ("Pressione Enter ou vírgula") — o gesto não é óbvio para todos.
- Valide cada tag com `validate` e devolva uma mensagem específica. O texto recusado fica no campo para correção.
- Em listas coladas (e-mails de uma planilha), inclua espaço e Tab em `separators` e ative `addOnBlur` para não perder o último item.

## Exemplos

### Básico

Enter ou vírgula criam a tag; Backspace com o campo vazio remove a última. Duplicadas são recusadas.

```tsx
import { TagInput } from '@orangesys/ui'

export default function Basic() {
  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      <TagInput
        label="Palavras-chave do artigo"
        description="Pressione Enter ou vírgula para adicionar."
        placeholder="Ex.: acessibilidade"
        defaultValue={['design system', 'react']}
        name="palavras-chave"
      />
    </div>
  )
}
```

### Convite por e-mail

Validação por tag, colagem de várias de uma vez e Tab/espaço como separadores. Tente colar “ana@empresa.com, bruno, carla@empresa.com”.

```tsx
import { Button, Stack, TagInput } from '@orangesys/ui'
import { useState } from 'react'

const emailValido = (texto: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto)

export default function Emails() {
  const [convidados, setConvidados] = useState<string[]>([])

  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 440 }}>
      <TagInput
        label="Convidar pessoas"
        description="Cole uma lista de e-mails separados por vírgula ou digite um por vez."
        placeholder="nome@empresa.com"
        separators={['Enter', ',', 'Tab', ' ']}
        addOnBlur
        validate={(email) => (emailValido(email) ? true : `“${email}” não é um e-mail válido`)}
        value={convidados}
        onChange={setConvidados}
      />
      <div>
        <Button disabled={convidados.length === 0}>
          {convidados.length === 0
            ? 'Enviar convites'
            : `Enviar ${convidados.length} ${convidados.length === 1 ? 'convite' : 'convites'}`}
        </Button>
      </div>
    </Stack>
  )
}
```

### Limite de tags

```tsx
import { TagInput } from '@orangesys/ui'

export default function MaxTags() {
  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      <TagInput
        label="Interesses do perfil"
        description="Até 5 interesses. O contador fica ao lado do rótulo."
        maxTags={5}
        defaultValue={['fotografia', 'ciclismo', 'café']}
      />
    </div>
  )
}
```

### Tamanhos e estados

```tsx
import { Stack, TagInput } from '@orangesys/ui'

export default function States() {
  return (
    <Stack gap={4} style={{ width: '100%', maxWidth: 440 }}>
      <TagInput size="sm" label="Rótulos (sm)" defaultValue={['bug', 'urgente']} />
      <TagInput
        label="Códigos de rastreio"
        required
        error="Informe ao menos um código."
        placeholder="Ex.: BR123456789BR"
      />
      <TagInput
        size="lg"
        label="Categorias (lg, desabilitado)"
        defaultValue={['eletrônicos', 'casa']}
        disabled
      />
    </Stack>
  )
}
```

## Props

### `TagInput`

Campo para digitar várias palavras-chave: Enter (ou vírgula) cria uma tag,
Backspace com o campo vazio remove a última. Colar texto separado por
vírgulas cria várias tags de uma vez.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `addOnBlur` | `boolean` | — | Adiciona o texto pendente como tag quando o campo perde o foco. Padrão: `false`. |
| `allowDuplicates` | `boolean` | `false` | Permite tags repetidas (comparação sem diferenciar maiúsculas). Padrão: `false`. |
| `className` | `string` | — | Classe aplicada ao contêiner externo. |
| `defaultValue` | `string[]` | `[]` | Tags iniciais (não controlado). |
| `description` | `ReactNode` | — | Texto de ajuda exibido abaixo do rótulo. |
| `error` | `ReactNode` | — | Mensagem de erro externa (tem precedência sobre os erros de validação internos). |
| `hideLabel` | `boolean` | — | Oculta o rótulo visualmente (continua acessível). |
| `invalid` | `boolean` | — | Força o estado inválido sem exibir mensagem (ex.: erro mostrado em um ErrorSummary). |
| `label` | `ReactNode` | — | Rótulo visível do campo. Sempre informe um rótulo — mesmo que oculto. |
| `maxTags` | `number` | — | Número máximo de tags. Mostra o contador ao lado do rótulo. |
| `onChange` | `((tags: string[]) => void)` | — | Chamado quando uma tag é adicionada ou removida. |
| `separators` | `TagInputSeparator[]` | — | Teclas que criam a tag. Padrão: `['Enter', ',']`. |
| `size` | `"sm" \| "md" \| "lg"` | — | Altura mínima do controle: `sm` 32px, `md` 40px, `lg` 48px. |
| `validate` | `((tag: string, tags: string[]) => string \| boolean \| null)` | — | Valida cada tag antes de adicioná-la. Retorne uma mensagem de erro para recusar, ou `true`/`undefined` para aceitar. |
| `value` | `string[]` | — | Tags (controlado). |

Repassa também os atributos nativos (`InputHTMLAttributes`) do `<input>`, como `name`, `required`, `disabled`, `readOnly`, `autoComplete`, `placeholder` e `onBlur`, além de `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`TagInputSeparator`:

```ts
export type TagInputSeparator = 'Enter' | ',' | 'Tab' | ';' | ' '
```

`TagInputSize`:

```ts
export type TagInputSize = 'sm' | 'md' | 'lg'
```

## Movimento

- **Criar tag** — A tag entra com pop (scale 0.6 → 1, 250ms, bounce). Tags presentes ao carregar não animam.
- **Remover tag** — Sai com fade + scale 0.8 em 120ms antes de deixar o DOM; o foco vai para a tag vizinha (ou o campo) na hora.
- **Recusa (erro)** — O campo treme uma vez (or-shake, 400ms) a cada recusa — duplicada, limite ou validação.
- **Foco / hover** — Borda e anel em 160ms, ease-out.
- **Botões internos** — Afundam no clique: translateY(1px) scale(0.985) em 90ms (press).
- **Movimento reduzido** — Durações e distâncias zeram pelos tokens; o estado continua indicado por cor, borda e texto.

## Acessibilidade

As tags ficam em uma lista (`role="list"`) antes do campo, cada uma com um botão "Remover …" com nome acessível. Inclusões, remoções e erros de validação são anunciados em uma região `role="status"`; o erro também é ligado ao campo por `aria-describedby` e marca `aria-invalid`. Ao remover uma tag, o foco vai para a próxima ou volta ao campo.

| Teclas | Ação |
| --- | --- |
| `Enter` | Cria a tag com o texto digitado (com o campo vazio, envia o formulário). |
| `,` | Cria a tag (separador padrão). |
| `Tab` | Com "Tab" em separators e texto no campo, cria a tag; senão, navega. |
| `Backspace` | Com o campo vazio, remove a última tag. |
| `Shift` + `Tab` | Volta pelos botões de remover. |

- **1.3.1** — Tags expostas como lista com botões nomeados.
- **2.1.1** — Adicionar e remover funcionam pelo teclado.
- **3.3.1** — Erros de validação identificados em texto e ligados ao campo.
- **3.3.3** — Mensagens sugerem a correção (duplicada, limite, formato).
- **4.1.3** — Mudanças anunciadas sem mover o foco.
