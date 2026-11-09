# SortableList

Lista que o usuário reordena arrastando, pelo teclado ou com botões de mover — prioridades, categorias de um cardápio, etapas de um processo.

- Categoria: Exibição de dados · Status: estável
- Importação: `import { SortableList } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/sortable-list (em inglês: https://orange.llypedev.com.br/en/components/sortable-list)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-sortablelist--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/SortableList

## Boas práticas

- Use quando a ordem é decisão do usuário e tem efeito: prioridades da sprint, ordem das categorias no cardápio, etapas de um processo. Para ordenar por um critério (data, preço), use a ordenação da Table.
- Arrastar nunca é o único caminho: mantenha `moveControls` em `buttons` (padrão) ou `menu`. Use `menu` em listas longas ou telas estreitas — ele também oferece "para o topo" e "para o fim".
- Dê um nome curto a cada item com `getItemLabel`: ele aparece na alça ("Reordenar Pizzas, posição 3 de 8") e em todos os anúncios.
- Desabilite os itens que não podem sair do lugar (uma etapa automática, uma categoria fixa). Os demais passam por eles sem tirá-los da posição.

- Faça: Salve a nova ordem em onReorder — o usuário espera que ela persista.
- Faça: Mostre a posição no conteúdo quando ela importa (01, 02…) usando o index de renderItem.
- Evite: Usar moveControls="none" sem oferecer outra forma de mover com um clique.
- Evite: Colocar links ou campos editáveis dentro da alça; ela é só para mover.

## Anatomia

- **Alça** — Botão com o ícone grip. Inicia o arraste (ponteiro) e o modo de mover (teclado). Em itens desabilitados, mostra um cadeado.
- **Conteúdo** — O que renderItem devolve. Recebe index, total, isDragging e disabled.
- **Controles de mover** — Botões "Mover para cima/baixo" ou um menu com topo, cima, baixo e fim — a alternativa de clique único.
- **Lugar de destino** — Contorno tracejado laranja que mostra onde o item vai cair durante o arraste com ponteiro.
- **Região de anúncios** — role="status" invisível que narra levantar, mover, soltar e cancelar.

## Exemplos

### Priorizar tarefas da sprint

Lista controlada: items + onReorder. Arraste pela alça, use as setas no teclado ou os botões de mover. A numeração vem do index de renderItem e acompanha o arraste.

```tsx
import { SortableList, Stack } from '@orangesys/ui'
import { useState } from 'react'

interface Task {
  id: string
  title: string
  points: number
}

const backlog: Task[] = [
  { id: 'checkout', title: 'Revisar fluxo de checkout', points: 5 },
  { id: 'busca', title: 'Corrigir filtro de busca por categoria', points: 3 },
  { id: 'cupom', title: 'Aplicar cupom no carrinho', points: 8 },
  { id: 'deps', title: 'Atualizar dependências do app', points: 2 },
  { id: 'api', title: 'Documentar API de pedidos', points: 3 },
]

export default function SprintPriorities() {
  const [tasks, setTasks] = useState(backlog)

  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <SortableList
        label="Prioridades da sprint"
        items={tasks}
        onReorder={setTasks}
        renderItem={(task, { index }) => (
          <Stack gap={3} direction="horizontal" align="baseline">
            <span
              style={{
                minWidth: '2ch',
                fontFamily: 'var(--or-font-display)',
                fontWeight: 600,
                fontVariantNumeric: 'tabular-nums',
                color: 'var(--or-color-accent-text)',
              }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>{task.title}</span>
            <span style={{ color: 'var(--or-color-text-muted)', whiteSpace: 'nowrap' }}>{task.points} pts</span>
          </Stack>
        )}
      />
    </div>
  )
}
```

### Categorias do cardápio (menu e rolagem)

moveControls="menu" agrupa topo, cima, baixo e fim em um botão. "Destaques da semana" está desabilitada e fica fixa. Com altura máxima, a lista rola sozinha quando o item arrastado chega perto da borda.

```tsx
import { SortableList } from '@orangesys/ui'
import { useState } from 'react'

interface Category {
  id: string
  name: string
  products: number
  disabled?: boolean
}

const initial: Category[] = [
  { id: 'destaques', name: 'Destaques da semana', products: 6, disabled: true },
  { id: 'lanches', name: 'Lanches', products: 14 },
  { id: 'pizzas', name: 'Pizzas', products: 18 },
  { id: 'pratos', name: 'Pratos executivos', products: 9 },
  { id: 'saladas', name: 'Saladas', products: 7 },
  { id: 'combos', name: 'Combos', products: 5 },
  { id: 'bebidas', name: 'Bebidas', products: 22 },
  { id: 'sobremesas', name: 'Sobremesas', products: 11 },
]

export default function MenuCategories() {
  const [categories, setCategories] = useState(initial)

  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <SortableList
        label="Ordem das categorias no cardápio"
        items={categories}
        onReorder={setCategories}
        getItemLabel={(category) => category.name}
        moveControls="menu"
        style={{ maxHeight: 320, overflowY: 'auto', paddingBlock: 'var(--or-space-2)' }}
        renderItem={(category, { disabled }) => (
          <div style={{ display: 'grid', gap: 2 }}>
            <span style={{ fontWeight: 500 }}>{category.name}</span>
            <span style={{ fontSize: 'var(--or-text-xs)', color: 'var(--or-color-text-muted)' }}>
              {disabled ? 'Fixa no topo do cardápio' : `${category.products} produtos`}
            </span>
          </div>
        )}
      />
    </div>
  )
}
```

### Etapas de um processo

Não controlada (defaultItems). onReorder recebe { item, from, to } — útil para registrar a mudança. A primeira e a última etapa são automáticas e não se movem.

```tsx
import { SortableList, Stack } from '@orangesys/ui'
import { useState } from 'react'

interface Step {
  id: string
  name: string
  owner: string
  disabled?: boolean
}

const steps: Step[] = [
  { id: 'recebido', name: 'Pedido recebido', owner: 'Automático', disabled: true },
  { id: 'pagamento', name: 'Conferência do pagamento', owner: 'Financeiro' },
  { id: 'separacao', name: 'Separação no estoque', owner: 'Logística' },
  { id: 'embalagem', name: 'Embalagem', owner: 'Logística' },
  { id: 'nota', name: 'Emissão da nota fiscal', owner: 'Financeiro' },
  { id: 'expedicao', name: 'Expedição', owner: 'Automático', disabled: true },
]

export default function ProcessSteps() {
  const [lastChange, setLastChange] = useState('Nenhuma alteração ainda.')

  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 520 }}>
      <SortableList
        label="Etapas do processo de pedido"
        defaultItems={steps}
        getItemLabel={(step) => step.name}
        onReorder={(_, { item, from, to }) =>
          setLastChange(`${item.name}: etapa ${from + 1} → etapa ${to + 1}`)
        }
        renderItem={(step, { index }) => (
          <Stack gap={3} direction="horizontal" align="baseline" justify="between">
            <span>
              <span style={{ color: 'var(--or-color-text-muted)' }}>Etapa {index + 1} · </span>
              {step.name}
            </span>
            <span style={{ fontSize: 'var(--or-text-xs)', color: 'var(--or-color-text-muted)', whiteSpace: 'nowrap' }}>
              {step.owner}
            </span>
          </Stack>
        )}
      />
      <p style={{ margin: 0, fontSize: 'var(--or-text-sm)', color: 'var(--or-color-text-muted)' }}>
        Última alteração: {lastChange}
      </p>
    </Stack>
  )
}
```

### Horizontal

orientation="horizontal" troca as setas do teclado para ← e → e os controles para esquerda/direita. Envolva a lista em um contêiner com rolagem horizontal em telas estreitas.

```tsx
import { SortableList } from '@orangesys/ui'
import { useState } from 'react'

export default function Horizontal() {
  const [tabs, setTabs] = useState(['Visão geral', 'Pedidos', 'Estoque', 'Relatórios'])

  return (
    <div style={{ width: '100%', overflowX: 'auto', paddingBlock: 8 }}>
      <SortableList
        label="Ordem das abas do painel"
        orientation="horizontal"
        moveControls="menu"
        items={tabs}
        onReorder={setTabs}
        renderItem={(tab) => <span style={{ whiteSpace: 'nowrap', fontWeight: 500 }}>{tab}</span>}
      />
    </div>
  )
}
```

## Movimento

- **Levantar** — O "lift" do zop: o item sobe 4px (--or-distance-lift), ganha a sombra sólida 0 8px 0 -4px, borda laranja e uma barra de acento de 4px que desce pela borda esquerda (scaleY 0 → 1). --or-duration-medium, --or-ease-out.
- **Vizinhos abrem espaço** — Enquanto o item passa, os vizinhos deslizam com transform (--or-duration-medium, --or-ease-out). Nos botões e no menu, a troca usa FLIP: os itens partem da posição antiga e deslizam até a nova.
- **Arrastar com ponteiro** — O item segue o ponteiro sem atraso, só no eixo da lista. O lugar de destino (tracejado laranja) desliza até a posição prevista. Só começa depois de 5px de movimento: um clique simples não arrasta.
- **Soltar** — O item assenta no lugar com --or-ease-spring (uma mola curta) e a sombra se desfaz em --or-duration-fast.
- **Cancelar** — Esc devolve o item e os vizinhos à ordem original com o mesmo deslize.
- **Movimento reduzido** — Com prefers-reduced-motion, tudo é instantâneo: sem FLIP, sem mola e sem deslocamento de 4px. A sombra, a borda e a barra laranja continuam indicando o item levantado.

Só `transform` e `box-shadow` são animados — nada de `top` ou `height`.

## Props

### `SortableList`

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `renderItem` (obrigatória) | `(item: T, state: SortableItemState) => ReactNode` | — | Renderiza o conteúdo do item. A alça e os controles de mover são do componente. |
| `announcements` | `SortableAnnouncements` | — | Substitui os textos anunciados ao levantar, mover, soltar e cancelar. |
| `defaultItems` | `readonly T[]` | — | Itens iniciais (não controlado). |
| `disabled` | `boolean` | `false` | Desabilita a reordenação de todos os itens. |
| `getItemLabel` | `((item: T) => string)` | — | Nome do item usado na alça ("Reordenar …") e nos anúncios. Padrão: `item.label`, `item.title` ou `item.name` (ou o próprio item, se for texto). |
| `getKey` | `((item: T, index: number) => SortableKey)` | — | Chave estável de cada item. Padrão: `item.id` (ou o próprio item, se for texto/número). |
| `isItemDisabled` | `((item: T) => boolean)` | — | Itens que não podem ser movidos. Padrão: `item.disabled === true`. |
| `items` | `readonly T[]` | — | Itens na ordem atual (controlado). Use com `onReorder`. |
| `label` | `string` | — | Nome acessível da lista (`aria-label`). |
| `moveControls` | `"none" \| "menu" \| "buttons"` | `buttons` | Alternativa ao arraste com um único clique (WCAG 2.5.7): botões "Mover para cima/baixo" (`buttons`, padrão), um menu com topo/cima/baixo/fim (`menu`) ou nenhuma (`none` — só quando a página oferece outra alternativa). |
| `onReorder` | `((items: T[], details: SortableReorderDetails<T>) => void)` | — | Chamado quando o usuário conclui uma reordenação (soltar, botão ou menu) com a nova lista e `{ from, to, item }`. Não é chamado ao cancelar. |
| `orientation` | `"horizontal" \| "vertical"` | `vertical` | Direção da lista. Define também as setas do teclado. Padrão: `vertical`. |
| `ref` | `Ref<HTMLUListElement>` | — | — |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`SortableAnnouncementContext`:

```ts
export interface SortableAnnouncementContext {
  /** Nome do item (de `getItemLabel`). */
  label: string
  /** Posição atual (base 1). */
  position: number
  /** Total de itens. */
  total: number
  /** Posição (base 1) antes do movimento começar. */
  initialPosition: number
}
```

`SortableAnnouncements`:

```ts
/** Textos anunciados no leitor de tela. Cada função substitui o texto padrão. */
export interface SortableAnnouncements {
  lifted?: (context: SortableAnnouncementContext) => string
  moved?: (context: SortableAnnouncementContext) => string
  dropped?: (context: SortableAnnouncementContext) => string
  cancelled?: (context: SortableAnnouncementContext) => string
}
```

`SortableItemState`:

```ts
export interface SortableItemState {
  /** Posição atual (base 0). Durante o arraste, é a posição prevista. */
  index: number
  /** Total de itens. */
  total: number
  /** O item está sendo movido (por ponteiro ou teclado). */
  isDragging: boolean
  /** O item não pode ser movido (`disabled` da lista ou do item). */
  disabled: boolean
}
```

`SortableKey`:

```ts
export type SortableKey = string | number
```

`SortableListOrientation`:

```ts
export type SortableListOrientation = 'vertical' | 'horizontal'
```

`SortableMoveControls`:

```ts
export type SortableMoveControls = 'buttons' | 'menu' | 'none'
```

`SortableReorderDetails`:

```ts
export interface SortableReorderDetails<T> {
  /** Posição original do item (base 0). */
  from: number
  /** Nova posição do item (base 0). */
  to: number
  /** O item movido. */
  item: T
}
```

## Acessibilidade

Renderiza um `<ul role="list">` com o nome de `label`. Cada item tem uma alça — um `<button>` com nome "Reordenar Pizzas, posição 3 de 8" e as instruções de teclado como descrição. Levantar, mover, soltar e cancelar são narrados em uma região `aria-live="polite"`, e o foco fica na alça do item movido depois de cada passo.

| Teclas | Ação |
| --- | --- |
| `Tab` | Foca a alça e depois os controles de mover de cada item. |
| `Space` | Na alça: levanta o item; com o item levantado, solta. |
| `Enter` | Igual ao Espaço. |
| `↑` + `↓` | Item levantado (vertical): move uma posição. Itens desabilitados são pulados. |
| `←` + `→` | Item levantado (horizontal): move uma posição. |
| `Home` | Item levantado: vai para a primeira posição livre. |
| `End` | Item levantado: vai para a última posição livre. |
| `Esc` | Cancela e devolve o item à posição original (também durante o arraste com ponteiro). |

> **Sair da alça solta o item** Se o usuário pressionar Tab ou clicar fora com um item levantado, o item é solto onde está e o foco vai para onde o usuário o levou.

- **1.3.1** — Lista semântica com papel explícito; o nome de cada alça inclui a posição.
- **2.1.1** — Reordenação completa pelo teclado na alça, sem depender de arrastar.
- **2.4.3** — O foco acompanha o item movido em cada passo (teclado, botões e menu).
- **2.4.7** — Foco visível com contorno laranja de 2px na alça e nos controles.
- **2.5.7** — Alternativa de clique único ao arraste: botões ou menu de mover (padrão: botões).
- **2.5.8** — Alça e controles com 32×32px.
- **4.1.3** — Mudanças de posição anunciadas em uma região de status educada, sem mover o foco.
