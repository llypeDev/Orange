# DescriptionList

Pares termo/descrição em um <dl> para metadados, especificações e resumos — horizontal, vertical ou em grade.

- Categoria: Exibição de dados · Status: estável
- Importação: `import { DescriptionList, DescriptionDetails, DescriptionGroup, DescriptionTerm } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/description-list (em inglês: https://orange.llypedev.com.br/en/components/description-list)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-descriptionlist--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/DescriptionList

## Boas práticas

- Use para pares rótulo/valor somente leitura: detalhes de um pedido, especificações, dados de uma assinatura.
- Termos curtos e substantivos ("Vencimento", não "Data em que a fatura vence"). O valor é o que a pessoa procura — deixe-o em destaque.
- O layout **horizontal** funciona para listas de detalhes; **vertical** para colunas estreitas; **grid** para indicadores lado a lado.
- Para dados comparáveis em várias linhas e colunas, use Table.

## Layouts

- **horizontal** — Termo à esquerda (largura em termWidth) e valor à direita, com linhas de 1px. Empilha em telas estreitas.
- **vertical** — Termo acima do valor.
- **grid** — Células com bordas de 1px em colunas responsivas; valores em Space Grotesk.

## Exemplos

### Horizontal

Um termo pode ter vários valores: passe um array em description.

```tsx
import { DescriptionList } from '@orangesys/ui'

export default function Horizontal() {
  return (
    <DescriptionList
      style={{ width: '100%', maxWidth: 560 }}
      items={[
        { term: 'Pedido', description: '#4821' },
        { term: 'Status', description: 'Em separação' },
        { term: 'Previsão de entrega', description: '6 de novembro de 2026' },
        { term: 'Transportadora', description: 'Entrega Expressa Sul' },
        { term: 'Itens', description: ['2× Cadeira ergonômica', '1× Apoio para os pés'] },
      ]}
    />
  )
}
```

### Vertical

```tsx
import { DescriptionList } from '@orangesys/ui'

export default function Vertical() {
  return (
    <DescriptionList
      layout="vertical"
      style={{ width: '100%', maxWidth: 320 }}
      items={[
        { term: 'Empresa', description: 'Mercado Bom Preço Ltda.' },
        { term: 'Segmento', description: 'Varejo alimentar' },
        { term: 'Fuso horário', description: 'Brasília (GMT−3)' },
        { term: 'Cliente desde', description: 'Agosto de 2023' },
      ]}
    />
  )
}
```

### Grade de indicadores

columns define o máximo de colunas; em contêineres estreitos, as células se reorganizam.

```tsx
import { DescriptionList } from '@orangesys/ui'

export default function Grid() {
  return (
    <DescriptionList
      layout="grid"
      columns={3}
      aria-label="Indicadores do suporte em outubro"
      style={{ width: '100%' }}
      items={[
        { term: 'Chamados abertos', description: '1.284' },
        { term: 'Tempo de 1ª resposta', description: '1h 12min' },
        { term: 'Satisfação', description: '94%' },
        { term: 'Resolvidos no 1º contato', description: '71%' },
        { term: 'Reabertos', description: '3,2%' },
        { term: 'Fila atual', description: '18 chamados' },
      ]}
    />
  )
}
```

### Composição e termos em negrito

Componha com DescriptionGroup, DescriptionTerm e DescriptionDetails quando os valores tiverem marcação própria.

```tsx
import { DescriptionDetails, DescriptionGroup, DescriptionList, DescriptionTerm } from '@orangesys/ui'

export default function Composed() {
  return (
    <DescriptionList termVariant="strong" termWidth="10rem" divided={false} size="sm" style={{ width: '100%', maxWidth: 520 }}>
      <DescriptionGroup>
        <DescriptionTerm>Instância</DescriptionTerm>
        <DescriptionDetails>
          <code>api-producao-01</code>
        </DescriptionDetails>
      </DescriptionGroup>
      <DescriptionGroup>
        <DescriptionTerm>Região</DescriptionTerm>
        <DescriptionDetails>São Paulo (sa-east-1)</DescriptionDetails>
      </DescriptionGroup>
      <DescriptionGroup>
        <DescriptionTerm>Recursos</DescriptionTerm>
        <DescriptionDetails>4 vCPUs</DescriptionDetails>
        <DescriptionDetails>16 GB de memória</DescriptionDetails>
      </DescriptionGroup>
      <DescriptionGroup>
        <DescriptionTerm>Último deploy</DescriptionTerm>
        <DescriptionDetails>3 de novembro, 14:05</DescriptionDetails>
      </DescriptionGroup>
    </DescriptionList>
  )
}
```

## Props

### `DescriptionList`

Lista de pares termo/descrição (`<dl>`) para metadados, especificações e
resumos — "Plano: Pro", "Vencimento: 12/03".

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `columns` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `3` | Colunas do layout `grid` em telas largas. Padrão: `3`. |
| `divided` | `boolean` | `true` | Linhas de 1px entre os pares (layouts `horizontal` e `vertical`). Padrão: `true`. |
| `items` | `DescriptionListItem[]` | — | Pares termo/descrição. Alternativa a compor com `DescriptionGroup`/`DescriptionTerm`/`DescriptionDetails`. |
| `layout` | `"grid" \| "horizontal" \| "vertical"` | `horizontal` | `horizontal` (termo à esquerda, padrão), `vertical` (termo acima) ou `grid` (células com bordas de 1px — exige `items` ou `DescriptionGroup`). |
| `size` | `"sm" \| "md"` | `md` | Tamanho do texto. Padrão: `md`. |
| `termVariant` | `"strong" \| "eyebrow"` | `eyebrow` | Estilo dos termos: `eyebrow` (caixa alta, padrão) ou `strong` (negrito). |
| `termWidth` | `string` | — | Largura da coluna de termos no layout `horizontal` (valor CSS). Padrão: `12rem`. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### `DescriptionDetails`

Descrição de um termo (`<dd>`).

Sem props próprias.

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### `DescriptionGroup`

Agrupa um termo e suas descrições (`<div>` dentro do `<dl>`). Necessário no layout `grid`.

Sem props próprias.

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### `DescriptionTerm`

Termo de uma `DescriptionList` (`<dt>`).

Sem props próprias.

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`DescriptionListItem`:

```ts
export interface DescriptionListItem {
  /** Termo (rótulo) — vira um `<dt>`. */
  term: ReactNode
  /** Descrição (valor) — vira um `<dd>`. Use um array para vários valores do mesmo termo. */
  description: ReactNode | ReactNode[]
  /** Chave estável (padrão: índice). */
  key?: Key
}
```

`DescriptionListLayout`:

```ts
export type DescriptionListLayout = 'horizontal' | 'vertical' | 'grid'
```

`DescriptionTermVariant`:

```ts
export type DescriptionTermVariant = 'eyebrow' | 'strong'
```

## Acessibilidade

Usa a lista de descrição nativa: `<dl>` com `<dt>` (termo) e `<dd>` (descrição), agrupados em `<div>` — estrutura válida em HTML. Leitores de tela anunciam a relação entre termo e valor. Use `aria-label` quando houver várias listas na mesma página.

- **1.3.1** — Relação termo/valor exposta pela semântica de <dl>, não só pelo layout.
- **1.4.10** — O layout horizontal empilha e a grade se reorganiza em telas estreitas, sem rolagem horizontal.
- **1.4.3** — Termos e valores usam tokens de texto com contraste de 4.5:1.
