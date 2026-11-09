# Spinner

Indicador circular para esperas curtas de duração desconhecida.

- Categoria: Feedback · Status: estável
- Importação: `import { Spinner } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/spinner (em inglês: https://orange.llypedev.com.br/en/components/spinner)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-spinner--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Spinner

## Boas práticas

- Use para esperas curtas (até alguns segundos) cuja duração não dá para medir. Se der para medir, prefira ProgressBar ou ProgressCircle.
- Para telas ou listas inteiras carregando, Skeleton mostra a forma do conteúdo e reduz a sensação de espera.
- Dê um rótulo específico com `label` ("Carregando comentários"), em vez do genérico "Carregando…".
- Botões que disparam a espera já têm `loading` — não coloque um Spinner solto ao lado deles.

## Tons

- **`accent`** — Laranja. Padrão, para esperas em destaque.
- **`neutral`** — Cor do texto, para áreas discretas.
- **`current`** — Herda currentColor — dentro de botões, links e textos coloridos.

## Exemplos

### Tamanhos

sm (16px), md (24px, padrão) e lg (40px).

```tsx
import { Spinner, Stack } from '@orangesys/ui'

export default function Sizes() {
  return (
    <Stack gap={8} direction="horizontal" align="center">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </Stack>
  )
}
```

### Tons

```tsx
import { Spinner, Stack } from '@orangesys/ui'

export default function Tones() {
  return (
    <Stack gap={8} direction="horizontal" align="center">
      <Spinner tone="accent" label="Carregando pedidos" />
      <Spinner tone="neutral" label="Carregando clientes" />
      {/* current herda a cor do texto ao redor */}
      <span style={{ color: 'var(--or-color-info-text)' }}>
        <Spinner tone="current" label="Carregando agenda" />
      </span>
    </Stack>
  )
}
```

### Com texto visível

Quando há texto ao lado, ele vira o anúncio e o Spinner fica decorativo.

```tsx
import { Spinner } from '@orangesys/ui'

export default function WithText() {
  return (
    // o texto visível é o anúncio; o spinner fica decorativo para não repetir "Carregando"
    <p role="status" style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
      <Spinner size="sm" decorative />
      Sincronizando 248 contatos…
    </p>
  )
}
```

### Em um painel

Clique em Recarregar: o Spinner ocupa o lugar do conteúdo e anuncia o rótulo.

```tsx
import { Button, Spinner, Stack } from '@orangesys/ui'
import { useState } from 'react'

const comments = [
  'Aprovado pelo financeiro.',
  'Enviar a versão final até sexta.',
  'Revisar o item 4 do contrato.',
]

export default function Panel() {
  const [loading, setLoading] = useState(false)

  const reload = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1800)
  }

  return (
    <section
      aria-labelledby="comentarios"
      style={{
        width: '100%',
        maxWidth: 420,
        border: '1px solid var(--or-color-border)',
        padding: 20,
      }}
    >
      <Stack gap={0} direction="horizontal" align="center" justify="between">
        <h3 id="comentarios" style={{ margin: 0, fontFamily: 'var(--or-font-display)' }}>
          Comentários
        </h3>
        {/* não desabilite o botão durante o carregamento: o foco se perderia */}
        <Button size="sm" variant="ghost" onClick={() => !loading && reload()}>
          Recarregar
        </Button>
      </Stack>
      <div
        style={{
          minHeight: 112,
          display: 'grid',
          placeItems: loading ? 'center' : 'stretch',
          marginTop: 12,
        }}
      >
        {loading ? (
          <Spinner label="Carregando comentários" />
        ) : (
          <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--or-color-text-muted)' }}>
            {comments.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
```

## Movimento

- **Rotação** — Uma volta a cada 800ms (`--or-duration-loop` / 3), linear e contínua.
- **Entrada** — Fade curto (`--or-duration-fast`): esperas breves não "piscam".
- **Movimento reduzido** — A rotação vira uma pulsação lenta de opacidade (2s), sem deslocamento.

## Props

### `Spinner`

Indicador circular de carregamento para esperas curtas e de duração
desconhecida. Anuncia `role="status"` com um rótulo visualmente oculto.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `decorative` | `boolean` | `false` | Esconde o indicador de tecnologias assistivas (`aria-hidden`). Use quando outro elemento já anuncia o carregamento (ex.: um texto visível ao lado). |
| `label` | `string` | — | Texto anunciado a leitores de tela. Padrão: `t('loading')`. |
| `size` | `"sm" \| "md" \| "lg"` | `md` | Diâmetro: `sm` 16px, `md` 24px, `lg` 40px. |
| `tone` | `"neutral" \| "accent" \| "current"` | `accent` | Cor do arco: `accent` (laranja), `neutral` (texto) ou `current` (herda `color`). |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`SpinnerSize`:

```ts
export type SpinnerSize = 'sm' | 'md' | 'lg'
```

`SpinnerTone`:

```ts
export type SpinnerTone = 'accent' | 'neutral' | 'current'
```

## Acessibilidade

O Spinner é um `role="status"` com o rótulo em texto visualmente oculto, traduzido pelo `OrangeProvider`. Não recebe foco. Com movimento reduzido, a rotação é trocada por uma pulsação lenta de opacidade.

- **1.4.11** — Arco com contraste mínimo de 3:1 sobre o fundo.
- **2.3.3** — Sem rotação contínua quando o sistema pede movimento reduzido.
- **4.1.3** — Estado anunciado via `role="status"`, sem mover o foco.
