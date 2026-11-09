# BarChart

Gráfico de barras acessível em SVG puro: compara quantidades entre categorias, agrupadas ou empilhadas, na vertical ou na horizontal.

- Categoria: Exibição de dados · Status: estável
- Importação: `import { BarChart } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/bar-chart (em inglês: https://orange.llypedev.com.br/en/components/bar-chart)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-barchart--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/BarChart

## Boas práticas

- Barras comparam quantidades entre categorias. Para evolução contínua no tempo use **LineChart**; para um único número, **Stat**. As regras vêm da diretriz Visualização de dados.
- O eixo começa sempre em zero (o componente garante). Use a orientação horizontal quando os rótulos forem longos.
- Até cinco séries, com as cores `--or-color-viz-1…5` na ordem. A sexta não ganha cor nova: agrupe em “Outros” com `--or-color-viz-other`.
- `title` diz o quê, `description` diz quando e em que unidade, `source` diz de onde. Escreva a conclusão em `summary`: é o que o leitor de tela ouve primeiro.

- Faça: Destacar uma barra com highlight (acento) e deixar o resto no neutro.
- Faça: Mostrar valores (showValues) quando são poucos e importam; o resto fica na dica e na tabela.
- Faça: Formatar com valueFormat (moeda, sem casas decimais em valores grandes).
- Evite: Pintar cada barra de uma cor quando há uma só série.
- Evite: Dois eixos Y no mesmo gráfico: faça dois gráficos.
- Evite: Empilhar mais de cinco partes ou partes que não somam um todo.

## Anatomia

- **Título e subtítulo** — O <figcaption> da figura: title em display bold, description em text-subtle. hideCaption os esconde só visualmente.
- **Legenda** — Acima do gráfico, na ordem das séries, com a marca e o nome em cor de texto. Só com 2 ou mais séries.
- **Eixos e grade** — Números “redondos” em --or-font-mono / --or-text-xs; grade de 1px em border; base (zero) em border-strong. Valores a partir de 10 mil ficam compactos (R$ 10 mil).
- **Barras** — Retas, até 56px de largura (24px na horizontal), separadas por 2px de fundo — também entre segmentos empilhados.
- **Dica** — Todas as séries da categoria: valor primeiro, nome depois, e o total na pilha.
- **Ver dados** — A tabela com os mesmos números. Sempre presente para leitores de tela; o botão a mostra na tela.

## Exemplos

### Agrupado

Vendas por canal por mês. Passe o mouse ou foque o gráfico e use as setas.

```tsx
import { BarChart } from '@orangesys/ui'

const canais = [
  { key: 'site', label: 'Site' },
  { key: 'app', label: 'App' },
  { key: 'lojas', label: 'Lojas físicas' },
]

const vendas = [
  { label: 'jan', values: { site: 48200, app: 31500, lojas: 22800 } },
  { label: 'fev', values: { site: 45100, app: 33900, lojas: 21400 } },
  { label: 'mar', values: { site: 52700, app: 38200, lojas: 23900 } },
  { label: 'abr', values: { site: 50300, app: 41800, lojas: 22100 } },
  { label: 'mai', values: { site: 55900, app: 44600, lojas: 24700 } },
  { label: 'jun', values: { site: 61200, app: 49300, lojas: 26300 } },
]

export default function SalesByChannel() {
  return (
    <div style={{ width: '100%' }}>
      <BarChart
        title="Vendas por canal"
        description="R$ por mês · 1º semestre de 2026"
        summary="O site lidera todos os meses; o app cresce mais rápido, de R$ 31,5 mil para R$ 49,3 mil."
        source="Fonte: ERP de vendas (dados fictícios)."
        categoryLabel="Mês"
        valueFormat={{ style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }}
        series={canais}
        data={vendas}
      />
    </div>
  )
}
```

### Horizontal

Para rótulos longos. Com showValues, o valor fica na ponta da barra.

```tsx
import { BarChart } from '@orangesys/ui'

export default function OrdersByCategory() {
  return (
    <div style={{ width: '100%' }}>
      <BarChart
        title="Pedidos por categoria"
        description="Março de 2026 · unidades"
        orientation="horizontal"
        categoryLabel="Categoria"
        showValues
        series={[{ key: 'pedidos', label: 'Pedidos' }]}
        data={[
          { label: 'Eletrônicos e informática', values: { pedidos: 1284 } },
          { label: 'Casa e decoração', values: { pedidos: 962 } },
          { label: 'Moda e acessórios', values: { pedidos: 871 } },
          { label: 'Esporte e lazer', values: { pedidos: 455 } },
          { label: 'Livros e papelaria', values: { pedidos: 318 } },
        ]}
      />
    </div>
  )
}
```

### Empilhado

Partes de um todo ao longo do tempo. showValues escreve o total; a tabela ganha a coluna Total.

```tsx
import { BarChart } from '@orangesys/ui'

export default function RevenueByRegion() {
  return (
    <div style={{ width: '100%' }}>
      <BarChart
        title="Receita por região"
        description="R$ por trimestre · 2026"
        layout="stacked"
        showValues
        categoryLabel="Trimestre"
        valueFormat={{ style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }}
        series={[
          { key: 'sudeste', label: 'Sudeste' },
          { key: 'sul', label: 'Sul' },
          { key: 'nordeste', label: 'Nordeste' },
          // A partir da quinta região, agrupe em "Outras" com o neutro.
          { key: 'outras', label: 'Outras', color: 'var(--or-color-viz-other)' },
        ]}
        data={[
          {
            label: '1º tri',
            values: { sudeste: 412000, sul: 168000, nordeste: 121000, outras: 64000 },
          },
          {
            label: '2º tri',
            values: { sudeste: 438000, sul: 175000, nordeste: 139000, outras: 71000 },
          },
          {
            label: '3º tri',
            values: { sudeste: 451000, sul: 182000, nordeste: 152000, outras: 69000 },
          },
        ]}
      />
    </div>
  )
}
```

### Destaque

Uma série, uma barra no acento e o resto no neutro — o acento continua único.

```tsx
import { BarChart } from '@orangesys/ui'

const pedidos = [312, 348, 401, 377, 452, 518]
const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun']

export default function Highlight() {
  return (
    <div style={{ width: '100%' }}>
      <BarChart
        title="Pedidos por mês"
        description="1º semestre de 2026 · junho em destaque"
        summary="Pedidos crescem de 312 em janeiro para 518 em junho, o maior valor do semestre, com uma queda leve em abril."
        categoryLabel="Mês"
        highlight="jun"
        series={[{ key: 'pedidos', label: 'Pedidos' }]}
        data={meses.map((label, i) => ({ label, values: { pedidos: pedidos[i] } }))}
      />
    </div>
  )
}
```

### Valores negativos

No modo agrupado, barras negativas descem a partir do zero.

```tsx
import { BarChart } from '@orangesys/ui'

export default function NegativeValues() {
  return (
    <div style={{ width: '100%' }}>
      <BarChart
        title="Resultado por loja"
        description="Lucro operacional em R$ · fevereiro e março de 2026"
        categoryLabel="Loja"
        height={240}
        valueFormat={{ style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }}
        series={[
          { key: 'fev', label: 'Fevereiro' },
          { key: 'mar', label: 'Março' },
        ]}
        data={[
          { label: 'Centro', values: { fev: 18400, mar: 21900 } },
          { label: 'Shopping', values: { fev: -3200, mar: 4100 } },
          { label: 'Aeroporto', values: { fev: 9800, mar: -1500 } },
          { label: 'Online', values: { fev: 26100, mar: 29400 } },
        ]}
      />
    </div>
  )
}
```

## Movimento

- **Entrada** — Uma vez, quando o gráfico entra na tela (useInView): cada categoria cresce a partir da base (scaleY, ou scaleX na horizontal, com transform-origin na linha do zero). --or-duration-reveal, --or-ease-out, escalonado com --or-stagger.
- **Rótulos de valor** — Aparecem logo depois das barras (opacidade, --or-duration-medium).
- **Destaque e dica** — A faixa da categoria e a dica deslizam para a nova posição e as outras barras recuam (opacidade), em --or-duration-fast.
- **Ver dados** — A tabela expande (or-collapse, --or-duration-slow) e o chevron gira 180°.
- **Movimento reduzido** — Tudo aparece desenhado, sem crescer nem deslizar. O destaque e a dica continuam indicando o valor.

## Props

### `BarChart`

Gráfico de barras acessível, em SVG puro: compara quantidades entre categorias,
com eixo sempre a partir de zero. Agrupado ou empilhado, vertical ou horizontal.
Legenda com marcas, tabela de dados alternativa e exploração por teclado.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `data` (obrigatória) | `ChartDatum[]` | — | Uma entrada por categoria: `{ label: 'jan', values: { site: 12400, app: 8100 } }`. |
| `series` (obrigatória) | `ChartSeries[]` | — | Séries na ordem da legenda. As cores seguem `--or-color-viz-1…5`. |
| `title` (obrigatória) | `string` | — | Título do gráfico: diz o quê. Vira o `<figcaption>` e o nome do gráfico. |
| `categoryLabel` | `string` | — | Cabeçalho da coluna de categorias na tabela de dados (ex.: "Mês"). |
| `defaultShowData` | `boolean` | — | Começa com a tabela de dados visível. |
| `description` | `ReactNode` | — | Subtítulo visível: quando e em que unidade ("R$ mil por mês · 2026"). |
| `height` | `number` | — | Altura da área do gráfico em px, incluindo os rótulos dos eixos. |
| `hideCaption` | `boolean` | `false` | Esconde o título e o subtítulo visualmente (continuam no `<figcaption>`). |
| `highlight` | `string` | — | Destaca uma categoria (pelo `label`) com o acento; as demais ficam no neutro `--or-color-viz-other`. Só para uma série. Ganha rótulo de valor. |
| `layout` | `"grouped" \| "stacked"` | `grouped` | `grouped` (lado a lado, padrão) ou `stacked` (empilhadas, com total). |
| `orientation` | `"horizontal" \| "vertical"` | `vertical` | `vertical` (colunas, padrão) ou `horizontal` (para rótulos longos). |
| `showValues` | `boolean` | `false` | Escreve o valor na ponta de cada barra (ou o total da pilha) quando couber. |
| `source` | `ReactNode` | — | Fonte dos dados, abaixo do gráfico. |
| `summary` | `string` | — | Resumo em texto para leitores de tela (a conclusão). Padrão: gerado a partir dos dados. |
| `valueFormat` | `((value: number) => string) \| NumberFormatOptions` | — | Formato dos números: função ou opções do `Intl.NumberFormat` (ex.: `{ style: 'currency', currency: 'BRL' }`). |
| `variant` | `"outline" \| "plain"` | `outline` | `outline` (padrão): borda de 1px e respiro interno. `plain`: sem moldura, para cartões. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`BarChartDatum`:

```ts
export type BarChartDatum = ChartDatum
```

`BarChartLayout`:

```ts
export type BarChartLayout = 'grouped' | 'stacked'
```

`BarChartOrientation`:

```ts
export type BarChartOrientation = 'vertical' | 'horizontal'
```

`BarChartSeries`:

```ts
export type BarChartSeries = ChartSeries
```

`ChartValueFormat`:

```ts
/** Formato dos valores: uma função ou opções de `Intl.NumberFormat` (ex.: moeda BRL). */
export type ChartValueFormat = ((value: number) => string) | Intl.NumberFormatOptions
```

## Acessibilidade

Renderiza um `<figure>` nomeado pelo título. O SVG tem `role="img"` e um `aria-label` com o título e o resumo (como na diretriz). A tabela de dados fica sempre na árvore de acessibilidade — o botão “Ver dados” só a mostra na tela. Ao explorar pelo teclado, uma região `role="status"` anuncia “mar · Site: R$ 52.700”. A dica é visual ( `aria-hidden`) e nunca é o único caminho para um valor.

| Teclas | Ação |
| --- | --- |
| `Tab` | Foca a área do gráfico (e depois o botão Ver dados). |
| `←` + `→` | Categoria anterior/próxima (na horizontal: ↑ ↓). |
| `↑` + `↓` | Troca a série dentro da categoria (na horizontal: ← →). |
| `Home` + `End` | Primeira/última categoria. |
| `Esc` | Limpa o destaque e fecha a dica (também a do mouse). |

- **1.1.1** — Texto alternativo: título + resumo no SVG e a tabela com os dados completos.
- **1.3.1** — Tabela com <caption> e cabeçalhos de linha e coluna.
- **1.4.1** — Cor nunca sozinha: legenda com nome, posição fixa das séries, dica e tabela.
- **1.4.11** — Cores categóricas com ≥ 3:1 contra o fundo nos dois temas (testado nos tokens).
- **1.4.13** — A dica não bloqueia o ponteiro e fecha com Esc.
- **2.1.1** — Todos os valores são alcançáveis pelo teclado.
- **2.3.3** — Sem animação com prefers-reduced-motion.
- **4.1.3** — Valor em destaque anunciado por role="status".
