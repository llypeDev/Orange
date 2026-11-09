# TreeView

Árvore hierárquica navegável por teclado, com seleção única ou múltipla — arquivos, categorias, estrutura de páginas.

- Categoria: Exibição de dados · Status: estável
- Importação: `import { TreeView } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/tree-view (em inglês: https://orange.llypedev.com.br/en/components/tree-view)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-treeview--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/TreeView

## Boas práticas

- Use para hierarquias que a pessoa explora: pastas e arquivos, categorias de produtos, estrutura de um site.
- Para navegação principal entre páginas, prefira um menu lateral com links. A árvore tem um modelo de teclado próprio (setas), que não é o esperado para links.
- Dê um nome à árvore com **aria-label** ou **aria-labelledby**. Use rótulos curtos e únicos entre irmãos — a busca por digitação depende deles.
- Evite mais de 4 ou 5 níveis. Hierarquias muito profundas são difíceis de percorrer, principalmente por teclado.

## Exemplos

### Explorador de arquivos

Seleção única. Clicar numa pasta a expande; onAction dispara com Enter ou clique — aqui, "abre" o arquivo.

```tsx
import { TreeView, type TreeViewItem } from '@orangesys/ui'
import { useState } from 'react'

const arquivos: TreeViewItem[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'button', label: 'Button.tsx' },
          { id: 'card', label: 'Card.tsx' },
          { id: 'modal', label: 'Modal.tsx' },
        ],
      },
      { id: 'hooks', label: 'hooks', children: [{ id: 'use-media', label: 'useMediaQuery.ts' }] },
      { id: 'index', label: 'index.ts' },
    ],
  },
  { id: 'docs', label: 'docs', children: [{ id: 'inicio', label: 'Guia de início.md' }] },
  { id: 'package', label: 'package.json' },
  { id: 'readme', label: 'README.md' },
]

export default function FileExplorer() {
  const [aberto, setAberto] = useState('Card.tsx')

  return (
    // Árvore (220–280px) e painel lado a lado; sem espaço para os dois, o painel desce.
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 24, width: '100%' }}>
      <TreeView
        style={{ flex: '1 1 220px', maxWidth: 280 }}
        aria-label="Arquivos do projeto"
        items={arquivos}
        defaultExpanded={['src', 'components']}
        defaultSelected={['card']}
        onAction={(item) => {
          if (!item.children) setAberto(String(item.label))
        }}
      />
      <p style={{ flex: '1 1 200px', margin: 0, color: 'var(--or-color-text-muted)' }}>
        Arquivo aberto: <strong style={{ color: 'var(--or-color-text)' }}>{aberto}</strong>
      </p>
    </div>
  )
}
```

### Seleção múltipla

Espaço alterna o item focado, Shift + ↑/↓ estende a seleção e Ctrl + A seleciona tudo. Itens desabilitados recebem foco, mas não seleção.

```tsx
import { TreeView, type TreeViewItem } from '@orangesys/ui'
import { useState } from 'react'

const pastas: TreeViewItem[] = [
  {
    id: 'financeiro',
    label: 'Financeiro',
    children: [
      { id: 'notas', label: 'Notas fiscais' },
      { id: 'contratos', label: 'Contratos' },
      { id: 'relatorios', label: 'Relatórios mensais' },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    children: [
      { id: 'campanhas', label: 'Campanhas 2026' },
      { id: 'marca', label: 'Manual da marca' },
    ],
  },
  { id: 'rh', label: 'Pessoas', children: [{ id: 'politicas', label: 'Políticas internas' }] },
  { id: 'arquivo-morto', label: 'Arquivo morto', disabled: true },
]

export default function MultipleSelection() {
  const [selecionadas, setSelecionadas] = useState<string[]>(['notas', 'campanhas'])

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 320 }}>
      <p id="sync-label" style={{ margin: 0, fontWeight: 600 }}>
        Pastas sincronizadas no computador
      </p>
      <TreeView
        aria-labelledby="sync-label"
        items={pastas}
        selectionMode="multiple"
        selected={selecionadas}
        onSelectedChange={setSelecionadas}
        defaultExpanded={['financeiro', 'marketing']}
        expandOnClick={false}
      />
      <p style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-muted)' }}>
        {selecionadas.length} {selecionadas.length === 1 ? 'pasta selecionada' : 'pastas selecionadas'}
      </p>
    </div>
  )
}
```

### Expansão controlada

expanded + onExpandedChange permitem ações externas como "Expandir tudo". selectionMode="none" deixa a árvore só para navegação.

```tsx
import { Button, TreeView, type TreeViewItem } from '@orangesys/ui'
import { useState } from 'react'

const paginas: TreeViewItem[] = [
  {
    id: 'inicio',
    label: 'Início',
    children: [
      { id: 'sobre', label: 'Sobre nós', children: [{ id: 'equipe', label: 'Equipe' }, { id: 'carreiras', label: 'Carreiras' }] },
      { id: 'produtos', label: 'Produtos', children: [{ id: 'pro', label: 'Plano Pro' }, { id: 'empresa', label: 'Plano Empresa' }] },
      { id: 'blog', label: 'Blog' },
    ],
  },
  { id: 'ajuda', label: 'Central de ajuda', children: [{ id: 'faq', label: 'Perguntas frequentes' }] },
]

const pastas = ['inicio', 'sobre', 'produtos', 'ajuda']

export default function Controlled() {
  const [expandidos, setExpandidos] = useState<string[]>(['inicio'])

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 320 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button size="sm" variant="outline" onClick={() => setExpandidos(pastas)}>
          Expandir tudo
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setExpandidos([])}>
          Recolher tudo
        </Button>
      </div>
      <TreeView
        aria-label="Mapa do site"
        items={paginas}
        expanded={expandidos}
        onExpandedChange={setExpandidos}
        selectionMode="none"
        defaultIcons={false}
      />
    </div>
  )
}
```

### Ícones próprios e tamanho compacto

```tsx
import { Icon, TreeView, type TreeViewItem } from '@orangesys/ui'

const categorias: TreeViewItem[] = [
  {
    id: 'eletronicos',
    label: 'Eletrônicos',
    icon: <Icon name="zap" size="sm" />,
    children: [
      { id: 'notebooks', label: 'Notebooks', icon: <Icon name="layout" size="sm" /> },
      { id: 'monitores', label: 'Monitores', icon: <Icon name="image" size="sm" /> },
      { id: 'teclados', label: 'Teclados', icon: <Icon name="keyboard" size="sm" /> },
    ],
  },
  {
    id: 'escritorio',
    label: 'Escritório',
    icon: <Icon name="inbox" size="sm" />,
    children: [{ id: 'cadeiras', label: 'Cadeiras', icon: <Icon name="user" size="sm" /> }],
  },
  { id: 'livros', label: 'Livros', icon: <Icon name="book" size="sm" /> },
]

export default function CustomIcons() {
  return (
    <div style={{ width: '100%', maxWidth: 280 }}>
      <TreeView
        aria-label="Categorias"
        items={categorias}
        size="sm"
        defaultExpanded={['eletronicos']}
        defaultSelected={['teclados']}
      />
    </div>
  )
}
```

## Props

### `TreeView`

Árvore hierárquica navegável por teclado (padrão "tree view" do WAI-ARIA):
explorador de arquivos, categorias, estrutura de páginas.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `items` (obrigatória) | `TreeViewItem[]` | — | Itens da árvore, aninhados via `children`. |
| `defaultExpanded` | `string[]` | `[]` | Ids expandidos inicialmente (não controlado). |
| `defaultIcons` | `boolean` | `true` | Usa ícones de pasta/arquivo quando o item não define `icon`. Padrão: `true`. |
| `defaultSelected` | `string[]` | `[]` | Ids selecionados inicialmente (não controlado). |
| `expanded` | `string[]` | — | Ids dos itens expandidos (controlado). |
| `expandOnClick` | `boolean` | `true` | Clicar na linha de uma pasta também a expande/recolhe. Padrão: `true`. |
| `onAction` | `((item: TreeViewItem) => void)` | — | Ação padrão do item, disparada por Enter ou clique (ex.: abrir o arquivo). |
| `onExpandedChange` | `((expanded: string[]) => void)` | — | Chamado quando itens são expandidos ou recolhidos. |
| `onSelectedChange` | `((selected: string[]) => void)` | — | Chamado quando a seleção muda. |
| `selected` | `string[]` | — | Ids selecionados (controlado). |
| `selectionMode` | `"single" \| "multiple" \| "none"` | `single` | `single` (padrão), `multiple` ou `none` (só navegação). |
| `size` | `"sm" \| "md"` | `md` | Altura das linhas: `sm` (28px) ou `md` (32px, padrão). |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`TreeViewItem`:

```ts
export interface TreeViewItem {
  /** Identificador único em toda a árvore. */
  id: string
  /** Rótulo exibido. */
  label: ReactNode
  /** Texto usado na busca por digitação quando `label` não é uma string. */
  textValue?: string
  /** Ícone do item. Sem ele, pastas e arquivos usam ícones padrão (veja `defaultIcons`). */
  icon?: ReactNode
  /** Itens filhos. Um item com `children` (mesmo vazio) é tratado como pasta. */
  children?: TreeViewItem[]
  /** Item focável, mas que não pode ser selecionado nem expandido. */
  disabled?: boolean
}
```

`TreeViewSelectionMode`:

```ts
export type TreeViewSelectionMode = 'single' | 'multiple' | 'none'
```

## Movimento

- **Expandir** — Os filhos abrem com altura (grade 0fr → 1fr) e opacidade — 400ms, ease-out. Pastas já abertas na montagem não animam.
- **Recolher** — Saída mais curta: 250ms, ease-in-out. Durante a saída o grupo fica inert (fora do foco e dos leitores de tela).
- **Chevron** — Gira 90° — 250ms, ease-spring.
- **Hover e foco** — Mesma resposta: fundo da linha — 160ms, ease-out. O contorno de foco aparece na hora.
- **Seleção** — Fundo e faixa laranja transicionam em 160ms; na seleção múltipla, o check entra com "pop" — 250ms, ease-bounce.
- **Movimento reduzido** — Expandir e recolher são instantâneos.

## Acessibilidade

Segue o padrão *Tree View* do WAI-ARIA: `role="tree"`, itens `treeitem` com `aria-level`, `aria-setsize`, `aria-posinset`, `aria-expanded` (pastas) e `aria-selected`, filhos em `role="group"`. Só um item fica na ordem de tabulação (roving tabindex); ao voltar à árvore, o foco retorna ao último item visitado ou ao selecionado. Na seleção múltipla, a árvore recebe `aria-multiselectable`.

| Teclas | Ação |
| --- | --- |
| `↓` | Próximo item visível. |
| `↑` | Item visível anterior. |
| `→` | Pasta fechada: expande. Pasta aberta: vai ao primeiro filho. |
| `←` | Pasta aberta: recolhe. Demais: volta ao item pai. |
| `Home` | Primeiro item. |
| `End` | Último item visível. |
| `Enter` | Seleciona o item e dispara onAction (em selectionMode="none", alterna a pasta). |
| `Space` | Seleciona (única) ou alterna a seleção (múltipla). |
| `*` | Expande todas as pastas irmãs do item focado. |
| `Shift` + `↑ / ↓` | Seleção múltipla: move o foco e adiciona o item à seleção. |
| `Ctrl` + `A` | Seleção múltipla: seleciona tudo (ou limpa, se tudo já estiver selecionado). |
| `a–z` | Busca por digitação: foca o próximo item que começa com o texto digitado. |

- **1.3.1** — Hierarquia, posição e estado expostos com papéis e atributos ARIA.
- **1.4.1** — Seleção indicada por fundo, faixa lateral e caixa de marcação (múltipla), não só por cor.
- **2.1.1** — Todas as ações disponíveis pelo teclado, conforme o padrão APG.
- **2.4.7** — Foco visível desenhado na linha do item.
- **4.1.2** — Cada item tem nome próprio (sem incluir o texto dos filhos) e estados atualizados.
