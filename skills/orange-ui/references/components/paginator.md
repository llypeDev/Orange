# Paginator

Divide listas e tabelas longas em páginas e permite navegar entre elas.

- Categoria: Navegação · Status: estável
- Importação: `import { Paginator } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/paginator (em inglês: https://orange.llypedev.com.br/en/components/paginator)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-paginator--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Paginator

## Boas práticas

- Use paginação quando a pessoa precisa voltar a um ponto específico (tabelas, resultados de busca). Para feeds, prefira "Carregar mais".
- Mostre quantos itens existem ("41–60 de 240") — ajuda a decidir entre paginar ou refinar a busca.
- Coloque a paginação logo abaixo do conteúdo que ela controla, alinhada à direita em tabelas.
- Em espaços estreitos (cards, mobile), use `variant="compact"` ou `siblingCount={0}`. Abaixo de 480px, os botões encolhem para 32px e primeira/última somem.
- Ao trocar de página, leve o foco ou a rolagem ao início da lista, para que a pessoa saiba que o conteúdo mudou.

## Exemplos

### Básico

Com 12 páginas, a primeira e a última ficam sempre visíveis; as demais viram reticências.

```tsx
import { Paginator } from '@orangesys/ui'
import { useState } from 'react'

export default function Basic() {
  const [page, setPage] = useState(6)
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Paginator totalPages={12} page={page} onPageChange={setPage} />
      <small style={{ color: 'var(--or-color-text-subtle)' }}>Exibindo resultados da página {page}</small>
    </div>
  )
}
```

### Com tabela e itens por página

totalItems habilita o texto de intervalo; pageSizeOptions mostra um select nativo (com a lista no visual do Orange onde há select customizável). Ao trocar o tamanho, o primeiro item continua visível.

```tsx
import { Paginator } from '@orangesys/ui'
import { useState } from 'react'

const customers = Array.from({ length: 87 }, (_, i) => ({
  id: 1001 + i,
  name: ['Mercado Bom Preço', 'Padaria Aurora', 'Farmácia Vida', 'Livraria Página 1', 'Pet Shop Amigo'][i % 5],
  city: ['Recife', 'Curitiba', 'Belém', 'Porto Alegre', 'Salvador'][i % 5],
}))

export default function WithTable() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const rows = customers.slice((page - 1) * pageSize, page * pageSize)
  const cell = { padding: '10px 12px', borderBottom: '1px solid var(--or-color-border)', textAlign: 'left' as const }

  return (
    <div style={{ display: 'grid', gap: 16, width: '100%' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <caption className="or-visually-hidden">Clientes</caption>
        <thead>
          <tr>
            <th style={cell}>Código</th>
            <th style={cell}>Cliente</th>
            <th style={cell}>Cidade</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id}>
              <td style={{ ...cell, fontVariantNumeric: 'tabular-nums' }}>{c.id}</td>
              <td style={cell}>{c.name}</td>
              <td style={cell}>{c.city}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Paginator
        aria-label="Paginação de clientes"
        totalItems={customers.length}
        page={page}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        pageSizeOptions={[5, 10, 25]}
        size="sm"
      />
    </div>
  )
}
```

### Compacta

"Página 3 de 12" entre anterior e próximo; o texto é anunciado quando muda.

```tsx
import { Paginator } from '@orangesys/ui'

export default function Compact() {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <Paginator variant="compact" totalPages={12} defaultPage={3} aria-label="Paginação de pedidos" />
      <Paginator variant="compact" totalPages={48} defaultPage={1} showFirstLast size="sm" aria-label="Paginação de notificações" />
    </div>
  )
}
```

### Primeira, última e vizinhas

showFirstLast adiciona atalhos às extremidades; siblingCount controla quantas páginas aparecem ao redor da atual.

```tsx
import { Paginator } from '@orangesys/ui'

export default function FirstLast() {
  return (
    <Paginator
      totalPages={50}
      defaultPage={25}
      siblingCount={2}
      boundaryCount={1}
      showFirstLast
      aria-label="Paginação do catálogo"
    />
  )
}
```

### Páginas como links

Com getPageHref, cada página tem endereço próprio (compartilhável e indexável). renderLink integra com o roteador.

```tsx
import { Paginator } from '@orangesys/ui'
import type { AnchorHTMLAttributes } from 'react'

// Em um app real: import { Link as RouterLink } from 'react-router-dom'
function RouterLink({ to, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  return <a href={`#${to}`} {...props} />
}

export default function Links() {
  return (
    <Paginator
      aria-label="Paginação dos artigos"
      totalPages={8}
      defaultPage={2}
      getPageHref={(page) => `/blog?pagina=${page}`}
      renderLink={({ href, ...props }) => <RouterLink to={href} {...props} />}
    />
  )
}
```

## Movimento

Durações e curvas vêm dos tokens de motion e zeram com prefers-reduced-motion: o estado continua indicado por cor, borda ou texto.

- **Trocar de página** — A barra laranja da página atual cresce do centro (scaleX) e a anterior recua — medium, ease-spring; fundo e borda em medium.
- **Pressionar** — Botões afundam 1px (translateY(1px) scale(0.985)) — press (90ms).
- **Hover / foco em anterior/próximo** — A seta empurra 2px na direção do destino — medium, ease-out.
- **Compacta: nova página** — "Página X de Y" entra com fade + 4px de cima — medium, ease-out.

## Props

### `Paginator`

Paginação: divide resultados longos em páginas e permite navegar entre
elas. Variante `compact` para espaços estreitos e seletor opcional de
itens por página.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `boundaryCount` | `number` | `1` | Páginas sempre mostradas no início e no fim. Padrão: 1. |
| `defaultPage` | `number` | `1` | Página inicial (não controlado). Padrão: 1. |
| `defaultPageSize` | `number` | `20` | Itens por página inicial (não controlado). Padrão: 20. |
| `getPageHref` | `((page: number) => string)` | — | Gera o endereço de cada página — as páginas viram links (bom para SEO e para abrir em nova aba). Sem ela, são botões. |
| `onPageChange` | `((page: number) => void)` | — | Chamado quando a página muda. |
| `onPageSizeChange` | `((pageSize: number) => void)` | — | Chamado quando o usuário escolhe outra quantidade de itens por página. |
| `page` | `number` | — | Página atual, começando em 1 (controlado). |
| `pageSize` | `number` | — | Itens por página (controlado). |
| `pageSizeOptions` | `number[]` | — | Opções do seletor de itens por página. Sem opções, o seletor não aparece. |
| `renderLink` | `RenderLink` | — | Renderiza os links com o componente do seu roteador (requer `getPageHref`). |
| `showFirstLast` | `boolean` | `false` | Mostra os botões de primeira e última página. |
| `siblingCount` | `number` | `1` | Páginas mostradas de cada lado da atual. Padrão: 1. |
| `size` | `"sm" \| "md"` | `md` | Tamanho dos botões: `sm` 32px, `md` 40px. |
| `totalItems` | `number` | — | Total de itens. Habilita o texto "1–20 de 240" e o cálculo de páginas. |
| `totalPages` | `number` | — | Total de páginas. Opcional quando `totalItems` é informado. |
| `variant` | `"default" \| "compact"` | `default` | `default`: lista de páginas. `compact`: "Página 3 de 12" entre anterior/próximo. |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

Um `<nav aria-label="Paginação">` com uma lista de botões (ou links). Cada página tem nome completo — "Página 3" — com o número visível; a atual recebe `aria-current="page"` e a barra laranja. Reticências são decorativas. Quando "Próxima página" fica desabilitado sob o foco, o foco passa para a página atual em vez de se perder.

| Teclas | Ação |
| --- | --- |
| `Tab` | Percorre os controles habilitados. |
| `Enter` | Vai para a página. |
| `Space` | Vai para a página (botões). |
| `↑` + `↓` | No seletor: escolhe a quantidade de itens por página. |

- **1.3.1** — Navegação rotulada com lista de páginas e select com rótulo visível.
- **2.5.3** — O nome acessível ("Página 3") contém o número visível.
- **2.5.8** — Botões de 32 ou 40px.
- **4.1.2** — Página atual com aria-current; anterior/próximo desabilitados nas extremidades.
- **4.1.3** — Intervalo e "Página X de Y" anunciados em região viva.
