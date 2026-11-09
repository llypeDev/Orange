# Skeleton

Espaço reservado com a forma do conteúdo que está carregando.

- Categoria: Feedback · Status: estável
- Importação: `import { Skeleton, SkeletonText } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/skeleton (em inglês: https://orange.llypedev.com.br/en/components/skeleton)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-skeleton--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Skeleton

## Boas práticas

- Imite o layout real: mesma quantidade aproximada de linhas, alturas e posições. O conteúdo não deve "pular" ao carregar.
- Use para o primeiro carregamento de listas, cartões e páginas. Para recarregar algo já visível, prefira LoadingOverlay ou Spinner.
- Mostre só a estrutura — não use skeleton para botões ou campos que o usuário já poderia usar.
- Se a espera passar de alguns segundos, troque por uma mensagem que explique o que está acontecendo.

## Padrão de contêiner

Skeletons são decorativos (`aria-hidden`). Quem informa o carregamento é o contêiner: marque-o com `aria-busy` e anuncie o início e o fim numa região `role="status"` que fica **fora** dele — alguns leitores de tela ignoram mudanças dentro de um elemento ocupado.

```tsx
<VisuallyHidden role="status">
  {loading ? 'Carregando pedidos…' : 'Pedidos carregados'}
</VisuallyHidden>

<section aria-labelledby="pedidos" aria-busy={loading}>
  <h2 id="pedidos">Últimos pedidos</h2>
  {loading ? <SkeletonText lines={3} /> : <OrderList />}
</section>
```

Com `loaded`, o próprio Skeleton vira o contêiner da troca: recebe `aria-busy` enquanto carrega e faz crossfade para o conteúdo real. O anúncio de início e fim continua numa região `role="status"` fora dele.

## Exemplos

### Variantes

text (uma linha), rect (imagens, gráficos, cartões) e circle (avatares).

```tsx
import { Skeleton } from '@orangesys/ui'

export default function Variants() {
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 420 }}>
      <Skeleton variant="text" />
      <Skeleton variant="rect" height={96} />
      <Skeleton variant="circle" width={48} />
    </div>
  )
}
```

### Parágrafo

SkeletonText repete linhas e encurta a última, como um texto real.

```tsx
import { SkeletonText } from '@orangesys/ui'

export default function Paragraph() {
  return (
    <div style={{ display: 'grid', gap: 24, width: '100%', maxWidth: 480 }}>
      <SkeletonText lines={3} />
      <SkeletonText lines={5} lastLineWidth="35%" />
    </div>
  )
}
```

### Cartão

```tsx
import { Skeleton, SkeletonText } from '@orangesys/ui'

export default function Card() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 16,
        width: 320,
        padding: 20,
        border: '1px solid var(--or-color-border)',
      }}
    >
      <Skeleton variant="rect" height={160} />
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Skeleton variant="circle" width={40} />
        <div style={{ flex: 1 }}>
          <Skeleton width="60%" />
          <Skeleton width="35%" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  )
}
```

### Troca pelo conteúdo (loaded)

Com loaded, o Skeleton envolve o conteúdo real e faz crossfade quando ele chega — sem "pulo". Clique em Recarregar perfil para repetir.

```tsx
import { Button, Skeleton, SkeletonText } from '@orangesys/ui'
import { useEffect, useState } from 'react'

export default function Swap() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (loaded) return
    const timer = setTimeout(() => setLoaded(true), 1800)
    return () => clearTimeout(timer)
  }, [loaded])

  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 420 }}>
      <article
        style={{
          display: 'grid',
          gap: 12,
          padding: 20,
          border: '1px solid var(--or-color-border)',
        }}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {/* loaded: crossfade do placeholder para o conteúdo real */}
          <Skeleton variant="circle" width={40} loaded={loaded}>
            <span
              aria-hidden="true"
              style={{
                display: 'grid',
                placeItems: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'var(--or-color-accent)',
                color: 'var(--or-color-text-on-accent)',
                fontWeight: 700,
              }}
            >
              AS
            </span>
          </Skeleton>
          <Skeleton width="50%" loaded={loaded} style={{ flex: 1 }}>
            <strong>Ana Souza</strong>
            <span style={{ display: 'block', fontSize: 13, color: 'var(--or-color-text-subtle)' }}>
              Gerente de contas
            </span>
          </Skeleton>
        </div>
        <SkeletonText lines={2} loaded={loaded}>
          <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
            Atende 42 clientes no Sudeste. Última visita: Padaria Pão Dourado, ontem às 15h.
          </p>
        </SkeletonText>
      </article>
      <div>
        <Button size="sm" variant="outline" onClick={() => setLoaded(false)}>
          Recarregar perfil
        </Button>
      </div>
    </div>
  )
}
```

### Lista carregando

aria-busy no contêiner e status fora dele. Clique em Recarregar para repetir.

```tsx
import { Button, Skeleton, VisuallyHidden } from '@orangesys/ui'
import { useEffect, useState } from 'react'

const orders = [
  { id: '#4821', customer: 'Padaria Pão Dourado', total: 'R$ 1.240,00' },
  { id: '#4820', customer: 'Mercado Bom Preço', total: 'R$ 3.875,50' },
  { id: '#4819', customer: 'Café Central', total: 'R$ 642,90' },
]

export default function Loading() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!loading) return
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [loading])

  return (
    <div style={{ width: '100%', maxWidth: 520 }}>
      {/* anúncio fora do contêiner ocupado */}
      <VisuallyHidden role="status">
        {loading ? 'Carregando pedidos…' : 'Pedidos carregados'}
      </VisuallyHidden>
      <section
        aria-labelledby="pedidos"
        aria-busy={loading}
        style={{ border: '1px solid var(--or-color-border)' }}
      >
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
          }}
        >
          <h3 id="pedidos" style={{ margin: 0, fontFamily: 'var(--or-font-display)' }}>
            Últimos pedidos
          </h3>
          <Button size="sm" variant="ghost" onClick={() => setLoading(true)}>
            Recarregar
          </Button>
        </header>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {(loading ? [0, 1, 2] : orders).map((order, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                gap: 16,
                alignItems: 'center',
                padding: '12px 16px',
                borderTop: '1px solid var(--or-color-border)',
              }}
            >
              {typeof order === 'number' ? (
                <>
                  <Skeleton width={48} />
                  <Skeleton width="45%" />
                  <Skeleton width={80} style={{ marginLeft: 'auto' }} />
                </>
              ) : (
                <>
                  <span
                    style={{
                      fontFamily: 'var(--or-font-mono)',
                      color: 'var(--or-color-text-subtle)',
                    }}
                  >
                    {order.id}
                  </span>
                  <span>{order.customer}</span>
                  <strong style={{ marginLeft: 'auto' }}>{order.total}</strong>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
```

## Movimento

- **Brilho** — Uma faixa clara atravessa a forma a cada 1.6s ( `--or-duration-loop` × 2/3), `--or-ease-in-out`.
- **Troca (loaded)** — Crossfade: o conteúdo aparece em `--or-duration-medium` sobre o placeholder, que esmaece em `--or-duration-fast` e só então sai do DOM (`usePresence`). Conteúdo que já chega carregado não anima.
- **Movimento reduzido** — Forma estática, sem brilho; a troca é instantânea.

## Props

### `Skeleton`

Espaço reservado com a forma do conteúdo que está carregando. É decorativo
(`aria-hidden`): marque o contêiner com `aria-busy` e anuncie o carregamento
numa região `role="status"` fora dele. Com `loaded`, troca sozinho pelo
conteúdo real com crossfade.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `animated` | `boolean` | `true` | Brilho animado. Desligado automaticamente com movimento reduzido. |
| `children` | `ReactNode` | — | Conteúdo real, exibido quando `loaded` é `true`. |
| `height` | `string \| number` | — | Altura (número = px). Padrão: 1 linha (`text`), 120px (`rect`) ou igual à largura (`circle`). |
| `loaded` | `boolean` | — | Modo de troca: com `loaded`, o Skeleton envolve o conteúdo real (`children`) e faz um crossfade do placeholder para ele quando `loaded` vira `true`. Enquanto carrega, o contêiner recebe `aria-busy`. |
| `variant` | `"text" \| "circle" \| "rect"` | `text` | Forma: linha de texto, retângulo (imagens, cartões) ou círculo (avatares). |
| `width` | `string \| number` | — | Largura (número = px). Padrão: 100% (`text`/`rect`) ou 40px (`circle`). |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### `SkeletonText`

Bloco de várias linhas de `Skeleton` imitando um parágrafo.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `animated` | `boolean` | `true` | Brilho animado. |
| `children` | `ReactNode` | — | Conteúdo real, exibido quando `loaded` é `true`. |
| `lastLineWidth` | `string \| number` | `60%` | Largura da última linha, para parecer um parágrafo real. |
| `lines` | `number` | `3` | Número de linhas. |
| `loaded` | `boolean` | — | Modo de troca: faz crossfade das linhas para `children` quando `true`. |
| `width` | `string \| number` | — | Largura do bloco. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`SkeletonVariant`:

```ts
export type SkeletonVariant = 'text' | 'rect' | 'circle'
```

## Acessibilidade

> **Sem interação** Skeletons não recebem foco nem são lidos. Não há interação por teclado.

- **1.3.1** — Estado de carregamento exposto no contêiner com `aria-busy`.
- **2.3.3** — Sem brilho animado quando o sistema pede movimento reduzido.
- **4.1.3** — Início e fim do carregamento anunciados por `role="status"`.
