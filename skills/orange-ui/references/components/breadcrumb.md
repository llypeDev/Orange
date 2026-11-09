# Breadcrumb

Trilha de navegação que mostra onde a página está na hierarquia e leva de volta a níveis anteriores.

- Categoria: Navegação · Status: estável
- Importação: `import { Breadcrumb, BreadcrumbItem } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/breadcrumb (em inglês: https://orange.llypedev.com.br/en/components/breadcrumb)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-breadcrumb--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Breadcrumb

## Boas práticas

- Use em hierarquias com três ou mais níveis. Em sites rasos, a trilha só repete o menu.
- A trilha mostra a hierarquia, não o histórico: "Voltar" é papel do navegador.
- Posicione-a acima do título da página e use os mesmos nomes do menu e dos títulos.
- Em caminhos longos, use `maxItems`: os níveis do meio viram um botão "…" que os revela.

- Faça: Nomes reais dos níveis, terminando na página atual.
- Evite: Rótulos genéricos ou ações no lugar de níveis.

## Exemplos

### Básico

O último nível é a página atual: recebe aria-current="page" e não é link.

```tsx
import { Breadcrumb } from '@orangesys/ui'

export default function Basic() {
  return (
    <Breadcrumb
      items={[
        { label: 'Início', href: '#inicio' },
        { label: 'Central de ajuda', href: '#ajuda' },
        { label: 'Pedidos', href: '#pedidos' },
        { label: 'Trocas e devoluções' },
      ]}
    />
  )
}
```

### Caminho longo recolhido

Com maxItems={4}, os níveis do meio ficam atrás do botão "…". Ao expandir, o foco vai para o primeiro nível revelado.

```tsx
import { Breadcrumb, Icon } from '@orangesys/ui'

const path = [
  { label: 'Início', href: '#inicio', icon: <Icon name="home" /> },
  { label: 'Loja', href: '#loja' },
  { label: 'Eletrônicos', href: '#eletronicos' },
  { label: 'Notebooks', href: '#notebooks' },
  { label: 'Ultrafinos', href: '#ultrafinos' },
  { label: 'Orange Book Air 14" — 16 GB' },
]

export default function Collapsed() {
  return (
    <Breadcrumb
      aria-label="Trilha do produto"
      items={path}
      maxItems={4}
      itemsBeforeCollapse={1}
      itemsAfterCollapse={2}
    />
  )
}
```

### Separadores e ícones

Qualquer nó serve de separador; ele é sempre decorativo (aria-hidden).

```tsx
import { Breadcrumb, BreadcrumbItem, Icon } from '@orangesys/ui'

export default function Separator() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Breadcrumb separator={<Icon name="chevron-right" />} aria-label="Trilha do projeto">
        <BreadcrumbItem href="#workspace" icon={<Icon name="layers" />}>
          Orange Labs
        </BreadcrumbItem>
        <BreadcrumbItem href="#projetos">Projetos</BreadcrumbItem>
        <BreadcrumbItem href="#checkout">Checkout 2.0</BreadcrumbItem>
        <BreadcrumbItem>Configurações</BreadcrumbItem>
      </Breadcrumb>
      <Breadcrumb separator="→" aria-label="Trilha do arquivo">
        <BreadcrumbItem href="#drive" icon={<Icon name="folder" />}>
          Meu drive
        </BreadcrumbItem>
        <BreadcrumbItem href="#financeiro">Financeiro</BreadcrumbItem>
        <BreadcrumbItem>Notas fiscais 2026</BreadcrumbItem>
      </Breadcrumb>
    </div>
  )
}
```

### Com roteador

renderLink recebe href, className, aria-current e children — repasse ao link do seu roteador.

```tsx
import { Breadcrumb } from '@orangesys/ui'
import type { AnchorHTMLAttributes } from 'react'

// Em um app real:
// import { Link as RouterLink } from 'react-router-dom'
function RouterLink({ to, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  return <a href={`#${to}`} {...props} />
}

export default function WithRouter() {
  return (
    <Breadcrumb
      aria-label="Trilha do cliente"
      items={[
        { label: 'Clientes', href: '/clientes' },
        { label: 'Mercado Bom Preço', href: '/clientes/482' },
        { label: 'Contratos' },
      ]}
      renderLink={({ href, ...props }) => <RouterLink to={href} {...props} />}
    />
  )
}
```

## Movimento

Durações e curvas vêm dos tokens de motion e zeram com prefers-reduced-motion: o estado continua indicado por cor, borda ou texto.

- **Hover / foco em um nível** — Sublinhado laranja cresce da esquerda (background-size) — medium, ease-out; cor em fast.
- **Expandir "…"** — Os níveis revelados entram com fade + 4px da esquerda, em cascata (40ms entre eles) — medium, ease-out.
- **Pressionar "…"** — O botão afunda 1px (translateY + scale) — press (90ms).

## Props

### `Breadcrumb`

Trilha de navegação: mostra onde a página está na hierarquia do site e
permite voltar a níveis anteriores.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | Elementos `BreadcrumbItem`. |
| `items` | `BreadcrumbEntry[]` | — | Níveis da trilha, do mais geral à página atual. Alternativa a `children`. |
| `itemsAfterCollapse` | `number` | `2` | Níveis mantidos depois do "…" ao recolher. Padrão: 2. |
| `itemsBeforeCollapse` | `number` | `1` | Níveis mantidos antes do "…" ao recolher. Padrão: 1. |
| `maxItems` | `number` | — | Número máximo de níveis visíveis. Acima disso, os níveis do meio são recolhidos em um botão "…" que os expande. |
| `renderLink` | `RenderLink` | — | Renderiza os links com o componente do seu roteador: `renderLink={({ href, ...p }) => <RouterLink to={href} {...p} />}`. |
| `separator` | `ReactNode` | `/` | Separador decorativo entre níveis. Padrão: `/`. |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

### `BreadcrumbItem`

Um nível da trilha. Use dentro de `Breadcrumb`.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `current` | `boolean` | — | Força o estado de página atual. Padrão: o último item. |
| `href` | `string` | — | Destino do nível. Sem `href`, o item é renderizado como texto. |
| `icon` | `ReactNode` | — | Ícone decorativo antes do rótulo. |

Repassa também os atributos nativos (`ButtonHTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

Segue o padrão **Breadcrumb** do WAI-ARIA APG: `<nav aria-label="Trilha de navegação">` com uma `<ol>` (leitores de tela anunciam "lista, 4 itens"), separadores com `aria-hidden` e o nível atual com `aria-current="page"`. O botão "…" tem nome acessível "Mostrar caminho completo".

| Teclas | Ação |
| --- | --- |
| `Tab` | Percorre os links da trilha e o botão "…". |
| `Enter` | Segue o link ou expande os níveis recolhidos. |

- **1.3.1** — Hierarquia exposta como lista ordenada dentro de uma navegação rotulada.
- **2.4.8** — Indica a localização da página dentro do site.
- **2.5.8** — Links e botão com altura mínima de 24px.
- **4.1.2** — Página atual exposta com aria-current="page".
