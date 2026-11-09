# AvatarGroup

Avatares sobrepostos em uma lista rotulada, com contador "+N" para quem não cabe.

- Categoria: Exibição de dados · Status: estável
- Importação: `import { AvatarGroup } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/avatar-group (em inglês: https://orange.llypedev.com.br/en/components/avatar-group)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-avatargroup--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/AvatarGroup

## Boas práticas

- Use para mostrar quem participa de algo (revisores, membros, pessoas online) quando a identidade individual é secundária.
- Dê um rótulo que explique o grupo com `label` — ou aponte para um título visível com `aria-labelledby`.
- Mostre de 3 a 5 avatares. Mais do que isso vira ruído; use max e deixe o contador resumir o restante.
- Se o usuário precisa ver a lista completa, ofereça um link ou botão ao lado ("Ver todos") — o contador não é interativo.

## Exemplos

### Básico com limite

max={4} mostra quatro avatares e resume o restante em "+2". O contador tem nome acessível ("mais 2") e lista os nomes ocultos no title.

```tsx
import { Avatar, AvatarGroup } from '@orangesys/ui'

const reviewers = ['Mariana Lopes', 'Rafael Costa', 'Beatriz Nunes', 'Diego Almeida', 'Lívia Martins', 'Thiago Rocha']

export default function Basic() {
  return (
    <AvatarGroup label="Revisores do documento" max={4}>
      {reviewers.map((name) => (
        <Avatar key={name} name={name} />
      ))}
    </AvatarGroup>
  )
}
```

### Tamanhos e formas

size e shape do grupo valem para todos os avatares (e para o contador).

```tsx
import { Avatar, AvatarGroup } from '@orangesys/ui'

const team = ['Ana Souza', 'Bruno Lima', 'Carla Dias', 'Diego Alves', 'Elisa Prado']

export default function SizesShapes() {
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <AvatarGroup label="Equipe de design" size="sm" max={3}>
        {team.map((name) => (
          <Avatar key={name} name={name} />
        ))}
      </AvatarGroup>
      <AvatarGroup label="Equipe de design" size="lg" shape="circle" max={3}>
        {team.map((name) => (
          <Avatar key={name} name={name} />
        ))}
      </AvatarGroup>
    </div>
  )
}
```

### Total maior que a lista

Quando só parte das pessoas foi carregada, total informa o número real e o contador mostra a diferença.

```tsx
import { Avatar, AvatarGroup } from '@orangesys/ui'

// A API devolveu só os 5 primeiros participantes, mas o evento tem 128.
const firstPage = ['Lívia Martins', 'Pedro Henrique', 'Sofia Ramos', 'Gustavo Lima', 'Helena Duarte']

export default function Total() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <AvatarGroup label="Participantes do webinar" total={128} size="sm" shape="circle">
        {firstPage.map((name) => (
          <Avatar key={name} name={name} />
        ))}
      </AvatarGroup>
      <span style={{ color: 'var(--or-color-text-muted)', fontSize: 'var(--or-text-sm)' }}>128 inscritos</span>
    </div>
  )
}
```

### Sobre uma superfície

A borda que separa os avatares usa a cor do fundo. Em superfícies elevadas, ajuste --or-avatar-ring. Aqui o rótulo é um texto visível ligado por aria-labelledby.

```tsx
import { Avatar, AvatarGroup, Button } from '@orangesys/ui'
import type { CSSProperties } from 'react'

const editors = ['Mariana Lopes', 'Rafael Costa', 'Beatriz Nunes', 'Diego Almeida', 'Lívia Martins']

// Em superfícies elevadas, a borda dos avatares acompanha o fundo via --or-avatar-ring.
const panel = {
  '--or-avatar-ring': 'var(--or-color-surface-raised)',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 16,
  padding: 20,
  border: '1px solid var(--or-color-border)',
  background: 'var(--or-color-surface-raised)',
} as CSSProperties

export default function OnSurface() {
  return (
    <div style={panel}>
      <span id="editores" style={{ fontWeight: 600 }}>
        Editando agora
      </span>
      <AvatarGroup aria-labelledby="editores" max={3} size="sm">
        {editors.map((name) => (
          <Avatar key={name} name={name} status="online" />
        ))}
      </AvatarGroup>
      <Button variant="outline" size="sm" style={{ marginLeft: 'auto' }}>
        Compartilhar
      </Button>
    </div>
  )
}
```

## Movimento

- **Hover ou foco em um avatar** — Sobe 4px (--or-distance-lift), fica acima dos vizinhos e ganha a sombra deslocada laranja. --or-duration-medium (250ms), --or-ease-out.
- **Movimento reduzido** — Sem deslocamento; a sombra laranja continua indicando o destaque.

## Props

### `AvatarGroup`

Avatares sobrepostos em uma lista rotulada, com contador "+N" para o
excedente. Os filhos devem ser `Avatar`.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `label` | `string` | — | Rótulo da lista (ex.: "Pessoas com acesso"). Obrigatório sem `aria-labelledby`. |
| `max` | `number` | — | Quantidade máxima de avatares visíveis; o restante vira o contador "+N". |
| `shape` | `"circle" \| "square"` | `square` | Forma aplicada a todos os avatares. |
| `size` | `"sm" \| "md" \| "lg" \| "xs" \| "xl"` | `md` | Tamanho aplicado a todos os avatares. |
| `total` | `number` | — | Total real de pessoas, quando apenas parte delas foi carregada. O contador mostra `total - visíveis`. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

## Acessibilidade

Renderiza uma `<ul role="list">` rotulada, com um `<li>` por avatar — leitores de tela anunciam "Revisores do documento, lista, 5 itens". O `role="list"` explícito preserva a semântica no Safari, que a remove de listas sem marcadores. O contador "+N" é uma imagem com nome traduzido via `t('avatarMore')`.

- **1.1.1** — Cada avatar e o contador têm nome acessível.
- **1.3.1** — Lista semântica rotulada, com a quantidade de itens anunciada.
- **1.4.11** — Borda na cor do fundo separa avatares sobrepostos.
