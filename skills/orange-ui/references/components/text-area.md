# TextArea

Campo de texto multilinha para comentários, descrições e mensagens, com crescimento automático e contador.

- Categoria: Formulários · Status: estável
- Importação: `import { TextArea } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/text-area (em inglês: https://orange.llypedev.com.br/en/components/text-area)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-textarea--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/TextArea

## Boas práticas

- Use TextArea quando a resposta pode ter mais de uma frase. Para nomes, e-mails e códigos, use TextField.
- Ajuste `rows` ao tamanho esperado da resposta: a altura do campo indica quanto escrever.
- Com limite de caracteres, mostre o contador (`showCount`) para que a pessoa não seja surpreendida.
- `autoResize` funciona bem em chats e respostas; defina `maxRows` para não empurrar o resto da tela.

## Exemplos

### Básico

```tsx
import { TextArea } from '@orangesys/ui'

export default function Basic() {
  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <TextArea
        label="Observações para a entrega"
        description="Ex.: ponto de referência, horário preferido, portaria."
        rows={4}
        optional
      />
    </div>
  )
}
```

### Contador de caracteres

O texto "x de y caracteres" é ligado ao campo e anunciado de forma educada após uma pausa na digitação.

```tsx
import { TextArea } from '@orangesys/ui'

export default function WithCount() {
  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <TextArea
        label="Bio"
        description="Aparece no seu perfil público."
        maxLength={160}
        showCount
        defaultValue="Designer de produto em São Paulo. Escrevo sobre acessibilidade e sistemas de design."
      />
    </div>
  )
}
```

### Crescimento automático

Começa com 2 linhas, cresce até 8 e então passa a rolar.

```tsx
import { Button, TextArea } from '@orangesys/ui'
import { useState } from 'react'

export default function AutoResize() {
  const [message, setMessage] = useState('')

  return (
    <form
      style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 480 }}
      onSubmit={(event) => {
        event.preventDefault()
        setMessage('')
      }}
    >
      <TextArea
        label="Responder ao chamado #4821"
        placeholder="Escreva sua resposta…"
        rows={2}
        autoResize
        maxRows={8}
        value={message}
        onValueChange={setMessage}
      />
      <div>
        <Button type="submit" size="sm" disabled={!message.trim()}>
          Enviar resposta
        </Button>
      </div>
    </form>
  )
}
```

### Estados

```tsx
import { Stack, TextArea } from '@orangesys/ui'

export default function States() {
  return (
    <Stack gap={5} style={{ width: '100%', maxWidth: 480 }}>
      <TextArea label="Motivo do cancelamento" required error="Conte o motivo para continuarmos com o cancelamento." />
      <TextArea label="Termos do contrato" readOnly rows={2} defaultValue="Vigência de 12 meses a partir da assinatura, renovável automaticamente." />
      <TextArea label="Comentário do revisor" disabled rows={2} defaultValue="Edição bloqueada durante a revisão." />
    </Stack>
  )
}
```

## Props

### `TextArea`

Campo de texto multilinha para comentários, descrições e mensagens. Pode
crescer com o conteúdo (`autoResize`) e mostrar contador de caracteres.
A `ref` e as props nativas vão para o `<textarea>`.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `autoResize` | `boolean` | `false` | Cresce automaticamente conforme o conteúdo, sem barra de rolagem. |
| `description` | `ReactNode` | — | Texto de ajuda exibido abaixo do rótulo e ligado por `aria-describedby`. |
| `error` | `ReactNode` | — | Mensagem de erro. Quando presente, o campo fica inválido. |
| `hideLabel` | `boolean` | — | Oculta o rótulo visualmente (continua acessível). |
| `invalid` | `boolean` | — | Força o estado inválido sem exibir mensagem (ex.: erro mostrado em um ErrorSummary). |
| `label` | `ReactNode` | — | Rótulo visível do campo. Sempre informe um rótulo — use `hideLabel` para ocultá-lo. |
| `labelAside` | `ReactNode` | — | Elemento à direita do rótulo (ex.: link "Esqueceu a senha?"). |
| `maxRows` | `number` | — | Com `autoResize`, limita o crescimento a este número de linhas (depois rola). |
| `onValueChange` | `((value: string) => void)` | — | Chamado com o novo texto a cada alteração (atalho para `onChange`). |
| `optional` | `boolean` | — | Mostra "(opcional)" ao lado do rótulo. |
| `required` | `boolean` | — | Campo obrigatório: mostra `*` no rótulo e aplica `required`. |
| `rows` | `number` | `3` | Número de linhas visíveis (altura mínima com `autoResize`). Padrão: 3. |
| `showCount` | `boolean` | `false` | Mostra o contador "x de y caracteres". Requer `maxLength`. |
| `size` | `"sm" \| "md" \| "lg"` | `md` | Altura do controle: `sm` 32px, `md` 40px, `lg` 48px. |

Repassa também os atributos nativos (`TextareaHTMLAttributes`) do `<textarea>`, como `name`, `required`, `disabled`, `rows`, `maxLength` e `placeholder`, além de `className`, `style`, `aria-*`, `data-*` e eventos.

## Movimento

Interações rápidas e geométricas, só com tokens de duração e curva. Com `prefers-reduced-motion`, as durações vão a zero e os estados mudam na hora — o movimento nunca é a única pista de estado.

- **Hover e foco** — Borda e anel de foco mudam de cor juntos — 160ms (--or-duration-fast), --or-ease-out.
- **Contador** — A cor muda suavemente perto do limite (250ms); ao atingir o limite, um toque de escala com --or-ease-bounce.
- **Crescimento automático** — A altura acompanha o texto sem animação, para não atrasar a digitação.
- **Erro surge** — A mensagem entra com fade e desliza 4px (250ms, --or-ease-out); o controle treme uma vez (or-shake, 400ms) só na passagem de válido para inválido.

## Acessibilidade

Um `<textarea>` nativo com `<label>`, descrição, contador e erro em `aria-describedby`. O crescimento automático não muda o foco nem a posição do cursor.

| Teclas | Ação |
| --- | --- |
| `Tab` | Move o foco para o campo (Tab não insere tabulação). |
| `Enter` | Insere uma nova linha. |
| `Shift` + `Tab` | Move o foco para o elemento anterior. |

- **1.3.1** — Rótulo, descrição e erro associados programaticamente.
- **1.4.10** — O texto quebra linha; não há rolagem horizontal.
- **2.4.7** — Foco visível com borda laranja.
- **3.3.1** — Erros descritos em texto e com aria-invalid.
- **4.1.3** — Contador como mensagem de status (aria-live="polite").
