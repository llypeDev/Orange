# SaveStatus

Indicador de salvamento automático: “Salvando…”, “Salvo há 2 min.” e “Erro ao salvar”, com nova tentativa.

- Categoria: Feedback · Status: novo
- Importação: `import { SaveStatus } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/save-status (em inglês: https://orange.llypedev.com.br/en/components/save-status)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-savestatus--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/SaveStatus

## Boas práticas

- Use em telas que salvam sozinhas (editores, formulários longos, configurações). Onde há um botão Salvar, o próprio botão mostra o carregamento e um Toast confirma.
- Posicione perto do que está sendo salvo — no cabeçalho do documento ou embaixo do campo — e sempre no mesmo lugar. Passe `savedAt`: “Salvo há 2 min.” tranquiliza mais do que “Salvo”.
- Em erro, passe `onRetry` e mantenha o que a pessoa digitou na tela. Não apague o conteúdo nem mova o foco para o botão.
- Mude o status pelo ciclo real do salvamento (idle → saving → saved | error): cada transição para saved ou error é anunciada uma vez.

- Faça: Ícone + texto + quando foi salvo.
- Evite: Só um ponto colorido ou só uma animação: cor e movimento não podem ser a única pista.

## Estados

- **idle** — Nada para salvar ainda. Vazio por padrão (ou labels.idle). As regiões vivas já ficam montadas.
- **saving — Salvando…** — Spinner (decorativo) + texto. Não é anunciado: a cada pausa na digitação seria ruído.
- **saved — Salvo há 2 min.** — Check + texto com RelativeTime (atualiza sozinho, sem anúncio). Anuncia “Salvo” de forma educada.
- **error — Erro ao salvar** — Ícone de alerta + texto em danger + “Tentar de novo” (com onRetry). Anunciado com role="alert".

## Exemplos

### Salvamento automático

Digite no campo: salva 1s depois da última tecla. Ligue “Simular falha” para ver o erro e a nova tentativa.

```tsx
import { useEffect, useRef, useState } from 'react'
import { SaveStatus, Stack, Switch, TextArea, type SaveStatusState } from '@orangesys/ui'

export default function Autosave() {
  const [descricao, setDescricao] = useState(
    'Tênis de corrida com amortecimento responsivo e cabedal respirável.',
  )
  const [status, setStatus] = useState<SaveStatusState>('saved')
  const [salvoEm, setSalvoEm] = useState(() => new Date(Date.now() - 2 * 60_000))
  const [simularFalha, setSimularFalha] = useState(false)
  const falhaRef = useRef(simularFalha)
  falhaRef.current = simularFalha
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Em um app real: chame a API aqui (ex.: PATCH /produtos/123).
  const salvar = () => {
    setStatus('saving')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      if (falhaRef.current) {
        setStatus('error')
      } else {
        setSalvoEm(new Date())
        setStatus('saved')
      }
    }, 900)
  }

  // Salva 1s depois da última tecla.
  const editar = (valor: string) => {
    setDescricao(valor)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(salvar, 1000)
  }

  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 520 }}>
      <TextArea
        label="Descrição do produto"
        rows={4}
        value={descricao}
        onChange={(event) => editar(event.target.value)}
      />
      <Stack
        gap={3} direction="horizontal" align="center" justify="between" wrap
      >
        <Switch
          size="sm"
          label="Simular falha de conexão"
          checked={simularFalha}
          onCheckedChange={setSimularFalha}
        />
        <SaveStatus status={status} savedAt={salvoEm} onRetry={salvar} />
      </Stack>
    </Stack>
  )
}
```

### Estados

```tsx
import { SaveStatus, Stack } from '@orangesys/ui'

const doisMinutosAtras = new Date(Date.now() - 2 * 60_000)

export default function States() {
  return (
    <Stack gap={3} align="start">
      <SaveStatus status="idle" labels={{ idle: 'Salvamento automático ativado' }} />
      <SaveStatus status="saving" />
      <SaveStatus status="saved" savedAt={doisMinutosAtras} />
      <SaveStatus status="error" onRetry={() => {}} />
    </Stack>
  )
}
```

### No cabeçalho de um documento

size="sm" para barras e cabeçalhos compactos.

```tsx
import { Button, Icon, SaveStatus } from '@orangesys/ui'

const salvoEm = new Date(Date.now() - 12 * 60_000)

export default function Toolbar() {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        maxWidth: 640,
        padding: '12px 16px',
        border: '1px solid var(--or-color-border)',
      }}
    >
      <div style={{ display: 'grid', gap: 2, minWidth: 0, flex: '1 1 14rem' }}>
        <strong style={{ fontFamily: 'var(--or-font-display)' }}>
          Proposta comercial — Acme Distribuidora
        </strong>
        <SaveStatus size="sm" status="saved" savedAt={salvoEm} />
      </div>
      <Button variant="outline" size="sm" startIcon={<Icon name="send" />}>
        Enviar para aprovação
      </Button>
    </div>
  )
}
```

### Textos próprios

labels troca qualquer texto; em savedAt, {time} marca onde entra o tempo relativo.

```tsx
import { SaveStatus, Stack } from '@orangesys/ui'

const salvoEm = new Date(Date.now() - 5 * 60_000)

export default function CustomLabels() {
  return (
    <Stack gap={3} align="start">
      <SaveStatus
        status="saved"
        savedAt={salvoEm}
        labels={{ saved: 'Rascunho salvo', savedAt: 'Rascunho salvo {time}' }}
      />
      <SaveStatus
        status="error"
        onRetry={() => {}}
        labels={{ error: 'Sem conexão', retry: 'Reconectar' }}
      />
    </Stack>
  )
}
```

## Movimento

- **Troca de estado** — Crossfade: o estado anterior some em --or-duration-fast enquanto o novo entra em --or-duration-medium (opacidade + 2px). Nada se move na primeira renderização.
- **Salvo / erro** — O check entra com um “pop” (or-scale-in, --or-ease-bounce); o ícone de erro balança uma vez (or-shake).
- **Salvando** — O Spinner gira enquanto salva (loop só durante o carregamento).
- **Movimento reduzido** — Troca instantânea, sem pop nem balanço; o Spinner pulsa devagar em vez de girar.

## Props

### `SaveStatus`

Indicador de salvamento automático para editores e formulários: "Salvando…",
"Salvo há 2 min." e "Erro ao salvar · Tentar de novo". Sempre ícone + texto;
anuncia o resultado (salvo/erro) uma vez por transição.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `status` (obrigatória) | `"error" \| "idle" \| "saving" \| "saved"` | — | Situação do salvamento automático. |
| `labels` | `SaveStatusLabels` | — | Substitui os textos padrão. |
| `onRetry` | `(() => void)` | — | Mostra o botão "Tentar de novo" no estado `error`. |
| `savedAt` | `RelativeTimeDate` | — | Momento do último salvamento, exibido em tempo relativo ("Salvo há 2 min."). |
| `size` | `"sm" \| "md"` | `md` | `sm` (texto 12px) ou `md` (13px, padrão). |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`SaveStatusLabels`:

```ts
/** Textos do `SaveStatus`. Cada um substitui o padrão do idioma do provider. */
export interface SaveStatusLabels {
  /** Texto no estado `idle`. Padrão: nenhum (o indicador fica vazio). */
  idle?: string
  /** Padrão: "Salvando…". */
  saving?: string
  /** Estado `saved` sem `savedAt`, e o texto anunciado ao salvar. Padrão: "Salvo". */
  saved?: string
  /** Estado `saved` com `savedAt`; `{time}` vira o tempo relativo. Padrão: "Salvo {time}". */
  savedAt?: string
  /** Padrão: "Erro ao salvar". */
  error?: string
  /** Botão de nova tentativa (com `onRetry`). Padrão: "Tentar de novo". */
  retry?: string
}
```

`SaveStatusSize`:

```ts
export type SaveStatusSize = 'sm' | 'md'
```

`SaveStatusState`:

```ts
export type SaveStatusState = 'idle' | 'saving' | 'saved' | 'error'
```

## Acessibilidade

O texto visível não é uma região viva — o “há 2 min.” se atualiza sozinho e seria relido. Duas regiões ocultas e sempre montadas recebem só os anúncios, uma vez por transição: `role="status"` (educada) para “Salvo” e `role="alert"` (assertiva) para “Erro ao salvar”, porque a pessoa pode perder o que digitou. “Salvando…” não é anunciado. O botão “Tentar de novo” é descrito pela mensagem de erro. Nenhum estado move o foco; só quando o botão some com o foco nele (a nova tentativa começou), o foco fica no próprio indicador em vez de cair no início da página — a menos que `onRetry` já o tenha levado a outro lugar.

| Teclas | Ação |
| --- | --- |
| `Tab` | Leva ao botão “Tentar de novo” (só no erro com onRetry). |
| `Enter` | Tenta salvar de novo. |
| `Space` | Tenta salvar de novo. |

- **1.4.1** — Cada estado tem ícone e texto; cor e movimento só reforçam.
- **2.4.3** — Ao tentar de novo, o foco não se perde: fica no indicador quando o botão some.
- **2.5.8** — Botão “Tentar de novo” com altura mínima de 24px.
- **4.1.3** — Mensagens de status anunciadas sem mover o foco: salvo (polite) e erro (alert).
