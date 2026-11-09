# Toast

Notificações breves e não bloqueantes que confirmam ações e somem sozinhas.

- Categoria: Feedback · Status: estável
- Importação: `import { Toast, ToastProvider } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/toast (em inglês: https://orange.llypedev.com.br/en/components/toast)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-toast--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Toast

## Boas práticas

- Use toasts para confirmar algo que o usuário acabou de fazer ("Link copiado", "Pedido enviado"). Não use para informações que ele precisa ler com calma.
- Seja breve: um título de até 6 palavras e, no máximo, uma linha de descrição.
- Erros que impedem o usuário de continuar pertencem ao lugar do erro (um **Alert** no formulário), não a um toast que some.
- Toda ação de um toast precisa estar disponível em outro lugar da interface. Toasts com ação não somem sozinhos por padrão.

- Faça: Confirmação curta de uma ação concluída.
- Evite: Erros de formulário longos que somem antes de serem lidos.

## Configuração

Envolva a aplicação com um único `ToastProvider` (dentro do `OrangeProvider`, para herdar o idioma) e dispare toasts com `useToast()`.

```tsx
// App.tsx
import { OrangeProvider, ToastProvider } from '@orangesys/ui'

export function App() {
  return (
    <OrangeProvider>
      <ToastProvider position="bottom-right" limit={3} duration={5000}>
        <Routes />
      </ToastProvider>
    </OrangeProvider>
  )
}

// SaveButton.tsx — qualquer componente dentro do provider
import { Button, useToast } from '@orangesys/ui'

export function SaveButton() {
  const { toast } = useToast()
  return <Button onClick={() => toast({ title: 'Alterações salvas', tone: 'success' })}>Salvar</Button>
}
```

## Exemplos

### Tons

Somem após 5 s. Passe o mouse ou foque um toast para pausar o tempo.

```tsx
import { Button, useToast } from '@orangesys/ui'

// O ToastProvider fica uma vez na raiz da aplicação (veja "Configuração").
export default function Basic() {
  const { toast } = useToast()

  return (
    <>
      <Button onClick={() => toast({ title: 'Alterações salvas', tone: 'success' })}>Salvar</Button>
      <Button
        variant="outline"
        onClick={() =>
          toast({ title: 'Link copiado', description: 'Cole onde quiser compartilhar.' })
        }
      >
        Copiar link
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast({
            title: 'Não foi possível enviar',
            description: 'O arquivo excede o limite de 25 MB.',
            tone: 'danger',
          })
        }
      >
        Enviar anexo
      </Button>
    </>
  )
}
```

### Com ação

A ação fecha o toast ao ser clicada. Pressione F8 para levar o foco ao toast mais recente e Escape para fechá-lo.

```tsx
import { Button, Stack, useToast } from '@orangesys/ui'
import { useState } from 'react'

export default function WithAction() {
  const { toast } = useToast()
  const [archived, setArchived] = useState(0)

  const archive = () => {
    setArchived((n) => n + 3)
    toast({
      title: '3 conversas arquivadas',
      action: { label: 'Desfazer', onClick: () => setArchived((n) => n - 3) },
    })
  }

  return (
    <Stack gap={4} direction="horizontal" align="center">
      <Button variant="outline" onClick={archive}>
        Arquivar selecionadas
      </Button>
      <span style={{ color: 'var(--or-color-text-muted)' }}>Arquivadas: {archived}</span>
    </Stack>
  )
}
```

### Atualizar pelo id

Chamar toast() com um id existente substitui o conteúdo — útil para "processando → concluído".

```tsx
import { Button, useToast } from '@orangesys/ui'

export default function Update() {
  const { toast } = useToast()

  const exportReport = () => {
    const id = toast({
      title: 'Gerando relatório…',
      description: 'Vendas de outubro, 1.284 linhas.',
      duration: Infinity,
      dismissible: false,
    })
    // mesmo id: o toast é atualizado (e anunciado de novo) em vez de empilhar
    setTimeout(() => {
      toast({
        id,
        title: 'Relatório pronto',
        description: 'vendas-outubro.xlsx foi baixado.',
        tone: 'success',
      })
    }, 2000)
  }

  return <Button onClick={exportReport}>Exportar relatório</Button>
}
```

### Barra de tempo restante

showProgress mostra quanto falta para o toast fechar. Passe o mouse sobre ele: a barra e o timer pausam juntos.

```tsx
import { Button, useToast } from '@orangesys/ui'

export default function Progress() {
  const { toast } = useToast()

  return (
    <Button
      variant="outline"
      onClick={() =>
        toast({
          title: 'Rascunho salvo',
          description: 'Proposta comercial — Café Central.',
          tone: 'success',
          duration: 6000,
          // barra de tempo restante só neste toast (ou showProgress no provider para todos)
          showProgress: true,
        })
      }
    >
      Salvar rascunho
    </Button>
  )
}
```

### Posições

No topo, o mais recente aparece em cima; embaixo, junto à borda. Até 3 visíveis (limit) — os demais aguardam na fila.

```tsx
import { Button, Stack, ToastProvider, useToast, type ToastPosition } from '@orangesys/ui'
import { useState } from 'react'

const positions: ToastPosition[] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
]

function Trigger({ position }: { position: ToastPosition }) {
  const { toast } = useToast()
  return (
    <Button
      onClick={() =>
        toast({ title: 'Contato salvo', description: `Posição: ${position}`, tone: 'success' })
      }
    >
      Mostrar toast
    </Button>
  )
}

// Um provider próprio só para a demonstração; na aplicação, use um único provider.
export default function Positions() {
  const [position, setPosition] = useState<ToastPosition>('top-center')

  return (
    <Stack gap={4}>
      <Stack role="group" aria-label="Posição" gap={2} direction="horizontal" wrap>
        {positions.map((p) => (
          <Button
            key={p}
            size="sm"
            variant={p === position ? 'secondary' : 'outline'}
            aria-pressed={p === position}
            onClick={() => setPosition(p)}
          >
            {p}
          </Button>
        ))}
      </Stack>
      <ToastProvider position={position} limit={3}>
        <div>
          <Trigger position={position} />
        </div>
      </ToastProvider>
    </Stack>
  )
}
```

### Visual (Toast)

O componente Toast é exportado para composições próprias. Dentro do provider, ele é renderizado automaticamente.

```tsx
import { Button, Stack, Toast } from '@orangesys/ui'

export default function Visual() {
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 416 }}>
      <Toast title="Link copiado" onDismiss={() => {}} />
      <Toast
        tone="success"
        title="Pedido enviado"
        description="O cliente receberá o código de rastreio por e-mail."
        onDismiss={() => {}}
      />
      <Toast
        tone="danger"
        title="Falha ao salvar"
        description="Verifique sua conexão e tente novamente."
        onDismiss={() => {}}
      />
      <Toast
        title="3 conversas arquivadas"
        action={
          <Button size="sm" variant="outline">
            Desfazer
          </Button>
        }
        onDismiss={() => {}}
      />
    </Stack>
  )
}
```

## Movimento

- **Entrada** — Desliza a partir da borda da `position` (direita → vem da direita; esquerda → da esquerda; `bottom-center` → sobe; `top-center` → desce) com fade — `--or-duration-medium`, `--or-ease-out`.
- **Pilha** — A linha do novo toast cresce (grid `0fr → 1fr`) e os demais se reacomodam suavemente — `--or-duration-medium`.
- **Saída** — Mais curta: volta para a borda e esmaece em `--or-duration-fast` enquanto a linha recolhe ( `--or-duration-medium`, `--or-ease-in-out`); o `usePresence` desmonta no fim.
- **Barra de tempo (showProgress)** — `or-fill-x` ao contrário (cheia → vazia), linear, na duração do toast. Pausa junto com o timer: hover, foco e aba oculta.
- **Movimento reduzido** — Sem deslocamento (só aparece e some) e sem barra de tempo.

## Props

### `Toast`

Visual de uma notificação temporária. Normalmente é renderizado pelo
`ToastProvider` — chame `useToast().toast({...})` em vez de usá-lo direto.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `action` | `ReactNode` | — | Ação relacionada (ex.: "Desfazer"). |
| `description` | `ReactNode` | — | Detalhe opcional, em uma ou duas linhas. |
| `icon` | `ReactNode` | — | Substitui o ícone do tom. `false` remove o ícone. |
| `onDismiss` | `(() => void)` | — | Quando informado, mostra o botão de fechar e o chama ao clicar. |
| `title` | `ReactNode` | — | Mensagem principal, curta. |
| `tone` | `"neutral" \| "info" \| "success" \| "warning" \| "danger"` | `neutral` | Cor semântica e ícone. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### `ToastProvider`

Provedor de toasts: guarda a fila, renderiza a pilha em um `Portal` e
anuncia cada mensagem em regiões vivas (educada; `danger` usa `role="alert"`).
Coloque-o uma vez, perto da raiz da aplicação.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `container` | `Element \| null` | — | Elemento onde a região é renderizada. Padrão: `document.body`. |
| `duration` | `number` | `5000` | Tempo padrão (ms) até um toast fechar sozinho. |
| `hotkey` | `string \| false` | `F8` | Tecla que leva o foco para o toast mais recente. `false` desativa. |
| `limit` | `number` | `3` | Máximo de toasts visíveis ao mesmo tempo; os demais aguardam na fila. |
| `position` | `"top-left" \| "top-center" \| "top-right" \| "bottom-left" \| "bottom-center" \| "bottom-right"` | `bottom-right` | Canto da tela onde a pilha aparece. |
| `showProgress` | `boolean` | `false` | Mostra uma barra fina com o tempo restante em toasts que fecham sozinhos. Ela pausa junto com o timer (hover, foco, aba oculta). |

### Tipos

`ToastAction`:

```ts
export interface ToastAction {
  /** Rótulo do botão (ex.: "Desfazer"). */
  label: string
  /** Chamado no clique. O toast é fechado em seguida. */
  onClick: () => void
}
```

`ToastOptions`:

```ts
export interface ToastOptions {
  /** Id próprio. Chamar `toast()` com um id existente substitui o conteúdo daquele toast. */
  id?: string
  title?: ReactNode
  description?: ReactNode
  /** Padrão: `neutral`. */
  tone?: ToastTone
  /** Substitui o ícone do tom. `false` remove o ícone. */
  icon?: ReactNode | false
  action?: ToastAction
  /**
   * Tempo em ms até fechar sozinho. `Infinity` mantém o toast até ser fechado.
   * Padrão: o `duration` do provider — ou `Infinity` quando há `action`.
   */
  duration?: number
  /** Mostra o botão de fechar. Padrão: `true`. */
  dismissible?: boolean
  /** Chamado quando o toast é fechado (pelo usuário, pelo tempo ou por `dismiss`). */
  onDismiss?: () => void
  /** Mostra a barra de tempo restante deste toast. Padrão: o `showProgress` do provider. */
  showProgress?: boolean
}
```

`ToastPosition`:

```ts
export type ToastPosition =
  'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
```

`ToastTone`:

```ts
export type ToastTone = FeedbackTone
```

`UseToastReturn`:

```ts
export interface UseToastReturn {
  /** Mostra um toast e retorna o seu id. */
  toast: (options: ToastOptions) => string
  /** Fecha o toast com o id informado. */
  dismiss: (id: string) => void
  /** Fecha todos os toasts. */
  dismissAll: () => void
}
```

## Acessibilidade

A pilha fica num `Portal`, dentro de uma região rotulada "Notificações (F8)". O texto de cada toast é copiado para regiões vivas ocultas e sempre montadas: `role="status"` (educada) para a maioria e `role="alert"` (assertiva) para `danger`. Assim o anúncio é confiável e não inclui os rótulos dos botões. O foco nunca é roubado: o usuário chega aos toasts com F8.

> **Tempo ajustável** O tempo pausa enquanto o ponteiro está sobre a pilha, enquanto o foco está em um toast e quando a aba fica em segundo plano.

| Teclas | Ação |
| --- | --- |
| `F8` | Leva o foco ao toast mais recente. |
| `Tab` | Percorre as ações e botões de fechar. |
| `Escape` | Fecha o toast focado; o foco vai para o próximo toast ou volta para onde estava. |
| `Enter` | Ativa a ação ou fecha. |

- **2.2.1** — Tempo pausável (hover, foco, aba oculta); toasts com ação não expiram por padrão.
- **2.3.3** — Sem deslizamento quando o sistema pede movimento reduzido.
- **2.4.3** — Ordem do DOM igual à ordem visual da pilha; o foco é devolvido ao fechar.
- **4.1.3** — Mensagens anunciadas por regiões vivas sem receber foco.
