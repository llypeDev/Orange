# Tag

Rótulo curto para categorizar ou indicar status, com marcador quadrado colorido e remoção opcional.

- Categoria: Exibição de dados · Status: estável
- Importação: `import { Tag } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/tag (em inglês: https://orange.llypedev.com.br/en/components/tag)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-tag--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Tag

## Boas práticas

- Use tags para categorias e status que o usuário só lê. Para filtros que ele liga e desliga, use Chip.
- Escreva rótulos de uma a três palavras. A cor reforça, mas o texto sozinho precisa bastar.
- Mantenha o mesmo tom para o mesmo significado em todo o produto (ex.: success sempre = concluído).
- Ao remover uma tag, mova o foco para a tag vizinha ou para um controle próximo — nunca deixe o foco cair no `<body>`.

## Exemplos

### Status

Variante outline (padrão): borda neutra e marcador quadrado na cor do tom.

```tsx
import { Tag } from '@orangesys/ui'

export default function Status() {
  return (
    <>
      <Tag>Rascunho</Tag>
      <Tag tone="info">Em separação</Tag>
      <Tag tone="accent">Enviado</Tag>
      <Tag tone="success">Entregue</Tag>
      <Tag tone="warning">Pagamento pendente</Tag>
      <Tag tone="danger">Devolvido</Tag>
    </>
  )
}
```

### Solid e tamanhos

solid usa o fundo suave do tom e o texto na cor do tom. Tamanhos sm, md (padrão) e lg.

```tsx
import { Tag } from '@orangesys/ui'

export default function SolidSizes() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <Tag variant="solid">Neutro</Tag>
        <Tag variant="solid" tone="accent">Destaque</Tag>
        <Tag variant="solid" tone="success">Ativo</Tag>
        <Tag variant="solid" tone="warning">Em teste</Tag>
        <Tag variant="solid" tone="danger">Suspenso</Tag>
        <Tag variant="solid" tone="info">Beta</Tag>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
        <Tag size="sm" tone="success">sm · 22px</Tag>
        <Tag size="md" tone="success">md · 28px</Tag>
        <Tag size="lg" tone="success">lg · 32px</Tag>
      </div>
    </div>
  )
}
```

### Com ícones

icon substitui o marcador; marker={false} remove o marcador.

```tsx
import { Icon, Tag } from '@orangesys/ui'

export default function WithIcons() {
  return (
    <>
      <Tag tone="info" icon={<Icon name="clock" />}>
        Agendado para 08/11
      </Tag>
      <Tag tone="success" icon={<Icon name="check-circle" />}>
        Verificado
      </Tag>
      <Tag icon={<Icon name="lock" />}>Privado</Tag>
      <Tag variant="solid" tone="accent" marker={false}>
        Sem marcador
      </Tag>
    </>
  )
}
```

### Removível

onRemove adiciona o botão "Remover {rótulo}". O exemplo move o foco para a próxima tag após a remoção.

```tsx
import { Button, Tag } from '@orangesys/ui'
import { useRef, useState } from 'react'

const initial = ['São Paulo', 'Até R$ 200', 'Frete grátis', 'Avaliação 4+']

export default function Removable() {
  const [filters, setFilters] = useState(initial)
  const listRef = useRef<HTMLUListElement>(null)
  const resetRef = useRef<HTMLButtonElement>(null)

  const remove = (index: number) => {
    const next = filters.filter((_, i) => i !== index)
    setFilters(next)
    // Leva o foco para a tag seguinte (ou anterior); sem tags, para o botão.
    requestAnimationFrame(() => {
      const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('button')
      const target = buttons?.[Math.min(index, next.length - 1)] ?? resetRef.current
      target?.focus()
    })
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <ul
        ref={listRef}
        aria-label="Filtros aplicados"
        style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: 0, padding: 0, listStyle: 'none' }}
      >
        {filters.map((filter, index) => (
          <li key={filter}>
            <Tag onRemove={() => remove(index)}>{filter}</Tag>
          </li>
        ))}
      </ul>
      <div>
        <Button ref={resetRef} variant="ghost" size="sm" onClick={() => setFilters(initial)}>
          Restaurar filtros
        </Button>
      </div>
    </div>
  )
}
```

## Movimento

- **Remover** — A tag encolhe para 90% e some em --or-duration-fast (160ms), --or-ease-in-out; onRemove é chamado ao final (na hora, em movimento reduzido).
- **Pressionar o "x"** — O ícone encolhe em --or-duration-press (90ms) e volta com --or-ease-bounce.
- **Hover** — Fundo e cor do botão de remover em --or-duration-fast (160ms).

## Props

### `Tag`

Rótulo estático para categorizar ou indicar status, com marcador quadrado
colorido e botão de remover opcional.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | Desabilita o botão de remover. |
| `icon` | `ReactNode` | — | Ícone no lugar do marcador. |
| `marker` | `boolean` | `true` | Mostra o marcador quadrado colorido. Padrão: `true`. |
| `onRemove` | `((event: MouseEvent<HTMLButtonElement, MouseEvent>) => void)` | — | Mostra o botão de remover. É chamado quando a animação de saída termina (imediatamente em movimento reduzido) — remova a tag da lista nesse momento. |
| `removeLabel` | `string` | — | Rótulo acessível do botão de remover. Padrão: "Remover {texto da tag}". |
| `size` | `"sm" \| "md" \| "lg"` | `md` | Altura: `sm` 22px, `md` 28px, `lg` 32px. |
| `tone` | `"neutral" \| "info" \| "success" \| "warning" \| "danger" \| "accent"` | `neutral` | Cor semântica do marcador (e do fundo, na variante `solid`). |
| `variant` | `"outline" \| "solid"` | `outline` | `outline` (borda, padrão) ou `solid` (fundo suave do tom). |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`TagSize`:

```ts
export type TagSize = 'sm' | 'md' | 'lg'
```

`TagTone`:

```ts
export type TagTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'
```

`TagVariant`:

```ts
export type TagVariant = 'outline' | 'solid'
```

## Acessibilidade

A tag é texto: o marcador e o ícone são decorativos. O botão de remover é um `<button>` nativo com nome "Remover São Paulo" (traduzido via `t('removeItem')`). Para um conjunto de tags, envolva-as em uma lista rotulada.

| Teclas | Ação |
| --- | --- |
| `Tab` | Move o foco para o botão de remover. |
| `Enter` | Remove a tag. |
| `Space` | Remove a tag. |

- **1.4.1** — O significado está no texto, não só na cor do marcador.
- **1.4.3** — Texto da variante solid com contraste mínimo de 4.5:1 sobre o fundo do tom.
- **2.4.7** — Foco visível no botão de remover.
- **4.1.2** — Botão de remover com nome que inclui o rótulo da tag.
