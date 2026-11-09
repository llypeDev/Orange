# CopyButton

Copia um texto para a área de transferência e confirma com um ícone de check e um anúncio para leitores de tela.

- Categoria: Ações · Status: estável
- Importação: `import { CopyButton } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/copy-button (em inglês: https://orange.llypedev.com.br/en/components/copy-button)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-copybutton--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/CopyButton

## Boas práticas

- Coloque o botão junto do valor que ele copia — à direita de um comando, link ou código — e mostre o valor na tela.
- Somente ícone funciona em blocos de código e campos compactos. Em fluxos de compartilhamento, use rótulo ("Copiar link").
- Personalize a confirmação com `copiedLabel` quando houver mais de um botão de copiar na tela ("Link copiado", "Cupom copiado").
- Não copie dados sensíveis sem que o usuário veja o que está sendo copiado.

- Faça: Rótulo diz o que será copiado.
- Evite: Rótulo genérico que não descreve a ação.

## Exemplos

### Comando de instalação

Somente ícone, variante ghost por padrão. O ícone vira um check por 2 segundos.

```tsx
import { CopyButton } from '@orangesys/ui'

const command = 'pnpm add @orangesys/ui @orangesys/tokens'

export default function Command() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        maxWidth: 480,
        padding: '4px 4px 4px 16px',
        border: '1px solid var(--or-color-border)',
        background: 'var(--or-color-bg-subtle)',
      }}
    >
      <code
        style={{
          flex: 1,
          minWidth: 0,
          fontFamily: 'var(--or-font-mono)',
          fontSize: 'var(--or-text-sm)',
          color: 'var(--or-color-text)',
        }}
      >
        {command}
      </code>
      {/* Sem children: somente ícone, com o nome "Copiar para a área de transferência". */}
      <CopyButton value={command} size="sm" />
    </div>
  )
}
```

### Com rótulo

Com children, o rótulo troca para a confirmação sem mudar a largura do botão.

```tsx
import { CopyButton, Stack } from '@orangesys/ui'

const inviteLink = 'https://app.orange.dev/convite/equipe-produto'

export default function WithLabel() {
  return (
    // minmax(0, 1fr): sem isso a largura mínima do input (~20 caracteres)
    // empurrava a linha para fora da prévia no celular.
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 8, width: '100%', maxWidth: 520 }}>
      <label
        htmlFor="invite-link"
        style={{
          fontFamily: 'var(--or-font-display)',
          fontSize: 'var(--or-text-sm)',
          fontWeight: 600,
        }}
      >
        Link de convite
      </label>
      <Stack gap={2} direction="horizontal">
        <input
          id="invite-link"
          readOnly
          value={inviteLink}
          onFocus={(e) => e.currentTarget.select()}
          style={{
            flex: 1,
            minWidth: 0,
            height: 40,
            padding: '0 12px',
            border: '1px solid var(--or-color-border-control)',
            background: 'var(--or-color-surface)',
            fontSize: 'var(--or-text-sm)',
          }}
        />
        <CopyButton value={inviteLink} copiedLabel="Link copiado">
          Copiar link
        </CopyButton>
      </Stack>
    </div>
  )
}
```

### onCopy e tempo de confirmação

`onCopy` é chamado depois de copiar com sucesso; `timeout` define quanto tempo o check fica visível.

```tsx
import { CopyButton, Stack } from '@orangesys/ui'
import { useState } from 'react'

export default function OnCopy() {
  const [count, setCount] = useState(0)

  return (
    <Stack gap={4} direction="horizontal" align="center" wrap>
      <div style={{ padding: '8px 16px', border: '1px dashed var(--or-color-accent-border)' }}>
        <span className="or-eyebrow">Cupom</span>
        <div style={{ fontFamily: 'var(--or-font-mono)', fontSize: 'var(--or-text-lg)' }}>
          BEMVINDO15
        </div>
      </div>
      <CopyButton
        value="BEMVINDO15"
        variant="primary"
        copiedLabel="Cupom copiado"
        timeout={3000}
        onCopy={() => setCount((c) => c + 1)}
      >
        Copiar cupom
      </CopyButton>
      <span style={{ fontSize: 'var(--or-text-sm)', color: 'var(--or-color-text-muted)' }}>
        Copiado {count} {count === 1 ? 'vez' : 'vezes'}
      </span>
    </Stack>
  )
}
```

### Variantes e tamanhos

```tsx
import { CopyButton, Stack } from '@orangesys/ui'

const pedido = 'PED-2026-048213'

export default function Variants() {
  return (
    <Stack gap={3} direction="horizontal" align="center" wrap>
      <CopyButton value={pedido} size="sm" variant="outline" />
      <CopyButton value={pedido} variant="outline" />
      <CopyButton value={pedido} size="lg" variant="outline" />
      <CopyButton value={pedido} size="sm" variant="ghost">
        Copiar número do pedido
      </CopyButton>
      <CopyButton value={pedido} variant="secondary">
        Copiar
      </CopyButton>
    </Stack>
  )
}
```

## Movimento

- **Pressionar** — Afunda 1px e reduz para 98,5% em `--or-duration-press` (90ms); volta em `fast` com `--or-ease-out`.
- **Copiar** — O ícone de cópia sai em `fast` (`ease-in-out`) e o check entra girando de -45° e crescendo de 0.6 a 1 com `--or-ease-bounce` em `medium`.
- **Rótulo** — O texto atual sobe 4px e some; a confirmação sobe de baixo. Os dois ocupam o mesmo espaço: a largura não muda.
- **Voltar** — Depois do `timeout`, o check sai rápido e o ícone de cópia volta suave (`medium`, `ease-out`); os textos fazem o caminho inverso.
- **Movimento reduzido** — Com `prefers-reduced-motion`, os tokens zeram as durações: os estados mudam na hora, sem perder nenhuma pista visual.

## Props

### `CopyButton`

Copia `value` para a área de transferência. O ícone vira um check e a
confirmação é anunciada em uma região `aria-live="polite"`.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `value` (obrigatória) | `string` | — | Texto copiado para a área de transferência. |
| `block` | `boolean` | — | Ocupa toda a largura disponível. |
| `children` | `ReactNode` | — | Rótulo visível. Sem `children`, o botão mostra só o ícone e usa `t('copyToClipboard')` como nome acessível. |
| `copiedLabel` | `string` | — | Texto exibido e anunciado após copiar. Padrão: `t('copied')` ("Copiado!"). |
| `onCopy` | `((value: string) => void)` | — | Chamado com o valor depois de copiar com sucesso. |
| `size` | `"sm" \| "md" \| "lg"` | — | Altura do botão: `sm` 32px, `md` 40px, `lg` 48px. |
| `timeout` | `number` | `2000` | Tempo (ms) em que o estado "copiado" permanece visível. |
| `variant` | `"outline" \| "danger" \| "primary" \| "secondary" \| "ghost"` | — | Estilo visual. `primary` é a ação principal; use apenas um por contexto. |

Repassa também os atributos nativos (`ButtonHTMLAttributes`) do `<button>`, como `type`, `disabled`, `onClick`, `form` e `name`, além de `className`, `style`, `aria-*`, `data-*` e eventos.

## Acessibilidade

É um `<button>` nativo. Depois de copiar, a confirmação é anunciada numa região `role="status"` com `aria-live="polite"`, que já existe na página antes do clique — por isso o anúncio é confiável em todos os leitores de tela. O foco não sai do botão.

| Teclas | Ação |
| --- | --- |
| `Tab` | Move o foco para o botão. |
| `Enter` | Copia o valor. |
| `Space` | Copia o valor. |

- **1.4.1** — A confirmação troca o ícone (cópia → check) e o texto, não só a cor.
- **2.4.7** — Foco visível com contorno laranja de 2px.
- **4.1.2** — Somente ícone recebe o nome "Copiar para a área de transferência" via `aria-label`.
- **4.1.3** — "Copiado!" é anunciado por uma região `aria-live="polite"`, sem mover o foco.
