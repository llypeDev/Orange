# BarList

Ranking em barras horizontais: uma lista com rótulo, valor e barra proporcional ao maior valor — páginas mais visitadas, produtos mais vendidos.

- Categoria: Exibição de dados · Status: novo
- Importação: `import { BarList } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/bar-list (em inglês: https://orange.llypedev.com.br/en/components/bar-list)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-barlist--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/BarList

## Boas práticas

- Use para rankings de uma medida só — páginas, produtos, regiões — com rótulos longos e valores lidos um a um. Para comparar várias séries, use **BarChart**; para partes de um todo, **DonutChart**. As regras vêm da diretriz Visualização de dados.
- A barra mede a distância até o maior valor da lista (que ocupa a linha toda); o número exato fica sempre escrito ao lado.
- Uma cor para todas as barras: `--or-color-viz-1` por padrão, como a primeira série dos gráficos. Troque com `color` (ex.: `--or-color-accent` num painel só de destaques).
- Dê um nome à lista: `aria-labelledby` com o título do cartão ou `aria-label` (os dois vão para o `<ul>`).

- Faça: Mostrar os 5 primeiros com limit e deixar o resto em “Mostrar todos”.
- Faça: Usar href quando cada linha leva ao detalhe (a linha inteira vira o link).
- Faça: Formatar com valueFormat (moeda, “min”, “visitas”).
- Evite: Valores negativos ou variações (+/−): use barras divergentes no BarChart.
- Evite: Uma cor por linha: a posição e o rótulo já identificam cada item.
- Evite: Botões ou links dentro do rótulo de uma linha com href (links aninhados).

## Anatomia

- **Linha** — Um <li>: rótulo à esquerda, valor em --or-font-mono à direita (sempre em cor de texto) e a barra embaixo. Com href, a linha inteira é um <a>.
- **Barra** — Reta, 4/6/8px (sm/md/lg), comprimento proporcional ao maior valor. Decorativa (aria-hidden): o valor está no texto.
- **Mostrar todos** — Com limit, um botão com aria-expanded alterna entre os primeiros itens e a lista inteira (“Mostrar todos (N)” / “Mostrar menos”).

## Exemplos

### Com links e limite

Cada linha leva ao detalhe da página. limit mostra as cinco primeiras; o botão revela o resto.

```tsx
import { useId } from 'react'
import { BarList } from '@orangesys/ui'

const paginas = [
  { label: 'Página inicial', value: 12480, href: '#/' },
  { label: '/produtos', value: 8930, href: '#/produtos' },
  { label: '/blog/como-emitir-nota-fiscal', value: 5210, href: '#/blog/como-emitir-nota-fiscal' },
  { label: '/precos', value: 3120, href: '#/precos' },
  { label: '/contato', value: 1460, href: '#/contato' },
  { label: '/carreiras', value: 980, href: '#/carreiras' },
  { label: '/ajuda/trocas-e-devolucoes', value: 640, href: '#/ajuda/trocas-e-devolucoes' },
]

export default function TopPages() {
  const titleId = useId()
  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <h3 id={titleId} className="or-eyebrow">
        Páginas mais visitadas · últimos 30 dias
      </h3>
      <BarList aria-labelledby={titleId} data={paginas} limit={5} />
    </div>
  )
}
```

### Em um cartão

Ordenado do maior para o menor automaticamente, em moeda, no tamanho sm.

```tsx
import { BarList, Card, CardBody, CardHeader } from '@orangesys/ui'

export default function TopProducts() {
  return (
    <Card style={{ width: '100%', maxWidth: 440 }}>
      <CardHeader title="Produtos mais vendidos" description="Receita · outubro de 2026" />
      <CardBody>
        <BarList
          aria-label="Produtos mais vendidos"
          size="sm"
          valueFormat={{ style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }}
          data={[
            { label: 'Mochila urbana 22 L', value: 51900 },
            { label: 'Tênis de corrida Leve 3', value: 84200 },
            { label: 'Jaqueta corta-vento', value: 27100 },
            { label: 'Garrafa térmica 1 L', value: 38400 },
            { label: 'Meias de compressão (par)', value: 12800 },
          ]}
        />
      </CardBody>
    </Card>
  )
}
```

### Menor é melhor

sort="asc" põe os menores valores no topo; valueFormat como função escreve a unidade.

```tsx
import { useId } from 'react'
import { BarList } from '@orangesys/ui'

export default function ResponseTime() {
  const titleId = useId()
  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <h3 id={titleId} className="or-eyebrow">
        Tempo médio de primeira resposta · outubro de 2026
      </h3>
      {/* Aqui menor é melhor: sort="asc" põe as equipes mais rápidas no topo. */}
      <BarList
        aria-labelledby={titleId}
        sort="asc"
        color="var(--or-color-viz-2)"
        valueFormat={(minutos) => `${minutos} min`}
        data={[
          { label: 'Financeiro', value: 42 },
          { label: 'Suporte técnico', value: 18 },
          { label: 'Comercial', value: 9 },
          { label: 'Logística', value: 27 },
        ]}
      />
    </div>
  )
}
```

## Movimento

- **Entrada** — Uma vez, quando a lista entra na tela (useInView): cada barra cresce a partir do início (scaleX), em --or-duration-reveal com --or-ease-out, escalonada com --or-stagger.
- **Mostrar todos** — Os itens revelados descem 4px e aparecem (--or-duration-medium) com as barras crescendo; ao recolher, somem em --or-duration-fast. O chevron gira 180°.
- **Dados novos** — Barras mudam de comprimento com transição (transform, --or-duration-slow).
- **Movimento reduzido** — Tudo aparece desenhado, sem crescer nem deslizar.

## Props

### `BarList`

Ranking em barras horizontais ("Páginas mais visitadas", "Produtos mais
vendidos"): uma lista (`ul`) em que cada item traz o rótulo, o valor e uma
barra proporcional ao maior valor. Linhas com `href` viram links. Com
`limit`, mostra os primeiros e um botão para ver todos.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `data` (obrigatória) | `BarListDatum[]` | — | Itens do ranking. A ordem final depende de `sort`. |
| `color` | `string` | `var(--or-color-viz-1)` | Cor das barras. Padrão: `--or-color-viz-1` (a cor da primeira série dos gráficos). |
| `defaultExpanded` | `boolean` | `false` | Estado inicial (não controlado). Padrão: `false`. |
| `expanded` | `boolean` | — | Lista inteira visível, com `limit` (controlado). |
| `limit` | `number` | — | Mostra só os primeiros itens, com o botão "Mostrar todos (N)" / "Mostrar menos". |
| `onExpandedChange` | `((expanded: boolean) => void)` | — | Chamado ao mostrar todos / mostrar menos. |
| `renderLink` | `RenderLink` | — | Renderiza os links das linhas com `href` (ex.: o `Link` do roteador): `renderLink={({ href, ...props }) => <RouterLink to={href} {...props} />}`. |
| `size` | `"sm" \| "md" \| "lg"` | `md` | Densidade: texto, respiro e espessura da barra. Padrão: `md`. |
| `sort` | `"none" \| "desc" \| "asc"` | `desc` | `desc` (maior primeiro, padrão), `asc` ou `none` (a ordem de `data`). |
| `valueFormat` | `ChartValueFormat` | — | Formato dos valores: função ou opções do `Intl.NumberFormat` (ex.: `{ style: 'currency', currency: 'BRL' }`). |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

É uma lista de verdade (`<ul role="list">` e `<li>`): o leitor de tela anuncia a quantidade de itens e lê cada um como “Página inicial: 12.480” — a barra é decorativa (`aria-hidden`). Linhas com `href` são um único link com rótulo e valor no nome, com foco visível na linha inteira. O botão “Mostrar todos” informa o estado com `aria-expanded` e aponta para a lista com `aria-controls`; o foco continua nele ao alternar.

| Teclas | Ação |
| --- | --- |
| `Tab` | Passa pelas linhas com link e depois pelo botão Mostrar todos. |
| `Enter` | Abre o link da linha / alterna a lista no botão. |
| `Space` | Alterna a lista no botão Mostrar todos. |

- **1.1.1** — O valor de cada barra está escrito no texto da linha.
- **1.3.1** — Estrutura de lista (ul/li) com nome via aria-label/aria-labelledby.
- **1.4.1** — Cor nunca sozinha: uma cor só, e cada linha tem rótulo e valor.
- **1.4.11** — Barras nos tokens viz (≥ 3:1 contra o fundo); em alto contraste, CanvasText.
- **2.4.7** — Foco visível na linha inteira (contorno de 2px) e no botão.
- **2.5.8** — Linhas com link e o botão têm pelo menos 24px de altura.
- **4.1.2** — Botão com aria-expanded e aria-controls.
